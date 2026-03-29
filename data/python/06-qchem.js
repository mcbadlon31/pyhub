/**
 * data/python/06-qchem.js
 * Stage 06: Quantum Chemistry in Python
 * Topics: pyscf-basics, orca-io, xtb-screening, geom-analysis, scf-concepts
 *
 * Inspired by Crawford Group Programming Projects (C++ → Python adaptation),
 * compchem101 skill guide, and Liu Group simulation basics.
 * Code line limits: Python = 15–35 lines per topic.
 */

window.PY_S6 = {
  id: 'py-s6', num: '06', title: 'Quantum Chemistry in Python',
  color: 'teal', meta: 'Bonus Stage', track: 'python',
  topics: [

    // ════════════════════════════════════════════════════════
    //  PYSCF-BASICS
    // ════════════════════════════════════════════════════════
    {
      id:   'pyscf-basics',
      name: 'PySCF Basics',
      desc: 'Running Hartree-Fock and DFT calculations entirely in Python with PySCF',

      explanation: `
        <p><strong>PySCF</strong> (Python Simulations of Chemistry Framework) is
        a pure-Python quantum chemistry package. Unlike external codes that
        require input files and parsing, PySCF runs calculations directly from
        Python scripts — build a molecule, choose a method, and call
        <code>.kernel()</code> to get energies, orbitals, and properties.</p>

        <p>The workflow: create a <code>gto.Mole</code> object with geometry
        and basis set, then attach a method (<code>scf.RHF</code> for
        Hartree-Fock, <code>dft.RKS</code> for DFT). The <code>.kernel()</code>
        method runs the SCF procedure — the same iterative process that
        the Crawford Group C++ projects implement from scratch, but here
        wrapped in a high-level API.</p>

        <p>PySCF exposes every intermediate quantity: overlap matrix,
        Fock matrix, MO coefficients, density matrix, and integrals.
        This makes it ideal for <strong>method development</strong> — you
        can prototype new electronic structure methods in Python at 10×
        the speed of writing C++ or Fortran, then optimise later.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">pyscf</span> <span class="kw">import</span> <span class="nm">gto</span>, <span class="nm">scf</span>, <span class="nm">dft</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Build water molecule</span>
<span class="nm">mol</span> = <span class="nm">gto</span>.<span class="fn">Mole</span>()
<span class="nm">mol</span>.<span class="nm">atom</span> = <span class="st">'''
  O  0.000  0.000  0.117
  H  0.000  0.757 -0.469
  H  0.000 -0.757 -0.469
'''</span>
<span class="nm">mol</span>.<span class="nm">basis</span> = <span class="st">'cc-pvdz'</span>
<span class="nm">mol</span>.<span class="fn">build</span>()

<span class="cm"># Hartree-Fock calculation</span>
<span class="nm">mf</span> = <span class="nm">scf</span>.<span class="fn">RHF</span>(<span class="nm">mol</span>)
<span class="nm">e_hf</span> = <span class="nm">mf</span>.<span class="fn">kernel</span>()
<span class="fn">print</span>(<span class="st">f"HF energy: </span>{<span class="nm">e_hf</span><span class="st">:.8f} Ha"</span>)

<span class="cm"># DFT calculation (B3LYP)</span>
<span class="nm">mf_dft</span> = <span class="nm">dft</span>.<span class="fn">RKS</span>(<span class="nm">mol</span>)
<span class="nm">mf_dft</span>.<span class="nm">xc</span> = <span class="st">'b3lyp'</span>
<span class="nm">e_dft</span> = <span class="nm">mf_dft</span>.<span class="fn">kernel</span>()
<span class="fn">print</span>(<span class="st">f"B3LYP energy: </span>{<span class="nm">e_dft</span><span class="st">:.8f} Ha"</span>)

<span class="cm"># Access SCF internals</span>
<span class="nm">S</span> = <span class="nm">mf</span>.<span class="fn">get_ovlp</span>()      <span class="cm"># overlap matrix</span>
<span class="nm">F</span> = <span class="nm">mf</span>.<span class="fn">get_fock</span>()      <span class="cm"># Fock matrix</span>
<span class="nm">C</span> = <span class="nm">mf</span>.<span class="nm">mo_coeff</span>         <span class="cm"># MO coefficients</span>
<span class="nm">e_orb</span> = <span class="nm">mf</span>.<span class="nm">mo_energy</span>     <span class="cm"># orbital energies</span>
<span class="fn">print</span>(<span class="st">f"HOMO: </span>{<span class="nm">e_orb</span>[<span class="nm">mol</span>.<span class="fn">nelectron</span>() // <span class="num">2</span> - <span class="num">1</span>]<span class="st">:.4f} Ha"</span>)
<span class="fn">print</span>(<span class="st">f"LUMO: </span>{<span class="nm">e_orb</span>[<span class="nm">mol</span>.<span class="fn">nelectron</span>() // <span class="num">2</span>]<span class="st">:.4f} Ha"</span>)`,

      cheatsheet: [
        { syn: 'gto.Mole()', desc: 'Create molecular object — set .atom, .basis, then .build()' },
        { syn: 'mol.atom = "O 0 0 0; H 0 0.75 -0.47"', desc: 'Set geometry — XYZ format or Z-matrix' },
        { syn: 'mol.basis = "cc-pvdz"', desc: 'Set basis set — STO-3G, 6-31G*, cc-pVDZ, etc.' },
        { syn: 'scf.RHF(mol).kernel()', desc: 'Run restricted Hartree-Fock, return total energy (Ha)' },
        { syn: 'dft.RKS(mol)', desc: 'Kohn-Sham DFT — set .xc = "b3lyp" or "pbe"' },
        { syn: 'mf.mo_energy', desc: 'Orbital energies (Ha) — index 0 is lowest' },
        { syn: 'mf.mo_coeff', desc: 'MO coefficient matrix C — columns are MOs' },
        { syn: 'mf.get_ovlp()', desc: 'Overlap matrix S — same as Crawford Project #3 Step 1' },
        { syn: 'mf.get_fock()', desc: 'Fock matrix F — core + electron-electron repulsion' },
        { syn: 'mf.make_rdm1()', desc: 'One-particle density matrix in AO basis' },
        { syn: 'mol.nelectron()', desc: 'Total number of electrons in the system' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'In PySCF, what does mf.kernel() do for an RHF calculation?',
          opts: [
            'It reads an input file and parses the geometry',
            'It runs the iterative SCF procedure to self-consistency and returns the total energy',
            'It computes only the nuclear repulsion energy',
            'It generates a basis set from scratch'
          ],
          answer: 1,
          feedback: 'kernel() is the main driver: it builds the Fock matrix, diagonalises, constructs the density matrix, and iterates until energy and density converge — the same SCF loop taught in Crawford Project #3.'
        },
        {
          type: 'fill',
          q: 'Complete the code to run a B3LYP DFT calculation:',
          pre: 'mf = dft.RKS(mol)\nmf._____ = "b3lyp"\ne = mf.kernel()',
          answer: 'xc',
          feedback: 'The .xc attribute sets the exchange-correlation functional. Common choices: "b3lyp", "pbe", "pbe0", "wb97x-d".'
        },
        {
          type: 'challenge',
          q: 'Use PySCF to compute the HOMO-LUMO gap of methane (CH4) at the HF/cc-pVDZ level. Print the HOMO energy, LUMO energy, and gap in eV (1 Ha = 27.2114 eV).',
          hint: 'Build CH4 with tetrahedral geometry. HOMO index = n_electrons//2 - 1, LUMO = n_electrons//2.',
          answer: `from pyscf import gto, scf

mol = gto.Mole()
mol.atom = '''
  C  0.000  0.000  0.000
  H  0.629  0.629  0.629
  H -0.629 -0.629  0.629
  H -0.629  0.629 -0.629
  H  0.629 -0.629 -0.629
'''
mol.basis = 'cc-pvdz'
mol.build()
mf = scf.RHF(mol).run()
n_occ = mol.nelectron() // 2
homo = mf.mo_energy[n_occ - 1] * 27.2114
lumo = mf.mo_energy[n_occ] * 27.2114
print(f"HOMO: {homo:.2f} eV")
print(f"LUMO: {lumo:.2f} eV")
print(f"Gap:  {lumo - homo:.2f} eV")`
        }
      ],

      resources: [
        { icon: '📘', title: 'PySCF Documentation', url: 'https://pyscf.org/user.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'PySCF Quick Start', url: 'https://pyscf.org/quickstart.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '🔬', title: 'Crawford Group: HF-SCF Project', url: 'https://github.com/CrawfordGroup/ProgrammingProjects/tree/master/Project%2303', tag: 'project', tagColor: 'purple' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  ORCA-IO
    // ════════════════════════════════════════════════════════
    {
      id:   'orca-io',
      name: 'ORCA Input/Output',
      desc: 'Writing ORCA input files and parsing output for energies, frequencies, and molecular orbitals',

      explanation: `
        <p><strong>ORCA</strong> is one of the most popular quantum chemistry
        packages, freely available for academic use. Unlike PySCF which runs
        inside Python, ORCA is an external executable — you write an input file,
        run it from the command line, and parse the output. Python automates
        all three steps: generate inputs, launch jobs, extract results.</p>

        <p>An ORCA input file has a simple structure: a <code>!</code> line with
        keywords (method, basis set, job type), optional <code>%</code> blocks
        for detailed settings, and an <code>* xyz charge mult</code> block with
        Cartesian coordinates. Python's string formatting and f-strings make it
        easy to generate inputs for hundreds of molecules programmatically.</p>

        <p>Parsing output requires <strong>regex</strong> and string matching.
        Key quantities to extract: <code>FINAL SINGLE POINT ENERGY</code>,
        orbital energies from the <code>ORBITAL ENERGIES</code> block,
        vibrational frequencies, and Mulliken charges. The
        <code>cclib</code> library automates much of this parsing across
        multiple QC packages.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">subprocess</span>
<span class="kw">import</span> <span class="nm">re</span>
<span class="kw">from</span> <span class="nm">pathlib</span> <span class="kw">import</span> <span class="nm">Path</span>

<span class="cm"># Generate ORCA input file for geometry optimisation</span>
<span class="kw">def</span> <span class="fn">write_orca_input</span>(<span class="nm">xyz</span>, <span class="nm">charge</span>=<span class="num">0</span>, <span class="nm">mult</span>=<span class="num">1</span>, <span class="nm">method</span>=<span class="st">'B3LYP'</span>,
                      <span class="nm">basis</span>=<span class="st">'def2-SVP'</span>, <span class="nm">jobtype</span>=<span class="st">'Opt'</span>):
    <span class="kw">return</span> <span class="st">f"""! </span>{<span class="nm">method</span>}<span class="st"> </span>{<span class="nm">basis</span>}<span class="st"> </span>{<span class="nm">jobtype</span>}<span class="st">
%pal nprocs 4 end
* xyz </span>{<span class="nm">charge</span>}<span class="st"> </span>{<span class="nm">mult</span>}<span class="st">
</span>{<span class="nm">xyz</span>}<span class="st">
*"""</span>

<span class="nm">water_xyz</span> = <span class="st">"""O  0.000  0.000  0.117
H  0.000  0.757 -0.469
H  0.000 -0.757 -0.469"""</span>
<span class="nm">inp</span> = <span class="fn">write_orca_input</span>(<span class="nm">water_xyz</span>)
<span class="nm">Path</span>(<span class="st">'water.inp'</span>).<span class="fn">write_text</span>(<span class="nm">inp</span>)

<span class="cm"># Parse ORCA output for final energy</span>
<span class="kw">def</span> <span class="fn">parse_orca_energy</span>(<span class="nm">outfile</span>):
    <span class="nm">text</span> = <span class="nm">Path</span>(<span class="nm">outfile</span>).<span class="fn">read_text</span>()
    <span class="nm">match</span> = <span class="nm">re</span>.<span class="fn">findall</span>(<span class="st">r'FINAL SINGLE POINT ENERGY\s+([-\d.]+)'</span>, <span class="nm">text</span>)
    <span class="kw">return</span> <span class="fn">float</span>(<span class="nm">match</span>[-<span class="num">1</span>]) <span class="kw">if</span> <span class="nm">match</span> <span class="kw">else</span> <span class="kw">None</span>

<span class="cm"># Parse vibrational frequencies</span>
<span class="kw">def</span> <span class="fn">parse_frequencies</span>(<span class="nm">outfile</span>):
    <span class="nm">text</span> = <span class="nm">Path</span>(<span class="nm">outfile</span>).<span class="fn">read_text</span>()
    <span class="kw">return</span> [<span class="fn">float</span>(<span class="nm">x</span>) <span class="kw">for</span> <span class="nm">x</span> <span class="kw">in</span>
            <span class="nm">re</span>.<span class="fn">findall</span>(<span class="st">r'^\s+\d+:\s+([-\d.]+)'</span>, <span class="nm">text</span>, <span class="nm">re</span>.<span class="nm">MULTILINE</span>)]`,

      cheatsheet: [
        { syn: '! B3LYP def2-SVP Opt', desc: 'ORCA keyword line: method + basis + job type' },
        { syn: '! Freq', desc: 'Frequency calculation — add after Opt for IR spectra' },
        { syn: '* xyz 0 1\\ncoords\\n*', desc: 'Coordinate block: charge, multiplicity, XYZ' },
        { syn: '%pal nprocs 4 end', desc: 'Parallel execution with 4 cores' },
        { syn: '%maxcore 4000', desc: 'Memory per core in MB' },
        { syn: 'FINAL SINGLE POINT ENERGY', desc: 'Regex target for total energy in output' },
        { syn: 'cclib.io.ccread("output.out")', desc: 'Parse any QC output with cclib library' },
        { syn: 'subprocess.run(["orca", "input.inp"])', desc: 'Launch ORCA from Python' },
        { syn: 're.findall(pattern, text)', desc: 'Extract all matches of a regex pattern' },
        { syn: 'Path(file).read_text()', desc: 'Read entire file as string for parsing' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the advantage of generating ORCA input files with Python over writing them manually?',
          opts: [
            'Python calculations are more accurate than ORCA',
            'You can programmatically generate inputs for hundreds of molecules and automate the workflow',
            'ORCA cannot read manually written input files',
            'Python runs ORCA calculations faster'
          ],
          answer: 1,
          feedback: 'Python automation lets you screen hundreds of molecules: generate inputs with f-strings, launch ORCA via subprocess, and parse all outputs into a DataFrame — a workflow that would take days manually.'
        },
        {
          type: 'fill',
          q: 'Complete the regex to extract the final energy from ORCA output:',
          pre: 'import re\nmatch = re.findall(r"FINAL SINGLE POINT _____\\s+([-\\d.]+)", text)',
          answer: 'ENERGY',
          feedback: 'The ORCA output line reads "FINAL SINGLE POINT ENERGY" followed by the energy in hartree. The regex captures the numerical value.'
        },
        {
          type: 'challenge',
          q: 'Write a function that takes a list of (name, xyz_string) tuples and generates an ORCA input file for each at the B3LYP/def2-SVP level with Opt keyword. Save each as name.inp. Test with water and methane.',
          hint: 'Use a template string with f-string substitution. Path(f"{name}.inp").write_text(content).',
          answer: `from pathlib import Path

def batch_orca_inputs(molecules, method='B3LYP', basis='def2-SVP'):
    for name, xyz in molecules:
        inp = f"""! {method} {basis} Opt
%pal nprocs 4 end
* xyz 0 1
{xyz}
*"""
        Path(f"{name}.inp").write_text(inp)
        print(f"Wrote {name}.inp")

molecules = [
    ("water", "O 0 0 0.117\\nH 0 0.757 -0.469\\nH 0 -0.757 -0.469"),
    ("methane", "C 0 0 0\\nH 0.629 0.629 0.629\\nH -0.629 -0.629 0.629\\nH -0.629 0.629 -0.629\\nH 0.629 -0.629 -0.629"),
]
batch_orca_inputs(molecules)`
        }
      ],

      resources: [
        { icon: '📘', title: 'ORCA Input Library', url: 'https://www.orcasoftware.de/tutorials_orca/', tag: 'docs', tagColor: 'blue' },
        { icon: '🔬', title: 'Liu Group: Running ORCA', url: 'https://liu-group.github.io/simulation-basics/', tag: 'tutorial', tagColor: 'green' },
        { icon: '📄', title: 'cclib: QC Output Parsing', url: 'https://cclib.github.io/', tag: 'library', tagColor: 'orange' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  XTB-SCREENING
    // ════════════════════════════════════════════════════════
    {
      id:   'xtb-screening',
      name: 'xTB Screening',
      desc: 'Fast semi-empirical calculations with GFN2-xTB for geometry optimisation and conformer searches',

      explanation: `
        <p><strong>xTB</strong> (extended tight-binding) provides DFT-quality
        geometries and relative energies at a fraction of the cost — 100–1000×
        faster than B3LYP. <strong>GFN2-xTB</strong> covers the entire periodic
        table and handles molecules with 1,000+ atoms, making it ideal for
        <strong>pre-screening</strong> before expensive DFT calculations.</p>

        <p>The <code>xtb-python</code> interface and the <code>xtb</code>
        command-line tool integrate with ASE via
        <code>XTB(method="GFN2-xTB")</code> as a calculator. Use xTB to
        rapidly optimise geometries, generate conformer ensembles with
        <code>CREST</code>, and rank candidates before selecting the best
        for DFT refinement — a standard workflow in computational drug design
        and catalyst screening.</p>

        <p>xTB also provides analytical <strong>thermochemistry</strong>
        (free energies, entropies) and <strong>solvation</strong> via ALPB/GBSA
        implicit solvent models. For reaction screening, run xTB geometry
        optimisations on 1,000 candidates, then DFT single points on the
        top 50 — reducing compute cost by 20× while keeping the same
        accuracy for the final predictions.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">subprocess</span>
<span class="kw">from</span> <span class="nm">pathlib</span> <span class="kw">import</span> <span class="nm">Path</span>
<span class="kw">import</span> <span class="nm">re</span>
<span class="cm"># Write XYZ file for water</span>
<span class="nm">xyz</span> = <span class="st">"""3
water
O  0.000  0.000  0.117
H  0.000  0.757 -0.469
H  0.000 -0.757 -0.469
"""</span>
<span class="nm">Path</span>(<span class="st">'water.xyz'</span>).<span class="fn">write_text</span>(<span class="nm">xyz</span>)

<span class="cm"># Run GFN2-xTB geometry optimisation</span>
<span class="nm">result</span> = <span class="nm">subprocess</span>.<span class="fn">run</span>(
    [<span class="st">'xtb'</span>, <span class="st">'water.xyz'</span>, <span class="st">'--opt'</span>, <span class="st">'--gfn'</span>, <span class="st">'2'</span>],
    <span class="nm">capture_output</span>=<span class="kw">True</span>, <span class="nm">text</span>=<span class="kw">True</span>)

<span class="cm"># Parse xTB output for total energy</span>
<span class="nm">match</span> = <span class="nm">re</span>.<span class="fn">search</span>(<span class="st">r'TOTAL ENERGY\s+([-\d.]+)\s+Eh'</span>, <span class="nm">result</span>.<span class="nm">stdout</span>)
<span class="kw">if</span> <span class="nm">match</span>:
    <span class="fn">print</span>(<span class="st">f"xTB energy: </span>{<span class="fn">float</span>(<span class="nm">match</span>.<span class="fn">group</span>(<span class="num">1</span>))<span class="st">:.6f} Ha"</span>)

<span class="cm"># Optimise with implicit solvation</span>
<span class="nm">r_solv</span> = <span class="nm">subprocess</span>.<span class="fn">run</span>(
    [<span class="st">'xtb'</span>, <span class="st">'water.xyz'</span>, <span class="st">'--opt'</span>, <span class="st">'--gfn'</span>, <span class="st">'2'</span>, <span class="st">'--alpb'</span>, <span class="st">'water'</span>],
    <span class="nm">capture_output</span>=<span class="kw">True</span>, <span class="nm">text</span>=<span class="kw">True</span>)

<span class="cm"># xTB via ASE calculator interface</span>
<span class="kw">from</span> <span class="nm">ase.build</span> <span class="kw">import</span> <span class="fn">molecule</span>
<span class="kw">from</span> <span class="nm">ase.optimize</span> <span class="kw">import</span> <span class="fn">BFGS</span>
<span class="cm"># from xtb.ase.calculator import XTB</span>
<span class="cm"># atoms = molecule('H2O')</span>
<span class="cm"># atoms.calc = XTB(method="GFN2-xTB")</span>
<span class="cm"># opt = BFGS(atoms)</span>
<span class="cm"># opt.run(fmax=0.05)</span>`,

      cheatsheet: [
        { syn: 'xtb molecule.xyz --opt --gfn 2', desc: 'Geometry optimisation with GFN2-xTB' },
        { syn: 'xtb mol.xyz --opt --alpb water', desc: 'Optimise with ALPB implicit solvation' },
        { syn: 'xtb mol.xyz --hess', desc: 'Compute Hessian for vibrational frequencies' },
        { syn: 'xtb mol.xyz --ohess', desc: 'Optimise + frequencies in one step' },
        { syn: 'crest molecule.xyz --gfn2', desc: 'Conformer search with CREST + GFN2-xTB' },
        { syn: 'XTB(method="GFN2-xTB")', desc: 'ASE calculator interface for xTB' },
        { syn: '--chrg 1 --uhf 0', desc: 'Set charge and number of unpaired electrons' },
        { syn: 'TOTAL ENERGY ... Eh', desc: 'Regex target for xTB total energy in output' },
        { syn: '--iterations 500', desc: 'Increase max SCF iterations for difficult cases' },
        { syn: '--gbsa water', desc: 'GBSA solvation model (older, use ALPB for new work)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'When should you use xTB instead of DFT (B3LYP) for a screening study?',
          opts: [
            'When you need the highest possible accuracy',
            'When you have 100+ candidates and need fast geometry optimisations to narrow the list',
            'When studying excited states',
            'When the molecule has fewer than 5 atoms'
          ],
          answer: 1,
          feedback: 'xTB is 100–1000× faster than DFT with reasonable geometries and relative energies. Screen 1000 candidates with xTB, then refine the top 50 with DFT — standard practice in drug design and catalysis.'
        },
        {
          type: 'fill',
          q: 'Complete the xTB command to optimise a molecule with implicit water solvation:',
          pre: 'xtb molecule.xyz --opt --gfn 2 --_____ water',
          answer: 'alpb',
          feedback: '--alpb water applies the ALPB implicit solvation model for water. Other solvents: methanol, dmso, acetonitrile, etc.'
        },
        {
          type: 'challenge',
          q: 'Write a Python function that takes a list of XYZ file paths, runs xTB --opt --gfn 2 on each via subprocess, parses the total energy from stdout, and returns a sorted list of (filename, energy) tuples.',
          hint: 'Use subprocess.run with capture_output=True. Parse "TOTAL ENERGY" line with regex. Sort by energy.',
          answer: `import subprocess, re

def screen_with_xtb(xyz_files):
    results = []
    for path in xyz_files:
        r = subprocess.run(
            ['xtb', path, '--opt', '--gfn', '2'],
            capture_output=True, text=True)
        m = re.search(r'TOTAL ENERGY\\s+([-\\d.]+)\\s+Eh', r.stdout)
        if m:
            results.append((path, float(m.group(1))))
    results.sort(key=lambda x: x[1])
    for name, e in results:
        print(f"{name}: {e:.6f} Ha")
    return results`
        }
      ],

      resources: [
        { icon: '📘', title: 'xTB Documentation', url: 'https://xtb-docs.readthedocs.io/', tag: 'docs', tagColor: 'blue' },
        { icon: '🔬', title: 'CREST Conformer Search', url: 'https://crest-lab.github.io/crest-docs/', tag: 'docs', tagColor: 'blue' },
        { icon: '🔬', title: 'CompChem101: Semi-Empirical Methods', url: 'https://github.com/gomesgroup/compchem101', tag: 'guide', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  GEOM-ANALYSIS
    // ════════════════════════════════════════════════════════
    {
      id:   'geom-analysis',
      name: 'Geometry Analysis',
      desc: 'Computing bond lengths, angles, and dihedrals from atomic coordinates — Crawford Project #1 in Python',

      explanation: `
        <p><strong>Molecular geometry analysis</strong> is the foundation of
        computational chemistry — computing bond lengths, angles, and dihedral
        angles from Cartesian coordinates. This is Crawford Group Project #1,
        originally in C++, here adapted to Python. Every comp chemist needs
        these skills for validating optimised structures and building input
        files.</p>

        <p><strong>Bond lengths</strong> are Euclidean distances between atom
        pairs: <code>d = ‖r_i - r_j‖</code>. <strong>Bond angles</strong>
        use the dot product of unit vectors:
        <code>cos(θ) = e_ij · e_kj</code>. <strong>Dihedral angles</strong>
        require cross products of bond vectors to measure rotation around
        the central bond. NumPy vectorises all of these operations.</p>

        <p>Beyond individual measurements, compute the <strong>moment of
        inertia tensor</strong> to classify molecules as linear, symmetric top,
        or asymmetric top. The eigenvalues give principal moments I_A ≤ I_B ≤ I_C,
        and the <strong>rotational constants</strong> A = ħ²/(2I_A) determine
        the microwave spectrum. This connects geometry to spectroscopy.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">numpy.linalg</span> <span class="kw">import</span> <span class="fn">norm</span>, <span class="fn">eigh</span>

<span class="cm"># Water molecule coordinates (Å)</span>
<span class="nm">coords</span> = <span class="nm">np</span>.<span class="fn">array</span>([
    [<span class="num">0.000</span>, <span class="num">0.000</span>, <span class="num">0.117</span>],   <span class="cm"># O</span>
    [<span class="num">0.000</span>, <span class="num">0.757</span>, -<span class="num">0.469</span>],  <span class="cm"># H</span>
    [<span class="num">0.000</span>, -<span class="num">0.757</span>, -<span class="num">0.469</span>]])  <span class="cm"># H</span>
<span class="nm">masses</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">15.999</span>, <span class="num">1.008</span>, <span class="num">1.008</span>])

<span class="cm"># Bond length: O-H distance</span>
<span class="nm">d_OH</span> = <span class="fn">norm</span>(<span class="nm">coords</span>[<span class="num">1</span>] - <span class="nm">coords</span>[<span class="num">0</span>])
<span class="fn">print</span>(<span class="st">f"O-H bond: </span>{<span class="nm">d_OH</span><span class="st">:.4f} Å"</span>)

<span class="cm"># Bond angle: H-O-H</span>
<span class="nm">v1</span> = <span class="nm">coords</span>[<span class="num">1</span>] - <span class="nm">coords</span>[<span class="num">0</span>]  <span class="cm"># O→H1</span>
<span class="nm">v2</span> = <span class="nm">coords</span>[<span class="num">2</span>] - <span class="nm">coords</span>[<span class="num">0</span>]  <span class="cm"># O→H2</span>
<span class="nm">cos_angle</span> = <span class="nm">np</span>.<span class="fn">dot</span>(<span class="nm">v1</span>, <span class="nm">v2</span>) / (<span class="fn">norm</span>(<span class="nm">v1</span>) * <span class="fn">norm</span>(<span class="nm">v2</span>))
<span class="nm">angle_deg</span> = <span class="nm">np</span>.<span class="fn">degrees</span>(<span class="nm">np</span>.<span class="fn">arccos</span>(<span class="nm">cos_angle</span>))
<span class="fn">print</span>(<span class="st">f"H-O-H angle: </span>{<span class="nm">angle_deg</span><span class="st">:.2f}°"</span>)

<span class="cm"># Centre of mass</span>
<span class="nm">com</span> = <span class="nm">np</span>.<span class="fn">average</span>(<span class="nm">coords</span>, <span class="nm">axis</span>=<span class="num">0</span>, <span class="nm">weights</span>=<span class="nm">masses</span>)
<span class="nm">r</span> = <span class="nm">coords</span> - <span class="nm">com</span>

<span class="cm"># Moment of inertia tensor</span>
<span class="nm">I</span> = <span class="nm">np</span>.<span class="fn">zeros</span>((<span class="num">3</span>, <span class="num">3</span>))
<span class="kw">for</span> <span class="nm">m</span>, <span class="nm">ri</span> <span class="kw">in</span> <span class="fn">zip</span>(<span class="nm">masses</span>, <span class="nm">r</span>):
    <span class="nm">I</span> += <span class="nm">m</span> * (<span class="nm">np</span>.<span class="fn">dot</span>(<span class="nm">ri</span>, <span class="nm">ri</span>) * <span class="nm">np</span>.<span class="fn">eye</span>(<span class="num">3</span>) - <span class="nm">np</span>.<span class="fn">outer</span>(<span class="nm">ri</span>, <span class="nm">ri</span>))
<span class="nm">eigvals</span>, <span class="nm">_</span> = <span class="fn">eigh</span>(<span class="nm">I</span>)
<span class="fn">print</span>(<span class="st">f"Principal moments: </span>{<span class="nm">eigvals</span>}<span class="st"> amu·Å²"</span>)`,

      cheatsheet: [
        { syn: 'np.linalg.norm(r_i - r_j)', desc: 'Bond length — Euclidean distance between atoms' },
        { syn: 'np.dot(v1, v2) / (norm(v1) * norm(v2))', desc: 'Cosine of bond angle from unit vectors' },
        { syn: 'np.cross(v1, v2)', desc: 'Cross product — needed for dihedral and out-of-plane angles' },
        { syn: 'np.degrees(np.arccos(cos_val))', desc: 'Convert radians to degrees' },
        { syn: 'np.average(coords, axis=0, weights=masses)', desc: 'Centre of mass calculation' },
        { syn: 'np.outer(r, r)', desc: 'Outer product — builds inertia tensor components' },
        { syn: 'np.linalg.eigh(I)', desc: 'Diagonalise symmetric inertia tensor → principal moments' },
        { syn: 'np.arctan2(y, x)', desc: 'Four-quadrant arctangent — for dihedral angles' },
        { syn: 'amu_to_kg = 1.66054e-27', desc: 'Atomic mass unit conversion for rotational constants' },
        { syn: 'B = hbar**2 / (2 * I)', desc: 'Rotational constant from principal moment of inertia' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'To compute a dihedral angle (torsion) for atoms A-B-C-D, which mathematical operation is essential?',
          opts: [
            'Dot product only',
            'Cross product of vectors AB×BC and BC×CD, then arctan2',
            'Eigenvalue decomposition',
            'Matrix multiplication'
          ],
          answer: 1,
          feedback: 'The dihedral angle measures rotation around the B-C bond. The cross products give normal vectors to the A-B-C and B-C-D planes, and arctan2 gives the signed angle between them.'
        },
        {
          type: 'fill',
          q: 'Complete the code to compute the bond angle between three atoms:',
          pre: 'v1 = coords[1] - coords[0]\nv2 = coords[2] - coords[0]\ncos_a = np.dot(v1, v2) / (norm(v1) * _____(v2))',
          answer: 'norm',
          feedback: 'The cosine of the angle is the dot product of unit vectors: (v1·v2)/(|v1|·|v2|). norm() computes the Euclidean length.'
        },
        {
          type: 'challenge',
          q: 'Compute all unique bond lengths for ethanol (C2H5OH). Given coordinates, find all pairs of atoms within 1.7 Å (bonded), print each bond with its length, and classify the molecule as linear or non-linear using the moment of inertia.',
          hint: 'Loop over all i<j pairs, compute distance, filter by threshold. For linearity, check if smallest principal moment ≈ 0.',
          answer: `import numpy as np
from numpy.linalg import norm, eigh

# Ethanol (simplified geometry, Å)
symbols = ['C', 'C', 'O', 'H', 'H', 'H', 'H', 'H', 'H']
coords = np.array([
    [0.0, 0.0, 0.0], [1.52, 0.0, 0.0], [2.16, 1.26, 0.0],
    [-0.51, 0.94, 0.0], [-0.51, -0.47, 0.89], [-0.51, -0.47, -0.89],
    [1.88, -0.51, 0.89], [1.88, -0.51, -0.89], [3.12, 1.16, 0.0]])
masses = np.array([12, 12, 16, 1, 1, 1, 1, 1, 1], dtype=float)

print("Bonds (< 1.7 Å):")
for i in range(len(coords)):
    for j in range(i+1, len(coords)):
        d = norm(coords[i] - coords[j])
        if d < 1.7:
            print(f"  {symbols[i]}{i}-{symbols[j]}{j}: {d:.3f} Å")

com = np.average(coords, axis=0, weights=masses)
r = coords - com
I = np.zeros((3, 3))
for m, ri in zip(masses, r):
    I += m * (np.dot(ri, ri) * np.eye(3) - np.outer(ri, ri))
vals, _ = eigh(I)
print(f"Principal moments: {vals}")
print("Linear" if vals[0] < 0.01 else "Non-linear")`
        }
      ],

      resources: [
        { icon: '🔬', title: 'Crawford Project #1: Geometry Analysis', url: 'https://github.com/CrawfordGroup/ProgrammingProjects/tree/master/Project%2301', tag: 'project', tagColor: 'purple' },
        { icon: '📘', title: 'ASE Geometry Tools', url: 'https://wiki.fysik.dtu.dk/ase/ase/geometry.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📓', title: 'SciComp for Chemists', url: 'https://weisscharlesj.github.io/SciCompforChemists/notebooks/introduction/intro.html', tag: 'textbook', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  SCF-CONCEPTS
    // ════════════════════════════════════════════════════════
    {
      id:   'scf-concepts',
      name: 'SCF Concepts in Python',
      desc: 'Understanding the Hartree-Fock self-consistent field procedure through Python implementation',

      explanation: `
        <p>The <strong>self-consistent field (SCF)</strong> procedure is the
        workhorse of quantum chemistry. Understanding it — not just using it —
        is what separates a button-pusher from a computational chemist. Crawford
        Group Projects #3 and #8 implement SCF from scratch in C++; here we
        explore the same concepts using PySCF's exposed internals.</p>

        <p>The SCF loop: (1) build core Hamiltonian H = T + V, (2) diagonalise
        the overlap matrix S for orthogonalisation, (3) initial guess for density
        matrix D, (4) build Fock matrix F = H + J - K from D, (5) diagonalise
        F → new MO coefficients C, (6) build new D from C, (7) check
        convergence (ΔE and ΔD), (8) repeat from step 4. <strong>DIIS</strong>
        (Direct Inversion in the Iterative Subspace) accelerates convergence
        dramatically.</p>

        <p>PySCF lets you inspect every quantity: extract S, T, V, and
        two-electron integrals, build the Fock matrix manually, and compare
        your result to PySCF's converged answer. This hands-on approach builds
        deep understanding of what "DFT didn't converge" actually means and
        how to fix it.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">pyscf</span> <span class="kw">import</span> <span class="nm">gto</span>, <span class="nm">scf</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">numpy.linalg</span> <span class="kw">import</span> <span class="fn">eigh</span>
<span class="kw">from</span> <span class="nm">scipy.linalg</span> <span class="kw">import</span> <span class="fn">fractional_matrix_power</span>

<span class="cm"># Build H2 molecule — simplest SCF</span>
<span class="nm">mol</span> = <span class="nm">gto</span>.<span class="fn">M</span>(<span class="nm">atom</span>=<span class="st">'H 0 0 0; H 0 0 0.74'</span>, <span class="nm">basis</span>=<span class="st">'sto-3g'</span>)

<span class="cm"># Extract fundamental integrals</span>
<span class="nm">S</span> = <span class="nm">mol</span>.<span class="fn">intor</span>(<span class="st">'int1e_ovlp'</span>)  <span class="cm"># overlap</span>
<span class="nm">T</span> = <span class="nm">mol</span>.<span class="fn">intor</span>(<span class="st">'int1e_kin'</span>)   <span class="cm"># kinetic energy</span>
<span class="nm">V</span> = <span class="nm">mol</span>.<span class="fn">intor</span>(<span class="st">'int1e_nuc'</span>)   <span class="cm"># nuclear attraction</span>
<span class="nm">H_core</span> = <span class="nm">T</span> + <span class="nm">V</span>               <span class="cm"># core Hamiltonian</span>

<span class="cm"># Symmetric orthogonalisation: S^(-1/2)</span>
<span class="nm">X</span> = <span class="fn">fractional_matrix_power</span>(<span class="nm">S</span>, -<span class="num">0.5</span>)

<span class="cm"># Initial density guess from core Hamiltonian</span>
<span class="nm">F_prime</span> = <span class="nm">X</span>.<span class="nm">T</span> @ <span class="nm">H_core</span> @ <span class="nm">X</span>
<span class="nm">eps</span>, <span class="nm">C_prime</span> = <span class="fn">eigh</span>(<span class="nm">F_prime</span>)
<span class="nm">C</span> = <span class="nm">X</span> @ <span class="nm">C_prime</span>
<span class="nm">n_occ</span> = <span class="nm">mol</span>.<span class="fn">nelectron</span>() // <span class="num">2</span>
<span class="nm">D</span> = <span class="num">2</span> * <span class="nm">C</span>[:, :<span class="nm">n_occ</span>] @ <span class="nm">C</span>[:, :<span class="nm">n_occ</span>].<span class="nm">T</span>

<span class="cm"># Compare with PySCF's converged result</span>
<span class="nm">mf</span> = <span class="nm">scf</span>.<span class="fn">RHF</span>(<span class="nm">mol</span>).<span class="fn">run</span>(<span class="nm">verbose</span>=<span class="num">0</span>)
<span class="fn">print</span>(<span class="st">f"PySCF SCF energy: </span>{<span class="nm">mf</span>.<span class="nm">e_tot</span><span class="st">:.8f} Ha"</span>)
<span class="fn">print</span>(<span class="st">f"Converged in </span>{<span class="nm">mf</span>.<span class="nm">cycles</span>}<span class="st"> iterations"</span>)
<span class="fn">print</span>(<span class="st">f"Orbital energies: </span>{<span class="nm">mf</span>.<span class="nm">mo_energy</span>}<span class="st">"</span>)
<span class="fn">print</span>(<span class="st">f"Overlap S shape: </span>{<span class="nm">S</span>.<span class="nm">shape</span>}<span class="st">"</span>)
<span class="fn">print</span>(<span class="st">f"DIIS used: </span>{<span class="nm">mf</span>.<span class="nm">diis</span> <span class="kw">is not</span> <span class="kw">None</span>}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'mol.intor("int1e_ovlp")', desc: 'Overlap matrix S — basis function overlaps' },
        { syn: 'mol.intor("int1e_kin")', desc: 'Kinetic energy integrals T' },
        { syn: 'mol.intor("int1e_nuc")', desc: 'Nuclear attraction integrals V' },
        { syn: 'mol.intor("int2e")', desc: 'Two-electron integrals (ERI) — (ij|kl)' },
        { syn: 'H_core = T + V', desc: 'Core Hamiltonian — one-electron part of Fock matrix' },
        { syn: 'S^(-1/2)', desc: 'Symmetric orthogonalisation matrix for basis transformation' },
        { syn: 'F = H + J - K', desc: 'Fock matrix = core + Coulomb - exchange' },
        { syn: 'D = 2 * C_occ @ C_occ.T', desc: 'Density matrix from occupied MO coefficients' },
        { syn: 'DIIS', desc: 'Convergence accelerator — extrapolates from previous Fock matrices' },
        { syn: 'mf.cycles', desc: 'Number of SCF iterations to convergence' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why does the SCF procedure need to iterate rather than solving the Schrödinger equation in one step?',
          opts: [
            'Computers cannot solve eigenvalue problems directly',
            'The Fock matrix depends on the density matrix, which depends on the MOs, creating a circular dependency',
            'Basis sets are not orthogonal',
            'Nuclear positions change during the calculation'
          ],
          answer: 1,
          feedback: 'The electron-electron repulsion (J and K terms in the Fock matrix) depends on where the electrons are (the density matrix), but the density comes from the MOs which come from the Fock matrix. This chicken-and-egg problem requires iteration to self-consistency.'
        },
        {
          type: 'fill',
          q: 'Complete the code to extract the overlap matrix from a PySCF molecule:',
          pre: 'S = mol._____(\'int1e_ovlp\')',
          answer: 'intor',
          feedback: 'mol.intor() computes molecular integrals. "int1e_ovlp" is the one-electron overlap integral. Other keys: "int1e_kin" (kinetic), "int1e_nuc" (nuclear attraction), "int2e" (two-electron).'
        },
        {
          type: 'challenge',
          q: 'Using PySCF, extract the overlap matrix S and core Hamiltonian H=T+V for H2 (STO-3G). Compute S^(-1/2), diagonalise H in the orthogonal basis, and compare the lowest eigenvalue to PySCF\'s converged HF energy. Explain why they differ.',
          hint: 'Use fractional_matrix_power(S, -0.5) for S^(-1/2). The core Hamiltonian eigenvalue ignores electron-electron repulsion.',
          answer: `from pyscf import gto, scf
import numpy as np
from scipy.linalg import fractional_matrix_power
from numpy.linalg import eigh

mol = gto.M(atom='H 0 0 0; H 0 0 0.74', basis='sto-3g')
S = mol.intor('int1e_ovlp')
T = mol.intor('int1e_kin')
V = mol.intor('int1e_nuc')
H_core = T + V
X = fractional_matrix_power(S, -0.5)
eps, _ = eigh(X.T @ H_core @ X)
print(f"Core H eigenvalue: {eps[0]:.6f} Ha")
mf = scf.RHF(mol).run(verbose=0)
print(f"Converged HF:      {mf.e_tot:.6f} Ha")
print("Difference: core H ignores e-e repulsion (J-K terms)")`
        }
      ],

      resources: [
        { icon: '🔬', title: 'Crawford Project #3: HF-SCF', url: 'https://github.com/CrawfordGroup/ProgrammingProjects/tree/master/Project%2303', tag: 'project', tagColor: 'purple' },
        { icon: '🔬', title: 'Crawford Project #8: DIIS', url: 'https://github.com/CrawfordGroup/ProgrammingProjects/tree/master/Project%2308', tag: 'project', tagColor: 'purple' },
        { icon: '📘', title: 'PySCF SCF Module', url: 'https://pyscf.org/user/scf.html', tag: 'docs', tagColor: 'blue' },
      ]
    },

  ],
};
