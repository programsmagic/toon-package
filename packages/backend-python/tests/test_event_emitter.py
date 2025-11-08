"""
Tests for event emitter
"""
import pytest
from toon_backend.event_emitter import EventEmitter, EventType, AgentEvent
import time


def test_event_emitter_emit():
    """Test event emission"""
    emitter = EventEmitter()
    events = []

    def handler(event: AgentEvent):
        events.append(event)

    emitter.on(EventType.ACTION_START, handler)
    emitter.emit(AgentEvent(
        event_type=EventType.ACTION_START,
        event_id="test",
        timestamp=int(time.time() * 1000),
        actionId="action1",
        actionName="Test Action",
        endpoint="/test",
        method="GET"
    ))

    assert len(events) == 1
    assert events[0].type == EventType.ACTION_START


def test_event_emitter_off():
    """Test removing handlers"""
    emitter = EventEmitter()
    events = []

    def handler(event: AgentEvent):
        events.append(event)

    emitter.on(EventType.ACTION_START, handler)
    emitter.off(EventType.ACTION_START, handler)
    emitter.emit(AgentEvent(
        event_type=EventType.ACTION_START,
        event_id="test",
        timestamp=int(time.time() * 1000),
    ))

    assert len(events) == 0

