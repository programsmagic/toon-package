"""
SSE streaming route
"""
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from toon_backend.event_emitter import EventEmitter, EventType, AgentEvent
import json
import time
import asyncio


async def event_generator(event_emitter: EventEmitter):
    """Generate SSE events"""
    # Send initial connection event
    yield f"data: {json.dumps({'type': 'connected', 'timestamp': int(time.time() * 1000)})}\n\n"
    
    # Set up event queue
    event_queue = asyncio.Queue()
    handlers = []
    
    # Event handler to add events to queue
    def make_handler():
        def handler(event: AgentEvent):
            try:
                event_queue.put_nowait(event)
            except asyncio.QueueFull:
                pass  # Drop event if queue is full
        return handler
    
    # Listen to all event types
    for event_type in EventType:
        handler = make_handler()
        handlers.append((event_type, handler))
        event_emitter.on(event_type, handler)
    
    try:
        while True:
            # Wait for event or timeout
            try:
                event = await asyncio.wait_for(event_queue.get(), timeout=30.0)
                yield f"data: {json.dumps(event.to_dict())}\n\n"
            except asyncio.TimeoutError:
                # Send heartbeat
                heartbeat = AgentEvent(
                    event_type=EventType.HEARTBEAT,
                    event_id=f"heartbeat_{int(time.time() * 1000)}",
                    timestamp=int(time.time() * 1000)
                )
                yield f"data: {json.dumps(heartbeat.to_dict())}\n\n"
    finally:
        # Clean up handlers
        for event_type, handler in handlers:
            event_emitter.off(event_type, handler)


def register_stream_route(router: APIRouter, event_emitter: EventEmitter):
    """Register SSE streaming route"""
    @router.get("/events")
    async def stream_events():
        return StreamingResponse(
            event_generator(event_emitter),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )

