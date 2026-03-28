---
name: validate
description: Run schema validation on one or all data files
argument-hint: "[data-file-path | all]"
user-invocable: true
allowed-tools: Bash, Glob, Read
---

# Schema Validation

Validate data files against the PyHub topic schema.

## If argument is a specific file path

Run validation on that single file:

```bash
node -e "
const fs = require('fs');
const window = {};
eval(fs.readFileSync('$ARGUMENTS', 'utf8'));
const varName = Object.keys(window).find(k => /^(PY|CS|ML)_S\d$/.test(k));
const stage = window[varName];
// ... validate all 8 fields, exercise minimums, cheatsheet counts, ID uniqueness
"
```

## If argument is "all" or empty

Find all `data/**/*.js` files and validate each one. Also check for **cross-file ID collisions**.

## Validation Checks

For each topic, verify:
1. All 8 required fields present: `id, name, desc, explanation, code, cheatsheet, exercises, resources`
2. Exercise minimums: at least 1 mcq + 1 fill + 1 challenge
3. Cheatsheet has 8-14 entries
4. ID is unique across ALL data files (not just the current one)
5. Stage wrapper has required fields: `id, num, title, color, meta, track, topics`

## Output Format

Print a summary table:
```
Stage   | Topics | Status
--------|--------|-------
py-s1   | 5      | valid
py-s2   | 6      | valid
py-s3   | 0      | stub
...
```

Then print total topic count and any errors found.
