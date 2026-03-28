---
paths:
  - "data/**/*.js"
---

# Data File Rules

When editing any file under `data/`, these rules apply:

## ONE file per prompt
Never modify more than one data file in a single response.

## Schema compliance
Every topic object MUST have all 8 fields: id, name, desc, explanation, code, cheatsheet, exercises, resources. No exceptions.

## Chemistry context is non-negotiable
- Variable names: chemistry-relevant (energy_hartree, spin_mult, atoms, structure)
- Numerical values: realistic (hartree, kcal/mol, eV, angstrom)
- Challenge exercises: real compchem/materials workflows
- No generic examples (no fruits, no animals, no iris dataset)

## Code highlighting
The `code` field uses HTML spans with these classes: kw, fn, st, nm, cm, num, op, bi.
Every token must be wrapped in the appropriate span.

## After every edit
Run schema validation to confirm the file is well-formed.

## Never modify CSS
CSS files are off-limits during data/content sessions.
