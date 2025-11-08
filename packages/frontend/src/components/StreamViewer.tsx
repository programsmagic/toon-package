// import React from 'react'; // Not needed in React 17+
import { useAgentStream } from '../hooks/useAgentStream.js';
import { EventTimeline } from './EventTimeline.js';
import { AgentEvent } from '@toon/core';
import '../styles/toon-theme.css';

export interface StreamViewerProps {
  url: string;
  protocol?: 'sse' | 'websocket';
  autoConnect?: boolean;
  className?: string;
}

/**
 * Real-time streaming viewer for TOON data
 */
export function StreamViewer({
  url,
  protocol = 'sse',
  autoConnect = true,
  className,
}: StreamViewerProps): JSX.Element {
  const { events, isConnected, isConnecting, error, connect, disconnect } = useAgentStream({
    url,
    protocol,
    autoConnect,
  });

  // Filter TOON-related events
  const toonEvents = events.filter((event) => {
    return 'content' in event || 'row' in event;
  });

  return (
    <div className={`toon-stream-viewer ${className || ''}`}>
      <div className="toon-stream-header">
        <div className="toon-stream-status">
          <span
            className={`toon-status-dot ${isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'}`}
          />
          <span className="toon-status-text">
            {isConnected ? 'Streaming' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
        <div className="toon-stream-controls">
          {!isConnected && !isConnecting && (
            <button onClick={connect} className="toon-button toon-button-primary">
              Connect
            </button>
          )}
          {isConnected && (
            <button onClick={disconnect} className="toon-button toon-button-secondary">
              Disconnect
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="toon-error-message">
          Error: {error.message}
        </div>
      )}

      <div className="toon-stream-content">
        <EventTimeline events={toonEvents as AgentEvent[]} maxEvents={100} />
      </div>
    </div>
  );
}

