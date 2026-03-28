---
name: fix-issues
description: Systematically fix issues found during expert review
argument-hint: "<data-file-path>"
user-invocable: true
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

# Fix Review Issues

Systematically address issues found during `/review` on a data file.

## Process

1. **Read the review output** from the conversation (the expert verdicts and issue list)
2. **Read the target file**: `$ARGUMENTS`
3. **Categorize issues by type**:

| Type | How to Fix |
|------|-----------|
| Wrong numerical value | Look up correct value, update in code + exercises |
| Wrong ORCA format | Check ORCA manual/output examples, fix string |
| Code won't run | Trace the logic, fix Python errors |
| Missing span class | Add appropriate `<span class="X">` wrapper |
| Exercise answer wrong | Recalculate, fix answer index or solution code |
| Pedagogy issue | Rewrite explanation for clarity, adjust difficulty |
| Missing chemistry context | Replace generic example with compchem workflow |

4. **Fix each issue**, starting with critical severity
5. **After all fixes**, run schema validation:
   ```bash
   node -e "..." # inline validation
   node .claude/validate-ids.mjs  # cross-file ID check
   ```
6. **Report what was changed**:
   ```
   ## Fixes Applied
   1. [topic-id]: description of fix (was: X, now: Y)
   2. ...

   ## Remaining Issues (if any)
   - ...

   ## Re-review Recommended: YES/NO
   ```

## Rules
- Only modify the target file — never touch other data files
- Preserve all existing content that was NOT flagged as an issue
- If an issue is ambiguous, flag it for human review instead of guessing
- Run validation after EVERY fix, not just at the end
