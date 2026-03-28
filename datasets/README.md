# PyHub Canonical Datasets

These datasets are referenced throughout the curriculum.
They are synthetic but chemically realistic.

---

## reaction_benchmark.csv

**Used in:** file-io, pandas, matplotlib, linear-regression, logistic-regression,
decision-trees, random-forests, model-evaluation, chem-ml-pipelines, uncertainty-qm

**Description:** 100 transition-metal-catalyzed reactions with DFT-computed
activation and reaction free energies, experimental yields, and metadata.

**Columns:**

| Column             | Type    | Description                                      |
|--------------------|---------|--------------------------------------------------|
| reaction_id        | str     | Unique ID (rxn_001 … rxn_100)                   |
| catalyst           | str     | Catalyst name (FeCl3, MnSO4, etc.)              |
| metal              | str     | Metal center (Fe, Mn, Zn, Cu, Co, Ni, Ti, V)    |
| ligand_type        | str     | Ligand class (NHC, phosphine, amine, etc.)       |
| delta_G_act_kcal   | float   | Activation free energy (kcal/mol), range 5–45   |
| delta_G_rxn_kcal   | float   | Reaction free energy (kcal/mol), range −25 to 5 |
| temperature_K      | int     | Reaction temperature (K)                         |
| solvent            | str     | Solvent used                                     |
| yield_pct          | float   | Experimental yield (%)                           |
| converged          | bool    | Did the DFT geometry optimization converge?      |
| method             | str     | DFT method/basis (e.g. B3LYP-D3/def2-TZVP)     |

**Statistics (seed=42):**
- ΔG‡ range: 10.3 – 38.8 kcal/mol (mean 22.5)
- Yield range: 15 – 99% (mean 63.2%)
- Convergence rate: 88/100

---

## alanine_dipeptide_mlip.extxyz

**Used in:** ase-basics, train-mlips, equivariant-nn, active-learning

**Description:** 500 DFT configurations of alanine dipeptide (Ac-Ala-NHMe)
in vacuum, from an ab initio MD trajectory at B3LYP-D3/def2-TZVP level (ORCA).
Format: Extended XYZ with energy (hartree) in the comment line and forces
(hartree/bohr) as per-atom columns.

**Status:** To be generated in Sprint S8 using ORCA + ASE.
See Sprint S8 notes in CLAUDE.md.

---

## perovskite_slab.extxyz

**Used in:** pymatgen, train-mlips, universal-potentials, open-catalyst

**Description:** 200 DFT configurations of a BaTiO₃(001) surface slab,
covering surface relaxation and adsorption configurations.

**Status:** To be generated in Sprint S8.
