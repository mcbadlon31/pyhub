# PyHub — Python Learning Hub for Computational Chemistry

An interactive, AI-powered Python learning application for quantum chemists,
computational chemists, theoretical chemists, and materials scientists.

## Quick Start

```bash
# Clone the repo
git clone <your-repo-url>
cd python-hub

# Open directly in any browser — no server needed
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

That's it. No npm, no build step, no dependencies to install.

## Structure

```
python-hub/
├── index.html              # App shell
├── css/                    # Styles
├── js/                     # App logic (ES6 modules)
│   ├── main.js             # Entry point
│   ├── state.js            # App state
│   ├── router.js           # Navigation
│   ├── data.js             # Curriculum index + schema validation
│   ├── progress.js         # localStorage progress (schema v2)
│   ├── ai.js               # Anthropic API + SSE streaming
│   ├── utils.js            # Shared utilities
│   └── render/             # UI rendering modules
├── data/                   # Curriculum content (one file per stage)
│   ├── python/             # 5 stages, 22 topics
│   ├── cs/                 # 2 stages, 15 topics
│   └── ml/                 # 6 stages, 35 topics
├── datasets/               # Canonical chemistry training datasets
│   └── reaction_benchmark.csv
├── CLAUDE.md               # Claude Code instructions (read before every session)
└── README.md               # This file
```

## Development with Claude Code

```bash
cd python-hub
claude
```

**Always start every Claude Code session with:**
> "Read CLAUDE.md first, then [your task]"

See CLAUDE.md for the full sprint roadmap, schema specification,
chemistry rules, and session log.

## Current Status

| Track     | Stages | Topics Complete | Status    |
|-----------|--------|-----------------|-----------|
| Python    | 5      | 1/22            | S1 next   |
| CS        | 2      | 0/15            | S4 next   |
| ML        | 6      | 0/35            | S5 next   |

**Next session:** Sprint S1 — complete `data/python/01-foundations.js`
(operators, strings, conditionals, loops). The `variables` topic is the
schema template.

## AI Explainer

Works automatically inside Claude.ai — no API key needed.
For standalone offline use: open the AI Explainer panel and paste
your Anthropic API key (stored only in your browser's localStorage).

## Tracks

- 🐍 **Python** — Foundations → Advanced, grounded in ORCA/Gaussian workflows
- 🧮 **CS Fundamentals** — Data structures and algorithms with molecular examples
- 🤖 **Machine Learning** — Classical ML → Deep Learning → Molecular ML (RDKit, GNNs) →
  Atomistic ML & Materials (ASE, pymatgen, MACE, universal potentials)
