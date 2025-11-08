# @toon/backend-python

Python backend adapter for Toon Agent Bridge with FastAPI, SSE, and WebSocket support.

## Installation

```bash
pip install toon-backend-python
```

## Usage

```python
from toon_backend import create_server, ServerOptions

options = ServerOptions(
    schema_source="./schema.json",
    port=8000,
    host="0.0.0.0",
    cors=True,
)

server = await create_server(options)
# Use server["app"] with uvicorn or your ASGI server
```

## CLI

```bash
toon-bridge --schema ./openapi.json --port 8000
```

## License

MIT

