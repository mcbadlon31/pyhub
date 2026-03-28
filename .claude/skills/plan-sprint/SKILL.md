---
name: plan-sprint
description: Plan a sprint by analyzing the target data file, identifying missing topics, and outlining content
argument-hint: "<data-file-path>"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
---

# Plan Sprint

Analyze a data file and produce a structured sprint plan before writing content.

## Process

1. **Read the target file**: `$ARGUMENTS`
2. **Read CLAUDE.md** for schema, chemistry rules, and ID registry
3. **Identify track and stage** from the file header and stage wrapper
4. **List all topics** from the file header comment that are NOT yet in the topics array
5. **For each missing topic**, produce:

```
### Topic: [id] — [display name]
- **Chemistry context**: What compchem/materials workflow does this map to?
- **Code example focus**: What should the 15-35 line code block demonstrate?
- **Key concepts**: 3-5 core ideas the explanation must cover
- **Exercise ideas**:
  - MCQ: [question concept]
  - Fill: [blank concept]
  - Challenge: [real-world task description]
- **Dependencies**: Which earlier topics does this build on?
- **Expert concerns**: Which expert checklists have relevant items?
```

6. **Check cross-topic consistency**:
   - Are there energy values from earlier topics we should reuse? (e.g., H2O = -76.4026 Ha)
   - Are there recurring objects? (Molecule class in oop, ASE Atoms in ase-basics)
   - Does the topic ordering make pedagogical sense?

7. **Determine which experts will review** this file (per /review skill mapping)

8. **Output a sprint summary**:
```
## Sprint Plan: [stage-id]
- File: [path]
- Missing topics: N
- Estimated exercises: N (mcq) + N (fill) + N (challenge)
- Reviewers: [expert list]
- Dependencies on earlier stages: [list]
- Key recurring values/objects to reuse: [list]
```

## Do NOT write any content
This skill only PLANS. Use `/fill-data` to write the actual content.
