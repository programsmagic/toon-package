"""
WebSocket route
"""
import asyncio
import json
import time
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from toon_backend.event_emitter import EventEmitter, EventType, AgentEvent


def register_websocket_route(router: APIRouter, event_emitter: EventEmitter):
    """Register WebSocket route"""
    @router.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        await websocket.accept()
        
        # Send connection confirmation
        await websocket.send_json({
            "type": "connected",
            "timestamp": int(time.time() * 1000)
        })
        
        # Set up event handler
        def handler(event: AgentEvent):
            asyncio.create_task(websocket.send_json(event.to_dict()))
        
        # Listen to all event types
        for event_type in EventType:
            event_emitter.on(event_type, handler)
        
        try:
            while True:
                # Receive messages from client
                data = await websocket.receive_json()
                
                # Handle client messages (e.g., subscribe/unsubscribe)
                if data.get("type") == "subscribe":
                    # Subscribe to specific event types
                    # Implementation can be extended
                    pass
        except WebSocketDisconnect:
            # Clean up handlers on disconnect
            for event_type in EventType:
                event_emitter.off(event_type, handler)

