"""
Action routes for agent endpoints
"""
import json
import time
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from typing import Dict, Any
from toon_backend.event_emitter import EventEmitter, EventType, AgentEvent


def create_action_handler(
    action: Dict[str, Any],
    event_emitter: EventEmitter,
    base_url: str = None
):
    """Create a FastAPI route handler for an action"""
    
    async def handler(request: Request):
        action_id = f"{action['id']}_{int(time.time() * 1000)}"
        start_time = time.time()
        
        # Emit action start event
        event_emitter.emit(AgentEvent(
            event_type=EventType.ACTION_START,
            event_id=action_id,
            timestamp=int(time.time() * 1000),
            actionId=action_id,
            actionName=action.get("name", ""),
            endpoint=action.get("endpoint", ""),
            method=action.get("method", "GET"),
            parameters={
                **dict(request.query_params),
                **dict(request.path_params),
            }
        ))
        
        try:
            # Build full URL if base_url is provided
            full_url = f"{base_url}{action['endpoint']}" if base_url else action['endpoint']
            
            # In a real implementation, this would make an actual HTTP request
            # For now, we'll simulate it
            response_data = await execute_action(action, request, full_url)
            
            duration = int((time.time() - start_time) * 1000)
            
            # Emit action end event
            event_emitter.emit(AgentEvent(
                event_type=EventType.ACTION_END,
                event_id=f"{action_id}_end",
                timestamp=int(time.time() * 1000),
                actionId=action_id,
                response=response_data,
                statusCode=200,
                success=True,
                duration=duration
            ))
            
            return response_data
        except Exception as error:
            duration = int((time.time() - start_time) * 1000)
            error_message = str(error)
            
            # Emit error event
            event_emitter.emit(AgentEvent(
                event_type=EventType.ACTION_END,
                event_id=f"{action_id}_end",
                timestamp=int(time.time() * 1000),
                actionId=action_id,
                success=False,
                error=error_message,
                duration=duration
            ))
            
            from fastapi.responses import JSONResponse
            return JSONResponse(
                content={"error": error_message},
                status_code=500
            )
    
    return handler


async def execute_action(
    action: Dict[str, Any],
    request: Request,
    full_url: str
) -> Dict[str, Any]:
    """Execute an action (mock implementation)"""
    # In a real implementation, this would:
    # 1. Build the request URL with query parameters
    # 2. Make an HTTP request to the actual backend
    # 3. Return the response
    
    return {
        "action": action.get("id", ""),
        "endpoint": action.get("endpoint", ""),
        "method": action.get("method", "GET"),
        "parameters": {
            **dict(request.query_params),
            **dict(request.path_params),
        },
        "message": "This is a mock response. In production, this would call the actual backend."
    }


def register_action_routes(
    router: APIRouter,
    schema: Dict[str, Any],
    event_emitter: EventEmitter
):
    """Register action routes from schema"""
    actions = schema.get("actions", [])
    base_url = schema.get("baseUrl", "")
    
    for action in actions:
        method = action.get("method", "GET").lower()
        endpoint = action.get("endpoint", "")
        handler = create_action_handler(action, event_emitter, base_url)
        
        # Register route based on method
        if method == "get":
            router.get(endpoint)(handler)
        elif method == "post":
            router.post(endpoint)(handler)
        elif method == "put":
            router.put(endpoint)(handler)
        elif method == "delete":
            router.delete(endpoint)(handler)
        elif method == "patch":
            router.patch(endpoint)(handler)
        elif method == "head":
            router.head(endpoint)(handler)
        elif method == "options":
            router.options(endpoint)(handler)

