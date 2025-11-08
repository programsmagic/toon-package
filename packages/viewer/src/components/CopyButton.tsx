import React, { useState } from 'react';
import type { SupportedFormat } from '@toon/converter';

export interface CopyButtonProps {
  content: string;
  format: SupportedFormat;
}

/**
 * Copy button with prompt wrapper
 */
export function CopyButton({ content, format }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      className="toon-copy-button"
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      {copied ? '✓ Copied' : `Copy ${format.toUpperCase()}`}
    </button>
  );
}

