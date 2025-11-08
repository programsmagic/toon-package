import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface SyntaxHighlighterProps {
  language: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

/**
 * Syntax highlighter component with optional editing
 */
export function SyntaxHighlighter({
  language,
  value,
  onChange,
  readOnly = false,
}: SyntaxHighlighterProps): JSX.Element {
  if (readOnly) {
    return (
      <div className="toon-syntax-highlighter">
        <SyntaxHighlighter
          language={language === 'toon' ? 'text' : language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            height: '100%',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className="toon-syntax-highlighter">
      <textarea
        className="toon-syntax-editor"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        spellCheck={false}
      />
      <div className="toon-syntax-preview">
        <SyntaxHighlighter
          language={language === 'toon' ? 'text' : language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: 'transparent',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

