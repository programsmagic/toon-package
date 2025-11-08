"""
FastAPI server setup
"""
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Optional
from toon_backend.adapters.schema_loader import load_schema
from toon_backend.routes.actions import register_action_routes
from toon_backend.routes.stream import register_stream_route
from toon_backend.routes.websocket import register_websocket_route
from toon_backend.event_emitter import EventEmitter


class ServerOptions:
    """Server configuration options"""
    def __init__(
        self,
        schema_source: str,
        port: int = 8000,
        host: str = "0.0.0.0",
        cors: bool = True,
        cors_origins: Optional[list] = None,
    ):
        self.schema_source = schema_source
        self.port = port
        self.host = host
        self.cors = cors
        self.cors_origins = cors_origins or ["*"]


async def create_server(options: ServerOptions):
    """Create and configure FastAPI server"""
    app = FastAPI(
        title="Toon Agent Bridge",
        description="Universal bridge for converting OpenAPI and agents.json schemas into agent-ready workflows",
        version="0.1.0",
    )
    
    # Configure CORS
    if options.cors:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=options.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    # Load schema
    schema = await load_schema(options.schema_source)
    
    # Create event emitter
    event_emitter = EventEmitter()
    
    # Create router
    router = APIRouter()
    
    # Register routes
    register_action_routes(router, schema, event_emitter)
    register_stream_route(router, event_emitter)
    register_websocket_route(router, event_emitter)
    
    # Health check endpoint
    @app.get("/health")
    async def health():
        return {
            "status": "ok",
            "schema": {
                "name": schema.get("name", "Unknown"),
                "version": schema.get("version", "1.0.0"),
                "actions": len(schema.get("actions", [])),
                "flows": len(schema.get("flows", [])),
            }
        }
    
    # Schema info endpoint
    @app.get("/schema")
    async def schema_info():
        return schema
    
    # Include router
    app.include_router(router)
    
    return {
        "app": app,
        "schema": schema,
        "event_emitter": event_emitter,
        "options": options,
    }

