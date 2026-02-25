import { useEffect, useState, useCallback, useRef } from 'react';
import { AgentEvent } from '@programsmagic/toon-core';

export interface UseAgentStreamOptions {
  url: string;
  protocol?: 'sse' | 'websocket';
  autoConnect?: boolean;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectBaseDelay?: number;
  onEvent?: (event: AgentEvent) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface UseAgentStreamReturn {
  events: AgentEvent[];
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
  clearEvents: () => void;
}

/**
 * React hook for connecting to agent event stream via SSE or WebSocket
 */
export function useAgentStream(options: UseAgentStreamOptions): UseAgentStreamReturn {
  const {
    url,
    protocol = 'sse',
    autoConnect = true,
    reconnect = true,
    maxReconnectAttempts = 5,
    reconnectBaseDelay = 1000,
    onEvent,
    onError,
    onConnect,
    onDisconnect,
  } = options;

  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const intentionalDisconnectRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (
      !reconnect ||
      intentionalDisconnectRef.current ||
      reconnectAttemptsRef.current >= maxReconnectAttempts
    ) {
      return;
    }
    const delay = reconnectBaseDelay * Math.pow(2, reconnectAttemptsRef.current);
    reconnectAttemptsRef.current++;
    reconnectTimeoutRef.current = setTimeout(() => {
      connectRef.current();
    }, delay);
  }, [reconnect, maxReconnectAttempts, reconnectBaseDelay]);

  const connect = useCallback(() => {
    if (isConnecting || isConnected) {
      return;
    }

    intentionalDisconnectRef.current = false;
    setIsConnecting(true);
    setError(null);

    if (protocol === 'sse') {
      try {
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          setIsConnecting(false);
          reconnectAttemptsRef.current = 0;
          onConnect?.();
        };

        eventSource.onmessage = (message) => {
          try {
            const event = JSON.parse(message.data) as AgentEvent;
            setEvents((prev) => [...prev, event]);
            onEvent?.(event);
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to parse event');
            setError(error);
            onError?.(error);
          }
        };

        eventSource.onerror = () => {
          setIsConnected(false);
          setIsConnecting(false);
          const error = new Error('SSE connection error');
          setError(error);
          onError?.(error);
          eventSource.close();
          eventSourceRef.current = null;
          scheduleReconnect();
        };
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error('Failed to create EventSource');
        setError(error);
        setIsConnecting(false);
        onError?.(error);
        scheduleReconnect();
      }
    } else if (protocol === 'websocket') {
      try {
        const ws = new WebSocket(url);
        websocketRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          setIsConnecting(false);
          reconnectAttemptsRef.current = 0;
          onConnect?.();
        };

        ws.onmessage = (message) => {
          try {
            const event = JSON.parse(message.data) as AgentEvent;
            setEvents((prev) => [...prev, event]);
            onEvent?.(event);
          } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error('Failed to parse event');
            setError(error);
            onError?.(error);
          }
        };

        ws.onerror = () => {
          const error = new Error('WebSocket connection error');
          setError(error);
          setIsConnected(false);
          setIsConnecting(false);
          onError?.(error);
        };

        ws.onclose = () => {
          setIsConnected(false);
          setIsConnecting(false);
          websocketRef.current = null;
          onDisconnect?.();
          scheduleReconnect();
        };
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error('Failed to create WebSocket');
        setError(error);
        setIsConnecting(false);
        onError?.(error);
        scheduleReconnect();
      }
    }
  }, [url, protocol, isConnecting, isConnected, onEvent, onError, onConnect, onDisconnect, scheduleReconnect]);

  connectRef.current = connect;

  const disconnect = useCallback(() => {
    intentionalDisconnectRef.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    setIsConnected(false);
    setIsConnecting(false);
    onDisconnect?.();
  }, [onDisconnect]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    events,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    clearEvents,
  };
}
