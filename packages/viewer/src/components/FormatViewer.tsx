import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { convert, type SupportedFormat } from '@toon/converter';
import { countTokensInText } from '@toon/tokenizer';
import { SyntaxHighlighter } from './SyntaxHighlighter.js';
import { TokenCounter } from './TokenCounter.js';
import { FormatSelector } from './FormatSelector.js';
import { CopyButton } from './CopyButton.js';
import '../styles/viewer.css';

export interface FormatViewerProps {
  /**
   * Initial content
   */
  initialContent?: string;
  /**
   * Initial format
   */
  initialFormat?: SupportedFormat;
  /**
   * Show token counter
   */
  showTokenCounter?: boolean;
  /**
   * Show format selector
   */
  showFormatSelector?: boolean;
  /**
   * LLM-grade mode (optimized for prompt copying)
   */
  llmMode?: boolean;
  /**
   * Model for token counting
   */
  model?: string;
  /**
   * On content change callback
   */
  onContentChange?: (content: string, format: SupportedFormat) => void;
  /**
   * Class name
   */
  className?: string;
}

/**
 * Main split-pane format viewer component
 */
export function FormatViewer({
  initialContent = '',
  initialFormat,
  showTokenCounter = true,
  showFormatSelector = true,
  llmMode = false,
  model = 'gpt-4',
  onContentChange,
  className,
}: FormatViewerProps): JSX.Element {
  const [content, setContent] = useState(initialContent);
  const [format, setFormat] = useState<SupportedFormat>(initialFormat || 'json');
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>('toon');
  const [convertedContent, setConvertedContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Convert content when format or target format changes
  const handleConvert = useCallback(async () => {
    try {
      setError(null);
      const result = await convert(content, {
        from: format,
        to: targetFormat,
      });
      setConvertedContent(result.content);
      onContentChange?.(result.content, targetFormat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  }, [content, format, targetFormat, onContentChange]);

  // Token counts
  const tokenCounts = useMemo(() => {
    try {
      const source = countTokensInText(content, model as any);
      const target = convertedContent ? countTokensInText(convertedContent, model as any) : null;
      return { source, target };
    } catch {
      return { source: null, target: null };
    }
  }, [content, convertedContent, model]);

  // Handle content change
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    handleConvert().catch(console.error);
  }, [handleConvert]);

  // Handle format change
  const handleFormatChange = useCallback((newFormat: SupportedFormat) => {
    setFormat(newFormat);
    handleConvert().catch(console.error);
  }, [handleConvert]);

  // Handle target format change
  const handleTargetFormatChange = useCallback((newFormat: SupportedFormat) => {
    setTargetFormat(newFormat);
    handleConvert().catch(console.error);
  }, [handleConvert]);

  // Initialize conversion on mount
  useEffect(() => {
    handleConvert().catch(console.error);
  }, []); // Only run on mount

  return (
    <div className={`toon-format-viewer ${className || ''}`}>
      {showTokenCounter && tokenCounts.source && (
        <div className="toon-viewer-header">
          <TokenCounter
            tokens={tokenCounts.source.tokens}
            model={model}
            estimatedCost={tokenCounts.source.estimatedCost}
          />
          {tokenCounts.target && (
            <TokenCounter
              tokens={tokenCounts.target.tokens}
              model={model}
              estimatedCost={tokenCounts.target.estimatedCost}
              label="Target"
            />
          )}
        </div>
      )}

      {showFormatSelector && (
        <div className="toon-viewer-controls">
          <FormatSelector
            value={format}
            onChange={handleFormatChange}
            label="Source Format"
          />
          <FormatSelector
            value={targetFormat}
            onChange={handleTargetFormatChange}
            label="Target Format"
          />
          <CopyButton
            content={llmMode ? `\`\`\`${targetFormat}\n${convertedContent}\n\`\`\`` : convertedContent}
            format={targetFormat}
          />
        </div>
      )}

      {error && (
        <div className="toon-viewer-error">
          Error: {error}
        </div>
      )}

      <Allotment>
        <Allotment.Pane minSize={200}>
          <div className="toon-viewer-pane">
            <div className="toon-viewer-pane-header">
              <span>Source ({format})</span>
            </div>
            <SyntaxHighlighter
              language={format}
              value={content}
              onChange={handleContentChange}
            />
          </div>
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          <div className="toon-viewer-pane">
            <div className="toon-viewer-pane-header">
              <span>Target ({targetFormat})</span>
            </div>
            <SyntaxHighlighter
              language={targetFormat}
              value={convertedContent}
              readOnly
            />
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

