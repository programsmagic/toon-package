import React from 'react';

export interface TokenCounterProps {
  tokens: number;
  model: string;
  estimatedCost?: {
    input: number;
    output?: number;
  };
  label?: string;
}

/**
 * Token counter display component
 */
export function TokenCounter({
  tokens,
  model,
  estimatedCost,
  label = 'Tokens',
}: TokenCounterProps): JSX.Element {
  return (
    <div className="toon-token-counter">
      <span className="toon-token-label">{label}:</span>
      <span className="toon-token-value">{tokens.toLocaleString()}</span>
      {estimatedCost && (
        <span className="toon-token-cost">
          ${estimatedCost.input.toFixed(4)} / 1K
        </span>
      )}
      <span className="toon-token-model">{model}</span>
    </div>
  );
}

