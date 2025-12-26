# Theme Standards - MCP Skills Server

## Overview

This document defines the visual and formatting standards for the MCP Skills Server CLI tool, including terminal output formatting, log message structure, error message formatting, and documentation theme.

**Important**: The MCP Skills Server is a CLI tool (not a web application), so "theme" refers to:
- Terminal output formatting
- Log message structure
- Error message formatting
- Documentation styling (README, GitHub pages)

**Note**: No UX mockups exist for this project since it's a command-line tool without a graphical interface.

---

## Terminal Output Standards

### CLI Help Text Format

**Structure**:
```
usage: mcp-skills-server [options]

MCP Skills Server - Serve AI agent skills via Model Context Protocol

Options:
  --skills-dir PATH          Skills directory path (required)
  --log-level LEVEL          Logging level: DEBUG, INFO, WARNING, ERROR (default: INFO)
  --oauth-client-id ID       OAuth client ID (or set MCP_OAUTH_CLIENT_ID)
  --oauth-client-secret SECRET OAuth client secret (or set MCP_OAUTH_CLIENT_SECRET)
  --config FILE              Configuration file path (v1.0 feature)
  --validate-config          Validate configuration and exit
  --version                  Show version and exit
  --help                     Show this help message and exit

Examples:
  mcp-skills-server --skills-dir ./dev-swarms/skills --log-level INFO
  mcp-skills-server --skills-dir /path/to/skills --config ~/.mcp-skills-server/config.yaml

Environment Variables:
  MCP_OAUTH_CLIENT_ID        OAuth application client ID
  MCP_OAUTH_CLIENT_SECRET    OAuth application client secret
  MCP_SKILLS_DIR             Default skills directory path
  MCP_LOG_LEVEL              Default log level

For more information: https://github.com/your-org/mcp-skills-server
```

**Formatting Rules**:
- Keep lines under 80 characters
- Indent options with 2 spaces
- Group related options together
- Provide clear examples
- Include environment variable alternatives

---

### Log Message Format

**Standard Format**:
```
[TIMESTAMP] [LEVEL] [COMPONENT] Message
```

**Format Specification**:
- **Timestamp**: ISO 8601 format `YYYY-MM-DD HH:MM:SS`
- **Level**: Fixed width (7 chars): `DEBUG  `, `INFO   `, `WARNING`, `ERROR  `
- **Component**: Fixed categories (see below)
- **Message**: Human-readable description

**Component Names**:
- `[server]` - Server lifecycle (startup, shutdown, ready)
- `[config]` - Configuration loading and validation
- `[discovery]` - Skill discovery process
- `[registry]` - Tool registry operations
- `[mcp]` - MCP protocol handler (requests/responses)
- `[oauth]` - OAuth validation
- `[io]` - File I/O operations
- `[invocation]` - Skill invocation handler

**Log Examples**:
```
[2025-12-26 16:30:45] [INFO   ] [server] MCP Skills Server v0.1.0 starting...
[2025-12-26 16:30:45] [DEBUG  ] [config] Skills directory: /Users/maya/projects/dev-swarms/skills
[2025-12-26 16:30:45] [DEBUG  ] [config] OAuth client ID: abc123xyz
[2025-12-26 16:30:45] [DEBUG  ] [config] OAuth client secret: ***masked***
[2025-12-26 16:30:45] [INFO   ] [oauth] OAuth configured for provider: google
[2025-12-26 16:30:45] [DEBUG  ] [discovery] Scanning skills directory...
[2025-12-26 16:30:46] [DEBUG  ] [discovery] Found SKILL.md: dev-swarms-init-ideas
[2025-12-26 16:30:46] [DEBUG  ] [discovery] Found SKILL.md: dev-swarms-market-research
[2025-12-26 16:30:46] [DEBUG  ] [discovery] Found SKILL.md: dev-swarms-personas
[2025-12-26 16:30:46] [INFO   ] [discovery] Found 3 skills in 0.8s
[2025-12-26 16:30:47] [INFO   ] [server] Server ready (1.2s)
[2025-12-26 16:31:00] [INFO   ] [mcp] Received list_tools request
[2025-12-26 16:31:00] [INFO   ] [mcp] list_tools complete (42ms)
[2025-12-26 16:31:15] [INFO   ] [mcp] Skill invoked: init-ideas
[2025-12-26 16:31:15] [DEBUG  ] [invocation] Reading SKILL.md: /Users/maya/.../dev-swarms-init-ideas/SKILL.md
[2025-12-26 16:31:15] [DEBUG  ] [io] File read successful: 45KB
[2025-12-26 16:31:15] [INFO   ] [mcp] Invocation complete (87ms)
[2025-12-26 16:31:20] [WARNING] [oauth] Token validation failed: token expired
[2025-12-26 16:31:25] [ERROR  ] [io] Failed to read file: /path/to/missing.md (File not found)
```

**Python Implementation**:
```python
import logging

# Configure logging format
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)-7s] [%(name)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    stream=sys.stderr
)

# Create component-specific loggers
server_logger = logging.getLogger('server')
config_logger = logging.getLogger('config')
discovery_logger = logging.getLogger('discovery')

# Log messages
server_logger.info("MCP Skills Server v0.1.0 starting...")
config_logger.debug(f"Skills directory: {skills_dir}")
discovery_logger.info(f"Found {len(skills)} skills in {elapsed}s")
```

---

### Error Message Format

**Structure**:
```
[ERROR] ERR_COMPONENT_CODE: Error Title

Detailed explanation of what went wrong.
  Context: Specific details (path, value, etc.)

To fix this issue:
1. Step one to resolve the problem
2. Step two to resolve the problem
3. Step three to resolve the problem

For more help: https://github.com/your-org/mcp-skills-server/docs/errors#ERR_COMPONENT_CODE
```

**Error Code Format**: `ERR_COMPONENT_NNN`
- **COMPONENT**: CONFIG, DISCOVERY, IO, MCP, OAUTH, SERVER
- **NNN**: 3-digit number (001-999)

**Error Examples**:

**Example 1: Configuration Error**
```
[ERROR] ERR_CONFIG_001: Skills directory not found

The configured skills directory does not exist:
  Path: ./dev-swarms/skills
  Absolute: /Users/maya/projects/dev-swarms/skills

To fix this issue:
1. Check that the path is correct
2. Create the directory: mkdir -p ./dev-swarms/skills
3. Or specify a different path: --skills-dir /path/to/skills

For more help: https://github.com/your-org/mcp-skills-server/docs/errors#ERR_CONFIG_001
```

**Example 2: OAuth Error**
```
[ERROR] ERR_OAUTH_100: OAuth provider unreachable

Unable to connect to OAuth provider for token validation:
  Provider: https://accounts.google.com
  Error: Connection timeout after 30 seconds

To fix this issue:
1. Check your internet connection
2. Verify OAuth provider URL is correct
3. Check if OAuth provider is experiencing outages
4. Retry in a few moments

For more help: https://github.com/your-org/mcp-skills-server/docs/errors#ERR_OAUTH_100
```

**Example 3: Skill Discovery Warning**
```
[WARNING] ERR_DISCOVERY_201: Skipping skill due to invalid YAML

Failed to parse YAML frontmatter:
  Skill: my-custom-skill
  File: ./dev-swarms/skills/my-custom-skill/SKILL.md
  Error: YAML parsing error at line 3: unexpected character ':'

To fix this issue:
1. Open the SKILL.md file
2. Check YAML frontmatter syntax (must be valid YAML between --- delimiters)
3. Fix the YAML error at line 3
4. Restart the server

For more help: https://github.com/your-org/mcp-skills-server/docs/errors#ERR_DISCOVERY_201
```

**Python Error Helper**:
```python
def format_error(code: str, title: str, explanation: str, context: dict, steps: list[str]) -> str:
    """Format error message according to standards."""
    lines = [
        f"[ERROR] {code}: {title}",
        "",
        explanation,
    ]

    if context:
        for key, value in context.items():
            lines.append(f"  {key}: {value}")
        lines.append("")

    if steps:
        lines.append("To fix this issue:")
        for i, step in enumerate(steps, 1):
            lines.append(f"{i}. {step}")
        lines.append("")

    lines.append(f"For more help: https://github.com/your-org/mcp-skills-server/docs/errors#{code}")

    return "\n".join(lines)
```

---

### Success/Status Messages

**Success Format**:
```
✓ Action completed successfully
```

**Progress Format**:
```
Discovering skills... (3/10) 30%
```

**Examples**:
```
✓ OAuth configured successfully
✓ Discovered 3 skills
✓ Server ready (1.2s)

Discovering skills... (3/10) 30%
Loading configuration...
Validating OAuth configuration...
```

**Note**: Use text-based indicators (not just symbols) for screen reader accessibility

---

## Terminal Color Usage (Optional)

**Philosophy**: Use colors sparingly, ensure graceful degradation

**Color Palette** (if terminal supports color):
- **Red**: Errors and critical issues
- **Yellow**: Warnings and cautions
- **Green**: Success and completion
- **Blue**: Info and neutral messages
- **Gray**: Debug and verbose output

**Implementation** (optional, detect terminal capabilities):
```python
import sys

# Detect color support
def supports_color():
    """Check if terminal supports ANSI color codes."""
    return hasattr(sys.stdout, 'isatty') and sys.stdout.isatty()

# ANSI color codes
class Colors:
    if supports_color():
        RED = '\033[91m'
        YELLOW = '\033[93m'
        GREEN = '\033[92m'
        BLUE = '\033[94m'
        GRAY = '\033[90m'
        RESET = '\033[0m'
    else:
        RED = YELLOW = GREEN = BLUE = GRAY = RESET = ''

# Usage
print(f"{Colors.GREEN}✓ Server ready{Colors.RESET}")
print(f"{Colors.RED}[ERROR]{Colors.RESET} Configuration invalid")
```

**Accessibility Note**: NEVER rely on color alone - always include text labels

---

## Documentation Theme (GitHub/Web)

### README.md Format

**Structure**:
```markdown
# Project Name

Brief tagline (one sentence)

## Overview

Short description (2-3 paragraphs)

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick Start

### Installation

```bash
uv pip install mcp-skills-server
```

### Configuration

```bash
export MCP_OAUTH_CLIENT_ID="your-client-id"
export MCP_OAUTH_CLIENT_SECRET="your-client-secret"
```

### Usage

```bash
mcp-skills-server --skills-dir ./dev-swarms/skills
```

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Configuration](docs/configuration.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT License - see [LICENSE](LICENSE)
```

**Markdown Styling Guidelines**:
- Use headings hierarchically (H1 → H2 → H3)
- Code blocks with language specification
- Use lists for sequential steps or related items
- Include alt text for images (accessibility)
- Keep line length under 100 characters

---

### GitHub Pages Theme (Optional)

**If using MkDocs or similar**:

**Color Scheme**:
- **Primary**: #2563eb (blue)
- **Accent**: #10b981 (green)
- **Background**: #ffffff (white)
- **Text**: #1f2937 (dark gray)
- **Code Background**: #f3f4f6 (light gray)

**Typography**:
- **Headings**: Inter, system-ui, sans-serif
- **Body**: system-ui, sans-serif
- **Code**: 'Fira Code', 'Source Code Pro', monospace

**Not Required for MVP**: GitHub README is sufficient

---

## Consistency Rules

### Terminology

Use consistent terminology throughout:
- **Skill** (not "tool", "plugin", "extension")
- **SKILL.md** (not "skill file", "skill.md")
- **MCP Client** (not "client", "AI agent")
- **OAuth Provider** (not "auth provider", "identity provider")
- **Skills Directory** (not "skills folder", "skill path")
- **Invocation** (not "execution", "run")

### Capitalization

- **Product Name**: MCP Skills Server (title case)
- **Skill Names**: lowercase with hyphens (`init-ideas`, not `Init-Ideas`)
- **Log Levels**: UPPERCASE (`DEBUG`, `INFO`, `WARNING`, `ERROR`)
- **Error Codes**: UPPERCASE (`ERR_CONFIG_001`)
- **Component Names**: lowercase (`server`, `config`, `discovery`)

### Formatting

- **File Paths**: Use absolute paths in logs for clarity
- **Durations**: Include units (`1.2s`, `87ms`)
- **Counts**: Include context (`Found 3 skills`, not `Found 3`)
- **Percentages**: Include `%` symbol (`30%`)
- **Sizes**: Use standard units (`45KB`, `200MB`)

---

## CLI Output Examples

### Startup Output (INFO Level)

```
[2025-12-26 16:30:45] [INFO   ] [server] MCP Skills Server v0.1.0 starting...
[2025-12-26 16:30:45] [INFO   ] [oauth] OAuth configured for provider: google
[2025-12-26 16:30:46] [INFO   ] [discovery] Found 3 skills in 0.8s
[2025-12-26 16:30:47] [INFO   ] [server] Server ready (1.2s)
```

### Startup Output (DEBUG Level)

```
[2025-12-26 16:30:45] [INFO   ] [server] MCP Skills Server v0.1.0 starting...
[2025-12-26 16:30:45] [DEBUG  ] [config] Skills directory: /Users/maya/projects/dev-swarms/skills
[2025-12-26 16:30:45] [DEBUG  ] [config] Project root: /Users/maya/projects/dev-swarms
[2025-12-26 16:30:45] [DEBUG  ] [config] Log level: DEBUG
[2025-12-26 16:30:45] [DEBUG  ] [config] OAuth client ID: abc123xyz
[2025-12-26 16:30:45] [DEBUG  ] [config] OAuth client secret: ***masked***
[2025-12-26 16:30:45] [DEBUG  ] [oauth] Connecting to OAuth provider: https://accounts.google.com
[2025-12-26 16:30:45] [INFO   ] [oauth] OAuth configured for provider: google
[2025-12-26 16:30:45] [DEBUG  ] [discovery] Scanning skills directory...
[2025-12-26 16:30:46] [DEBUG  ] [discovery] Found SKILL.md: dev-swarms-init-ideas
[2025-12-26 16:30:46] [DEBUG  ] [discovery] Parsing YAML frontmatter: dev-swarms-init-ideas
[2025-12-26 16:30:46] [DEBUG  ] [registry] Registered skill: init-ideas
[2025-12-26 16:30:46] [DEBUG  ] [discovery] Found SKILL.md: dev-swarms-market-research
[2025-12-26 16:30:46] [DEBUG  ] [registry] Registered skill: market-research
[2025-12-26 16:30:46] [DEBUG  ] [discovery] Found SKILL.md: dev-swarms-personas
[2025-12-26 16:30:46] [DEBUG  ] [registry] Registered skill: personas
[2025-12-26 16:30:46] [INFO   ] [discovery] Found 3 skills in 0.8s
[2025-12-26 16:30:47] [DEBUG  ] [mcp] Starting stdio listener...
[2025-12-26 16:30:47] [INFO   ] [server] Server ready (1.2s)
```

### Error Output

```
[2025-12-26 16:30:45] [ERROR  ] [config] Configuration validation failed
[ERROR] ERR_CONFIG_001: Skills directory not found

The configured skills directory does not exist:
  Path: ./dev-swarms/skills
  Absolute: /Users/maya/projects/dev-swarms/skills

To fix this issue:
1. Check that the path is correct
2. Create the directory: mkdir -p ./dev-swarms/skills
3. Or specify a different path: --skills-dir /path/to/skills

For more help: https://github.com/your-org/mcp-skills-server/docs/errors#ERR_CONFIG_001

Server startup failed. Exit code: 1
```

---

## Accessibility Standards

### Screen Reader Compatibility

- ✅ All status updates have text labels (not just symbols)
- ✅ Progress indicators include percentages
- ✅ Error messages are clear and actionable
- ✅ No reliance on color alone (always include text)

### Terminal Compatibility

- ✅ Works in 80-character width terminals
- ✅ UTF-8 encoding supported
- ✅ Graceful degradation if colors not supported
- ✅ Works over SSH connections

---

## Theme Standards Summary

| Aspect | Standard |
|--------|----------|
| **Log Format** | `[TIMESTAMP] [LEVEL] [COMPONENT] Message` |
| **Timestamp** | ISO 8601: `YYYY-MM-DD HH:MM:SS` |
| **Error Format** | `ERR_COMPONENT_NNN: Title + Explanation + Steps` |
| **Line Length** | Max 80-100 characters |
| **Colors** | Optional, with graceful degradation |
| **Terminology** | Consistent (Skill, SKILL.md, MCP Client, etc.) |
| **Capitalization** | Product name title case, skill names lowercase |
| **Accessibility** | Text labels + colors, screen reader friendly |

---

Last updated: 2025-12-26
