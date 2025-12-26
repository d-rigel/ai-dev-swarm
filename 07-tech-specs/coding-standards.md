# Coding Standards - MCP Skills Server

## Overview

This document defines code style rules, naming conventions, file organization, and best practices for the MCP Skills Server codebase.

**Philosophy**: Write clean, readable, maintainable code that follows Python best practices.

---

## General Principles

### 1. Readability First
- Code is read more often than written
- Optimize for clarity, not cleverness
- Use descriptive names over short names
- Comment the WHY, not the WHAT

### 2. DRY (Don't Repeat Yourself)
- Extract common logic into functions
- Avoid copy-paste code
- Use inheritance/composition appropriately

### 3. KISS (Keep It Simple, Stupid)
- Simple solutions over complex ones
- Avoid premature optimization
- Don't over-engineer

### 4. SOLID Principles

- **Single Responsibility**: Each class/function does ONE thing
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes should be substitutable for base types
- **Interface Segregation**: Many specific interfaces > one general interface
- **Dependency Inversion**: Depend on abstractions, not implementations

### 5. Fail Fast
- Validate inputs early
- Raise exceptions for invalid state
- Don't silently ignore errors

---

## Python Version

**Target**: Python 3.8+

**Compatibility**:
- Support Python 3.8, 3.9, 3.10, 3.11, 3.12
- Use type hints (Python 3.8+)
- Avoid features added after Python 3.8 (or check version)

**Version Check Example**:
```python
import sys

if sys.version_info < (3, 8):
    raise RuntimeError("Python 3.8 or higher required")
```

---

## Code Style

### Formatter: Black

**Tool**: `black` (opinionated Python formatter)

**Configuration** (`pyproject.toml`):
```toml
[tool.black]
line-length = 100
target-version = ['py38', 'py39', 'py310', 'py311', 'py312']
skip-string-normalization = false
```

**Run Black**:
```bash
black .
```

**IDE Integration**: Configure VSCode/PyCharm to format on save

### Linter: Ruff

**Tool**: `ruff` (fast, modern linter)

**Configuration** (`pyproject.toml`):
```toml
[tool.ruff]
line-length = 100
target-version = "py38"

select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "UP",  # pyupgrade
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "SIM", # flake8-simplify
]

ignore = [
    "E501",  # line too long (handled by black)
]

[tool.ruff.isort]
known-first-party = ["mcp_skills_server"]
```

**Run Ruff**:
```bash
ruff check .
ruff check --fix .  # Auto-fix issues
```

---

## Naming Conventions

### Variables

**Style**: snake_case

**Examples**:
```python
# Good
user_name = "Maya"
is_active = True
skill_count = 3
oauth_client_id = "abc123"

# Bad
userName = "Maya"      # camelCase (use in Python)
UserName = "Maya"      # PascalCase (for classes only)
SKILL_COUNT = 3        # UPPER_CASE (for constants only)
```

### Functions and Methods

**Style**: snake_case, verb-first naming

**Examples**:
```python
# Good
def get_user_data(user_id: str) -> dict:
    """Retrieve user data by ID."""
    pass

def validate_email(email: str) -> bool:
    """Check if email is valid."""
    pass

def handle_skill_invocation(skill_name: str) -> str:
    """Process skill invocation request."""
    pass

# Bad
def getUserData(userId):  # camelCase
    pass

def data():  # Not descriptive, no verb
    pass

def x():  # Too short, unclear
    pass
```

**Boolean Functions**: Use `is_`, `has_`, `can_` prefixes

```python
def is_valid_token(token: str) -> bool:
    """Check if OAuth token is valid."""
    pass

def has_permission(user: str, resource: str) -> bool:
    """Check if user has permission."""
    pass

def can_invoke_skill(user: str, skill: str) -> bool:
    """Check if user can invoke skill."""
    pass
```

### Classes

**Style**: PascalCase

**Examples**:
```python
# Good
class ConfigManager:
    """Manages application configuration."""
    pass

class SkillDiscoveryEngine:
    """Discovers skills from filesystem."""
    pass

class OAuthValidator:
    """Validates OAuth tokens."""
    pass

# Bad
class configManager:  # camelCase
    pass

class skill_discovery:  # snake_case
    pass

class OAUTH_VALIDATOR:  # UPPER_CASE
    pass
```

### Constants

**Style**: UPPER_SNAKE_CASE

**Examples**:
```python
# Good
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30
OAUTH_PROVIDER_URL = "https://accounts.google.com"
LOG_FORMAT = "[%(asctime)s] [%(levelname)s] %(message)s"

# Bad
maxRetries = 3  # camelCase
max_retries = 3  # snake_case (use for variables)
```

### Files and Modules

**Style**: snake_case

**Examples**:
```
Good:
  config_manager.py
  skill_discovery.py
  oauth_validator.py
  utils/file_io.py
  utils/path_resolver.py

Bad:
  ConfigManager.py   # PascalCase
  skillDiscovery.py  # camelCase
  OAuth-Validator.py # hyphens
```

### Private Members

**Style**: Single leading underscore `_`

**Examples**:
```python
class ConfigManager:
    def __init__(self):
        self._config = {}  # Private attribute
        self.public_value = "visible"  # Public attribute

    def _load_config_file(self, path: str) -> dict:
        """Private method."""
        pass

    def get_config(self, key: str) -> any:
        """Public method."""
        return self._config.get(key)
```

**Note**: Double underscore `__` triggers name mangling (avoid unless needed)

---

## Type Hints

**Requirement**: Use type hints for all function signatures

**Examples**:
```python
from typing import List, Dict, Optional, Union

def discover_skills(skills_dir: str) -> List[dict]:
    """Discover skills from directory."""
    skills = []
    return skills

def get_skill(skill_name: str) -> Optional[dict]:
    """Get skill by name, or None if not found."""
    return registry.get(skill_name)

def validate_token(token: str, timeout: int = 30) -> bool:
    """Validate OAuth token."""
    return True

def process_request(
    method: str,
    params: Dict[str, any]
) -> Union[dict, None]:
    """Process MCP request."""
    pass
```

**Type Checking**: Use `mypy` to check types

```bash
mypy mcp_skills_server/
```

---

## Docstrings

**Style**: Google-style docstrings

**Format**:
```python
def function_name(param1: str, param2: int) -> bool:
    """Brief one-line summary.

    Optional longer description with more details.

    Args:
        param1: Description of param1
        param2: Description of param2

    Returns:
        Description of return value

    Raises:
        ValueError: If param1 is empty
        IOError: If file cannot be read
    """
    pass
```

**Examples**:

```python
def validate_skill_name(name: str) -> bool:
    """Validate skill name format.

    Args:
        name: Skill name to validate

    Returns:
        True if valid, False otherwise

    Examples:
        >>> validate_skill_name("init-ideas")
        True
        >>> validate_skill_name("init@ideas")
        False
    """
    return bool(re.match(r"^[a-zA-Z0-9-_]+$", name))


class SkillRegistry:
    """Registry for discovered skills.

    Maintains a mapping of skill names to skill metadata.
    Provides O(1) lookup by skill name.

    Attributes:
        _registry: Internal dictionary mapping skill names to metadata
    """

    def __init__(self):
        """Initialize empty registry."""
        self._registry: Dict[str, dict] = {}

    def register_skill(self, metadata: dict) -> None:
        """Register a skill in the registry.

        Args:
            metadata: Skill metadata dictionary with 'name' key

        Raises:
            ValueError: If skill name already registered
        """
        pass
```

---

## Code Organization

### Project Structure

```
mcp-skills-server/
├── mcp_skills_server/          # Main package
│   ├── __init__.py
│   ├── __main__.py             # Entry point for `python -m mcp_skills_server`
│   ├── cli.py                  # CLI argument parsing
│   ├── server.py               # Main server class
│   ├── config/
│   │   ├── __init__.py
│   │   └── manager.py          # ConfigManager class
│   ├── discovery/
│   │   ├── __init__.py
│   │   └── engine.py           # SkillDiscoveryEngine class
│   ├── registry/
│   │   ├── __init__.py
│   │   └── tool_registry.py    # ToolRegistry class
│   ├── mcp/
│   │   ├── __init__.py
│   │   └── protocol_handler.py # MCPProtocolHandler class
│   ├── oauth/
│   │   ├── __init__.py
│   │   └── validator.py        # OAuthValidator class
│   ├── invocation/
│   │   ├── __init__.py
│   │   └── handler.py          # SkillInvocationHandler class
│   └── utils/
│       ├── __init__.py
│       ├── file_io.py          # File I/O utilities
│       ├── logger.py           # Logging configuration
│       └── path_resolver.py    # Path resolution utilities
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── pyproject.toml              # Project metadata and config
├── README.md
└── LICENSE
```

### Module Organization

**Order Within a Module**:
1. Module docstring
2. Imports (standard library, third-party, local)
3. Constants
4. Classes
5. Functions
6. Main block (if executable)

**Example**:
```python
"""Module for skill discovery.

This module provides functionality to discover skills from
the filesystem by scanning for SKILL.md files.
"""

# Standard library imports
import os
import logging
from pathlib import Path
from typing import List, Dict

# Third-party imports
import yaml

# Local imports
from mcp_skills_server.utils.file_io import read_file
from mcp_skills_server.utils.logger import get_logger

# Constants
SKILL_FILE_NAME = "SKILL.md"
MAX_DEPTH = 10

# Logger
logger = get_logger(__name__)


# Classes
class SkillDiscoveryEngine:
    """Discovers skills from filesystem."""

    def __init__(self, skills_dir: str):
        """Initialize discovery engine."""
        self.skills_dir = Path(skills_dir)


# Functions
def parse_yaml_frontmatter(content: str) -> Dict[str, any]:
    """Parse YAML frontmatter from SKILL.md content."""
    pass


# Main block (if executable)
if __name__ == "__main__":
    engine = SkillDiscoveryEngine("./skills")
```

---

## Import Organization

**Order**:
1. Standard library imports
2. Third-party imports
3. Local application imports

**Grouping**: Separate groups with blank line

**Sorting**: Alphabetical within each group (handled by ruff/isort)

**Example**:
```python
# Standard library
import logging
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional

# Third-party
import requests
import yaml

# Local
from mcp_skills_server.config.manager import ConfigManager
from mcp_skills_server.utils.file_io import read_file
from mcp_skills_server.utils.logger import get_logger
```

**Avoid Star Imports**:
```python
# Bad
from mcp_skills_server.utils import *

# Good
from mcp_skills_server.utils.file_io import read_file, write_file
```

---

## Indentation and Formatting

**Indentation**: 4 spaces (Python standard)

**Line Length**: Max 100 characters (configured in Black)

**Blank Lines**:
- 2 blank lines between top-level classes/functions
- 1 blank line between methods in a class
- 1 blank line to separate logical sections

**Example**:
```python
class ConfigManager:
    """Manages configuration."""

    def __init__(self, config_file: Optional[str] = None):
        """Initialize config manager."""
        self._config = {}
        if config_file:
            self._load_config_file(config_file)

    def load_env_vars(self) -> None:
        """Load configuration from environment variables."""
        pass

    def get(self, key: str, default: any = None) -> any:
        """Get configuration value."""
        return self._config.get(key, default)


class SkillRegistry:
    """Registry for skills."""

    def __init__(self):
        """Initialize registry."""
        self._registry = {}
```

---

## Error Handling

### Use Exceptions

**Good**:
```python
def read_file(path: str) -> str:
    """Read file content."""
    if not Path(path).exists():
        raise FileNotFoundError(f"File not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        return f.read()


# Caller
try:
    content = read_file("skill.md")
except FileNotFoundError as e:
    logger.error(f"Failed to read file: {e}")
    # Handle error appropriately
```

**Bad**:
```python
def read_file(path: str) -> Optional[str]:
    """Read file content, or None if error."""
    try:
        with open(path, "r") as f:
            return f.read()
    except Exception:
        return None  # Silently ignores errors


# Caller doesn't know what went wrong
content = read_file("skill.md")
if content is None:
    # What happened? File doesn't exist? Permission denied? Encoding error?
    pass
```

### Specific Exceptions

**Good**:
```python
try:
    metadata = yaml.safe_load(frontmatter)
except yaml.YAMLError as e:
    raise ValueError(f"Invalid YAML frontmatter: {e}")
except Exception as e:
    raise RuntimeError(f"Unexpected error parsing YAML: {e}")
```

**Bad**:
```python
try:
    metadata = yaml.safe_load(frontmatter)
except Exception:
    pass  # Too broad, swallows all errors
```

### Don't Silently Ignore Errors

**Good**:
```python
try:
    response = requests.post(url, data=data, timeout=30)
    response.raise_for_status()
except requests.Timeout:
    logger.error("OAuth provider timeout")
    raise
except requests.RequestException as e:
    logger.error(f"OAuth provider error: {e}")
    raise
```

**Bad**:
```python
try:
    response = requests.post(url, data=data)
except:
    pass  # Silently ignore - NO!
```

---

## Best Practices

### Async Code (If Needed)

**Use async/await**: Prefer async/await over callbacks

```python
import asyncio

async def validate_token_async(token: str) -> bool:
    """Validate token asynchronously."""
    # Use aiohttp or httpx for async HTTP
    pass

async def main():
    result = await validate_token_async("token")
```

**Note**: MVP uses synchronous code (simpler). Async for v1.0+ if needed.

### Context Managers

**Use `with` for Resources**:
```python
# Good
with open(path, "r") as f:
    content = f.read()

# Bad
f = open(path, "r")
content = f.read()
f.close()  # Might not execute if exception
```

### List Comprehensions

**Use When Readable**:
```python
# Good
skill_names = [skill["name"] for skill in skills]
valid_skills = [s for s in skills if validate_skill_name(s["name"])]

# Bad (too complex)
result = [
    {
        "name": skill["name"],
        "path": Path(skill["folder"]) / "SKILL.md"
    }
    for folder in os.listdir(skills_dir)
    if Path(folder).is_dir()
    for skill in discover_in_folder(folder)
    if validate_skill(skill)
]

# Better (break into steps)
folders = [f for f in os.listdir(skills_dir) if Path(f).is_dir()]
skills = []
for folder in folders:
    discovered = discover_in_folder(folder)
    valid = [s for s in discovered if validate_skill(s)]
    skills.extend(valid)
```

### f-strings for Formatting

**Prefer f-strings**:
```python
# Good
logger.info(f"Found {len(skills)} skills in {elapsed}s")

# OK (for simple cases)
logger.info("Server ready")

# Bad (old style)
logger.info("Found %d skills in %.2fs" % (len(skills), elapsed))
logger.info("Found {} skills in {}s".format(len(skills), elapsed))
```

---

## Security Best Practices

### Never Log Secrets

```python
# Good
logger.debug(f"OAuth client ID: {client_id}")
logger.debug("OAuth client secret: ***masked***")

# Bad
logger.debug(f"OAuth client secret: {client_secret}")  # NEVER!
```

### Validate All Input

```python
def validate_skill_name(name: str) -> bool:
    """Validate skill name format."""
    if not name or len(name) > 100:
        return False
    return bool(re.match(r"^[a-zA-Z0-9-_]+$", name))


def invoke_skill(skill_name: str) -> str:
    """Invoke skill (with validation)."""
    if not validate_skill_name(skill_name):
        raise ValueError(f"Invalid skill name: {skill_name}")

    # Continue with invocation
```

### Use Parameterized Queries

**N/A for this project** (no SQL), but general principle:
```python
# Good (if we had SQL)
cursor.execute("SELECT * FROM skills WHERE name = ?", (skill_name,))

# Bad
cursor.execute(f"SELECT * FROM skills WHERE name = '{skill_name}'")
```

---

## Comments

### When to Comment

**Comment the WHY, not the WHAT**:
```python
# Good
# YAML safe_load prevents code execution in frontmatter
metadata = yaml.safe_load(frontmatter_content)

# Cache tokens for 5 minutes to reduce OAuth provider calls
token_cache[token_hash] = {"valid": True, "expires": time.time() + 300}

# Bad (obvious from code)
# Load YAML
metadata = yaml.safe_load(frontmatter_content)

# Set count to zero
count = 0
```

### Docstrings Over Comments

**Good**:
```python
def validate_token(token: str) -> bool:
    """Validate OAuth token with provider.

    Calls OAuth provider's introspection endpoint to verify
    the token is active and not expired.

    Args:
        token: OAuth access token

    Returns:
        True if valid, False otherwise
    """
    pass
```

**Bad**:
```python
# Validate OAuth token
def validate_token(token):
    pass
```

### TODO Comments

**Format**: `# TODO(author): Description`

```python
# TODO(maya): Add caching to reduce OAuth calls
def validate_token(token: str) -> bool:
    pass

# TODO: Implement file watching for hot reload (v1.0)
class SkillDiscoveryEngine:
    pass
```

---

## Version Control

### Commit Messages

**Format**: `<type>: <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring (no behavior change)
- `test`: Add or update tests
- `chore`: Maintenance (dependencies, build, etc.)

**Examples**:
```
feat: add skill discovery engine
fix: resolve OAuth token expiration bug
docs: update README with installation instructions
style: format code with black
refactor: extract path validation into utility
test: add unit tests for ConfigManager
chore: update dependencies to latest versions
```

**Body** (optional): More details if needed

```
feat: add caching for OAuth token validation

Implement in-memory cache for token validation results
with 5-minute TTL to reduce calls to OAuth provider.

Reduces average invocation time from 87ms to 30ms.
```

---

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows naming conventions
- [ ] Type hints on all function signatures
- [ ] Docstrings on all public functions/classes
- [ ] No secrets or credentials in code
- [ ] Error handling for expected failures
- [ ] Tests written and passing
- [ ] Black formatting applied
- [ ] Ruff linter passes
- [ ] Mypy type checking passes (if applicable)
- [ ] Comments explain WHY, not WHAT
- [ ] No TODO comments for critical functionality

---

Last updated: 2025-12-26
