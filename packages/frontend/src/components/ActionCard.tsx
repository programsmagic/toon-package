import React from 'react';
import { motion } from 'framer-motion';
import { AgentEvent, EventType } from '@toon/core';
import { parseEvent } from '../utils/event-parser.js';
import '../styles/toon-theme.css';

export interface ActionCardProps {
  event: AgentEvent;
  index?: number;
  onClick?: (event: AgentEvent) => void;
}

/**
 * Individual action/result card component
 */
export function ActionCard({ event, index = 0, onClick }: ActionCardProps): JSX.Element {
  const parsed = parseEvent(event);
  const isAction = parsed.category === 'action';
  const isStart = event.type === EventType.ACTION_START || event.type === EventType.FLOW_START;
  const isEnd = event.type === EventType.ACTION_END || event.type === EventType.FLOW_END;
  const isSuccess = isEnd && 'success' in event && event.success === true;

  return (
    <motion.div
      className="toon-action-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick?.(event)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="toon-action-card-header">
        <span className={`toon-action-status ${isStart ? 'start' : isEnd ? (isSuccess ? 'success' : 'error') : 'pending'}`}>
          {isStart ? '▶' : isEnd ? (isSuccess ? '✓' : '✗') : '○'}
        </span>
        <span className="toon-action-name">
          {'actionName' in event ? event.actionName : 'flowName' in event ? event.flowName : 'Unknown'}
        </span>
        <span className="toon-action-time">
          {new Date(event.timestamp).toLocaleTimeString()}
        </span>
      </div>
      {isAction && 'endpoint' in event && (
        <div className="toon-action-details">
          <span className="toon-action-method">{event.method}</span>
          <span className="toon-action-endpoint">{event.endpoint}</span>
        </div>
      )}
      {isEnd && 'response' in event && (
        <div className="toon-action-response">
          <pre>{JSON.stringify(event.response, null, 2)}</pre>
        </div>
      )}
      {isEnd && 'error' in event && event.error && (
        <div className="toon-action-error">
          {event.error}
        </div>
      )}
    </motion.div>
  );
}

