# Contributing to Toon Agent Bridge

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Python** >= 3.11 (for backend-python package)

### Setup

```bash
# Clone the repository
git clone https://github.com/programsmagic/toon-package.git
cd toon-package

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Project Structure

```
toon-package/
├── packages/
│   ├── core/           # Core types, schema parsers, normalization
│   ├── backend-node/   # Node.js/TypeScript backend (Fastify)
│   ├── backend-python/ # Python backend (FastAPI)
│   ├── frontend/       # React components for visualization
│   ├── format/         # TOON format parser/encoder
│   ├── converter/      # Multi-format converter
│   ├── tokenizer/      # Token counting utilities
│   ├── viewer/         # React viewer component
│   └── cli/            # CLI tool
├── examples/           # Working example projects
└── docs/               # Documentation
```

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/programsmagic/toon-package/issues) first
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Node.js/pnpm version and OS

### Suggesting Features

Open an issue with the **feature request** label. Include:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

### Submitting Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```
3. **Make your changes** following the code style below
4. **Add tests** for new functionality
5. **Run checks** before committing:
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```
6. **Commit** with a descriptive message (see commit conventions below)
7. **Push** to your fork and open a PR against `main`

## Code Style

- **TypeScript** for all Node.js packages
- **ESLint + Prettier** enforced via pre-commit hooks
- Run `pnpm format` to auto-format code
- Run `pnpm lint` to check for issues

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new token estimation model
fix: correct TOON parser edge case with nested arrays
docs: update CLI usage guide
test: add converter batch processing tests
chore: update dependencies
```

## Development Workflow

### Working on a Package

Each package can be developed independently:

```bash
# Build a specific package
cd packages/core
pnpm build

# Run tests for a specific package
cd packages/core
pnpm test

# Watch mode (if available)
cd packages/core
pnpm dev
```

### Running Examples

```bash
cd examples/basic-openapi
pnpm install
pnpm start
```

### Adding a New Package

1. Create directory under `packages/`
2. Add `package.json` with `@programsmagic/toon-*` scope
3. Add the package to `pnpm-workspace.yaml`
4. Add build/test/lint scripts
5. Add to CI workflow in `.github/workflows/ci.yml`

## Testing

- Use **Jest** for TypeScript packages
- Use **pytest** for Python packages
- Place tests in `src/__tests__/` within each package
- Aim for meaningful coverage on core logic

## Questions?

- Open a [GitHub Discussion](https://github.com/programsmagic/toon-package/discussions)
- File an [issue](https://github.com/programsmagic/toon-package/issues)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
