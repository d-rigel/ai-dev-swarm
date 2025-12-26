# VS Code Dev Container Setup Plan

## Overview

This document serves as both the **initial setup plan** and **final documentation** for VS Code Dev Container configuration. After execution, this file will be updated to reflect the actual configuration state.

**Current Status**: 📋 Setup Plan (Not Yet Executed)

---

## What is a Dev Container?

A Dev Container is a Docker container specifically configured for development. It provides:
- **Reproducible environment**: Same setup across all developers
- **Pre-configured tools**: All dependencies installed and ready
- **Isolation**: Doesn't affect host system
- **VS Code integration**: Seamless development experience

---

## Proposed Dev Container Configuration

### Container Specifications

**Base Image**: `python:3.10-slim` (official Python image)

**Why Python 3.10**:
- Middle ground for testing (supports 3.8-3.12)
- Good performance
- Modern features available
- Wide compatibility

**Installed Tools**:
- Python 3.10
- uv (package manager)
- git
- curl
- vim (for quick edits)
- All development dependencies (black, ruff, mypy, pytest)

**VS Code Extensions**:
- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Black Formatter (ms-python.black-formatter)
- Ruff (charliermarsh.ruff)
- autoDocstring (njpwerner.autodocstring)
- GitLens (eamodio.gitlens)
- Docker (ms-azuretools.vscode-docker)

---

## Dev Container Files

### File Structure
```
.devcontainer/
├── devcontainer.json   # VS Code Dev Container configuration
├── Dockerfile          # Container image definition
└── docker-compose.yml  # Multi-container setup (optional)
```

---

## File Contents

### 1. devcontainer.json

**Location**: `.devcontainer/devcontainer.json`

```json
{
  "name": "MCP Skills Server Dev",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".."
  },

  "features": {
    "ghcr.io/devcontainers/features/git:1": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },

  "customizations": {
    "vscode": {
      "settings": {
        "python.defaultInterpreterPath": "/usr/local/bin/python",
        "python.linting.enabled": true,
        "python.linting.pylintEnabled": false,
        "python.linting.ruffEnabled": true,
        "python.formatting.provider": "black",
        "python.formatting.blackPath": "/usr/local/bin/black",
        "python.testing.pytestEnabled": true,
        "python.testing.unittestEnabled": false,
        "python.analysis.typeCheckingMode": "basic",
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.organizeImports": "explicit"
        },
        "files.exclude": {
          "**/__pycache__": true,
          "**/.pytest_cache": true,
          "**/.mypy_cache": true,
          "**/.ruff_cache": true,
          "**/*.pyc": true
        }
      },
      "extensions": [
        "ms-python.python",
        "ms-python.vscode-pylance",
        "ms-python.black-formatter",
        "charliermarsh.ruff",
        "njpwerner.autodocstring",
        "eamodio.gitlens",
        "ms-azuretools.vscode-docker",
        "github.copilot"
      ]
    }
  },

  "forwardPorts": [],

  "postCreateCommand": "pip install -e '.[dev]' && echo 'Dev container ready!'",

  "remoteUser": "vscode",

  "mounts": [
    "source=${localEnv:HOME}/.gitconfig,target=/home/vscode/.gitconfig,type=bind,consistency=cached"
  ]
}
```

### 2. Dockerfile

**Location**: `.devcontainer/Dockerfile`

```dockerfile
# Use official Python 3.10 slim image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install uv (fast Python package manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:${PATH}"

# Create non-root user
RUN useradd -m -s /bin/bash vscode && \
    mkdir -p /workspace && \
    chown -R vscode:vscode /workspace

# Set working directory
WORKDIR /workspace

# Switch to non-root user
USER vscode

# Copy uv to vscode user path
ENV PATH="/home/vscode/.cargo/bin:${PATH}"

# Install uv for vscode user
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# The project will be mounted at /workspace
# Dependencies will be installed by postCreateCommand
```

### 3. docker-compose.yml (Optional)

**Location**: `.devcontainer/docker-compose.yml`

**Status**: Not needed for MVP (no database or external services yet)

**Future Use**: When we add PostgreSQL or other services:
```yaml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
    command: sleep infinity
    network_mode: service:db

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: mcp
      POSTGRES_PASSWORD: mcp_dev
      POSTGRES_DB: mcp_skills
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

---

## Setup Instructions

### Prerequisites

- Docker Desktop installed and running
- VS Code installed
- Dev Containers extension for VS Code installed

**Install Dev Containers Extension**:
```bash
code --install-extension ms-vscode-remote.remote-containers
```

### Step 1: Create .devcontainer Directory

```bash
mkdir -p .devcontainer
```

### Step 2: Create Dockerfile

```bash
cat > .devcontainer/Dockerfile << 'EOF'
[Dockerfile content from above]
EOF
```

### Step 3: Create devcontainer.json

```bash
cat > .devcontainer/devcontainer.json << 'EOF'
[devcontainer.json content from above]
EOF
```

### Step 4: Add Dev Container to .gitignore (if needed)

Dev container files SHOULD be committed to git (for team collaboration):
```bash
# Ensure .devcontainer/ is NOT in .gitignore
# (It should be committed)

# However, some temporary files should be ignored:
echo "**/.DS_Store" >> .gitignore
```

### Step 5: Build and Open Dev Container

**Option A: Using VS Code Command Palette**
1. Open VS Code
2. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Dev Containers: Reopen in Container"
4. Select and press Enter
5. Wait for container to build (first time takes ~2-5 minutes)

**Option B: Using CLI**
```bash
# Build container
docker build -f .devcontainer/Dockerfile -t mcp-skills-dev .

# Verify build succeeded
docker images | grep mcp-skills-dev
```

### Step 6: Verify Container Environment

Once inside the container, run verification commands:

```bash
# Check Python version
python --version  # Should be 3.10.x

# Check uv is installed
uv --version

# Check git is installed
git --version

# Check development tools are installed
black --version
ruff --version
mypy --version
pytest --version

# Check project dependencies are installed
pip list | grep -E "(mcp|pyyaml|requests|pytest)"
```

### Step 7: Test Development Workflow

Inside the dev container:

```bash
# Format code with black
black .

# Lint with ruff
ruff check .

# Type check with mypy (if code exists)
mypy mcp_skills_server/ || echo "No code yet"

# Run tests
pytest || echo "No tests yet"
```

---

## Container Configuration Details

### Port Forwarding

**Currently**: No ports forwarded (CLI tool, no HTTP server)

**Future**: If we add HTTP server (P2), forward port 8000:
```json
"forwardPorts": [8000]
```

### Volume Mounts

**Project Directory**:
- Host: `.` (project root)
- Container: `/workspace`
- Mode: cached (performance optimized)

**Git Config**:
- Mounts `~/.gitconfig` for git user settings
- Preserves commit author information

**Future Mounts** (as needed):
- SSH keys: `~/.ssh` → `/home/vscode/.ssh` (for git over SSH)
- AWS credentials: `~/.aws` → `/home/vscode/.aws` (for cloud deployment)

### Environment Variables

**Development Variables** (add to devcontainer.json if needed):
```json
"containerEnv": {
  "MCP_SKILLS_DIR": "/workspace/skills",
  "MCP_LOG_LEVEL": "DEBUG",
  "PYTHONPATH": "/workspace"
}
```

### Post-Create Commands

**Current**:
```bash
pip install -e '.[dev]'
```

**Explanation**:
- Installs project in editable mode (`-e`)
- Installs all development dependencies (`[dev]`)
- Runs automatically after container is created

**Future Commands** (as project grows):
```bash
pip install -e '.[dev]' && \
pre-commit install && \
pytest --collect-only
```

---

## VS Code Extensions Explained

**Python** (`ms-python.python`):
- Core Python support
- IntelliSense, debugging, testing

**Pylance** (`ms-python.vscode-pylance`):
- Fast type checking
- Auto-completion
- Import resolution

**Black Formatter** (`ms-python.black-formatter`):
- Auto-format on save
- Consistent code style

**Ruff** (`charliermarsh.ruff`):
- Fast linting
- Replaces multiple linters

**autoDocstring** (`njpwerner.autodocstring`):
- Generate docstring templates
- Google-style format

**GitLens** (`eamodio.gitlens`):
- Git blame annotations
- Commit history visualization

**Docker** (`ms-azuretools.vscode-docker`):
- Manage Docker containers
- View container logs

**GitHub Copilot** (`github.copilot`) (Optional):
- AI code suggestions
- Requires GitHub Copilot subscription

---

## Verification Checklist

After container setup, verify:

- [ ] Container builds without errors
- [ ] Python 3.10 is installed
- [ ] uv package manager is available
- [ ] git is configured with correct user
- [ ] All VS Code extensions are installed
- [ ] Black formatting works (format a .py file)
- [ ] Ruff linting shows issues (if any exist)
- [ ] pytest can discover tests (when tests exist)
- [ ] Terminal works inside container
- [ ] File changes sync between host and container
- [ ] Can commit and push to git from inside container

---

## Troubleshooting

**Issue**: Container fails to build
- **Solution**: Check Docker Desktop is running, verify Dockerfile syntax, check internet connection for downloads

**Issue**: Extensions not installing
- **Solution**: Rebuild container, manually install extensions, check VS Code version compatibility

**Issue**: Permission denied errors
- **Solution**: Verify `remoteUser: vscode` is set, check file ownership with `ls -la`

**Issue**: Slow file sync between host and container
- **Solution**: Using "cached" consistency mode should help, ensure Docker Desktop has enough resources

**Issue**: uv command not found
- **Solution**: Rebuild container, verify PATH includes uv location, try `source ~/.bashrc`

**Issue**: Git user not configured
- **Solution**: Mount .gitconfig, or manually configure inside container:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "you@example.com"
  ```

---

## Performance Optimization

**Docker Desktop Resources**:
- CPU: 4+ cores recommended
- Memory: 4GB+ recommended
- Disk: 20GB+ available

**VS Code Settings** (for better performance):
```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/*/**": true,
    "**/.venv/**": true,
    "**/__pycache__/**": true
  }
}
```

---

## Rebuilding Container

**When to Rebuild**:
- After changing Dockerfile
- After adding system dependencies
- After updating base image version
- When container feels "corrupted"

**How to Rebuild**:
1. `Cmd+Shift+P` → "Dev Containers: Rebuild Container"
2. Or: "Dev Containers: Rebuild Container Without Cache" (slower, cleaner)

**From CLI**:
```bash
docker build --no-cache -f .devcontainer/Dockerfile -t mcp-skills-dev .
```

---

## Alternative: Remote Development (Without Docker)

If Docker is not available, use VS Code Remote SSH:
1. Install Python 3.10 on remote machine
2. Install all tools (uv, git, etc.)
3. Connect via Remote-SSH extension

---

## Post-Execution Updates

*This section will be updated after execution to document actual container configuration, build times, issues encountered, and verification results.*

**Build Statistics**:
- TBD after first build

**Verification Results**:
- TBD after testing

**Deviations from Plan**:
- TBD after execution

**Known Issues/Limitations**:
- TBD after execution

**Performance Notes**:
- TBD after usage

---

## Resources

**Dev Containers Documentation**:
- Official Docs: https://code.visualstudio.com/docs/devcontainers/containers
- Dev Container Spec: https://containers.dev/
- Example Configurations: https://github.com/devcontainers/templates

**Python Dev Containers**:
- Python Template: https://github.com/devcontainers/templates/tree/main/src/python
- Features: https://github.com/devcontainers/features

**Docker Documentation**:
- Dockerfile Reference: https://docs.docker.com/engine/reference/builder/
- Best Practices: https://docs.docker.com/develop/dev-best-practices/

---

Last updated: 2025-12-26 (Setup Plan Created)
