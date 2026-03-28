---
name: commit-sprint
description: Validate and commit a completed data file sprint
argument-hint: "<data-file-path>"
user-invocable: true
allowed-tools: Bash, Read, Glob
---

# Commit Sprint

Validate a completed data file and create a git commit.

## Steps

1. **Run full schema validation** on `$ARGUMENTS` (all 8 fields, exercise minimums, ID uniqueness)
2. **Cross-check IDs** against all other data files to ensure no collisions
3. **Count code lines** in each topic's `code` field — verify within limits:
   - Python/CS: 15-35 lines
   - ML 1-4: 20-50 lines
   - ML 5-6: 25-60 lines
4. **If all checks pass**: stage the file and create a commit with message format:
   ```
   feat: complete {stage-id} sprint — add {topic-list} topics
   ```
5. **If checks fail**: report errors, do NOT commit

## Commit Message Convention

Follow the existing pattern from git log:
```
feat: complete {stage} sprint — add {topics} topics
```

Include a body summarizing what was added (topic count, exercise count, chemistry context highlights).
