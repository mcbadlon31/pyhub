---
name: fill-data
description: Fill a data file with complete topic content following the schema and chemistry rules
argument-hint: "<data-file-path>"
user-invocable: true
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

# Fill Data File

You are completing a data file for the PyHub learning application.

## Instructions

1. **Read the target file**: `$ARGUMENTS`
2. **Read CLAUDE.md** for the full schema, chemistry rules, and ID registry
3. **Read `data/python/01-foundations.js`** as the gold-standard template (the `variables` topic)
4. **Identify which topics** are listed in the file header but missing from the topics array
5. **Generate all missing topics** following these rules exactly:

## Rules (from CLAUDE.md — do NOT deviate)

### Schema — ALL 8 FIELDS REQUIRED
```
{ id, name, desc, explanation, code, cheatsheet, exercises, resources }
```

### Chemistry Context — EVERY TOPIC
- Variable names: `energy_hartree`, `spin_mult`, `delta_G_act`, `atoms`, `structure`
- Realistic values: hartree, kcal/mol, eV, angstrom — never abstract 1/2/3
- Challenge exercises: real compchem/materials workflows (ORCA parsing, input generation, PES scans)
- Use `reaction_benchmark.csv` for ML 1-5 tabular examples

### Code Line Limits
- Python / CS topics: 15-35 lines
- ML Stages 1-4: 20-50 lines
- ML Stages 5-6: 25-60 lines

### Code Highlighting Classes
```
kw = keyword (if, def, class, import, return, True, False, None, for, while, in, as, with, not, and, or, elif, else, try, except, raise, from)
fn = function name / call
st = string literal
nm = variable name
cm = comment
num = number literal
op = operator (+, -, *, /, **, ==, <, >, etc.)
bi = builtin type/exception name
```

### Exercise Minimums
- P1 topics (foundations, core): 1 mcq + 1 fill + 1 challenge
- P2 topics (intermediate+): 1 mcq + 1 fill + 2 challenges

### Cheatsheet
- 8-14 entries per topic
- Each entry: `{ syn: '...', desc: '...' }`

### Resources
- 3 resources per topic: official docs, tutorial, quick reference
- Format: `{ icon, title, url, tag, tagColor }`

## After Writing

Run schema validation:
```bash
node -e "const fs=require('fs'); const window={}; eval(fs.readFileSync('$ARGUMENTS','utf8')); ..."
```

Report: topic count, exercise counts, any validation errors.
