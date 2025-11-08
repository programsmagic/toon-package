import { renderHook, waitFor } from '@testing-library/react';
import { useAgentStream } from '../hooks/useAgentStream.js';

// Mock EventSource
global.EventSource = jest.fn().mockImplementation(() => ({
  onopen: null,
  onmessage: null,
  onerror: null,
  close: jest.fn(),
}));

describe('useAgentStream', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useAgentStream({
        url: 'http://localhost:3000/events',
        autoConnect: false,
      })
    );

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.events).toHaveLength(0);
  });
});

