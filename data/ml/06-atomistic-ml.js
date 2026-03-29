/**
 * data/ml/06-atomistic-ml.js
 * Stage 06: Atomistic ML & Materials
 * Topics: ase-basics,pymatgen,geometric-dl,equivariant-nn,train-mlips,
 *         universal-potentials,open-catalyst,active-learning
 *
 * All examples use ASE, pymatgen, MACE, and atomistic simulation context.
 * Code line limits: ML 5-6 = 25–60 lines per topic.
 */

window.ML_S6 = {
  id: 'ml-s6', num: '06', title: 'Atomistic ML & Materials',
  color: 'cyan', meta: 'Stage 6', track: 'ml',
  topics: [

    // ════════════════════════════════════════════════════════
    //  ASE-BASICS
    // ════════════════════════════════════════════════════════
    {
      id:   'ase-basics',
      name: 'ASE Basics',
      desc: 'Building, manipulating, and simulating atomic structures with the Atomic Simulation Environment',

      explanation: `
        <p>The <strong>Atomic Simulation Environment (ASE)</strong> is Python's
        standard library for atomistic simulations. Its core object,
        <code>Atoms</code>, stores positions, atomic numbers, cell vectors, and
        periodic boundary conditions. You build structures atom-by-atom, from
        built-in databases, or by reading files (XYZ, VASP, CIF).</p>

        <p>ASE provides a <strong>calculator interface</strong> — attach any
        energy/force engine (DFT, force field, ML potential) to an Atoms object
        with <code>atoms.calc = calculator</code>, then call
        <code>atoms.get_potential_energy()</code> or
        <code>atoms.get_forces()</code>. This uniform API means you can swap
        VASP for MACE with a single line change.</p>

        <p>Built-in tools: <strong>geometry optimisation</strong> (BFGS, LBFGS),
        <strong>molecular dynamics</strong> (Verlet, Langevin, NPT),
        <strong>equation of state</strong> fitting, and <strong>NEB</strong>
        (nudged elastic band) for transition states. ASE also reads/writes
        trajectories and integrates with visualisation tools like
        <code>ase.visualize.view()</code>.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">ase</span> <span class="kw">import</span> <span class="fn">Atoms</span>
<span class="kw">from</span> <span class="nm">ase.build</span> <span class="kw">import</span> <span class="fn">molecule</span>, <span class="fn">bulk</span>, <span class="fn">surface</span>, <span class="fn">fcc111</span>
<span class="kw">from</span> <span class="nm">ase.io</span> <span class="kw">import</span> <span class="fn">read</span>, <span class="fn">write</span>
<span class="kw">from</span> <span class="nm">ase.calculators.emt</span> <span class="kw">import</span> <span class="fn">EMT</span>
<span class="kw">from</span> <span class="nm">ase.optimize</span> <span class="kw">import</span> <span class="fn">BFGS</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Build a water molecule manually</span>
<span class="nm">water</span> = <span class="fn">Atoms</span>(<span class="st">'OH2'</span>,
    <span class="nm">positions</span>=[(<span class="num">0.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>),
               (<span class="num">0.96</span>, <span class="num">0.0</span>, <span class="num">0.0</span>),
               (-<span class="num">0.24</span>, <span class="num">0.93</span>, <span class="num">0.0</span>)])
<span class="fn">print</span>(<span class="st">f"Water: </span>{<span class="fn">len</span>(<span class="nm">water</span>)}<span class="st"> atoms, symbols=</span>{<span class="nm">water</span>.<span class="fn">get_chemical_symbols</span>()}<span class="st">"</span>)

<span class="cm"># Built-in molecules and bulk structures</span>
<span class="nm">ch4</span> = <span class="fn">molecule</span>(<span class="st">'CH4'</span>)
<span class="nm">cu_bulk</span> = <span class="fn">bulk</span>(<span class="st">'Cu'</span>, <span class="st">'fcc'</span>, <span class="nm">a</span>=<span class="num">3.6</span>)
<span class="nm">cu_slab</span> = <span class="fn">fcc111</span>(<span class="st">'Cu'</span>, <span class="nm">size</span>=(<span class="num">2</span>, <span class="num">2</span>, <span class="num">3</span>), <span class="nm">vacuum</span>=<span class="num">10.0</span>)
<span class="fn">print</span>(<span class="st">f"Cu bulk: </span>{<span class="fn">len</span>(<span class="nm">cu_bulk</span>)}<span class="st"> atoms, cell=</span>{<span class="nm">cu_bulk</span>.<span class="nm">cell</span>.<span class="fn">lengths</span>()}<span class="st">"</span>)
<span class="fn">print</span>(<span class="st">f"Cu slab: </span>{<span class="fn">len</span>(<span class="nm">cu_slab</span>)}<span class="st"> atoms, PBC=</span>{<span class="nm">cu_slab</span>.<span class="nm">pbc</span>}<span class="st">"</span>)

<span class="cm"># Attach calculator and compute energy/forces</span>
<span class="nm">cu_bulk</span>.<span class="nm">calc</span> = <span class="fn">EMT</span>()
<span class="nm">energy</span> = <span class="nm">cu_bulk</span>.<span class="fn">get_potential_energy</span>()
<span class="nm">forces</span> = <span class="nm">cu_bulk</span>.<span class="fn">get_forces</span>()
<span class="fn">print</span>(<span class="st">f"Energy: </span>{<span class="nm">energy</span><span class="st">:.4f} eV, max force: </span>{<span class="nm">np</span>.<span class="fn">abs</span>(<span class="nm">forces</span>).<span class="fn">max</span>()<span class="st">:.4f} eV/Å"</span>)

<span class="cm"># Geometry optimisation</span>
<span class="nm">cu_slab</span>.<span class="nm">calc</span> = <span class="fn">EMT</span>()
<span class="nm">opt</span> = <span class="fn">BFGS</span>(<span class="nm">cu_slab</span>, <span class="nm">logfile</span>=<span class="st">'-'</span>)
<span class="nm">opt</span>.<span class="fn">run</span>(<span class="nm">fmax</span>=<span class="num">0.05</span>)
<span class="fn">print</span>(<span class="st">f"Relaxed energy: </span>{<span class="nm">cu_slab</span>.<span class="fn">get_potential_energy</span>()<span class="st">:.4f} eV"</span>)

<span class="cm"># Save structure</span>
<span class="fn">write</span>(<span class="st">'cu_slab_relaxed.xyz'</span>, <span class="nm">cu_slab</span>)`,

      cheatsheet: [
        { syn: 'Atoms("H2O", positions=[...])', desc: 'Create atomic structure from symbols + positions' },
        { syn: 'molecule("CH4")', desc: 'Built-in molecule from ASE database' },
        { syn: 'bulk("Cu", "fcc", a=3.6)', desc: 'Create bulk crystal with given lattice constant' },
        { syn: 'fcc111("Pt", size=(2,2,3), vacuum=10)', desc: 'FCC(111) surface slab with vacuum layer' },
        { syn: 'atoms.calc = EMT()', desc: 'Attach calculator — EMT is a fast toy potential for metals' },
        { syn: 'atoms.get_potential_energy()', desc: 'Compute total energy (eV) using attached calculator' },
        { syn: 'atoms.get_forces()', desc: 'Compute forces (eV/Å) on each atom — shape (N, 3)' },
        { syn: 'BFGS(atoms).run(fmax=0.05)', desc: 'Optimise geometry until max force < 0.05 eV/Å' },
        { syn: 'read("file.xyz") / write("file.xyz", atoms)', desc: 'Read/write structures in many formats' },
        { syn: 'atoms.get_positions()', desc: 'Atomic coordinates as (N, 3) NumPy array' },
        { syn: 'atoms.cell / atoms.pbc', desc: 'Unit cell vectors and periodic boundary conditions' },
        { syn: 'Trajectory("traj.traj", "w", atoms)', desc: 'Record optimisation/MD trajectory to file' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the key advantage of ASE\'s calculator interface for ML potential development?',
          opts: [
            'It automatically trains ML models',
            'It provides a uniform API — swap DFT for ML potential with one line change',
            'It only works with VASP',
            'It is faster than all other simulation tools'
          ],
          answer: 1,
          feedback: 'ASE\'s calculator interface means atoms.calc = DFTCalc() and atoms.calc = MLIPCalc() use the same get_energy/get_forces API. This makes benchmarking and integration seamless.'
        },
        {
          type: 'fill',
          q: 'Complete the code to run a geometry optimisation until forces converge:',
          pre: 'from ase.optimize import BFGS\nopt = BFGS(atoms)\nopt._____(fmax=0.05)',
          answer: 'run',
          feedback: 'opt.run(fmax=0.05) iterates BFGS steps until the maximum force on any atom is below 0.05 eV/Å.'
        },
        {
          type: 'challenge',
          q: 'Build a Cu FCC bulk structure (a=3.6 Å), attach the EMT calculator, compute the energy and forces. Then create a 2×2×1 supercell, displace one atom by 0.1 Å in x, and compare the energy before and after displacement.',
          hint: 'Use bulk("Cu","fcc",a=3.6), atoms.calc=EMT(), atoms.repeat((2,2,1)), atoms.positions[0,0]+=0.1.',
          answer: `from ase.build import bulk
from ase.calculators.emt import EMT

atoms = bulk('Cu', 'fcc', a=3.6)
atoms.calc = EMT()
e_prim = atoms.get_potential_energy()
print(f"Primitive: {e_prim:.4f} eV")

supercell = atoms.repeat((2, 2, 1))
supercell.calc = EMT()
e_before = supercell.get_potential_energy()
supercell.positions[0, 0] += 0.1
e_after = supercell.get_potential_energy()
print(f"Supercell before: {e_before:.4f} eV")
print(f"Supercell after:  {e_after:.4f} eV")
print(f"ΔE = {e_after - e_before:.4f} eV")`
        }
      ],

      resources: [
        { icon: '📘', title: 'ASE Documentation', url: 'https://wiki.fysik.dtu.dk/ase/', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'ASE Tutorial: Getting Started', url: 'https://wiki.fysik.dtu.dk/ase/tutorials/tutorials.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '📄', title: 'ASE Calculators', url: 'https://wiki.fysik.dtu.dk/ase/ase/calculators/calculators.html', tag: 'docs', tagColor: 'blue' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  PYMATGEN
    // ════════════════════════════════════════════════════════
    {
      id:   'pymatgen',
      name: 'Pymatgen',
      desc: 'Crystal structure analysis, Materials Project API, and materials informatics with pymatgen',

      explanation: `
        <p><strong>Pymatgen</strong> (Python Materials Genomics) is the core
        library for computational materials science. It handles crystal
        structures, symmetry analysis, phase diagrams, and interfaces with
        the <strong>Materials Project</strong> database — giving you access
        to computed properties of 150,000+ inorganic materials via API.</p>

        <p>The <code>Structure</code> object represents a periodic crystal with
        a lattice and atomic sites. Unlike ASE's Atoms (which is more molecular),
        pymatgen excels at crystallographic operations: space group detection,
        symmetry-equivalent sites, band structure analysis, and Pourbaix
        diagrams. Convert between ASE and pymatgen with
        <code>AseAtomsAdaptor</code>.</p>

        <p>The <strong>Materials Project API</strong> (via <code>MPRester</code>)
        lets you query computed band gaps, formation energies, elastic constants,
        and more. This is how you build training datasets for materials ML
        without running your own DFT calculations — download 10,000 perovskite
        energies in seconds, featurise them, and train a property predictor.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">pymatgen.core</span> <span class="kw">import</span> <span class="fn">Structure</span>, <span class="fn">Lattice</span>
<span class="kw">from</span> <span class="nm">pymatgen.symmetry.analyzer</span> <span class="kw">import</span> <span class="fn">SpacegroupAnalyzer</span>
<span class="kw">from</span> <span class="nm">pymatgen.ext.matproj</span> <span class="kw">import</span> <span class="fn">MPRester</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Build BaTiO3 perovskite structure</span>
<span class="nm">lattice</span> = <span class="fn">Lattice</span>.<span class="fn">cubic</span>(<span class="num">4.01</span>)  <span class="cm"># Å</span>
<span class="nm">bto</span> = <span class="fn">Structure</span>(
    <span class="nm">lattice</span>,
    [<span class="st">'Ba'</span>, <span class="st">'Ti'</span>, <span class="st">'O'</span>, <span class="st">'O'</span>, <span class="st">'O'</span>],
    [[<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>], [<span class="num">0.5</span>, <span class="num">0.5</span>, <span class="num">0.5</span>],
     [<span class="num">0.5</span>, <span class="num">0.5</span>, <span class="num">0</span>], [<span class="num">0.5</span>, <span class="num">0</span>, <span class="num">0.5</span>], [<span class="num">0</span>, <span class="num">0.5</span>, <span class="num">0.5</span>]])
<span class="fn">print</span>(<span class="st">f"BaTiO3: </span>{<span class="nm">bto</span>.<span class="nm">formula</span>}<span class="st">, Volume=</span>{<span class="nm">bto</span>.<span class="nm">volume</span><span class="st">:.2f} ų"</span>)

<span class="cm"># Symmetry analysis</span>
<span class="nm">sga</span> = <span class="fn">SpacegroupAnalyzer</span>(<span class="nm">bto</span>)
<span class="fn">print</span>(<span class="st">f"Space group: </span>{<span class="nm">sga</span>.<span class="fn">get_space_group_symbol</span>()}<span class="st"> (</span>{<span class="nm">sga</span>.<span class="fn">get_space_group_number</span>()}<span class="st">)"</span>)
<span class="fn">print</span>(<span class="st">f"Crystal system: </span>{<span class="nm">sga</span>.<span class="fn">get_crystal_system</span>()}<span class="st">"</span>)

<span class="cm"># Supercell and site manipulation</span>
<span class="nm">supercell</span> = <span class="nm">bto</span> * (<span class="num">2</span>, <span class="num">2</span>, <span class="num">2</span>)
<span class="fn">print</span>(<span class="st">f"Supercell: </span>{<span class="fn">len</span>(<span class="nm">supercell</span>)}<span class="st"> atoms"</span>)

<span class="cm"># Query Materials Project (requires API key)</span>
<span class="cm"># with MPRester("YOUR_API_KEY") as mpr:</span>
<span class="cm">#     results = mpr.summary.search(</span>
<span class="cm">#         formula="BaTiO3",</span>
<span class="cm">#         fields=["material_id", "formation_energy_per_atom",</span>
<span class="cm">#                 "band_gap", "symmetry"])</span>
<span class="cm">#     for r in results:</span>
<span class="cm">#         print(f"  {r.material_id}: Ef={r.formation_energy_per_atom:.3f} eV")</span>

<span class="cm"># Convert between pymatgen ↔ ASE</span>
<span class="kw">from</span> <span class="nm">pymatgen.io.ase</span> <span class="kw">import</span> <span class="fn">AseAtomsAdaptor</span>
<span class="nm">ase_atoms</span> = <span class="fn">AseAtomsAdaptor</span>.<span class="fn">get_atoms</span>(<span class="nm">bto</span>)
<span class="fn">print</span>(<span class="st">f"ASE Atoms: </span>{<span class="nm">ase_atoms</span>.<span class="fn">get_chemical_formula</span>()}<span class="st">"</span>)
<span class="nm">back_to_pmg</span> = <span class="fn">AseAtomsAdaptor</span>.<span class="fn">get_structure</span>(<span class="nm">ase_atoms</span>)`,

      cheatsheet: [
        { syn: 'Structure(lattice, species, coords)', desc: 'Create periodic crystal — coords in fractional' },
        { syn: 'Lattice.cubic(a)', desc: 'Cubic lattice with parameter a (Å)' },
        { syn: 'structure.volume', desc: 'Unit cell volume in ų' },
        { syn: 'structure.formula', desc: 'Chemical formula string' },
        { syn: 'SpacegroupAnalyzer(struct)', desc: 'Analyse symmetry — space group, crystal system' },
        { syn: 'structure * (2, 2, 2)', desc: 'Create 2×2×2 supercell' },
        { syn: 'Structure.from_file("POSCAR")', desc: 'Read structure from VASP, CIF, or other file' },
        { syn: 'MPRester(api_key)', desc: 'Connect to Materials Project database' },
        { syn: 'mpr.summary.search(formula, fields)', desc: 'Query MP for materials with specific properties' },
        { syn: 'AseAtomsAdaptor.get_atoms(struct)', desc: 'Convert pymatgen Structure → ASE Atoms' },
        { syn: 'AseAtomsAdaptor.get_structure(atoms)', desc: 'Convert ASE Atoms → pymatgen Structure' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the primary advantage of querying the Materials Project API instead of running your own DFT calculations?',
          opts: [
            'MP calculations are more accurate than any DFT code',
            'You get computed properties for 150k+ materials instantly, enabling large-scale ML datasets',
            'MP results include experimental validation for every entry',
            'The API is faster than a single DFT calculation'
          ],
          answer: 1,
          feedback: 'The Materials Project provides a massive database of pre-computed DFT results. You can download formation energies, band gaps, and elastic constants for thousands of materials in seconds — perfect for building ML training sets.'
        },
        {
          type: 'fill',
          q: 'Complete the code to analyse the space group of a crystal structure:',
          pre: 'from pymatgen.symmetry.analyzer import SpacegroupAnalyzer\nsga = _____(structure)\nprint(sga.get_space_group_symbol())',
          answer: 'SpacegroupAnalyzer',
          feedback: 'SpacegroupAnalyzer takes a pymatgen Structure and provides space group symbol, number, crystal system, and symmetry operations.'
        },
        {
          type: 'challenge',
          q: 'Build an FCC Cu structure with pymatgen (a=3.615 Å, species=["Cu"], fractional coords=[[0,0,0]]). Print its space group, create a 3×3×3 supercell, and convert to ASE Atoms. Print the number of atoms.',
          hint: 'Use Lattice.cubic(3.615), Structure(lattice, ["Cu"], [[0,0,0]]), then structure*(3,3,3).',
          answer: `from pymatgen.core import Structure, Lattice
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
from pymatgen.io.ase import AseAtomsAdaptor

lattice = Lattice.cubic(3.615)
cu = Structure(lattice, ["Cu"], [[0, 0, 0]])
sga = SpacegroupAnalyzer(cu)
print(f"Space group: {sga.get_space_group_symbol()}")
supercell = cu * (3, 3, 3)
print(f"Supercell: {len(supercell)} atoms")
ase_atoms = AseAtomsAdaptor.get_atoms(supercell)
print(f"ASE atoms: {len(ase_atoms)}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Pymatgen Documentation', url: 'https://pymatgen.org/', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'Materials Project API', url: 'https://next-gen.materialsproject.org/api', tag: 'API', tagColor: 'orange' },
        { icon: '📄', title: 'Pymatgen Tutorials', url: 'https://matgenb.materialsvirtuallab.org/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  GEOMETRIC-DL
    // ════════════════════════════════════════════════════════
    {
      id:   'geometric-dl',
      name: 'Geometric Deep Learning',
      desc: 'Graph and point cloud networks for 3D atomic structures — SchNet, DimeNet, and invariant features',

      explanation: `
        <p><strong>Geometric deep learning</strong> extends GNNs to 3D atomic
        structures where positions, distances, and angles matter. Unlike
        molecular GNNs that operate on bond graphs, geometric models use
        <strong>continuous interatomic distances</strong> as edge features and
        build representations that respect <strong>physical symmetries</strong>:
        energy must be invariant to translation, rotation, and permutation of
        identical atoms.</p>

        <p><strong>SchNet</strong> uses continuous filter convolutions on
        interatomic distances, expanded via radial basis functions (Gaussians).
        <strong>DimeNet</strong> adds angular information (bond angles) for
        richer 3-body features. <strong>PaiNN</strong> and <strong>MACE</strong>
        use equivariant message passing — they track both scalar and vector
        quantities, preserving directional information needed for accurate
        force predictions.</p>

        <p>Key concepts: a <strong>cutoff radius</strong> (typically 5–6 Å)
        defines the neighbourhood graph — atoms beyond this distance don't
        interact directly. <strong>Radial basis functions</strong> expand
        distances into feature vectors (like fingerprints but continuous).
        The model predicts energy (invariant scalar), and forces are obtained
        as <code>F = -∂E/∂r</code> via autograd — guaranteeing energy
        conservation.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">torch_geometric.data</span> <span class="kw">import</span> <span class="fn">Data</span>

<span class="cm"># Build atomic graph with 3D positions (water molecule)</span>
<span class="nm">positions</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([
    [<span class="num">0.000</span>, <span class="num">0.000</span>, <span class="num">0.000</span>],   <span class="cm"># O</span>
    [<span class="num">0.957</span>, <span class="num">0.000</span>, <span class="num">0.000</span>],   <span class="cm"># H</span>
    [-<span class="num">0.240</span>, <span class="num">0.927</span>, <span class="num">0.000</span>],  <span class="cm"># H</span>
], <span class="nm">dtype</span>=<span class="nm">torch</span>.<span class="nm">float</span>)
<span class="nm">atomic_numbers</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([<span class="num">8</span>, <span class="num">1</span>, <span class="num">1</span>])

<span class="cm"># Compute pairwise distances and build neighbour list</span>
<span class="nm">cutoff</span> = <span class="num">5.0</span>  <span class="cm"># Å</span>
<span class="nm">n_atoms</span> = <span class="fn">len</span>(<span class="nm">positions</span>)
<span class="nm">src</span>, <span class="nm">dst</span>, <span class="nm">dists</span> = [], [], []
<span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">n_atoms</span>):
    <span class="kw">for</span> <span class="nm">j</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">n_atoms</span>):
        <span class="kw">if</span> <span class="nm">i</span> != <span class="nm">j</span>:
            <span class="nm">d</span> = <span class="nm">torch</span>.<span class="fn">norm</span>(<span class="nm">positions</span>[<span class="nm">i</span>] - <span class="nm">positions</span>[<span class="nm">j</span>])
            <span class="kw">if</span> <span class="nm">d</span> < <span class="nm">cutoff</span>:
                <span class="nm">src</span>.<span class="fn">append</span>(<span class="nm">i</span>); <span class="nm">dst</span>.<span class="fn">append</span>(<span class="nm">j</span>); <span class="nm">dists</span>.<span class="fn">append</span>(<span class="nm">d</span>)
<span class="nm">edge_index</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([<span class="nm">src</span>, <span class="nm">dst</span>], <span class="nm">dtype</span>=<span class="nm">torch</span>.<span class="nm">long</span>)
<span class="nm">edge_dist</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>(<span class="nm">dists</span>)
<span class="fn">print</span>(<span class="st">f"Edges: </span>{<span class="nm">edge_index</span>.<span class="nm">shape</span>}<span class="st">, distances: </span>{<span class="nm">edge_dist</span>}<span class="st">"</span>)

<span class="cm"># Gaussian radial basis expansion</span>
<span class="kw">def</span> <span class="fn">gaussian_rbf</span>(<span class="nm">d</span>, <span class="nm">n_rbf</span>=<span class="num">20</span>, <span class="nm">cutoff</span>=<span class="num">5.0</span>):
    <span class="nm">centers</span> = <span class="nm">torch</span>.<span class="fn">linspace</span>(<span class="num">0.1</span>, <span class="nm">cutoff</span>, <span class="nm">n_rbf</span>)
    <span class="nm">gamma</span> = <span class="num">1.0</span> / (<span class="num">2</span> * (<span class="nm">centers</span>[<span class="num">1</span>] - <span class="nm">centers</span>[<span class="num">0</span>])**<span class="num">2</span>)
    <span class="kw">return</span> <span class="nm">torch</span>.<span class="fn">exp</span>(-<span class="nm">gamma</span> * (<span class="nm">d</span>.<span class="fn">unsqueeze</span>(-<span class="num">1</span>) - <span class="nm">centers</span>)**<span class="num">2</span>)

<span class="nm">rbf_features</span> = <span class="fn">gaussian_rbf</span>(<span class="nm">edge_dist</span>)
<span class="fn">print</span>(<span class="st">f"RBF features: </span>{<span class="nm">rbf_features</span>.<span class="nm">shape</span>}<span class="st">"</span>)  <span class="cm"># (n_edges, 20)</span>

<span class="cm"># Package as PyG Data object</span>
<span class="nm">graph</span> = <span class="fn">Data</span>(<span class="nm">z</span>=<span class="nm">atomic_numbers</span>, <span class="nm">pos</span>=<span class="nm">positions</span>,
            <span class="nm">edge_index</span>=<span class="nm">edge_index</span>, <span class="nm">edge_attr</span>=<span class="nm">rbf_features</span>,
            <span class="nm">y</span>=<span class="nm">torch</span>.<span class="fn">tensor</span>([-<span class="num">76.026</span>]))  <span class="cm"># energy in Ha</span>
<span class="fn">print</span>(<span class="st">f"Graph: </span>{<span class="nm">graph</span>.<span class="nm">num_nodes</span>}<span class="st"> atoms, </span>{<span class="nm">graph</span>.<span class="nm">num_edges</span>}<span class="st"> edges"</span>)`,

      cheatsheet: [
        { syn: 'cutoff = 5.0  # Å', desc: 'Neighbourhood radius — atoms beyond this distance don\'t interact' },
        { syn: 'gaussian_rbf(distances, n_rbf=20)', desc: 'Expand distances into smooth feature vectors' },
        { syn: 'Data(z=Z, pos=pos, edge_index=ei)', desc: 'PyG graph with atomic numbers and 3D positions' },
        { syn: 'SchNet(hidden=128, n_interactions=3)', desc: 'Continuous filter convolution on distances' },
        { syn: 'DimeNet(hidden=128, n_bilinear=8)', desc: 'Adds bond angles for 3-body interactions' },
        { syn: 'PaiNN(n_atom_basis=128)', desc: 'Equivariant model — scalar + vector channels' },
        { syn: 'F = -torch.autograd.grad(E, pos)', desc: 'Forces from energy gradient — guarantees conservation' },
        { syn: 'edge_dist = torch.norm(pos[src]-pos[dst])', desc: 'Compute pairwise distances from positions' },
        { syn: 'radius_graph(pos, r, batch)', desc: 'PyG utility: build neighbour list within cutoff r' },
        { syn: 'data.y = energy_tensor', desc: 'Store target energy as graph-level property' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why do geometric ML models predict forces as F = -∂E/∂r rather than directly predicting forces?',
          opts: [
            'It is computationally cheaper',
            'It guarantees energy conservation — forces are consistent with the energy surface',
            'Direct force prediction requires more training data',
            'Autograd is more accurate than direct regression'
          ],
          answer: 1,
          feedback: 'Computing forces via the energy gradient ensures thermodynamic consistency — the force field is conservative. Direct force prediction can violate energy conservation, causing artefacts in MD simulations.'
        },
        {
          type: 'fill',
          q: 'Complete the code to build a neighbour list within a cutoff radius:',
          pre: 'from torch_geometric.nn import radius_graph\nedge_index = _____(pos, r=5.0, batch=batch)',
          answer: 'radius_graph',
          feedback: 'radius_graph finds all atom pairs within distance r and returns edge_index in COO format, handling batch offsets automatically.'
        },
        {
          type: 'challenge',
          q: 'Build a PyG Data object for a CO2 molecule (C at origin, O at ±1.16 Å along x). Compute all pairwise distances, apply Gaussian RBF expansion (n_rbf=16, cutoff=5.0), and store as edge features. Print the number of edges and RBF shape.',
          hint: 'CO2 has 3 atoms, so with full connectivity (excluding self-loops) there are 6 edges.',
          answer: `import torch
from torch_geometric.data import Data

pos = torch.tensor([[0.0, 0.0, 0.0],
                    [1.16, 0.0, 0.0],
                    [-1.16, 0.0, 0.0]])
z = torch.tensor([6, 8, 8])
src, dst, dists = [], [], []
for i in range(3):
    for j in range(3):
        if i != j:
            d = torch.norm(pos[i] - pos[j])
            if d < 5.0:
                src.append(i); dst.append(j); dists.append(d)
edge_index = torch.tensor([src, dst], dtype=torch.long)
d_tensor = torch.tensor(dists)
centers = torch.linspace(0.1, 5.0, 16)
gamma = 1.0 / (2 * (centers[1] - centers[0])**2)
rbf = torch.exp(-gamma * (d_tensor.unsqueeze(-1) - centers)**2)
graph = Data(z=z, pos=pos, edge_index=edge_index, edge_attr=rbf)
print(f"Edges: {graph.num_edges}, RBF shape: {rbf.shape}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Geometric GNN Survey', url: 'https://arxiv.org/abs/2104.13478', tag: 'paper', tagColor: 'purple' },
        { icon: '📄', title: 'SchNet Paper', url: 'https://arxiv.org/abs/1706.08566', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'PyG 3D Point Cloud Tutorial', url: 'https://pytorch-geometric.readthedocs.io/en/latest/tutorial/point_cloud.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  EQUIVARIANT-NN
    // ════════════════════════════════════════════════════════
    {
      id:   'equivariant-nn',
      name: 'Equivariant Neural Networks',
      desc: 'E(3)-equivariant architectures with spherical harmonics for learning atomic interactions',

      explanation: `
        <p><strong>Equivariant neural networks</strong> build physical symmetries
        directly into the architecture. An <strong>invariant</strong> model outputs
        the same energy regardless of how you rotate the molecule. An
        <strong>equivariant</strong> model goes further: if you rotate the input,
        the predicted forces rotate by exactly the same amount. This is guaranteed
        by construction, not learned from data.</p>

        <p>The mathematical backbone is <strong>spherical harmonics</strong> Y_l^m
        — functions on the sphere labelled by degree l. Scalars (l=0) are invariant,
        vectors (l=1) rotate like 3D vectors, and higher orders (l=2: quadrupoles)
        capture increasingly complex angular patterns. The <strong>e3nn</strong>
        library implements tensor products of these irreducible representations,
        enabling equivariant message passing.</p>

        <p>State-of-the-art models like <strong>MACE</strong>, <strong>NequIP</strong>,
        and <strong>Allegro</strong> use equivariant architectures to achieve
        DFT-level accuracy with ML speed. They typically use l_max=2 or 3
        (scalars + vectors + tensors). Higher l captures more angular detail
        but increases computational cost quadratically. These models power
        modern machine learning interatomic potentials (MLIPs).</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">e3nn</span>
<span class="kw">from</span> <span class="nm">e3nn</span> <span class="kw">import</span> <span class="nm">o3</span>
<span class="kw">from</span> <span class="nm">e3nn.o3</span> <span class="kw">import</span> <span class="fn">Irreps</span>, <span class="fn">spherical_harmonics</span>

<span class="cm"># Irreducible representations: building blocks of equivariance</span>
<span class="nm">scalars</span> = <span class="fn">Irreps</span>(<span class="st">'3x0e'</span>)       <span class="cm"># 3 scalar channels (even parity)</span>
<span class="nm">vectors</span> = <span class="fn">Irreps</span>(<span class="st">'2x1o'</span>)       <span class="cm"># 2 vector channels (odd parity)</span>
<span class="nm">mixed</span> = <span class="fn">Irreps</span>(<span class="st">'3x0e + 2x1o + 1x2e'</span>)  <span class="cm"># scalars + vectors + tensors</span>
<span class="fn">print</span>(<span class="st">f"Scalar dim: </span>{<span class="nm">scalars</span>.<span class="nm">dim</span>}<span class="st">"</span>)   <span class="cm"># 3</span>
<span class="fn">print</span>(<span class="st">f"Vector dim: </span>{<span class="nm">vectors</span>.<span class="nm">dim</span>}<span class="st">"</span>)   <span class="cm"># 6 (2 × 3 components)</span>
<span class="fn">print</span>(<span class="st">f"Mixed dim:  </span>{<span class="nm">mixed</span>.<span class="nm">dim</span>}<span class="st">"</span>)    <span class="cm"># 3 + 6 + 5 = 14</span>

<span class="cm"># Spherical harmonics: expand direction vectors</span>
<span class="nm">r_vec</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([[<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>],    <span class="cm"># O-H bond direction</span>
                      [-<span class="num">0.25</span>, <span class="num">0.97</span>, <span class="num">0.0</span>]])  <span class="cm"># second O-H</span>
<span class="nm">sh</span> = <span class="fn">spherical_harmonics</span>(<span class="st">'0e + 1o + 2e'</span>, <span class="nm">r_vec</span>, <span class="nm">normalize</span>=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="st">f"SH shape: </span>{<span class="nm">sh</span>.<span class="nm">shape</span>}<span class="st">"</span>)  <span class="cm"># (2, 1+3+5=9)</span>

<span class="cm"># Equivariant linear layer</span>
<span class="nm">linear</span> = <span class="nm">o3</span>.<span class="fn">Linear</span>(
    <span class="nm">irreps_in</span>=<span class="st">'3x0e + 2x1o'</span>,
    <span class="nm">irreps_out</span>=<span class="st">'5x0e + 3x1o'</span>)
<span class="nm">x_in</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">10</span>, <span class="nm">mixed</span>.<span class="nm">dim</span>)[:, :<span class="num">9</span>]  <span class="cm"># 10 atoms</span>
<span class="nm">x_out</span> = <span class="nm">linear</span>(<span class="nm">x_in</span>)
<span class="fn">print</span>(<span class="st">f"Input:  </span>{<span class="nm">x_in</span>.<span class="nm">shape</span>}<span class="st">"</span>)   <span class="cm"># (10, 9)</span>
<span class="fn">print</span>(<span class="st">f"Output: </span>{<span class="nm">x_out</span>.<span class="nm">shape</span>}<span class="st">"</span>)  <span class="cm"># (10, 14)</span>

<span class="cm"># Tensor product: core equivariant operation</span>
<span class="nm">tp</span> = <span class="nm">o3</span>.<span class="fn">FullyConnectedTensorProduct</span>(
    <span class="st">'3x0e + 2x1o'</span>,  <span class="cm"># node features</span>
    <span class="st">'0e + 1o'</span>,       <span class="cm"># edge spherical harmonics</span>
    <span class="st">'5x0e + 3x1o'</span>)  <span class="cm"># output features</span>
<span class="fn">print</span>(<span class="st">f"Tensor product params: </span>{<span class="fn">sum</span>(<span class="nm">p</span>.<span class="fn">numel</span>() <span class="kw">for</span> <span class="nm">p</span> <span class="kw">in</span> <span class="nm">tp</span>.<span class="fn">parameters</span>())}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'Irreps("3x0e + 2x1o")', desc: '3 scalar + 2 vector irreps — e=even, o=odd parity' },
        { syn: 'spherical_harmonics(irreps, vectors)', desc: 'Expand 3D directions into spherical harmonic features' },
        { syn: 'o3.Linear(irreps_in, irreps_out)', desc: 'Equivariant linear layer — respects SO(3) symmetry' },
        { syn: 'o3.FullyConnectedTensorProduct()', desc: 'Core operation: combine two irrep features equivariantly' },
        { syn: 'l=0: scalar, l=1: vector, l=2: tensor', desc: 'Irrep degrees — higher l = more angular detail' },
        { syn: 'irreps.dim', desc: 'Total dimension: sum of (2l+1) per channel' },
        { syn: 'e3nn.nn.Gate(irreps_scalars, ...)', desc: 'Non-linearity for equivariant networks' },
        { syn: 'Wigner D-matrices', desc: 'Rotation matrices for each l — how irreps transform' },
        { syn: 'NequIP: equivariant message passing', desc: 'State-of-the-art MLIP using e3nn' },
        { syn: 'MACE: higher-order equivariant messages', desc: 'Multi-body interactions via tensor products' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why are equivariant models preferred over invariant models for predicting atomic forces?',
          opts: [
            'They are faster to train',
            'Forces are vectors that must rotate with the coordinate frame — equivariance guarantees this',
            'Invariant models cannot predict any vector quantities',
            'Equivariant models require less training data'
          ],
          answer: 1,
          feedback: 'Forces are equivariant quantities: rotating the molecule should rotate the forces identically. Equivariant architectures guarantee this by construction, while invariant models can only predict scalars directly.'
        },
        {
          type: 'fill',
          q: 'Complete the code to create irreps with 4 scalar and 2 vector channels:',
          pre: 'from e3nn.o3 import Irreps\nirreps = Irreps("_____")',
          answer: '4x0e + 2x1o',
          feedback: '"4x0e" means 4 channels of l=0 (scalar, even parity). "2x1o" means 2 channels of l=1 (vector, odd parity). The total dimension is 4×1 + 2×3 = 10.'
        },
        {
          type: 'challenge',
          q: 'Compute spherical harmonics (l=0,1,2: "0e + 1o + 2e") for 3 unit direction vectors: x-hat, y-hat, z-hat. Print the output shape and verify that the l=0 component is the same for all directions (rotational invariance of scalars).',
          hint: 'directions = torch.eye(3). Use spherical_harmonics("0e + 1o + 2e", directions, normalize=True). The first column is the l=0 component.',
          answer: `import torch
from e3nn.o3 import spherical_harmonics

directions = torch.eye(3)  # x, y, z unit vectors
sh = spherical_harmonics("0e + 1o + 2e", directions, normalize=True)
print(f"Shape: {sh.shape}")  # (3, 9)
print(f"l=0 components: {sh[:, 0].tolist()}")
print(f"All equal? {torch.allclose(sh[:, 0], sh[0, 0].expand(3))}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'e3nn Documentation', url: 'https://docs.e3nn.org/', tag: 'docs', tagColor: 'blue' },
        { icon: '📄', title: 'E(3)-Equivariant GNNs (MACE paper)', url: 'https://arxiv.org/abs/2206.07697', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'e3nn Tutorials', url: 'https://docs.e3nn.org/en/latest/guide/change_of_basis.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  TRAIN-MLIPS
    // ════════════════════════════════════════════════════════
    {
      id:   'train-mlips',
      name: 'Training MLIPs',
      desc: 'Machine learning interatomic potentials — data preparation, training, and validation for MD simulations',

      explanation: `
        <p><strong>Machine learning interatomic potentials (MLIPs)</strong> replace
        expensive DFT calculations with fast neural network predictions of energy
        and forces. Training data consists of atomic structures with DFT-computed
        energies and forces — typically 1,000–100,000 configurations from MD
        trajectories, rattled structures, or active learning.</p>

        <p>The training pipeline: (1) prepare a dataset of structures + DFT
        energies + forces (extxyz format), (2) choose a model architecture
        (MACE, NequIP, SchNet), (3) train with a combined loss:
        <code>L = w_E × L_energy + w_F × L_forces</code>. Force loss typically
        dominates (w_F >> w_E) because forces have 3N labels per structure
        vs. 1 energy label, and accurate forces are critical for stable MD.</p>

        <p>Validation metrics: <strong>energy MAE</strong> (meV/atom),
        <strong>force MAE</strong> (meV/Å), and <strong>force component RMSE</strong>.
        Chemical accuracy thresholds: energy < 1 meV/atom and forces < 50 meV/Å
        for stable MD. Always test on out-of-distribution structures (different
        temperatures, compositions) to check generalisation.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">ase.io</span> <span class="kw">import</span> <span class="fn">read</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">import</span> <span class="nm">torch</span>

<span class="cm"># Load DFT training data (extxyz with energies + forces)</span>
<span class="cm"># configs = read('train.extxyz', ':')</span>
<span class="cm"># For demo, create synthetic data</span>
<span class="kw">from</span> <span class="nm">ase</span> <span class="kw">import</span> <span class="fn">Atoms</span>
<span class="kw">from</span> <span class="nm">ase.calculators.emt</span> <span class="kw">import</span> <span class="fn">EMT</span>
<span class="kw">from</span> <span class="nm">ase.build</span> <span class="kw">import</span> <span class="fn">bulk</span>

<span class="nm">configs</span> = []
<span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    <span class="nm">atoms</span> = <span class="fn">bulk</span>(<span class="st">'Cu'</span>, <span class="st">'fcc'</span>, <span class="nm">a</span>=<span class="num">3.6</span>).<span class="fn">repeat</span>((<span class="num">2</span>, <span class="num">2</span>, <span class="num">2</span>))
    <span class="nm">atoms</span>.<span class="fn">rattle</span>(<span class="nm">stdev</span>=<span class="num">0.05</span>)  <span class="cm"># perturb positions</span>
    <span class="nm">atoms</span>.<span class="nm">calc</span> = <span class="fn">EMT</span>()
    <span class="nm">atoms</span>.<span class="nm">info</span>[<span class="st">'energy'</span>] = <span class="nm">atoms</span>.<span class="fn">get_potential_energy</span>()
    <span class="nm">atoms</span>.<span class="nm">arrays</span>[<span class="st">'forces'</span>] = <span class="nm">atoms</span>.<span class="fn">get_forces</span>()
    <span class="nm">configs</span>.<span class="fn">append</span>(<span class="nm">atoms</span>)

<span class="cm"># Extract training data</span>
<span class="nm">energies</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="nm">c</span>.<span class="nm">info</span>[<span class="st">'energy'</span>] / <span class="fn">len</span>(<span class="nm">c</span>) <span class="kw">for</span> <span class="nm">c</span> <span class="kw">in</span> <span class="nm">configs</span>])
<span class="nm">all_forces</span> = <span class="nm">np</span>.<span class="fn">concatenate</span>([<span class="nm">c</span>.<span class="nm">arrays</span>[<span class="st">'forces'</span>] <span class="kw">for</span> <span class="nm">c</span> <span class="kw">in</span> <span class="nm">configs</span>])
<span class="fn">print</span>(<span class="st">f"Configs: </span>{<span class="fn">len</span>(<span class="nm">configs</span>)}<span class="st">"</span>)
<span class="fn">print</span>(<span class="st">f"Energy range: </span>{<span class="nm">energies</span>.<span class="fn">min</span>()<span class="st">:.4f} to </span>{<span class="nm">energies</span>.<span class="fn">max</span>()<span class="st">:.4f} eV/atom"</span>)
<span class="fn">print</span>(<span class="st">f"Force MAE target: < 50 meV/Å"</span>)
<span class="fn">print</span>(<span class="st">f"Force std: </span>{<span class="nm">all_forces</span>.<span class="fn">std</span>() * <span class="num">1000</span><span class="st">:.1f} meV/Å"</span>)

<span class="cm"># MACE training (command line)</span>
<span class="cm"># mace_run_train \\</span>
<span class="cm">#   --train_file=train.extxyz \\</span>
<span class="cm">#   --valid_file=valid.extxyz \\</span>
<span class="cm">#   --model=MACE --hidden_irreps='128x0e+128x1o' \\</span>
<span class="cm">#   --r_max=5.0 --batch_size=4 \\</span>
<span class="cm">#   --max_num_epochs=200 --lr=0.01</span>`,

      cheatsheet: [
        { syn: 'atoms.rattle(stdev=0.05)', desc: 'Add Gaussian noise to positions — generates training configs' },
        { syn: 'atoms.info["energy"] = E', desc: 'Store energy as structure-level property' },
        { syn: 'atoms.arrays["forces"] = F', desc: 'Store forces as per-atom array (N, 3)' },
        { syn: 'read("train.extxyz", ":")', desc: 'Load all configs from extended XYZ file' },
        { syn: 'L = w_E * L_energy + w_F * L_forces', desc: 'Combined loss — w_F typically 100–1000' },
        { syn: 'energy MAE < 1 meV/atom', desc: 'Target accuracy for stable MD simulations' },
        { syn: 'force MAE < 50 meV/Å', desc: 'Force accuracy threshold for reliable dynamics' },
        { syn: 'mace_run_train --train_file=data.xyz', desc: 'MACE CLI training command' },
        { syn: 'nequip-train config.yaml', desc: 'NequIP training from config file' },
        { syn: 'write("data.extxyz", configs)', desc: 'Save training configurations in extxyz format' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why is the force loss typically weighted much higher than the energy loss (w_F >> w_E) when training MLIPs?',
          opts: [
            'Forces are harder to compute with DFT',
            'Each structure provides 3N force labels vs. 1 energy label, and accurate forces drive stable MD',
            'Energy predictions are always accurate',
            'Forces are measured in smaller units'
          ],
          answer: 1,
          feedback: 'For a 32-atom system, you get 96 force components vs. 1 energy per config. Forces are also the quantities that directly drive atomic motion in MD, so their accuracy determines simulation stability.'
        },
        {
          type: 'fill',
          q: 'Complete the code to add Gaussian noise to a bulk structure for training data generation:',
          pre: 'atoms = bulk("Cu", "fcc", a=3.6).repeat((2,2,2))\natoms._____(stdev=0.05)',
          answer: 'rattle',
          feedback: 'atoms.rattle(stdev=0.05) displaces each atom by a random Gaussian vector with σ=0.05 Å, generating diverse training configurations around equilibrium.'
        },
        {
          type: 'challenge',
          q: 'Generate 20 training configs for Cu FCC (a=3.6, 2×2×2 supercell): rattle with stdev=0.03, compute EMT energies/forces, and save to an extxyz file. Print energy and force statistics.',
          hint: 'Use ase.build.bulk, atoms.repeat, atoms.rattle, EMT calculator, and ase.io.write with list of atoms.',
          answer: `from ase.build import bulk
from ase.calculators.emt import EMT
from ase.io import write
import numpy as np

configs = []
for i in range(20):
    atoms = bulk('Cu', 'fcc', a=3.6).repeat((2, 2, 2))
    atoms.rattle(stdev=0.03)
    atoms.calc = EMT()
    atoms.info['energy'] = atoms.get_potential_energy()
    atoms.arrays['forces'] = atoms.get_forces()
    configs.append(atoms)
write('cu_train.extxyz', configs)
energies = [c.info['energy'] / len(c) for c in configs]
forces = np.concatenate([c.arrays['forces'] for c in configs])
print(f"E range: {min(energies):.4f} to {max(energies):.4f} eV/atom")
print(f"F MAE: {np.abs(forces).mean()*1000:.1f} meV/Å")`
        }
      ],

      resources: [
        { icon: '📘', title: 'MACE Documentation', url: 'https://mace-docs.readthedocs.io/', tag: 'docs', tagColor: 'blue' },
        { icon: '📄', title: 'MACE Paper', url: 'https://arxiv.org/abs/2206.07697', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'NequIP Tutorial', url: 'https://github.com/mir-group/nequip', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  UNIVERSAL-POTENTIALS
    // ════════════════════════════════════════════════════════
    {
      id:   'universal-potentials',
      name: 'Universal Potentials',
      desc: 'Pre-trained foundation models — MACE-MP-0, CHGNet, and M3GNet for general-purpose atomistic simulation',

      explanation: `
        <p><strong>Universal machine learning potentials</strong> are pre-trained
        on massive DFT databases (Materials Project, Alexandria) covering most
        of the periodic table. Instead of training from scratch for each system,
        you download a pre-trained model and use it directly — like GPT for
        atoms. <strong>MACE-MP-0</strong> (trained on ~150k MP structures) and
        <strong>CHGNet</strong> (trained on MP trajectories) are the leading
        options.</p>

        <p>These models attach to ASE as calculators:
        <code>atoms.calc = mace_mp()</code> gives you instant energy/force
        predictions for any combination of elements. Accuracy is typically
        within 30–50 meV/atom of DFT for equilibrium structures — good enough
        for structure screening, geometry optimisation, and exploratory MD.
        For production accuracy on a specific system, <strong>fine-tune</strong>
        the universal model on your DFT data.</p>

        <p>Use cases: rapid <strong>geometry optimisation</strong> of thousands
        of candidate structures, <strong>phonon calculations</strong> without
        DFT, <strong>MD simulations</strong> at near-DFT accuracy for ns
        timescales, and <strong>pre-screening</strong> before expensive
        high-level calculations. Fine-tuning on 50–500 system-specific DFT
        configs dramatically improves accuracy for your target chemistry.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">mace.calculators</span> <span class="kw">import</span> <span class="fn">mace_mp</span>
<span class="kw">from</span> <span class="nm">ase.build</span> <span class="kw">import</span> <span class="fn">bulk</span>, <span class="fn">molecule</span>
<span class="kw">from</span> <span class="nm">ase.optimize</span> <span class="kw">import</span> <span class="fn">BFGS</span>
<span class="kw">from</span> <span class="nm">ase</span> <span class="kw">import</span> <span class="fn">Atoms</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Load universal potential (downloads on first use)</span>
<span class="nm">calc</span> = <span class="fn">mace_mp</span>(<span class="nm">model</span>=<span class="st">'medium'</span>, <span class="nm">default_dtype</span>=<span class="st">'float64'</span>)

<span class="cm"># Quick energy evaluation for any material</span>
<span class="nm">cu</span> = <span class="fn">bulk</span>(<span class="st">'Cu'</span>, <span class="st">'fcc'</span>, <span class="nm">a</span>=<span class="num">3.6</span>)
<span class="nm">cu</span>.<span class="nm">calc</span> = <span class="nm">calc</span>
<span class="fn">print</span>(<span class="st">f"Cu energy: </span>{<span class="nm">cu</span>.<span class="fn">get_potential_energy</span>()<span class="st">:.4f} eV"</span>)

<span class="nm">si</span> = <span class="fn">bulk</span>(<span class="st">'Si'</span>, <span class="st">'diamond'</span>, <span class="nm">a</span>=<span class="num">5.43</span>)
<span class="nm">si</span>.<span class="nm">calc</span> = <span class="nm">calc</span>
<span class="fn">print</span>(<span class="st">f"Si energy: </span>{<span class="nm">si</span>.<span class="fn">get_potential_energy</span>()<span class="st">:.4f} eV"</span>)

<span class="cm"># Geometry optimisation with universal potential</span>
<span class="nm">bto</span> = <span class="fn">bulk</span>(<span class="st">'BaTiO3'</span>, <span class="st">'perovskite'</span>, <span class="nm">a</span>=<span class="num">4.01</span>)
<span class="nm">bto</span>.<span class="nm">calc</span> = <span class="nm">calc</span>
<span class="nm">opt</span> = <span class="fn">BFGS</span>(<span class="nm">bto</span>, <span class="nm">logfile</span>=<span class="kw">None</span>)
<span class="nm">opt</span>.<span class="fn">run</span>(<span class="nm">fmax</span>=<span class="num">0.01</span>)
<span class="fn">print</span>(<span class="st">f"BaTiO3 relaxed: E=</span>{<span class="nm">bto</span>.<span class="fn">get_potential_energy</span>()<span class="st">:.4f} eV"</span>)

<span class="cm"># Screen multiple alloy compositions</span>
<span class="nm">compositions</span> = [(<span class="st">'Cu'</span>, <span class="num">3.6</span>), (<span class="st">'Ag'</span>, <span class="num">4.09</span>), (<span class="st">'Au'</span>, <span class="num">4.08</span>), (<span class="st">'Pt'</span>, <span class="num">3.92</span>)]
<span class="fn">print</span>(<span class="st">"\\nFCC cohesive energies (MACE-MP-0):"</span>)
<span class="kw">for</span> <span class="nm">elem</span>, <span class="nm">a</span> <span class="kw">in</span> <span class="nm">compositions</span>:
    <span class="nm">atoms</span> = <span class="fn">bulk</span>(<span class="nm">elem</span>, <span class="st">'fcc'</span>, <span class="nm">a</span>=<span class="nm">a</span>)
    <span class="nm">atoms</span>.<span class="nm">calc</span> = <span class="nm">calc</span>
    <span class="nm">e</span> = <span class="nm">atoms</span>.<span class="fn">get_potential_energy</span>() / <span class="fn">len</span>(<span class="nm">atoms</span>)
    <span class="fn">print</span>(<span class="st">f"  </span>{<span class="nm">elem</span>:<span class="num">3</span>}<span class="st">: </span>{<span class="nm">e</span><span class="st">:.4f} eV/atom"</span>)`,

      cheatsheet: [
        { syn: 'mace_mp(model="medium")', desc: 'Load MACE-MP-0 universal potential (small/medium/large)' },
        { syn: 'CHGNet.load()', desc: 'Load CHGNet universal potential (Materials Project)' },
        { syn: 'M3GNet.load()', desc: 'Load M3GNet foundation model' },
        { syn: 'atoms.calc = mace_mp()', desc: 'Attach universal potential as ASE calculator' },
        { syn: 'BFGS(atoms).run(fmax=0.01)', desc: 'Relax structure with universal potential forces' },
        { syn: 'MACECalculator(model_path)', desc: 'Load custom fine-tuned MACE model' },
        { syn: 'mace_run_train --foundation_model=mace_mp', desc: 'Fine-tune MACE-MP-0 on your DFT data' },
        { syn: 'model="small" / "medium" / "large"', desc: 'Trade-off: speed vs accuracy' },
        { syn: 'default_dtype="float64"', desc: 'Double precision — required for geometry optimisation' },
        { syn: 'Trajectory("relax.traj", "w", atoms)', desc: 'Save optimisation trajectory for analysis' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'When should you fine-tune a universal potential instead of using it directly?',
          opts: [
            'Always — universal potentials are never accurate enough',
            'When you need production-level accuracy for a specific chemistry not well-represented in training data',
            'Only for molecules, not for periodic systems',
            'When the universal model is too fast'
          ],
          answer: 1,
          feedback: 'Universal potentials are good baselines (~30-50 meV/atom) but may lack accuracy for specific chemistries. Fine-tuning on 50-500 DFT configs of your target system dramatically improves accuracy while preserving general knowledge.'
        },
        {
          type: 'fill',
          q: 'Complete the code to load the MACE universal potential and attach it to a structure:',
          pre: 'from mace.calculators import mace_mp\ncalc = _____(model="medium", default_dtype="float64")\natoms.calc = calc',
          answer: 'mace_mp',
          feedback: 'mace_mp() loads the pre-trained MACE-MP-0 model. On first call it downloads the weights. "medium" balances speed and accuracy.'
        },
        {
          type: 'challenge',
          q: 'Use MACE-MP-0 to compute and compare the energy per atom of Cu (FCC, a=3.6), Si (diamond, a=5.43), and NaCl (rocksalt, a=5.64). Print a ranked table of energies.',
          hint: 'Use ase.build.bulk with the appropriate crystal structure for each. Divide total energy by number of atoms.',
          answer: `from mace.calculators import mace_mp
from ase.build import bulk

calc = mace_mp(model='medium', default_dtype='float64')
systems = [('Cu', 'fcc', 3.6), ('Si', 'diamond', 5.43), ('NaCl', 'rocksalt', 5.64)]
results = []
for name, struct, a in systems:
    atoms = bulk(name, struct, a=a)
    atoms.calc = calc
    e = atoms.get_potential_energy() / len(atoms)
    results.append((name, e))
results.sort(key=lambda x: x[1])
print("Energy per atom (MACE-MP-0):")
for name, e in results:
    print(f"  {name:5}: {e:.4f} eV/atom")`
        }
      ],

      resources: [
        { icon: '📘', title: 'MACE-MP-0 Model Card', url: 'https://github.com/ACEsuit/mace-mp', tag: 'model', tagColor: 'purple' },
        { icon: '📄', title: 'CHGNet Paper', url: 'https://arxiv.org/abs/2302.14231', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'Foundation Models for Materials', url: 'https://arxiv.org/abs/2401.00096', tag: 'review', tagColor: 'orange' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  OPEN-CATALYST
    // ════════════════════════════════════════════════════════
    {
      id:   'open-catalyst',
      name: 'Open Catalyst Project',
      desc: 'Large-scale catalyst screening with OC20/OC22 models and the FAIR-Chem framework',

      explanation: `
        <p>The <strong>Open Catalyst Project (OCP)</strong> by Meta FAIR is the
        largest effort in ML for heterogeneous catalysis. The OC20 dataset
        contains ~260M DFT calculations of adsorbates (CO, H, OH, etc.) on
        catalyst surfaces — orders of magnitude larger than any previous dataset.
        OC22 extends this to oxide catalysts.</p>

        <p>The goal: given an adsorbate + catalyst surface, predict the
        <strong>relaxed adsorption energy</strong> without running expensive
        DFT relaxations. This enables screening millions of catalyst candidates
        for reactions like CO₂ reduction, hydrogen evolution, and ammonia
        synthesis. Models trained on OC20 (EquiformerV2, eSCN, GemNet-OC)
        achieve remarkable accuracy on novel catalysts.</p>

        <p>The <strong>fairchem-core</strong> library provides pre-trained models
        as ASE calculators. Load a model, build an adsorbate-surface system,
        and predict relaxation energy in seconds instead of hours. For your
        own catalyst systems, fine-tune OCP models on domain-specific DFT
        data to achieve best performance.</p>
      `,

      code: `<span class="cm"># Open Catalyst with fairchem-core</span>
<span class="kw">from</span> <span class="nm">fairchem.core</span> <span class="kw">import</span> <span class="fn">FAIRChemCalculator</span>
<span class="kw">from</span> <span class="nm">ase.build</span> <span class="kw">import</span> <span class="fn">fcc111</span>, <span class="fn">add_adsorbate</span>
<span class="kw">from</span> <span class="nm">ase.optimize</span> <span class="kw">import</span> <span class="fn">BFGS</span>
<span class="kw">from</span> <span class="nm">ase.constraints</span> <span class="kw">import</span> <span class="fn">FixAtoms</span>
<span class="kw">from</span> <span class="nm">ase</span> <span class="kw">import</span> <span class="fn">Atoms</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Load pre-trained OCP model as ASE calculator</span>
<span class="nm">calc</span> = <span class="fn">FAIRChemCalculator</span>(
    <span class="nm">model_name</span>=<span class="st">'EquiformerV2-31M-S2EF-OC20-All+MD'</span>,
    <span class="nm">local_cache</span>=<span class="st">'./ocp_models'</span>)

<span class="cm"># Build catalyst surface: Cu(111) slab</span>
<span class="nm">slab</span> = <span class="fn">fcc111</span>(<span class="st">'Cu'</span>, <span class="nm">size</span>=(<span class="num">3</span>, <span class="num">3</span>, <span class="num">4</span>), <span class="nm">vacuum</span>=<span class="num">13.0</span>)
<span class="nm">slab</span>.<span class="nm">pbc</span> = [<span class="kw">True</span>, <span class="kw">True</span>, <span class="kw">True</span>]

<span class="cm"># Fix bottom 2 layers (bulk-like)</span>
<span class="nm">z_sorted</span> = <span class="nm">np</span>.<span class="fn">sort</span>(<span class="nm">np</span>.<span class="fn">unique</span>(<span class="nm">slab</span>.<span class="fn">get_positions</span>()[:, <span class="num">2</span>].<span class="fn">round</span>(<span class="num">2</span>)))
<span class="nm">fix_mask</span> = <span class="nm">slab</span>.<span class="fn">get_positions</span>()[:, <span class="num">2</span>] < <span class="nm">z_sorted</span>[<span class="num">2</span>]
<span class="nm">slab</span>.<span class="fn">set_constraint</span>(<span class="fn">FixAtoms</span>(<span class="nm">mask</span>=<span class="nm">fix_mask</span>))

<span class="cm"># Add CO adsorbate at top site</span>
<span class="nm">co</span> = <span class="fn">Atoms</span>(<span class="st">'CO'</span>, <span class="nm">positions</span>=[(<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>), (<span class="num">0</span>, <span class="num">0</span>, <span class="num">1.16</span>)])
<span class="fn">add_adsorbate</span>(<span class="nm">slab</span>, <span class="nm">co</span>, <span class="nm">height</span>=<span class="num">1.8</span>, <span class="nm">position</span>=<span class="st">'ontop'</span>)

<span class="cm"># Predict adsorption energy</span>
<span class="nm">slab</span>.<span class="nm">calc</span> = <span class="nm">calc</span>
<span class="nm">e_ads</span> = <span class="nm">slab</span>.<span class="fn">get_potential_energy</span>()
<span class="fn">print</span>(<span class="st">f"CO/Cu(111) energy: </span>{<span class="nm">e_ads</span><span class="st">:.4f} eV"</span>)

<span class="cm"># Relax adsorbate position</span>
<span class="nm">opt</span> = <span class="fn">BFGS</span>(<span class="nm">slab</span>, <span class="nm">logfile</span>=<span class="kw">None</span>)
<span class="nm">opt</span>.<span class="fn">run</span>(<span class="nm">fmax</span>=<span class="num">0.05</span>, <span class="nm">steps</span>=<span class="num">50</span>)
<span class="fn">print</span>(<span class="st">f"Relaxed energy: </span>{<span class="nm">slab</span>.<span class="fn">get_potential_energy</span>()<span class="st">:.4f} eV"</span>)
<span class="fn">print</span>(<span class="st">f"Converged in </span>{<span class="nm">opt</span>.<span class="fn">get_number_of_steps</span>()}<span class="st"> steps"</span>)`,

      cheatsheet: [
        { syn: 'FAIRChemCalculator(model_name=...)', desc: 'Load pre-trained OCP model as ASE calculator' },
        { syn: 'fcc111("Cu", size=(3,3,4), vacuum=13)', desc: 'Build FCC(111) catalyst surface slab' },
        { syn: 'add_adsorbate(slab, mol, height, position)', desc: 'Place adsorbate on surface site' },
        { syn: 'FixAtoms(mask=bottom_layers)', desc: 'Freeze bulk-like atoms during relaxation' },
        { syn: 'slab.pbc = [True, True, True]', desc: 'Enable full periodic boundary conditions' },
        { syn: 'EquiformerV2-31M-S2EF-OC20-All+MD', desc: 'Best OC20 model for structure-to-energy+forces' },
        { syn: 'E_ads = E(slab+ads) - E(slab) - E(gas)', desc: 'Adsorption energy calculation' },
        { syn: 'fcc100, fcc110, bcc110, hcp0001', desc: 'Other surface builders available in ase.build' },
        { syn: 'position="ontop" / "bridge" / "hollow"', desc: 'Common adsorption site types' },
        { syn: 'opt.run(fmax=0.05, steps=100)', desc: 'Relax with force threshold and step limit' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why is the Open Catalyst dataset orders of magnitude larger than typical ML-for-chemistry datasets?',
          opts: [
            'It uses cheaper DFT settings than other projects',
            'Catalyst screening requires covering many adsorbate × surface × site combinations',
            'It includes experimental data alongside DFT',
            'It only computes single-point energies, not full relaxations'
          ],
          answer: 1,
          feedback: 'OC20 covers ~80 adsorbates on ~55 elements across multiple surface facets and adsorption sites. The combinatorial explosion of (adsorbate, surface, site) triples requires massive dataset size.'
        },
        {
          type: 'fill',
          q: 'Complete the code to add a CO molecule on top of a catalyst surface:',
          pre: 'from ase.build import add_adsorbate\n_____(slab, co, height=1.8, position="ontop")',
          answer: 'add_adsorbate',
          feedback: 'add_adsorbate() places a molecule at the specified height above a surface site. "ontop" places it above an atom; "bridge" and "hollow" are other options.'
        },
        {
          type: 'challenge',
          q: 'Build Pt(111) and Cu(111) slabs (3×3×3, vacuum=13Å), fix the bottom 2 layers, add an H atom at height 1.5Å on the ontop site. Use EMT as a simple calculator to compare adsorption energies on both surfaces.',
          hint: 'Compute E_ads = E(slab+H) - E(clean_slab) - E(H_gas). For H gas, use a single H atom in a large box.',
          answer: `from ase.build import fcc111, add_adsorbate
from ase.calculators.emt import EMT
from ase.constraints import FixAtoms
from ase import Atoms
import numpy as np

def get_ads_energy(element):
    slab = fcc111(element, size=(3,3,3), vacuum=13.0)
    z_vals = np.sort(np.unique(slab.positions[:, 2].round(2)))
    slab.set_constraint(FixAtoms(mask=slab.positions[:, 2] < z_vals[2]))
    clean = slab.copy()
    clean.calc = EMT()
    e_slab = clean.get_potential_energy()
    add_adsorbate(slab, 'H', height=1.5, position='ontop')
    slab.calc = EMT()
    e_total = slab.get_potential_energy()
    h_gas = Atoms('H', positions=[[0,0,0]])
    h_gas.calc = EMT()
    e_h = h_gas.get_potential_energy()
    return e_total - e_slab - e_h

for metal in ['Pt', 'Cu']:
    print(f"{metal}(111) + H: E_ads = {get_ads_energy(metal):.3f} eV")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Open Catalyst Project', url: 'https://opencatalystproject.org/', tag: 'project', tagColor: 'orange' },
        { icon: '📄', title: 'OC20 Dataset Paper', url: 'https://arxiv.org/abs/2010.09990', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'FAIR-Chem Documentation', url: 'https://fair-chem.github.io/', tag: 'docs', tagColor: 'blue' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  ACTIVE-LEARNING
    // ════════════════════════════════════════════════════════
    {
      id:   'active-learning',
      name: 'Active Learning',
      desc: 'Iterative data acquisition strategies for efficiently building MLIP training sets with minimal DFT',

      explanation: `
        <p><strong>Active learning (AL)</strong> is a strategy for building
        training datasets iteratively: train a model, identify where it is most
        uncertain, compute DFT for those configurations, retrain. This cycle
        minimises the total number of expensive DFT calculations needed to reach
        target accuracy — critical when each DFT job costs CPU-hours.</p>

        <p>The AL loop: (1) train MLIP on current data, (2) run MD or geometry
        optimisation with the MLIP to generate candidate structures, (3) score
        candidates by <strong>uncertainty</strong> (ensemble disagreement, MC
        dropout, or committee query-by-committee), (4) select the most uncertain
        structures, (5) compute DFT energies/forces, (6) add to training set,
        (7) repeat until convergence.</p>

        <p>For MLIPs, active learning typically uses an <strong>ensemble of
        models</strong> trained with different random seeds. The standard
        deviation of predictions across ensemble members serves as the
        uncertainty estimate. Structures where ensemble members disagree most
        are the most informative to add. This approach has been shown to
        reduce training set size by 5–10× compared to random sampling while
        achieving the same accuracy.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">ase.build</span> <span class="kw">import</span> <span class="fn">bulk</span>
<span class="kw">from</span> <span class="nm">ase.calculators.emt</span> <span class="kw">import</span> <span class="fn">EMT</span>
<span class="kw">from</span> <span class="nm">ase.io</span> <span class="kw">import</span> <span class="fn">write</span>

<span class="cm"># Active learning loop (simplified)</span>
<span class="kw">def</span> <span class="fn">generate_candidates</span>(<span class="nm">n</span>=<span class="num">50</span>):
    <span class="st">"""Generate candidate structures by rattling bulk Cu."""</span>
    <span class="nm">candidates</span> = []
    <span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">n</span>):
        <span class="nm">atoms</span> = <span class="fn">bulk</span>(<span class="st">'Cu'</span>, <span class="st">'fcc'</span>, <span class="nm">a</span>=<span class="num">3.6</span>).<span class="fn">repeat</span>((<span class="num">2</span>, <span class="num">2</span>, <span class="num">2</span>))
        <span class="nm">atoms</span>.<span class="fn">rattle</span>(<span class="nm">stdev</span>=<span class="nm">np</span>.<span class="nm">random</span>.<span class="fn">uniform</span>(<span class="num">0.01</span>, <span class="num">0.15</span>))
        <span class="nm">candidates</span>.<span class="fn">append</span>(<span class="nm">atoms</span>)
    <span class="kw">return</span> <span class="nm">candidates</span>

<span class="kw">def</span> <span class="fn">ensemble_uncertainty</span>(<span class="nm">candidates</span>, <span class="nm">n_models</span>=<span class="num">3</span>):
    <span class="st">"""Estimate uncertainty via ensemble disagreement (EMT demo)."""</span>
    <span class="nm">all_energies</span> = []
    <span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">n_models</span>):
        <span class="nm">energies</span> = []
        <span class="kw">for</span> <span class="nm">atoms</span> <span class="kw">in</span> <span class="nm">candidates</span>:
            <span class="nm">atoms</span>.<span class="nm">calc</span> = <span class="fn">EMT</span>()
            <span class="nm">e</span> = <span class="nm">atoms</span>.<span class="fn">get_potential_energy</span>() / <span class="fn">len</span>(<span class="nm">atoms</span>)
            <span class="nm">e</span> += <span class="nm">np</span>.<span class="nm">random</span>.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.01</span>)  <span class="cm"># simulate model variation</span>
            <span class="nm">energies</span>.<span class="fn">append</span>(<span class="nm">e</span>)
        <span class="nm">all_energies</span>.<span class="fn">append</span>(<span class="nm">energies</span>)
    <span class="nm">stds</span> = <span class="nm">np</span>.<span class="fn">std</span>(<span class="nm">all_energies</span>, <span class="nm">axis</span>=<span class="num">0</span>)
    <span class="kw">return</span> <span class="nm">stds</span>

<span class="cm"># Run one AL iteration</span>
<span class="nm">candidates</span> = <span class="fn">generate_candidates</span>(<span class="nm">n</span>=<span class="num">30</span>)
<span class="nm">uncertainties</span> = <span class="fn">ensemble_uncertainty</span>(<span class="nm">candidates</span>)
<span class="nm">top_k</span> = <span class="num">5</span>
<span class="nm">query_idx</span> = <span class="nm">np</span>.<span class="fn">argsort</span>(<span class="nm">uncertainties</span>)[-<span class="nm">top_k</span>:]
<span class="fn">print</span>(<span class="st">f"Querying </span>{<span class="nm">top_k</span>}<span class="st"> most uncertain structures:"</span>)
<span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="nm">query_idx</span>:
    <span class="fn">print</span>(<span class="st">f"  Config </span>{<span class="nm">i</span>}<span class="st">: σ=</span>{<span class="nm">uncertainties</span>[<span class="nm">i</span>] * <span class="num">1000</span><span class="st">:.1f} meV/atom"</span>)

<span class="cm"># Compute DFT for queried structures (EMT as stand-in)</span>
<span class="nm">new_data</span> = [<span class="nm">candidates</span>[<span class="nm">i</span>] <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="nm">query_idx</span>]
<span class="kw">for</span> <span class="nm">atoms</span> <span class="kw">in</span> <span class="nm">new_data</span>:
    <span class="nm">atoms</span>.<span class="nm">calc</span> = <span class="fn">EMT</span>()
    <span class="nm">atoms</span>.<span class="nm">info</span>[<span class="st">'energy'</span>] = <span class="nm">atoms</span>.<span class="fn">get_potential_energy</span>()
    <span class="nm">atoms</span>.<span class="nm">arrays</span>[<span class="st">'forces'</span>] = <span class="nm">atoms</span>.<span class="fn">get_forces</span>()
<span class="fn">write</span>(<span class="st">'al_iteration_1.extxyz'</span>, <span class="nm">new_data</span>)
<span class="fn">print</span>(<span class="st">f"Added </span>{<span class="fn">len</span>(<span class="nm">new_data</span>)}<span class="st"> configs to training set"</span>)`,

      cheatsheet: [
        { syn: 'Train → Predict → Score → Query → DFT → Retrain', desc: 'The active learning loop for MLIPs' },
        { syn: 'np.std(ensemble_preds, axis=0)', desc: 'Ensemble disagreement as uncertainty metric' },
        { syn: 'query_idx = np.argsort(σ)[-k:]', desc: 'Select k most uncertain structures for DFT' },
        { syn: 'atoms.rattle(stdev=0.05)', desc: 'Generate diverse candidate structures' },
        { syn: 'MaxwellBoltzmannDistribution(atoms, T)', desc: 'Initialise velocities for MD-based exploration' },
        { syn: 'committee = [model_1, model_2, model_3]', desc: 'Train ensemble with different random seeds' },
        { syn: 'σ_force = std across ensemble force predictions', desc: 'Force uncertainty — more informative than energy' },
        { syn: 'convergence: σ_max < threshold', desc: 'Stop when maximum uncertainty drops below target' },
        { syn: 'write("al_data.extxyz", configs)', desc: 'Save labelled configs for retraining' },
        { syn: 'batch AL: query k structures per iteration', desc: 'Balance exploration (diversity) and exploitation (uncertainty)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why does active learning reduce the number of DFT calculations needed compared to random sampling?',
          opts: [
            'Active learning uses a cheaper DFT method',
            'It selects the most informative structures — those where the model is most uncertain',
            'It skips the force calculation and only computes energies',
            'It trains smaller models that need less data'
          ],
          answer: 1,
          feedback: 'Random sampling wastes DFT compute on structures the model already predicts well. Active learning targets the model\'s blind spots — structures where it is most uncertain — maximising information gain per DFT calculation.'
        },
        {
          type: 'fill',
          q: 'Complete the code to select the 10 most uncertain structures from an array of uncertainties:',
          pre: 'uncertainties = ensemble_std  # array of N values\nquery_idx = np._____(uncertainties)[-10:]',
          answer: 'argsort',
          feedback: 'np.argsort returns indices that would sort the array. Taking [-10:] gives the indices of the 10 largest uncertainties.'
        },
        {
          type: 'challenge',
          q: 'Implement a simplified active learning loop: (1) generate 50 Cu bulk candidates with random rattle amplitudes (0.01–0.1), (2) compute EMT energies with 3 different noise levels added to simulate ensemble disagreement, (3) select the 5 most uncertain, (4) print their indices and uncertainties.',
          hint: 'Use np.random.uniform for rattle amplitude, np.random.normal(0, noise) for model noise. np.argsort for selection.',
          answer: `import numpy as np
from ase.build import bulk
from ase.calculators.emt import EMT

candidates = []
for _ in range(50):
    atoms = bulk('Cu', 'fcc', a=3.6).repeat((2, 2, 2))
    atoms.rattle(stdev=np.random.uniform(0.01, 0.1))
    candidates.append(atoms)

ensemble_energies = []
for noise in [0.005, 0.01, 0.015]:
    energies = []
    for atoms in candidates:
        atoms.calc = EMT()
        e = atoms.get_potential_energy() / len(atoms)
        energies.append(e + np.random.normal(0, noise))
    ensemble_energies.append(energies)

stds = np.std(ensemble_energies, axis=0)
top5 = np.argsort(stds)[-5:]
print("Most uncertain structures:")
for i in top5:
    print(f"  Config {i}: σ = {stds[i]*1000:.1f} meV/atom")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Active Learning for MLIPs Review', url: 'https://arxiv.org/abs/2301.09308', tag: 'review', tagColor: 'orange' },
        { icon: '📄', title: 'FLARE: Fast Learning of Atomistic Rare Events', url: 'https://arxiv.org/abs/2106.01949', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'Uncertainty-Driven AL Tutorial', url: 'https://mace-docs.readthedocs.io/en/latest/guide/active_learning.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

  ],
};
