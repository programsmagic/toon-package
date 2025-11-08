# Changelog

All notable changes to Toon Agent Bridge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-XX

### Added

- Initial release of Toon Agent Bridge
- `@toon/core` package with OpenAPI 3.0 and agents.json parsers
- `@toon/backend-node` package with Fastify server, SSE, and WebSocket support
- `@toon/backend-python` package with FastAPI server, SSE, and WebSocket support
- `@toon/frontend` package with React components for agent visualization
- Support for OpenAPI 3.0 schema parsing and normalization
- Support for agents.json schema parsing and normalization
- Real-time event streaming via SSE and WebSocket
- Animated "toon" theme for frontend components
- Example projects for basic OpenAPI, agents.json, LangGraph, and CrewAI
- Comprehensive documentation
- Unit tests for core functionality
- CI/CD workflows with GitHub Actions

### Features

- Zero-config agent integration from JSON schemas
- Auto-generated REST routes from OpenAPI/agents.json
- Event streaming for all API calls
- Flow visualization for agents.json workflows
- React hooks and components for frontend integration
- TypeScript and Python support
- Monorepo structure with pnpm workspaces

