# Features Documentation

This folder contains compressed product knowledge that AI agents load on-demand when working on specific features.

## Purpose

As the project grows, keeping all context in memory becomes inefficient. This folder allows AI to:
1. Load only relevant feature documentation when needed
2. Maintain consistency across implementations
3. Reference past decisions and patterns

## Structure

- **features-index.md** - Entry point listing all features (keep this small)
- **flows/** - Cross-feature flows (when behavior spans multiple features)
- **contracts/** - API contracts, database schemas, interfaces
- **impl/** - Implementation notes, pitfalls, code pointers
- **[feature-name].md** - Individual feature definitions (WHAT/WHY/SCOPE)

## When to Create Feature Docs

Feature documentation is created during Stage 9 (Sprint Development) as features are implemented.

---

**Status:** Empty (to be populated during development)  
**Last Updated:** 2025-12-30
