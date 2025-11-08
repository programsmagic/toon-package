<!-- b2e01346-bdb8-42cc-a6ce-52f905c890e0 cbf30b16-477d-4ad4-beb8-d93c25dab4db -->
# TOON Format Viewer & Converter Extension Plan

## Project Overview

Extend the existing Toon Agent Bridge monorepo to include:

1. TOON format support (Token-Oriented Object Notation) for LLM token efficiency
2. Rich viewer/converter UI for multiple formats (TOON, JSON, CSV, YAML)
3. Token counting and optimization features
4. Agent-friendly streaming and prompt optimization
5. Multi-format conversion with intelligent format selection

## New Package Structure

Add to existing monorepo:

- `@toon/format` - TOON format parser/encoder with TOON+ extensions
- `@toon/converter` - Multi-format converter (JSON/TOON/CSV/YAML) with smart fallback
- `@toon/viewer` - Rich React viewer component with split-pane UI
- `@toon/cli` - Command-line tool for format conversion and token optimization
- `@toon/tokenizer` - Token counting and estimation utilities

## Phase 1: TOON Format Core Package

### 1.1 @toon/format Package

**Location**: `packages/format/`

**Key Features**:

- TOON format parser (decode TOON → JSON)
- TOON format encoder (encode JSON → TOON)
- TOON+ extensions:
  - Structural index header (MD5/length hints)
  - Multimodal metadata support
  - Field-level comments/annotations
- Ultra-minimization mode (strip all whitespace for pure model use)
- Type preservation (numbers, booleans, null)

**Key Files**:

- `src/parser.ts` - TOON parser implementation
- `src/encoder.ts` - TOON encoder with optimization options
- `src/toon-plus.ts` - TOON+ extensions (index, metadata, comments)
- `src/types.ts` - TOON format types
- `src/utils.ts` - Format utilities

**Dependencies**:

- `@toon/core` (workspace dependency)
- `zod` for validation

## Phase 2: Multi-Format Converter Package

### 2.1 @toon/converter Package

**Location**: `packages/converter/`

**Key Features**:

- Format detection (auto-detect JSON/TOON/CSV/YAML)
- Smart format selection (choose optimal format per data structure)
- CSV eligibility detection (identify tabular data at all nesting levels)
- Intelligent fallback (use JSON for non-tabular data, TOON/CSV for tabular)
- Batch conversion utilities
- Format comparison (token savings analysis)

**Key Files**:

- `src/detector.ts` - Format auto-detection
- `src/selector.ts` - Smart format selection algorithm
- `src/csv-detector.ts` - CSV eligibility detection
- `src/converter.ts` - Multi-format conversion engine
- `src/batch.ts` - Batch file processing
- `src/comparator.ts` - Format comparison utilities

**Dependencies**:

- `@toon/format` (workspace dependency)
- `@toon/core` (workspace dependency)
- `js-yaml` for YAML support
- `papaparse` for CSV support

## Phase 3: Token Counting & Optimization

### 3.1 @toon/tokenizer Package

**Location**: `packages/tokenizer/`

**Key Features**:

- Token counting for multiple models (GPT-4, Claude, etc.)
- Real-time token estimation as-you-type
- Per-field token analysis
- Token savings calculator (compare formats)
- Token audit utilities (batch analysis)

**Key Files**:

- `src/counter.ts` - Token counting implementation
- `src/estimator.ts` - Real-time token estimation
- `src/analyzer.ts` - Per-field token analysis
- `src/models.ts` - Model-specific tokenizers
- `src/audit.ts` - Token audit utilities

**Dependencies**:

- `@toon/format` (workspace dependency)
- `tiktoken` for OpenAI token counting
- `@anthropic-ai/sdk` for Claude token counting

## Phase 4: Rich Viewer UI Package

### 4.1 @toon/viewer Package

**Location**: `packages/viewer/`

**Key Features**:

- Split-pane viewer (JSON/TOON/CSV side-by-side)
- Real-time format conversion
- Token count display (live updates)
- Copy as fenced block (with auto-labeled headers)
- Drag & drop file support
- Paste detection (auto-detect format)
- Syntax highlighting
- Format validation with error highlighting
- LLM-grade mode (optimized for prompt copying)

**Key Components**:

- `FormatViewer.tsx` - Main split-pane viewer component
- `FormatConverter.tsx` - Format conversion UI
- `TokenCounter.tsx` - Token count display component
- `CopyButton.tsx` - Copy with prompt wrapper
- `FileDropZone.tsx` - Drag & drop file upload
- `SyntaxHighlighter.tsx` - Syntax highlighting
- `FormatValidator.tsx` - Format validation with errors

**Dependencies**:

- `@toon/converter` (workspace dependency)
- `@toon/tokenizer` (workspace dependency)
- `@toon/frontend` (workspace dependency for styling)
- `react-split-pane` or similar
- `react-syntax-highlighter`
- `react-dropzone`

## Phase 5: CLI Tool Package

### 5.1 @toon/cli Package

**Location**: `packages/cli/`

**Key Features**:

- Command-line format conversion
- Token optimization mode
- Batch file processing
- Token audit reports
- Format comparison reports
- Streaming conversion (row-by-row for large files)

**Commands**:

- `toon convert <input> <output>` - Convert between formats
- `toon optimize <file>` - Optimize file for LLM (choose best format)
- `toon audit <file>` - Token audit report
- `toon compare <file1> <file2>` - Compare formats
- `toon stream <file>` - Stream conversion (SSE/WebSocket)

**Key Files**:

- `src/cli.ts` - CLI entry point
- `src/commands/convert.ts` - Convert command
- `src/commands/optimize.ts` - Optimize command
- `src/commands/audit.ts` - Audit command
- `src/commands/compare.ts` - Compare command
- `src/commands/stream.ts` - Stream command

**Dependencies**:

- `@toon/converter` (workspace dependency)
- `@toon/tokenizer` (workspace dependency)
- `commander` for CLI framework
- `chalk` for colored output

## Phase 6: Agent Integration & Streaming

### 6.1 Extend @toon/backend-node

**Location**: `packages/backend-node/`

**New Features**:

- TOON format streaming endpoint
- Row-by-row TOON streaming (SSE/WebSocket)
- Agent prompt wrapper endpoint
- Format optimization API

**New Routes**:

- `POST /convert` - Format conversion API
- `GET /stream/toon` - Stream TOON format (row-by-row)
- `POST /optimize` - Optimize format for LLM
- `GET /tokens` - Token count API

### 6.2 Extend @toon/frontend

**Location**: `packages/frontend/`

**New Components**:

- `FormatViewer` - Re-export from @toon/viewer
- `TokenCounter` - Re-export from @toon/tokenizer
- `StreamViewer` - Real-time streaming viewer for TOON data

## Phase 7: Integration Examples

### 7.1 New Examples

**Location**: `examples/`

- `toon-viewer/` - Standalone viewer app
- `toon-converter/` - Format conversion demo
- `token-optimizer/` - Token optimization demo
- `agent-streaming/` - Agent streaming with TOON format
- `batch-processor/` - Batch file processing example

## Phase 8: Documentation & Polish

### 8.1 Documentation

- TOON format guide
- Viewer UI guide
- Token optimization guide
- CLI usage guide
- Agent integration guide

### 8.2 Testing

- Unit tests for format conversion
- Integration tests for viewer UI
- E2E tests for CLI tool
- Token counting accuracy tests

## Technical Decisions

**TOON Format Library**:

- Option A: Use official `@toon-format/toon` as dependency
- Option B: Implement from spec (more control, TOON+ extensions)
- **Recommendation**: Option B for TOON+ extensions and full control

**Token Counting**:

- Use `tiktoken` for OpenAI models
- Use `@anthropic-ai/sdk` for Claude
- Fallback to character-based estimation for other models

**Viewer UI Framework**:

- React (matches existing frontend package)
- Use Monaco Editor or CodeMirror for syntax highlighting
- Split-pane library: `react-split-pane` or `allotment`

**Format Detection**:

- Use file extension as primary hint
- Content-based detection as fallback
- Magic number detection for binary formats

## File Structure Preview

```
toon-package/
├── packages/
│   ├── core/ (existing)
│   ├── backend-node/ (existing, extended)
│   ├── backend-python/ (existing)
│   ├── frontend/ (existing, extended)
│   ├── format/ (NEW)
│   ├── converter/ (NEW)
│   ├── tokenizer/ (NEW)
│   ├── viewer/ (NEW)
│   └── cli/ (NEW)
├── examples/
│   ├── toon-viewer/ (NEW)
│   ├── toon-converter/ (NEW)
│   ├── token-optimizer/ (NEW)
│   └── ... (existing examples)
└── docs/
    ├── toon-format.md (NEW)
    ├── viewer-guide.md (NEW)
    └── ... (existing docs)
```

## Success Metrics & Quality Gates

### Performance Metrics

1. **Token Efficiency**: 30-60% token reduction vs JSON (validated across datasets)
2. **Format Detection**: 98%+ accuracy in auto-detection
3. **Viewer Performance**: Handle files up to 50MB smoothly (with streaming)
4. **CLI Speed**: Convert 1000+ files in < 30 seconds
5. **Conversion Speed**: < 100ms for typical files (< 1MB)
6. **Bundle Size**: < 200KB gzipped for viewer component
7. **Time to Interactive**: < 2s for viewer UI

### Quality Metrics

1. **Test Coverage**: 90%+ code coverage
2. **Type Safety**: 100% TypeScript strict mode
3. **Error Rate**: < 0.1% unhandled errors
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
6. **API Stability**: No breaking changes in patch/minor versions

### Developer Experience Metrics

1. **Setup Time**: < 5 minutes from install to first use
2. **Documentation**: 100% API coverage with examples
3. **Error Messages**: Clear, actionable error messages
4. **TypeScript Support**: Full type definitions for all packages
5. **IDE Support**: VS Code extension with autocomplete
6. **Community**: Active community with < 24h response time

### Production Readiness

1. **Logging**: Structured logging for all operations
2. **Monitoring**: Health check endpoints
3. **Error Tracking**: Integration-ready for Sentry/LogRocket
4. **Performance**: Lighthouse score > 90
5. **Security**: No known vulnerabilities
6. **Documentation**: Complete guides for all use cases

## Implementation Phases Summary

**Phase 1-3**: Core format support (TOON parser, converter, tokenizer)

**Phase 4-5**: Viewer UI and CLI tool

**Phase 6-7**: Backend extensions and integration examples

**Phase 8**: Production-ready features (error handling, performance, security)

**Phase 9**: Comprehensive documentation

**Phase 10**: Developer tooling (VS Code extension, enhanced CLI)

**Phase 11**: Enterprise features (monitoring, analytics, support)

**Phase 12**: Community and ecosystem (plugins, integrations)

## Risk Mitigation

### Technical Risks

- **Large File Handling**: Implement streaming early, test with 100MB+ files
- **Format Compatibility**: Maintain 100% TOON spec compliance
- **Token Accuracy**: Regular validation against official tokenizers
- **Performance**: Continuous performance monitoring and optimization

### Developer Experience Risks

- **Complexity**: Provide simple defaults, advanced features opt-in
- **Documentation**: Comprehensive docs with examples for every feature
- **Migration**: Clear migration paths from other formats
- **Support**: Active community support and quick response times

### Production Risks

- **Errors**: Comprehensive error handling with recovery
- **Security**: Regular security audits and updates
- **Stability**: Thorough testing and gradual rollout
- **Monitoring**: Full observability from day one

### To-dos

- [ ] Create @toon/format package with TOON parser, encoder, and TOON+ extensions (structural index, metadata, comments)
- [ ] Create @toon/converter package with multi-format support (JSON/TOON/CSV/YAML), auto-detection, and smart format selection
- [ ] Create @toon/tokenizer package with token counting for multiple models, real-time estimation, and per-field analysis
- [ ] Create @toon/viewer package with split-pane viewer, real-time conversion, token display, drag & drop, and LLM-grade mode
- [ ] Create @toon/cli package with convert, optimize, audit, compare, and stream commands
- [ ] Extend @toon/backend-node with TOON streaming endpoints, format conversion API, and optimization endpoints
- [ ] Extend @toon/frontend with FormatViewer, TokenCounter, and StreamViewer components
- [ ] Create examples: toon-viewer, toon-converter, token-optimizer, agent-streaming, batch-processor
- [ ] Write docs: TOON format guide, viewer UI guide, token optimization guide, CLI usage, agent integration
- [ ] Add unit tests for format conversion, integration tests for viewer UI, E2E tests for CLI, token counting accuracy tests