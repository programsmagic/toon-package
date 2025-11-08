import { AgentEvent, EventType, EventEmitter as IEventEmitter } from '@toon/core';

/**
 * Simple event emitter implementation for agent events
 */
export class EventEmitter implements IEventEmitter {
  private handlers: Map<EventType, Set<(event: AgentEvent) => void>> = new Map();

  emit(event: AgentEvent): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });
    }

    // Also emit to 'all' listeners if needed
    const allHandlers = this.handlers.get(EventType.HEARTBEAT); // Using HEARTBEAT as a placeholder for 'all'
    // In a real implementation, you might want a separate 'all' event type
  }

  on(eventType: EventType, handler: (event: AgentEvent) => void): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  off(eventType: EventType, handler: (event: AgentEvent) => void): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  removeAllListeners(eventType?: EventType): void {
    if (eventType) {
      this.handlers.delete(eventType);
    } else {
      this.handlers.clear();
    }
  }
}

