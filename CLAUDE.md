# Python Learning Hub — CLAUDE.md
# ══════════════════════════════════════════════════════════════
# READ THIS FILE BEFORE EVERY SESSION
# ══════════════════════════════════════════════════════════════

## What This Project Is
An interactive, AI-powered Python learning application for scientists with formal
chemistry training: computational chemists, quantum chemists, theoretical chemists,
and materials scientists learning Python and ML for research.

ALL examples, exercises, code, and datasets use quantum chemistry, computational
chemistry, theoretical chemistry, and materials science context.
No generic examples. No iris dataset. No titanic dataset. No fruits in for loops.

## Tech Stack
- HTML5 + CSS Custom Properties + Vanilla JS with native ES6 modules (type="module")
- No build tools. No frameworks. No npm. Open index.html in any browser directly.
- AI: Anthropic Messages API, SSE streaming (claude-sonnet-4-20250514)
- Persistence: localStorage, SCHEMA_VERSION = 2 in js/progress.js
- Deploy: Netlify / GitHub Pages (static, zero config)

## Complete Data File Map
data/python/01-foundations.js    → variables, operators, strings, conditionals, loops
data/python/02-core.js           → functions, lists, tuples-sets, dicts, file-io, error-handling
data/python/03-intermediate.js   → comprehensions, oop, modules, args-kwargs,
                                    lambda-map-filter, decorators, generators
data/python/04-ecosystem.js      → stdlib-scipy, venv-pip-jupyter, numpy, pandas,
                                    matplotlib, cli-tools
data/python/05-advanced.js       → type-hints, async, testing, packaging, design-patterns
data/cs/01-data-structures.js    → arrays, linked-lists, stacks, queues, hash-tables,
                                    trees, graphs, heaps
data/cs/02-algorithms.js         → big-o, sorting, binary-search, recursion,
                                    dynamic-programming, graph-traversal, string-algorithms
data/ml/01-math-foundations.js   → lin-alg, stats-prob, calculus-gradients
data/ml/02-data-prep.js          → numpy-ml, pandas-ml, feature-scaling, encoding,
                                    train-test-split
data/ml/03-classical-ml.js       → linear-regression, logistic-regression, decision-trees,
                                    random-forests, svm, kmeans, model-evaluation
data/ml/04-deep-learning.js      → nn-basics, pytorch-tensors, nn-module, training-loop,
                                    cnns
data/ml/05-molecular-ml.js       → rdkit-basics, mol-representations, mol-gnns,
                                    mol-transformers, chem-ml-pipelines,
                                    save-deploy-models, uncertainty-qm
data/ml/06-atomistic-ml.js       → ase-basics, pymatgen, geometric-dl, equivariant-nn,
                                    train-mlips, universal-potentials, open-catalyst,
                                    active-learning

## Canonical Datasets (in datasets/ folder)
datasets/reaction_benchmark.csv         → 100 rows: catalyst, metal, ligand_type,
                                           delta_G_act_kcal, delta_G_rxn_kcal,
                                           temperature_K, solvent, yield_pct,
                                           converged, method
datasets/alanine_dipeptide_mlip.extxyz  → 500 DFT configs (to be generated in S8 sprint)
datasets/perovskite_slab.extxyz         → 200 BaTiO3 surface configs (to be generated in S8)

## Stage ID Format — STRICT
All stage IDs use prefixed kebab format: {track}-s{n}
  Python: py-s1  py-s2  py-s3  py-s4  py-s5
  CS:     cs-s1  cs-s2
  ML:     ml-s1  ml-s2  ml-s3  ml-s4  ml-s5  ml-s6

## Topic ID Format — STRICT
All topic IDs are globally unique kebab-case. No two topics across any file share an ID.
Current IDs in use (do not reuse):
  variables, operators, strings, conditionals, loops,
  functions, lists, tuples-sets, dictionaries, file-io, error-handling,
  comprehensions, oop, modules, args-kwargs, lambda-map-filter, decorators, generators,
  stdlib-scipy, venv-pip-jupyter, numpy, pandas, matplotlib, cli-tools,
  type-hints, async, testing, packaging, design-patterns,
  arrays, linked-lists, stacks, queues, hash-tables, trees, graphs, heaps,
  big-o, sorting, binary-search, recursion, dynamic-programming, graph-traversal, string-algorithms,
  lin-alg, stats-prob, calculus-gradients,
  numpy-ml, pandas-ml, feature-scaling, encoding, train-test-split,
  linear-regression, logistic-regression, decision-trees, random-forests, svm, kmeans, model-evaluation,
  nn-basics, pytorch-tensors, nn-module, training-loop, cnns,
  rdkit-basics, mol-representations, mol-gnns, mol-transformers, chem-ml-pipelines,
  save-deploy-models, uncertainty-qm,
  ase-basics, pymatgen, geometric-dl, equivariant-nn, train-mlips,
  universal-potentials, open-catalyst, active-learning

## Topic Schema — ALL 8 FIELDS REQUIRED (renderers depend on this exactly)
{
  id:          'unique-kebab-id',
  name:        'Display Name',
  desc:        'One-line summary shown in reference view',
  explanation: `<p>HTML...</p>`,   // 3-5 <p> elements. <strong> and <code> only.
  code:        `highlighted HTML`, // span classes: kw fn st nm cm num op bi
  cheatsheet:  [ { syn: '...', desc: '...' } ],  // 8-14 entries
  exercises: [
    { type: 'mcq',       q: '...', opts: ['A','B','C','D'], answer: 0, feedback: '...' },
    { type: 'fill',      q: '...', pre: 'code ___ here', answer: 'word', feedback: '...' },
    { type: 'challenge', q: '...', hint: '...', answer: '# solution code' }
  ],
  resources: [ { icon: '📘', title: '...', url: 'https://...', tag: '...', tagColor: 'blue' } ]
}

// Stage wrapper:
{ id: 'ml-s5', num: '05', title: 'Molecular ML', color: 'lime', meta: 'Stage 5',
  track: 'ml', topics: [...] }

## Code Line Limits
Python / CS topics:  15–35 lines
ML Stages 1–4:       20–50 lines
ML Stages 5–6:       25–60 lines

## Exercise Minimums
P1 topics: 1 mcq + 1 fill + 1 challenge
P2 topics: 1 mcq + 1 fill + 2 challenges

## Chemistry & Domain Rules — EVERY TOPIC
1. Variable names reflect chemistry: energy_hartree, spin_mult, delta_G_act, atoms, structure
2. Realistic numerical values: hartree, kcal/mol, eV, Å — never abstract 1/2/3
3. Challenge exercises use real compchem/materials workflows:
   - Python:   parse output files, write input files, plot spectra, automation tools
   - ML 1–4:  predict ΔG‡/yield/selectivity using reaction_benchmark.csv
   - ML 5:    RDKit fingerprints, QM9 GNN, ChemBERTa, scaffold split
   - ML 6:    ASE MD, pymatgen MP API, MACE training, universal potentials,
              adsorption screening, active learning loops
4. Canonical recurring objects:
   - Molecule class (introduced in 'oop' topic, referenced throughout Python track)
   - ASE Atoms object (introduced in 'ase-basics', used in ML Stage 6)
5. Use reaction_benchmark.csv for all ML 1–5 tabular examples

## Tool Versions for ML 5–6 Code Examples
rdkit >= 2023.09              from rdkit import Chem
torch_geometric >= 2.4.0      import torch_geometric
deepchem >= 2.7.0             import deepchem as dc
ase >= 3.23.0                 from ase import Atoms
pymatgen >= 2024.1.1          from pymatgen.core import Structure
mace-torch >= 0.3.0           from mace.calculators import MACECalculator, mace_mp
chgnet >= 0.3.0               from chgnet.model import CHGNet
fairchem-core >= 1.1.0        from fairchem.core import FAIRChemCalculator
nequip >= 0.6.0               from nequip.ase import NequIPCalculator
e3nn >= 0.5.0                 import e3nn
schnetpack >= 2.0.0           import schnetpack as spk
dscribe >= 2.1.0              from dscribe.descriptors import SOAP
phonopy >= 2.20.0             from phonopy import Phonopy

## Coding Rules (js/ files)
- ES6 modules everywhere: export/import, zero window.X = ...
- Pure rendering functions: data as args → return HTML strings, never read state directly
- Targeted DOM updates only: never innerHTML the entire sidebar on a state change
- HTML-escape all AI/user content via the esc() function in js/utils.js before innerHTML
- try/catch on every fetch() and localStorage call
- Naming: camelCase functions · UPPER_SNAKE constants · kebab-case files and IDs
- JSDoc comment on all functions over 10 lines

## Claude Code Session Rules
- ONE data file per prompt — always
- Reference schema AND chemistry requirement explicitly in every content prompt
- Run schema validation after every completed data file
- git commit before AND after every session
- Never modify css/ files during content/data sessions

## Schema Version
SCHEMA_VERSION = 2
Migration from v1: removes progress keys for deleted topics:
  nlp-basics, ml-pipelines, save-models, mlops

## Session Log
- [DATE]: Project initialized. Correct ES6 module structure in place. All 13 data
  stubs created. CLAUDE.md v2 installed. reaction_benchmark.csv populated.
  SCHEMA_VERSION=2 with v1→v2 migration in progress.js.
- NEXT: S1 sprint — complete data/python/01-foundations.js
  Seed topic 'variables' is already filled in as the schema template.
  Add: operators, strings, conditionals, loops.
  All challenges must use ORCA output parsing or molecular data context.
