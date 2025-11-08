"""
CLI entry point
"""
import argparse
import uvicorn
from toon_backend.server import create_server, ServerOptions


def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(
        description="Toon Agent Bridge - Universal bridge for agent schemas"
    )
    parser.add_argument(
        "-p", "--port",
        type=int,
        default=8000,
        help="Port to listen on (default: 8000)"
    )
    parser.add_argument(
        "-H", "--host",
        type=str,
        default="0.0.0.0",
        help="Host to bind to (default: 0.0.0.0)"
    )
    parser.add_argument(
        "-s", "--schema",
        type=str,
        default="./schema.json",
        help="Path to schema file (default: ./schema.json)"
    )
    parser.add_argument(
        "--cors",
        action="store_true",
        default=True,
        help="Enable CORS (default: True)"
    )
    parser.add_argument(
        "--no-cors",
        dest="cors",
        action="store_false",
        help="Disable CORS"
    )
    
    args = parser.parse_args()
    
    options = ServerOptions(
        schema_source=args.schema,
        port=args.port,
        host=args.host,
        cors=args.cors,
    )
    
    async def run():
        server = await create_server(options)
        config = uvicorn.Config(
            server["app"],
            host=options.host,
            port=options.port,
            log_level="info",
        )
        server_instance = uvicorn.Server(config)
        await server_instance.serve()
    
    import asyncio
    asyncio.run(run())


if __name__ == "__main__":
    main()

