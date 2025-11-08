/**
 * CSV eligibility detection
 */
export interface CsvEligibilityResult {
  eligible: boolean;
  confidence: number;
  reason?: string;
  structure?: {
    rows: number;
    columns: number;
    hasHeader: boolean;
  };
}

/**
 * Check if data structure is eligible for CSV conversion
 */
export function isCsvEligible(data: unknown): CsvEligibilityResult {
  // Arrays are always CSV-eligible
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return {
        eligible: true,
        confidence: 1.0,
        reason: 'Empty array',
        structure: {
          rows: 0,
          columns: 0,
          hasHeader: false,
        },
      };
    }

    // Check if all items are objects with same keys
    const firstItem = data[0];
    if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
      const keys = Object.keys(firstItem);
      const allSameStructure = data.every((item) => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
          return false;
        }
        const itemKeys = Object.keys(item);
        return itemKeys.length === keys.length && keys.every((k) => k in item);
      });

      if (allSameStructure) {
        return {
          eligible: true,
          confidence: 0.95,
          reason: 'Array of objects with consistent structure',
          structure: {
            rows: data.length,
            columns: keys.length,
            hasHeader: true,
          },
        };
      }
    }

    // Check if all items are arrays of same length
    if (Array.isArray(firstItem)) {
      const firstLength = firstItem.length;
      const allSameLength = data.every((item) => Array.isArray(item) && item.length === firstLength);

      if (allSameLength) {
        return {
          eligible: true,
          confidence: 0.9,
          reason: 'Array of arrays with consistent length',
          structure: {
            rows: data.length,
            columns: firstLength,
            hasHeader: false,
          },
        };
      }
    }

    // Check if all items are primitives
    const allPrimitives = data.every((item) => {
      const type = typeof item;
      return type === 'string' || type === 'number' || type === 'boolean' || item === null;
    });

    if (allPrimitives) {
      return {
        eligible: true,
        confidence: 0.8,
        reason: 'Array of primitives',
        structure: {
          rows: data.length,
          columns: 1,
          hasHeader: false,
        },
      };
    }
  }

  // Objects are not directly CSV-eligible (need to be arrays)
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return {
      eligible: false,
      confidence: 0.9,
      reason: 'Object structure not suitable for CSV (needs array)',
    };
  }

  return {
    eligible: false,
    confidence: 0.7,
    reason: 'Data structure not suitable for CSV',
  };
}

/**
 * Check if nested data has CSV-eligible regions
 */
export function findCsvEligibleRegions(data: unknown): Array<{
  path: string;
  result: CsvEligibilityResult;
}> {
  const regions: Array<{ path: string; result: CsvEligibilityResult }> = [];

  function traverse(obj: unknown, path: string = ''): void {
    const result = isCsvEligible(obj);
    if (result.eligible && result.confidence > 0.7) {
      regions.push({ path, result });
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        traverse(item, path ? `${path}[${index}]` : `[${index}]`);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        traverse(value, path ? `${path}.${key}` : key);
      });
    }
  }

  traverse(data);
  return regions;
}

