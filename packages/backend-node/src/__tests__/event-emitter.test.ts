import { EventEmitter } from '../event-emitter.js';
import { EventType } from '@programsmagic/toon-core';

describe('EventEmitter', () => {
  it('should emit and handle events', () => {
    const emitter = new EventEmitter();
    const handler = jest.fn();

    emitter.on(EventType.ACTION_START, handler);
    emitter.emit({
      type: EventType.ACTION_START,
      id: 'test',
      timestamp: Date.now(),
      actionId: 'action1',
      actionName: 'Test Action',
      endpoint: '/test',
      method: 'GET',
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should remove handlers', () => {
    const emitter = new EventEmitter();
    const handler = jest.fn();

    emitter.on(EventType.ACTION_START, handler);
    emitter.off(EventType.ACTION_START, handler);
    emitter.emit({
      type: EventType.ACTION_START,
      id: 'test',
      timestamp: Date.now(),
      actionId: 'action1',
      actionName: 'Test Action',
      endpoint: '/test',
      method: 'GET',
    });

    expect(handler).not.toHaveBeenCalled();
  });
});

