import { renderHook } from '@testing-library/react';
import { useAgentStream } from '../hooks/useAgentStream.js';

// Mock EventSource
global.EventSource = jest.fn().mockImplementation(() => ({
  onopen: null,
  onmessage: null,
  onerror: null,
  close: jest.fn(),
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
})) as unknown as typeof EventSource;

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

