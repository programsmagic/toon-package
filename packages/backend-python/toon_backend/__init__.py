"""
@programsmagic/toon-backend-python - Python backend adapter for Toon Agent Bridge
"""

__version__ = "0.1.0"

from toon_backend.server import create_server
from toon_backend.event_emitter import EventEmitter

__all__ = ["create_server", "EventEmitter", "__version__"]

