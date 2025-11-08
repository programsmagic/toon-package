"""
Event emitter implementation for agent events
"""
from typing import Callable, Dict, Set
from enum import Enum


class EventType(str, Enum):
    """Event types for agent communication"""
    TEXT_MESSAGE_CONTENT = "TEXT_MESSAGE_CONTENT"
    TOOL_CALL_START = "TOOL_CALL_START"
    TOOL_CALL_END = "TOOL_CALL_END"
    ACTION_START = "ACTION_START"
    ACTION_END = "ACTION_END"
    FLOW_START = "FLOW_START"
    FLOW_END = "FLOW_END"
    STATE_UPDATE = "STATE_UPDATE"
    ERROR = "ERROR"
    HEARTBEAT = "HEARTBEAT"


class AgentEvent:
    """Base agent event"""
    def __init__(self, event_type: EventType, event_id: str, **kwargs):
        self.type = event_type
        self.id = event_id
        self.timestamp = kwargs.get("timestamp", 0)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self) -> dict:
        """Convert event to dictionary"""
        return {
            "type": self.type.value,
            "id": self.id,
            "timestamp": self.timestamp,
            **{k: v for k, v in self.__dict__.items() if k not in ("type", "id", "timestamp")}
        }


class EventEmitter:
    """Simple event emitter implementation for agent events"""
    
    def __init__(self):
        self._handlers: Dict[EventType, Set[Callable[[AgentEvent], None]]] = {}
    
    def emit(self, event: AgentEvent) -> None:
        """Emit an event to all registered handlers"""
        handlers = self._handlers.get(event.type, set())
        for handler in handlers.copy():
            try:
                handler(event)
            except Exception as e:
                print(f"Error in event handler for {event.type}: {e}")
    
    def on(self, event_type: EventType, handler: Callable[[AgentEvent], None]) -> None:
        """Register an event handler"""
        if event_type not in self._handlers:
            self._handlers[event_type] = set()
        self._handlers[event_type].add(handler)
    
    def off(self, event_type: EventType, handler: Callable[[AgentEvent], None]) -> None:
        """Unregister an event handler"""
        if event_type in self._handlers:
            self._handlers[event_type].discard(handler)
    
    def remove_all_listeners(self, event_type: EventType = None) -> None:
        """Remove all listeners for an event type, or all listeners if no type specified"""
        if event_type:
            self._handlers.pop(event_type, None)
        else:
            self._handlers.clear()

