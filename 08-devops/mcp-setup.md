# MCP Tools Setup Plan

## Overview

This document serves as both the **initial setup plan** and **final documentation** for MCP (Model Context Protocol) tools configuration. After execution, this file will be updated to reflect the actual configuration state.

**Current Status**: 📋 Setup Plan (Not Yet Executed)

---

## What are MCP Tools?

MCP (Model Context Protocol) tools are integrations that allow AI agents (like Claude Code) to interact with external systems and data sources. These tools enable AI-assisted development by providing controlled access to:
- File systems
- GitHub repositories
- Web browsing
- Databases
- APIs
- And more

---

## Proposed MCP Tools Configuration

For the MCP Skills Server project, we'll configure the following MCP tools:

### 1. Filesystem Tool (Built-in)

**Purpose**: Allow AI agent to read/write files in the project directory

**Status**: ✅ Already available (Claude Code built-in)

**Configuration**: Not needed (automatically enabled)

**Capabilities**:
- Read files
- Write files
- Search files
- List directories

### 2. GitHub MCP Server

**Purpose**: Integrate with GitHub for repository management, PR creation, issue tracking

**Installation Method**: Via MCP server

**Why Needed**:
- Create and manage pull requests
- Search code across repositories
- Manage issues and projects
- Review code changes
- Access GitHub Actions status

**Installation Steps**:

```bash
# Install GitHub MCP server (if not already installed)
# This is typically configured in Claude Desktop settings
```

**Configuration** (in Claude Desktop config or MCP client):
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

**Required Permissions** (GitHub Personal Access Token):
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows
- `read:org` - Read org and team membership

**Setup GitHub Token**:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: "MCP GitHub Server"
4. Select scopes: `repo`, `workflow`, `read:org`
5. Generate token
6. Copy token and store securely

### 3. Brave Search MCP Server (Optional)

**Purpose**: Web search capabilities for research and documentation lookup

**Status**: Optional (useful for finding documentation, Stack Overflow answers)

**Installation**:
```bash
# Typically configured in MCP client settings
```

**Configuration**:
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

**Setup Brave API Key**:
1. Go to https://brave.com/search/api/
2. Sign up for API access
3. Get API key (free tier available)
4. Store securely

### 4. Memory MCP Server (Optional)

**Purpose**: Persistent memory for AI agent across sessions

**Status**: Optional (useful for maintaining context)

**Configuration**:
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

---

## MCP Configuration File Locations

**Claude Desktop (macOS)**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Claude Desktop (Windows)**:
```
%APPDATA%/Claude/claude_desktop_config.json
```

**Claude Desktop (Linux)**:
```
~/.config/Claude/claude_desktop_config.json
```

---

## Recommended MCP Tools for This Project

### Minimal Setup (MVP)
1. ✅ Filesystem (built-in) - For code editing
2. ✅ GitHub - For repository management

### Standard Setup (Recommended)
1. ✅ Filesystem (built-in)
2. ✅ GitHub - Repository management
3. ✅ Brave Search - Documentation lookup

### Advanced Setup (Optional)
1. ✅ Filesystem (built-in)
2. ✅ GitHub
3. ✅ Brave Search
4. ✅ Memory - Context persistence
5. ✅ PostgreSQL (if we add database later)

---

## Setup Instructions

### Step 1: Identify MCP Client

**Current Environment**: Claude Code (CLI)

Claude Code typically has built-in MCP tool support. We need to:
1. Verify which MCP tools are available
2. Configure additional tools if needed

### Step 2: Check Existing MCP Configuration

```bash
# Check if Claude Desktop config exists (if using Claude Desktop)
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json 2>/dev/null || echo "Not found"

# For Claude Code CLI, configuration may be different
# Check documentation: https://docs.anthropic.com/claude/docs/claude-code
```

### Step 3: Configure GitHub MCP Server

**Option A: Using Claude Desktop**

Edit config file:
```bash
# macOS
code ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Add GitHub MCP server configuration
```

**Option B: Environment Variables (for development)**

```bash
# Add to .env file
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here" >> .env

# Or export in shell
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"
```

### Step 4: Test MCP Tools

**Test Filesystem Access**:
```bash
# This should work automatically in Claude Code
# Try reading a file to verify
```

**Test GitHub Access**:
```bash
# If using Claude Code CLI with GitHub MCP tool
# Try listing repositories or creating an issue
```

### Step 5: Document Environment Variables

Create `.env.example` file:
```bash
cat > .env.example << 'EOF'
# GitHub MCP Server
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here

# Brave Search MCP Server (optional)
BRAVE_API_KEY=your_brave_api_key_here

# OAuth Configuration (for MCP Skills Server itself)
MCP_OAUTH_CLIENT_ID=your_oauth_client_id
MCP_OAUTH_CLIENT_SECRET=your_oauth_client_secret
MCP_SKILLS_DIR=./skills
MCP_LOG_LEVEL=INFO
EOF
```

Ensure `.env` is in `.gitignore`:
```bash
echo ".env" >> .gitignore
```

---

## Verification Steps

After setup, verify each MCP tool:

### Verify Filesystem Tool
- [ ] Can read files in project directory
- [ ] Can write files to project directory
- [ ] Can search files with patterns
- [ ] Can list directory contents

### Verify GitHub MCP Tool
- [ ] Can access repository information
- [ ] Can create/list issues
- [ ] Can create/list pull requests
- [ ] Can search code in repository
- [ ] Token has required permissions

### Verify Brave Search (if configured)
- [ ] Can perform web searches
- [ ] Results are relevant
- [ ] API key is valid

---

## Security Considerations

**Secrets Management**:
- ✅ Never commit `.env` file to git
- ✅ Use `.env.example` as template
- ✅ Store tokens in secure location (password manager)
- ✅ Rotate tokens periodically
- ✅ Use minimal required permissions

**Token Permissions**:
- GitHub: Only grant necessary scopes
- Brave: Use API key with rate limits
- Never share tokens in public channels

**Environment Variables**:
```bash
# Check .gitignore includes .env
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore

# Verify .env is not tracked
git status .env 2>&1 | grep -q "not found" && echo "✅ .env not tracked" || echo "⚠️  .env may be tracked!"
```

---

## Troubleshooting

**Issue**: MCP tool not found or not responding
- **Solution**: Check MCP server is running, verify configuration syntax, restart Claude Desktop

**Issue**: GitHub authentication failed
- **Solution**: Verify token is valid, check required scopes, regenerate token if expired

**Issue**: Rate limit exceeded
- **Solution**: Brave Search free tier has limits, upgrade plan or reduce usage

**Issue**: Permission denied errors
- **Solution**: Check token scopes include required permissions (repo, workflow, etc.)

---

## MCP Tools for Future Stages

As the project evolves, consider adding:

**Stage 9-10 (Development)**:
- ✅ PostgreSQL MCP Server (if we add database)
- ✅ Puppeteer/Playwright (for browser testing)
- ✅ Docker MCP Server (for container management)

**Stage 11 (Deployment)**:
- ✅ AWS/GCP/Azure MCP Servers (for cloud deployment)
- ✅ Kubernetes MCP Server (for orchestration)

---

## Post-Execution Updates

*This section will be updated after execution to document actual MCP tools configured, versions, issues encountered, and verification results.*

**Actual Configuration**:
- TBD after execution

**Verification Results**:
- TBD after testing

**Deviations from Plan**:
- TBD after execution

**Known Issues/Limitations**:
- TBD after execution

---

## Resources

**MCP Documentation**:
- Official MCP Docs: https://modelcontextprotocol.io/
- MCP Servers: https://github.com/modelcontextprotocol/servers
- Claude Code Docs: https://docs.anthropic.com/claude/docs/claude-code

**Available MCP Servers**:
- GitHub: `@modelcontextprotocol/server-github`
- Brave Search: `@modelcontextprotocol/server-brave-search`
- PostgreSQL: `@modelcontextprotocol/server-postgres`
- Puppeteer: `@modelcontextprotocol/server-puppeteer`
- Memory: `@modelcontextprotocol/server-memory`
- Filesystem: Built-in to Claude Code

---

Last updated: 2025-12-26 (Setup Plan Created)
