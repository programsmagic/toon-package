import { AgentEvent, EventType } from '@toon/core';

/**
 * Parse and categorize events
 */
export function parseEvent(event: AgentEvent): {
  type: EventType;
  category: 'action' | 'flow' | 'message' | 'state' | 'error' | 'system';
  timestamp: number;
  data: Record<string, unknown>;
} {
  const category =
    event.type === EventType.ACTION_START || event.type === EventType.ACTION_END
      ? 'action'
      : event.type === EventType.FLOW_START || event.type === EventType.FLOW_END
      ? 'flow'
      : event.type === EventType.TEXT_MESSAGE_CONTENT
      ? 'message'
      : event.type === EventType.STATE_UPDATE
      ? 'state'
      : event.type === EventType.ERROR
      ? 'error'
      : 'system';

  return {
    type: event.type,
    category,
    timestamp: event.timestamp,
    data: event as unknown as Record<string, unknown>,
  };
}

/**
 * Filter events by type
 */
export function filterEventsByType(events: AgentEvent[], eventType: EventType): AgentEvent[] {
  return events.filter((event) => event.type === eventType);
}

/**
 * Filter events by category
 */
export function filterEventsByCategory(
  events: AgentEvent[],
  category: 'action' | 'flow' | 'message' | 'state' | 'error' | 'system'
): AgentEvent[] {
  return events.filter((event) => {
    const parsed = parseEvent(event);
    return parsed.category === category;
  });
}

/**
 * Get latest event of a specific type
 */
export function getLatestEvent(events: AgentEvent[], eventType?: EventType): AgentEvent | null {
  const filtered = eventType ? filterEventsByType(events, eventType) : events;
  if (filtered.length === 0) {
    return null;
  }
  return filtered[filtered.length - 1];
}

