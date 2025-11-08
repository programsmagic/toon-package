"""
Load and parse schemas from file or URL
"""
import json
from pathlib import Path
from typing import Dict, Any
import aiohttp


async def load_schema(source: str) -> Dict[str, Any]:
    """
    Load schema from file or URL
    Returns normalized schema dictionary
    """
    if source.startswith("http://") or source.startswith("https://"):
        # Load from URL
        async with aiohttp.ClientSession() as session:
            async with session.get(source) as response:
                if response.status != 200:
                    raise ValueError(f"Failed to fetch schema: {response.status}")
                return await response.json()
    else:
        # Load from file
        path = Path(source)
        if not path.exists():
            raise FileNotFoundError(f"Schema file not found: {source}")
        
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

