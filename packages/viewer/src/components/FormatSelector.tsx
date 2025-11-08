// import React from 'react'; // Not needed in React 17+
import type { SupportedFormat } from '@toon/converter';

export interface FormatSelectorProps {
  value: SupportedFormat;
  onChange: (format: SupportedFormat) => void;
  label?: string;
}

/**
 * Format selector component
 */
export function FormatSelector({
  value,
  onChange,
  label,
}: FormatSelectorProps): JSX.Element {
  const formats: SupportedFormat[] = ['json', 'toon', 'csv', 'yaml'];

  return (
    <div className="toon-format-selector">
      {label && <label className="toon-format-label">{label}</label>}
      <select
        className="toon-format-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SupportedFormat)}
      >
        {formats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

