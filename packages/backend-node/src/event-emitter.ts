import { AgentEvent, EventType, EventEmitter as IEventEmitter, log } from '@programsmagic/toon-core';

/**
 * Simple event emitter implementation for agent events
 */
export class EventEmitter implements IEventEmitter {
  private handlers: Map<EventType, Set<(event: AgentEvent) => void>> = new Map();
  private allHandlers: Set<(event: AgentEvent) => void> = new Set();

  emit(event: AgentEvent): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          log.error(`Error in event handler for ${event.type}`, error);
        }
      });
    }

    this.allHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        log.error(`Error in wildcard event handler for ${event.type}`, error);
      }
    });
  }

  on(eventType: EventType, handler: (event: AgentEvent) => void): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  /**
   * Subscribe to all event types
   */
  onAll(handler: (event: AgentEvent) => void): void {
    this.allHandlers.add(handler);
  }

  /**
   * Subscribe to an event type and auto-remove after first invocation
   */
  once(eventType: EventType, handler: (event: AgentEvent) => void): void {
    const wrapper = (event: AgentEvent) => {
      this.off(eventType, wrapper);
      handler(event);
    };
    this.on(eventType, wrapper);
  }

  off(eventType: EventType, handler: (event: AgentEvent) => void): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  offAll(handler: (event: AgentEvent) => void): void {
    this.allHandlers.delete(handler);
  }

  listenerCount(eventType?: EventType): number {
    if (eventType) {
      return (this.handlers.get(eventType)?.size ?? 0);
    }
    let count = this.allHandlers.size;
    this.handlers.forEach((set) => { count += set.size; });
    return count;
  }

  removeAllListeners(eventType?: EventType): void {
    if (eventType) {
      this.handlers.delete(eventType);
    } else {
      this.handlers.clear();
      this.allHandlers.clear();
    }
  }
}

