# Testing Standards - MCP Skills Server

## Overview

This document defines testing requirements, frameworks, coverage standards, and test execution gates for the MCP Skills Server.

**Testing Philosophy**: Write tests that verify behavior, not implementation. Tests should be reliable, fast, and easy to understand.

---

## Testing Principles

### 1. Test Behavior, Not Implementation
- Test what the code does, not how it does it
- Tests should survive refactoring
- Avoid testing private methods directly

### 2. Keep Tests Simple and Readable
- One assertion per test (when possible)
- Clear test names that describe what is being tested
- Arrange-Act-Assert pattern

### 3. Tests Should Be Independent
- Each test can run in isolation
- No shared state between tests
- Order of execution doesn't matter

### 4. Fast Tests
- Unit tests should run in milliseconds
- Integration tests in seconds
- E2E tests in minutes (acceptable)

### 5. Write Tests Before or Alongside Code
- TDD (Test-Driven Development) encouraged
- At minimum, write tests before PR is merged
- No untested code in main branch

---

## Testing Pyramid

```
      /\
     /E2E\        <- Few (5-10 tests, 10%)
    /------\
   /Integration\  <- Some (20-30 tests, 30%)
  /------------\
 /  Unit Tests  \ <- Many (50-100 tests, 60%)
 ---------------
```

**Distribution**:
- **Unit Tests**: 60% - Test individual functions/classes
- **Integration Tests**: 30% - Test component interactions
- **E2E Tests**: 10% - Test complete workflows

**Rationale**: Unit tests are fast and catch most bugs. Integration tests verify components work together. E2E tests validate complete user flows.

---

## Test Coverage Requirements

### Minimum Coverage Targets

| Code Type | Coverage | Rationale |
|-----------|----------|-----------|
| **Overall** | 80% | Good balance of coverage and effort |
| **Critical Paths** | 100% | Authentication, skill invocation, OAuth |
| **Business Logic** | 90% | Core functionality must be well-tested |
| **Utilities** | 85% | Helper functions should be reliable |
| **UI/CLI** | 60% | Lower priority, harder to test |

### Critical Paths Requiring 100% Coverage

1. **OAuth Validation**:
   - Token validation logic
   - Expiration checking
   - Provider communication

2. **Skill Invocation**:
   - Skill lookup
   - File reading
   - Path resolution

3. **Skill Discovery**:
   - SKILL.md parsing
   - YAML frontmatter validation
   - Registry registration

4. **Input Validation**:
   - Skill name validation
   - Path validation
   - JSON-RPC validation

---

## Testing Framework

### Unit Testing: pytest

**Choice**: `pytest`

**Why pytest**:
- Industry standard for Python
- Simple syntax (plain assert statements)
- Powerful fixtures
- Excellent plugin ecosystem
- Clear test output

**Installation**:
```bash
uv pip install pytest pytest-cov pytest-mock
```

**Run Tests**:
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=mcp_skills_server --cov-report=html

# Run specific test file
pytest tests/unit/test_config.py

# Run tests matching pattern
pytest -k "test_oauth"

# Run with verbose output
pytest -v

# Run with debug output
pytest -s
```

---

## Unit Testing

### What to Test

**All Business Logic**:
- Configuration loading and validation
- Skill discovery and parsing
- OAuth token validation (mock provider)
- Skill invocation logic
- Path resolution and validation
- Registry operations

**File Structure**:
```
tests/unit/
├── test_config_manager.py
├── test_skill_discovery.py
├── test_tool_registry.py
├── test_oauth_validator.py
├── test_skill_invocation.py
├── test_path_resolver.py
├── test_file_io.py
└── test_validators.py
```

### Test Naming Convention

**Format**: `test_<function_name>_<scenario>`

**Examples**:
```python
def test_validate_skill_name_with_valid_name():
    """Test skill name validation with valid input."""
    assert validate_skill_name("init-ideas") is True


def test_validate_skill_name_with_special_characters():
    """Test skill name validation rejects special characters."""
    assert validate_skill_name("init@ideas") is False


def test_validate_skill_name_with_empty_string():
    """Test skill name validation rejects empty string."""
    assert validate_skill_name("") is False


def test_get_skill_returns_none_when_not_found():
    """Test registry returns None for unknown skill."""
    registry = ToolRegistry()
    assert registry.get_skill("unknown") is None
```

### Test Structure: Arrange-Act-Assert

**Pattern**:
```python
def test_function_name():
    """Test description."""
    # Arrange: Set up test data and dependencies
    skill_name = "init-ideas"
    registry = ToolRegistry()

    # Act: Execute the function under test
    result = registry.get_skill(skill_name)

    # Assert: Verify the result
    assert result is None  # or expected value
```

### Example Unit Tests

**Test Configuration Manager**:
```python
import pytest
from mcp_skills_server.config.manager import ConfigManager


def test_config_manager_loads_from_env_vars(monkeypatch):
    """Test config loads from environment variables."""
    # Arrange
    monkeypatch.setenv("MCP_OAUTH_CLIENT_ID", "test123")
    monkeypatch.setenv("MCP_SKILLS_DIR", "/path/to/skills")

    # Act
    config = ConfigManager()

    # Assert
    assert config.get("oauth_client_id") == "test123"
    assert config.get("skills_dir") == "/path/to/skills"


def test_config_manager_raises_error_when_required_missing():
    """Test config raises error when required value missing."""
    # Arrange
    config = ConfigManager()

    # Act & Assert
    with pytest.raises(ValueError, match="OAuth credentials not configured"):
        config.validate_required_fields()


def test_config_manager_masks_secrets_in_logs(caplog):
    """Test sensitive values are masked in logs."""
    # Arrange
    config = ConfigManager(oauth_client_secret="secret123")

    # Act
    config.log_config()

    # Assert
    assert "secret123" not in caplog.text
    assert "***masked***" in caplog.text
```

**Test OAuth Validator (with mocking)**:
```python
import pytest
from unittest.mock import Mock, patch
from mcp_skills_server.oauth.validator import OAuthValidator


def test_validate_token_success(requests_mock):
    """Test successful token validation."""
    # Arrange
    validator = OAuthValidator(provider_url="https://example.com")
    requests_mock.post(
        "https://example.com/tokeninfo",
        json={"active": True, "exp": 9999999999}
    )

    # Act
    result = validator.validate_token("valid_token")

    # Assert
    assert result is True


def test_validate_token_expired(requests_mock):
    """Test expired token is rejected."""
    # Arrange
    validator = OAuthValidator(provider_url="https://example.com")
    requests_mock.post(
        "https://example.com/tokeninfo",
        json={"active": False}
    )

    # Act
    result = validator.validate_token("expired_token")

    # Assert
    assert result is False


def test_validate_token_provider_timeout(requests_mock):
    """Test timeout when provider unreachable."""
    # Arrange
    validator = OAuthValidator(provider_url="https://example.com")
    requests_mock.post(
        "https://example.com/tokeninfo",
        exc=requests.exceptions.Timeout
    )

    # Act & Assert
    with pytest.raises(OAuthProviderError):
        validator.validate_token("token")
```

---

## Integration Testing

### What to Test

**Component Interactions**:
- Server startup sequence (all components initialize correctly)
- Skill discovery → Registry registration flow
- MCP request → OAuth validation → Skill invocation flow
- File I/O → Path resolution → Content processing
- Error propagation across components

**File Structure**:
```
tests/integration/
├── test_server_startup.py
├── test_skill_discovery_flow.py
├── test_skill_invocation_flow.py
├── test_oauth_integration.py
└── test_error_handling.py
```

### Example Integration Tests

**Test Server Startup**:
```python
import pytest
from mcp_skills_server.server import MCPSkillsServer


def test_server_startup_success(tmp_path):
    """Test server starts up successfully with valid config."""
    # Arrange
    skills_dir = tmp_path / "skills"
    skills_dir.mkdir()

    # Create a test skill
    skill_dir = skills_dir / "test-skill"
    skill_dir.mkdir()
    skill_file = skill_dir / "SKILL.md"
    skill_file.write_text("""---
name: "test-skill"
description: "Test skill"
---
# Test Skill
""")

    # Act
    server = MCPSkillsServer(
        skills_dir=str(skills_dir),
        oauth_client_id="test",
        oauth_client_secret="test"
    )
    server.start()

    # Assert
    assert server.is_ready
    assert len(server.registry.list_skills()) == 1

    # Cleanup
    server.stop()


def test_server_startup_fails_with_missing_skills_dir():
    """Test server fails to start with missing skills directory."""
    # Arrange & Act & Assert
    with pytest.raises(ValueError, match="Skills directory not found"):
        server = MCPSkillsServer(
            skills_dir="/nonexistent/path",
            oauth_client_id="test",
            oauth_client_secret="test"
        )
        server.start()
```

**Test Skill Invocation Flow**:
```python
def test_skill_invocation_end_to_end(tmp_path, requests_mock):
    """Test complete skill invocation flow."""
    # Arrange
    # Set up skills directory
    skills_dir = tmp_path / "skills"
    skills_dir.mkdir()
    skill_dir = skills_dir / "test-skill"
    skill_dir.mkdir()
    skill_file = skill_dir / "SKILL.md"
    skill_file.write_text("""---
name: "test-skill"
description: "Test skill"
---
# Test Skill
Instructions here.
""")

    # Mock OAuth provider
    requests_mock.post(
        "https://oauth-provider.com/tokeninfo",
        json={"active": True, "exp": 9999999999}
    )

    # Start server
    server = MCPSkillsServer(
        skills_dir=str(skills_dir),
        oauth_client_id="test",
        oauth_client_secret="test",
        oauth_provider_url="https://oauth-provider.com"
    )
    server.start()

    # Act
    result = server.invoke_skill(
        skill_name="test-skill",
        access_token="valid_token"
    )

    # Assert
    assert result is not None
    assert "Test Skill" in result
    assert "Instructions here" in result

    # Cleanup
    server.stop()
```

---

## End-to-End (E2E) Testing

### What to Test

**Critical User Flows** (from UX design):
1. Server startup
2. OAuth configuration
3. Skill invocation via MCP protocol (stdio)
4. Error handling and recovery
5. Skill hot reload (v1.0)

**E2E Test Approach**:
- Spawn actual server process
- Communicate via stdin/stdout (JSON-RPC)
- Verify complete workflows work

**File Structure**:
```
tests/e2e/
├── test_mcp_list_tools.py
├── test_mcp_call_tool.py
├── test_oauth_flow.py
└── test_error_scenarios.py
```

### Example E2E Tests

**Test MCP list_tools**:
```python
import subprocess
import json
import pytest


def test_list_tools_via_stdio(tmp_path):
    """Test list_tools request via stdio."""
    # Arrange
    skills_dir = tmp_path / "skills"
    skills_dir.mkdir()
    # Create test skill...

    # Start server process
    process = subprocess.Popen(
        [
            "mcp-skills-server",
            "--skills-dir", str(skills_dir),
            "--oauth-client-id", "test",
            "--oauth-client-secret", "test"
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Act: Send list_tools request
    request = {
        "jsonrpc": "2.0",
        "method": "list_tools",
        "id": 1
    }
    process.stdin.write(json.dumps(request) + "\n")
    process.stdin.flush()

    # Wait for response
    response_line = process.stdout.readline()
    response = json.loads(response_line)

    # Assert
    assert response["jsonrpc"] == "2.0"
    assert response["id"] == 1
    assert "result" in response
    assert "tools" in response["result"]
    assert len(response["result"]["tools"]) > 0

    # Cleanup
    process.terminate()
    process.wait()
```

**Note**: E2E tests are slower and more complex. Keep them focused on critical flows.

---

## Testing Utilities and Fixtures

### Shared Fixtures (conftest.py)

```python
# tests/conftest.py
import pytest
from pathlib import Path


@pytest.fixture
def temp_skills_dir(tmp_path):
    """Create temporary skills directory."""
    skills_dir = tmp_path / "skills"
    skills_dir.mkdir()
    return skills_dir


@pytest.fixture
def sample_skill(temp_skills_dir):
    """Create a sample skill for testing."""
    skill_dir = temp_skills_dir / "test-skill"
    skill_dir.mkdir()
    skill_file = skill_dir / "SKILL.md"
    skill_file.write_text("""---
name: "test-skill"
description: "Test skill for unit tests"
---
# Test Skill
Test instructions.
""")
    return skill_file


@pytest.fixture
def mock_oauth_validator(monkeypatch):
    """Mock OAuth validator for tests."""
    def mock_validate(token):
        return token == "valid_token"

    monkeypatch.setattr(
        "mcp_skills_server.oauth.validator.OAuthValidator.validate_token",
        mock_validate
    )
```

### Mocking Best Practices

**Mock External Dependencies**:
- OAuth provider HTTP calls
- Filesystem (when testing logic, not I/O)
- Time (for time-sensitive tests)

**Example**:
```python
from unittest.mock import Mock, patch


def test_with_mocked_oauth_provider(requests_mock):
    """Test with mocked HTTP requests."""
    requests_mock.post(
        "https://oauth-provider.com/tokeninfo",
        json={"active": True}
    )

    validator = OAuthValidator("https://oauth-provider.com")
    assert validator.validate_token("token") is True


def test_with_mocked_filesystem(monkeypatch):
    """Test with mocked file I/O."""
    def mock_read_file(path):
        return "mocked content"

    monkeypatch.setattr("builtins.open", mock_read_file)

    # Test code that reads files
```

---

## Test Execution

### Local Development

**Run Tests Before Committing**:
```bash
# Run all tests
pytest

# Run specific test category
pytest tests/unit/
pytest tests/integration/

# Run with coverage
pytest --cov=mcp_skills_server --cov-report=term-missing

# Run fast tests only (skip slow E2E)
pytest -m "not slow"
```

**Watch Mode** (run tests on file change):
```bash
pytest-watch
```

### CI/CD Pipeline

**Automated Testing on Every PR**:
1. Run linting (ruff)
2. Run type checking (mypy)
3. Run unit tests (pytest)
4. Run integration tests
5. Generate coverage report
6. Block merge if tests fail or coverage < 80%

**GitHub Actions Example**:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install uv
          uv pip install -e ".[dev]"

      - name: Run linting
        run: ruff check .

      - name: Run type checking
        run: mypy mcp_skills_server/

      - name: Run tests with coverage
        run: pytest --cov=mcp_skills_server --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Test Categories and Markers

**pytest markers** to categorize tests:

```python
# In tests/conftest.py or test files
import pytest

# Unit tests
@pytest.mark.unit
def test_unit_example():
    pass

# Integration tests
@pytest.mark.integration
def test_integration_example():
    pass

# Slow E2E tests
@pytest.mark.slow
def test_e2e_example():
    pass
```

**Run specific categories**:
```bash
# Run only unit tests
pytest -m unit

# Run all except slow tests
pytest -m "not slow"

# Run unit and integration, skip E2E
pytest -m "unit or integration"
```

**Configure in pyproject.toml**:
```toml
[tool.pytest.ini_options]
markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "slow: Slow E2E tests",
]
```

---

## Minimum Test Gates

### Before Merging to Main

- [ ] All tests pass (unit, integration, E2E)
- [ ] Code coverage >= 80% overall
- [ ] Critical paths have 100% coverage
- [ ] No failing tests in CI/CD pipeline
- [ ] Linting passes (ruff)
- [ ] Type checking passes (mypy)

### Before Deployment

- [ ] All tests pass in production-like environment
- [ ] Integration tests pass with real OAuth provider (staging)
- [ ] E2E tests pass on staging environment
- [ ] Performance tests meet targets (if applicable)
- [ ] Security tests pass (dependency scan, etc.)

---

## Performance Testing (Optional, P1)

### Load Testing

**Tool**: `locust` or `pytest-benchmark`

**What to Test**:
- Concurrent skill invocations
- Skill discovery time with many skills (100+)
- Memory usage under load

**Example**:
```python
def test_skill_invocation_performance(benchmark):
    """Benchmark skill invocation time."""
    server = setup_server()

    # Benchmark: should complete in <100ms
    result = benchmark(server.invoke_skill, "test-skill", "token")

    assert result is not None
```

---

## Test Commands

**Common Commands**:

```bash
# Run all tests
pytest

# Run tests with verbose output
pytest -v

# Run tests in parallel (faster)
pytest -n auto

# Run tests matching keyword
pytest -k "oauth"

# Run specific file
pytest tests/unit/test_config.py

# Run with coverage report
pytest --cov=mcp_skills_server --cov-report=html

# Open coverage report
open htmlcov/index.html

# Run tests and stop on first failure
pytest -x

# Run last failed tests
pytest --lf

# Run tests with debug output
pytest -s

# Run tests and show slowest tests
pytest --durations=10
```

---

## Testing Best Practices

### Write Tests That Catch Real Bugs

**Good**: Tests behavior that users depend on
```python
def test_skill_invocation_validates_token():
    """Test that invalid token is rejected."""
    with pytest.raises(Unauthorized):
        server.invoke_skill("skill", "invalid_token")
```

**Bad**: Tests implementation details
```python
def test_private_method_format():
    """Test private formatting method."""
    obj = SomeClass()
    result = obj._format_internal()  # Testing implementation, not behavior
```

### Keep Tests Maintainable

- **Don't duplicate production code in tests**
- **Use helper functions for common setups**
- **Keep assertions simple and clear**
- **One logical assertion per test** (when possible)

### Test Edge Cases

```python
def test_skill_name_validation_edge_cases():
    """Test skill name validation with edge cases."""
    # Empty string
    assert validate_skill_name("") is False

    # Max length
    assert validate_skill_name("a" * 100) is True

    # Over max length
    assert validate_skill_name("a" * 101) is False

    # Special characters
    assert validate_skill_name("skill@name") is False

    # Unicode
    assert validate_skill_name("skill-名前") is False
```

---

Last updated: 2025-12-26
