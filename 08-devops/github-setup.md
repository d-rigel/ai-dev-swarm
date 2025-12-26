# GitHub Repository Setup Plan

## Overview

This document serves as both the **initial setup plan** and **final documentation** for GitHub repository configuration. After execution, this file will be updated to reflect the actual configuration state.

**Current Status**: 📋 Setup Plan (Not Yet Executed)

---

## Repository Information

**Repository URL**: `git@github.com:X-School-Academy/ai-dev-swarm.git`
**Organization**: X-School-Academy
**Repository Name**: ai-dev-swarm
**Primary Branch**: main
**Development Branch**: mcp-skills (current)

---

## Proposed GitHub Configuration

### 1. Branch Protection Rules

**Protected Branches**: `main`

**Protection Settings**:
- ✅ Require pull request before merging
  - Required approvals: 1
  - Dismiss stale reviews when new commits are pushed
  - Require review from Code Owners: No (optional for team projects)
- ✅ Require status checks to pass before merging
  - Status checks: `test`, `lint`, `type-check` (from GitHub Actions)
  - Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ❌ Do not allow force pushes
- ❌ Do not allow deletions

**Why These Settings**:
- Ensures code review before merging to main
- Prevents accidental force pushes or deletions
- Guarantees CI/CD tests pass before merge
- Maintains clean git history

### 2. Pull Request Template

**Location**: `.github/PULL_REQUEST_TEMPLATE.md`

**Template Content**:
```markdown
## Description

Brief description of changes (2-3 sentences)

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update
- [ ] DevOps/Infrastructure change

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass locally

## Code Quality

- [ ] Code follows project coding standards
- [ ] Black formatting applied
- [ ] Ruff linting passes
- [ ] Type hints added (mypy passes)
- [ ] Documentation updated (if needed)

## Related Issues

Closes #issue_number (if applicable)

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### 3. Issue Templates

**Location**: `.github/ISSUE_TEMPLATE/`

**Templates to Create**:

#### Bug Report (`bug_report.md`)
```markdown
---
name: Bug Report
about: Report a bug or unexpected behavior
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- OS: [e.g., macOS 14.0, Ubuntu 22.04]
- Python Version: [e.g., 3.10.5]
- MCP Skills Server Version: [e.g., 0.1.0]

## Additional Context

Add any other context about the problem here.

## Logs/Error Messages

```
Paste relevant logs or error messages here
```
```

#### Feature Request (`feature_request.md`)
```markdown
---
name: Feature Request
about: Suggest a new feature or enhancement
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description

A clear and concise description of the feature you'd like.

## Use Case

Describe the problem this feature would solve or the use case it enables.

## Proposed Solution

Describe how you envision this feature working.

## Alternatives Considered

Describe any alternative solutions or features you've considered.

## Additional Context

Add any other context, mockups, or examples about the feature request here.
```

### 4. GitHub Actions Workflows

**Location**: `.github/workflows/`

#### Main CI/CD Workflow (`ci.yml`)

```yaml
name: CI/CD

on:
  push:
    branches: [ main, mcp-skills ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install ruff

      - name: Run ruff
        run: ruff check .

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install mypy
          pip install -e ".[dev]"

      - name: Run mypy
        run: mypy mcp_skills_server/ || true

  test:
    name: Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.8', '3.9', '3.10', '3.11', '3.12']

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[dev]"

      - name: Run tests with coverage
        run: |
          pytest --cov=mcp_skills_server --cov-report=xml --cov-report=term-missing

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        if: matrix.python-version == '3.10'
        with:
          file: ./coverage.xml
          fail_ci_if_error: false

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install pip-audit
          pip install -e ".[dev]"

      - name: Run pip-audit
        run: pip-audit || true
```

### 5. Repository Settings

**General Settings**:
- Description: "AI-powered development swarm with MCP Skills Server"
- Topics: `mcp`, `ai-agents`, `python`, `skills-server`, `development-tools`
- Features:
  - ✅ Issues enabled
  - ✅ Projects enabled (optional)
  - ❌ Wiki disabled (use docs/ instead)
  - ✅ Discussions disabled (use Issues)

**Merge Settings**:
- ✅ Allow squash merging (default)
- ❌ Allow merge commits (cleaner history with squash)
- ❌ Allow rebase merging

**Auto-delete head branches**: ✅ Enabled

---

## Setup Instructions

### Prerequisites

- GitHub CLI installed: `gh --version`
- Authenticated with GitHub: `gh auth status`
- Repository cloned locally

### Step 1: Create PR Template

```bash
# Create .github directory
mkdir -p .github

# Create PR template
cat > .github/PULL_REQUEST_TEMPLATE.md << 'EOF'
[Template content from above]
EOF
```

### Step 2: Create Issue Templates

```bash
# Create issue templates directory
mkdir -p .github/ISSUE_TEMPLATE

# Create bug report template
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
[Bug report content from above]
EOF

# Create feature request template
cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
[Feature request content from above]
EOF
```

### Step 3: Create GitHub Actions Workflow

```bash
# Create workflows directory
mkdir -p .github/workflows

# Create CI/CD workflow
cat > .github/workflows/ci.yml << 'EOF'
[Workflow content from above]
EOF
```

### Step 4: Configure Branch Protection

**Using GitHub CLI**:
```bash
# Note: Branch protection requires admin access
gh api repos/X-School-Academy/ai-dev-swarm/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=test \
  --field required_status_checks[contexts][]=lint \
  --field required_status_checks[contexts][]=type-check \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field required_pull_request_reviews[dismiss_stale_reviews]=true \
  --field enforce_admins=false \
  --field required_conversation_resolution=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

**Or configure manually via GitHub web interface**:
1. Go to repository Settings → Branches
2. Click "Add rule" for `main` branch
3. Configure protection settings as listed above
4. Click "Create" or "Save changes"

### Step 5: Update Repository Settings

**Using GitHub CLI**:
```bash
# Update repository description and topics
gh repo edit X-School-Academy/ai-dev-swarm \
  --description "AI-powered development swarm with MCP Skills Server" \
  --add-topic mcp \
  --add-topic ai-agents \
  --add-topic python \
  --add-topic skills-server \
  --add-topic development-tools
```

**Or configure manually via GitHub web interface**:
1. Go to repository Settings → General
2. Update description and topics
3. Configure merge settings
4. Enable "Automatically delete head branches"

### Step 6: Commit and Push Templates

```bash
# Stage all changes
git add .github/

# Commit
git commit -m "chore(github): add PR/issue templates and CI/CD workflow"

# Push to remote
git push origin mcp-skills
```

### Step 7: Verify Setup

- [ ] PR template appears when creating new PR
- [ ] Issue templates appear when creating new issue
- [ ] GitHub Actions workflow runs on push/PR
- [ ] Branch protection prevents direct push to main
- [ ] All CI/CD checks pass

---

## Verification Checklist

After execution, verify:

- [ ] `.github/PULL_REQUEST_TEMPLATE.md` exists and displays correctly
- [ ] `.github/ISSUE_TEMPLATE/bug_report.md` exists
- [ ] `.github/ISSUE_TEMPLATE/feature_request.md` exists
- [ ] `.github/workflows/ci.yml` exists and runs successfully
- [ ] Branch protection rules applied to `main` branch
- [ ] Repository description and topics updated
- [ ] Merge settings configured (squash only)
- [ ] Auto-delete head branches enabled
- [ ] Test PR created to verify templates and CI/CD

---

## Troubleshooting

**Issue**: GitHub CLI permission denied for branch protection
- **Solution**: Requires admin access. Configure manually via web interface or request admin permissions

**Issue**: GitHub Actions workflow not triggering
- **Solution**: Check workflow syntax with `gh workflow list`, ensure branch names match triggers

**Issue**: Status checks not appearing in branch protection
- **Solution**: Workflow must run at least once before status checks are available

---

## Post-Execution Updates

*This section will be updated after execution to document actual configuration, deviations from plan, and any issues encountered.*

---

Last updated: 2025-12-26 (Setup Plan Created)
