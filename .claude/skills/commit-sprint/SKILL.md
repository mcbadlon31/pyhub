---
name: commit-sprint
description: Validate, run expert review, and commit a completed data file sprint
argument-hint: "<data-file-path>"
user-invocable: true
allowed-tools: Bash, Read, Glob, Grep, Agent
---

# Commit Sprint

Full validation pipeline + commit for a completed data file.

## Steps

### Phase 1: Schema Validation
1. **Run full schema validation** on `$ARGUMENTS` (all 8 fields, exercise minimums, cheatsheet count 8-14)
2. **Run global ID collision check**: `node .claude/validate-ids.mjs`
3. **Count code lines** in each topic's `code` field — verify within limits:
   - Python/CS: 15-35 lines
   - ML 1-4: 20-50 lines
   - ML 5-6: 25-60 lines

### Phase 2: Expert Review
4. **Run `/review $ARGUMENTS`** — launches domain expert agents in parallel
5. **Collect all expert verdicts**
6. If ANY expert says NEEDS REVISION → report issues, do NOT commit

### Phase 3: Commit (only if Phase 1 + 2 pass)
7. Stage the file: `git add $ARGUMENTS`
8. Create commit with message format:
   ```
   feat: complete {stage-id} sprint — add {topic-list} topics
   ```
9. Run `git status` to verify

## Commit Message Convention

Follow the existing pattern from git log:
```
feat: complete {stage} sprint — add {topics} topics
```

Include a body summarizing: topic count, exercise count, expert review status.

## If checks fail

Report ALL issues from both schema validation and expert review. Group by severity. Do NOT commit.
