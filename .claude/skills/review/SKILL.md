---
name: review
description: Run all domain expert agents in parallel to review a completed data file
argument-hint: "<data-file-path>"
user-invocable: true
allowed-tools: Read, Bash, Glob, Grep, Agent
---

# Expert Review Pipeline

Run a multi-expert review on a completed data file before committing.

## Process

1. **Read the target file**: `$ARGUMENTS`
2. **Determine which experts to invoke** based on the file's track:

| Track | Experts to run |
|-------|---------------|
| Python (`data/python/`) | compchem-expert, cs-expert, pedagogy-expert |
| CS (`data/cs/`) | cs-expert, math-expert, pedagogy-expert |
| ML 1-4 (`data/ml/01-04`) | cs-expert, math-expert, compchem-expert, pedagogy-expert |
| ML 5 (`data/ml/05`) | compchem-expert, quantum-expert, cs-expert, pedagogy-expert |
| ML 6 (`data/ml/06`) | compchem-expert, quantum-expert, cs-expert, math-expert, pedagogy-expert |

3. **Launch all relevant experts in parallel** using the Agent tool. Each agent receives:
   - The file path to review
   - Instructions to read the file and follow their checklist
   - The agent definition from `.claude/agents/<name>.md`

4. **Collect results** from all experts

5. **Synthesize a final verdict**:
   - If ALL experts say APPROVED → **READY TO COMMIT**
   - If ANY expert says NEEDS REVISION → list all issues, grouped by severity (critical → low)
   - Provide a clear action list of what to fix

## How to invoke each expert

For each expert, spawn an Agent with this prompt pattern:

```
You are the [expert-name] reviewer. Read and follow the review checklist in .claude/agents/[expert-name].md

Review this data file: [file-path]

Read the file, then systematically check every item in your checklist. Report your findings in the specified output format.
```

## Final Output Format

```
# Expert Review: [filename]

## Expert Verdicts
| Expert | Verdict | Issues |
|--------|---------|--------|
| compchem | APPROVED/NEEDS REVISION | N or 0 |
| cs | APPROVED/NEEDS REVISION | N or 0 |
| ... | ... | ... |

## Issues (if any)
### Critical
- ...
### High
- ...
### Medium
- ...
### Low
- ...

## Final Verdict: APPROVED / NEEDS REVISION
## Action Items (if revision needed):
1. ...
```
