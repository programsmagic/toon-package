// import React from 'react'; // Not needed in React 17+
// import { motion } from 'framer-motion'; // Reserved for future use
import { AgentEvent } from '@toon/core';
import { ActionCard } from './ActionCard.js';
import '../styles/toon-theme.css';

export interface EventTimelineProps {
  events: AgentEvent[];
  onEventClick?: (event: AgentEvent) => void;
  maxEvents?: number;
}

/**
 * Timeline component for displaying agent events
 */
export function EventTimeline({
  events,
  onEventClick,
  maxEvents = 100,
}: EventTimelineProps): JSX.Element {
  const displayEvents = events.slice(-maxEvents);

  return (
    <div className="toon-event-timeline">
      <div className="toon-timeline-header">
        <h3>Event Timeline</h3>
        <span className="toon-event-count">{events.length} events</span>
      </div>
      <div className="toon-timeline-content">
        {displayEvents.length === 0 ? (
          <div className="toon-timeline-empty">No events yet</div>
        ) : (
          displayEvents.map((event, index) => (
            <ActionCard
              key={event.id}
              event={event}
              index={index}
              onClick={onEventClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

