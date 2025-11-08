import React from 'react';
import { useAgentStream, UseAgentStreamOptions } from '../hooks/useAgentStream.js';
import { EventTimeline } from './EventTimeline.js';
import { FlowDiagram } from './FlowDiagram.js';
import '../styles/toon-theme.css';

export interface AgentVisualizerProps extends UseAgentStreamOptions {
  showTimeline?: boolean;
  showFlowDiagram?: boolean;
  flows?: Array<{
    id: string;
    name: string;
    steps: Array<{ actionId: string }>;
  }>;
  className?: string;
}

/**
 * Main visualization component for agent state and events
 */
export function AgentVisualizer({
  url,
  protocol = 'sse',
  autoConnect = true,
  showTimeline = true,
  showFlowDiagram = false,
  flows,
  onEvent,
  onError,
  onConnect,
  onDisconnect,
  className,
}: AgentVisualizerProps): JSX.Element {
  const { events, isConnected, isConnecting, error, connect, disconnect, clearEvents } =
    useAgentStream({
      url,
      protocol,
      autoConnect,
      onEvent,
      onError,
      onConnect,
      onDisconnect,
    });

  return (
    <div className={`toon-agent-visualizer ${className || ''}`}>
      <div className="toon-visualizer-header">
        <div className="toon-status-indicator">
          <span
            className={`toon-status-dot ${isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'}`}
          />
          <span className="toon-status-text">
            {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
        <div className="toon-visualizer-controls">
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
          <button onClick={clearEvents} className="toon-button toon-button-secondary">
            Clear
            </button>
        </div>
      </div>

      {error && (
        <div className="toon-error-message">
          Error: {error.message}
        </div>
      )}

      {showTimeline && <EventTimeline events={events} />}
      {showFlowDiagram && <FlowDiagram events={events} flows={flows} />}
    </div>
  );
}

