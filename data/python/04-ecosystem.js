/**
 * data/python/04-ecosystem.js
 * Stage 04: Ecosystem
 * Topics: stdlib-scipy,venv-pip-jupyter,numpy,pandas,matplotlib,cli-tools
 *
 * All challenge exercises use computational chemistry / materials science context.
 * Code line limits: 15–35 lines per topic.
 */

window.PY_S4 = {
  id: 'py-s4', num: '04', title: 'Ecosystem',
  color: 'orange', meta: 'Weeks 10-14', track: 'python',
  topics: [

    // ════════════════════════════════════════════════════════
    //  STDLIB-SCIPY
    // ════════════════════════════════════════════════════════
    {
      id:   'stdlib-scipy',
      name: 'Standard Library & SciPy',
      desc: 'Essential built-in modules and SciPy for scientific computation',

      explanation: `
        <p>Python's <strong>standard library</strong> provides dozens of modules
        you use daily in computational chemistry. <code>pathlib</code> builds
        OS-independent file paths to calculation directories, <code>glob</code>
        finds output files matching patterns, <code>re</code> extracts numbers
        from ORCA output with regular expressions, and <code>collections.Counter</code>
        tallies atom types in a molecular formula.</p>

        <p><strong>SciPy</strong> adds numerical routines on top of NumPy.
        <code>scipy.optimize.minimize</code> finds minimum-energy geometries,
        <code>scipy.interpolate</code> builds smooth potential energy curves from
        discrete scan points, <code>scipy.linalg</code> diagonalizes Hamiltonian
        matrices, and <code>scipy.constants</code> provides physical constants
        (Boltzmann, Avogadro, Planck) with correct units and precision.</p>

        <p>A practical pattern: use <code>pathlib.Path</code> to locate all
        <code>.out</code> files in a project, <code>re</code> to extract energies,
        and <code>scipy.optimize.curve_fit</code> to fit a Morse potential to the
        scanned points. The standard library and SciPy together handle the vast
        majority of data processing tasks before you ever need a specialized
        chemistry package.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">pathlib</span> <span class="kw">import</span> <span class="nm">Path</span>
<span class="kw">import</span> <span class="nm">re</span>
<span class="kw">from</span> <span class="nm">collections</span> <span class="kw">import</span> <span class="nm">Counter</span>
<span class="kw">from</span> <span class="nm">scipy</span> <span class="kw">import</span> <span class="nm">constants</span>, <span class="nm">optimize</span>

<span class="cm"># pathlib: find all ORCA output files</span>
<span class="nm">calc_dir</span> = <span class="fn">Path</span>(<span class="st">"calculations"</span>)
<span class="nm">outputs</span> = <span class="fn">list</span>(<span class="nm">calc_dir</span>.<span class="fn">glob</span>(<span class="st">"**/*.out"</span>))

<span class="cm"># re: extract SCF energy from output text</span>
<span class="nm">text</span> = <span class="st">"FINAL SINGLE POINT ENERGY   -76.402683"</span>
<span class="nm">match</span> = <span class="nm">re</span>.<span class="fn">search</span>(<span class="st">r"FINAL SINGLE POINT ENERGY\s+([-\d.]+)"</span>, <span class="nm">text</span>)
<span class="nm">energy</span> = <span class="fn">float</span>(<span class="nm">match</span>.<span class="fn">group</span>(<span class="num">1</span>)) <span class="kw">if</span> <span class="nm">match</span> <span class="kw">else</span> <span class="kw">None</span>

<span class="cm"># Counter: tally atoms in a formula</span>
<span class="nm">atoms</span> = [<span class="st">"C"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>, <span class="st">"O"</span>, <span class="st">"H"</span>]
<span class="nm">composition</span> = <span class="fn">Counter</span>(<span class="nm">atoms</span>)  <span class="cm"># Counter({'H': 4, 'C': 1, 'O': 1})</span>

<span class="cm"># scipy.constants: physical constants</span>
<span class="nm">k_B</span> = <span class="nm">constants</span>.<span class="nm">k</span>          <span class="cm"># 1.380649e-23 J/K</span>
<span class="nm">N_A</span> = <span class="nm">constants</span>.<span class="nm">Avogadro</span>   <span class="cm"># 6.02214076e23 mol⁻¹</span>

<span class="cm"># scipy.optimize: fit Morse potential V(r) = D*(1-exp(-a*(r-r0)))²</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="nm">r_data</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">0.8</span>, <span class="num">0.9</span>, <span class="num">0.96</span>, <span class="num">1.1</span>, <span class="num">1.3</span>])  <span class="cm"># Å</span>
<span class="nm">e_data</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">0.15</span>, <span class="num">0.02</span>, <span class="num">0.0</span>, <span class="num">0.01</span>, <span class="num">0.05</span>])  <span class="cm"># Ha (rel.)</span>
<span class="kw">def</span> <span class="fn">morse</span>(<span class="nm">r</span>, <span class="nm">D</span>, <span class="nm">a</span>, <span class="nm">r0</span>):
    <span class="kw">return</span> <span class="nm">D</span> <span class="op">*</span> (<span class="num">1</span> <span class="op">-</span> <span class="nm">np</span>.<span class="fn">exp</span>(<span class="op">-</span><span class="nm">a</span> <span class="op">*</span> (<span class="nm">r</span> <span class="op">-</span> <span class="nm">r0</span>))) <span class="op">**</span> <span class="num">2</span>
<span class="nm">popt</span>, <span class="nm">_</span> = <span class="nm">optimize</span>.<span class="fn">curve_fit</span>(<span class="nm">morse</span>, <span class="nm">r_data</span>, <span class="nm">e_data</span>, <span class="nm">p0</span>=[<span class="num">0.2</span>, <span class="num">2.0</span>, <span class="num">0.96</span>])`,

      cheatsheet: [
        { syn: 'Path("dir") / "file.out"',             desc: 'Build paths — OS-independent separator' },
        { syn: 'Path.glob("**/*.out")',                 desc: 'Recursively find files matching a pattern' },
        { syn: 're.search(r"pattern", text)',           desc: 'Find first regex match in a string' },
        { syn: 'match.group(1)',                        desc: 'Extract a capture group from a regex match' },
        { syn: 'Counter(["H","H","O"])',                desc: 'Count occurrences — returns dict-like object' },
        { syn: 'scipy.constants.k',                     desc: 'Boltzmann constant in SI units' },
        { syn: 'optimize.curve_fit(func, x, y)',        desc: 'Least-squares fit of a function to data' },
        { syn: 'optimize.minimize(f, x0)',              desc: 'Find the minimum of a scalar function' },
        { syn: 're.findall(r"\\d+\\.\\d+", text)',     desc: 'Extract all matching substrings as a list' },
        { syn: 'Path.read_text()',                      desc: 'Read entire file contents as a string' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Which module would you use to extract a floating-point number from the text <code>"SCF Done:  E = -152.983 Ha"</code>?',
          opts: [
            'pathlib',
            'collections',
            're (regular expressions)',
            'itertools'
          ],
          answer: 2,
          feedback: 'The <code>re</code> module finds patterns in text. <code>re.search(r"[-\\d.]+", text)</code> would extract <code>-152.983</code>.'
        },
        {
          type: 'fill',
          q: 'Use pathlib to find all .xyz files recursively:',
          pre: 'from pathlib import Path\nfiles = list(Path("data").___("**/*.xyz"))',
          answer: 'glob',
          feedback: '<code>Path.glob("**/*.xyz")</code> recursively searches for files matching the pattern. The <code>**</code> matches any number of directories.'
        },
        {
          type: 'challenge',
          q: 'Write a function that takes a string of ORCA output text and uses <code>re.findall</code> to extract all lines matching "FINAL SINGLE POINT ENERGY" and return the energies as a list of floats. Then use <code>scipy.optimize.curve_fit</code> to fit a quadratic <code>a*x² + b*x + c</code> to the energies (assume equally spaced scan points from 0.8 to 1.4 Å).',
          hint: 'Use re.findall(r"FINAL SINGLE POINT ENERGY\\s+([-\\d.]+)", text) and np.linspace for x values.',
          answer: `import re
import numpy as np
from scipy.optimize import curve_fit

def extract_and_fit(orca_text):
    matches = re.findall(r"FINAL SINGLE POINT ENERGY\\s+([-\\d.]+)", orca_text)
    energies = [float(m) for m in matches]
    r_values = np.linspace(0.8, 1.4, len(energies))

    def quadratic(x, a, b, c):
        return a * x**2 + b * x + c

    popt, _ = curve_fit(quadratic, r_values, energies)
    return energies, popt  # (a, b, c)`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Standard Library', url: 'https://docs.python.org/3/library/', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'SciPy Documentation', url: 'https://docs.scipy.org/doc/scipy/', tag: 'docs', tagColor: 'blue' },
        { icon: '📓', title: 'SciComp for Chemists: Signal Processing', url: 'https://weisscharlesj.github.io/SciCompforChemists/notebooks/introduction/intro.html', tag: 'textbook', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  VENV-PIP-JUPYTER
    // ════════════════════════════════════════════════════════
    {
      id:   'venv-pip-jupyter',
      name: 'Environments, pip & Jupyter',
      desc: 'Managing isolated Python environments and interactive notebooks for research',

      explanation: `
        <p>A <strong>virtual environment</strong> (<code>venv</code>) is an isolated
        Python installation where you can install packages without affecting the
        system Python. This is essential in computational chemistry where projects
        have conflicting dependencies — one project needs <code>ase==3.22</code>
        while another requires <code>ase==3.23</code>. Create one with
        <code>python -m venv myenv</code> and activate it to isolate your
        packages.</p>

        <p><code>pip</code> installs packages from PyPI. Best practice: always work
        inside a venv, pin versions with <code>pip freeze > requirements.txt</code>,
        and recreate environments with <code>pip install -r requirements.txt</code>.
        For complex scientific stacks (RDKit, ORCA Python bindings), consider
        <code>conda</code> which also manages non-Python libraries like MKL and
        CUDA.</p>

        <p><strong>Jupyter notebooks</strong> (<code>.ipynb</code>) combine code,
        output, and markdown in a single document — ideal for exploratory analysis
        of calculation results. Run cells interactively, visualize spectra inline,
        and document your analysis alongside the code. For reproducible research,
        pair notebooks with <code>.py</code> scripts: explore in Jupyter, then
        refactor production code into modules.</p>
      `,

      code: `<span class="cm"># ─── Terminal commands (not Python) ───</span>
<span class="cm"># Create a virtual environment</span>
<span class="cm"># $ python -m venv compchem-env</span>
<span class="cm"># $ source compchem-env/bin/activate  (Linux/macOS)</span>
<span class="cm"># $ compchem-env\\Scripts\\activate     (Windows)</span>

<span class="cm"># Install packages in the active venv</span>
<span class="cm"># $ pip install numpy scipy matplotlib ase</span>
<span class="cm"># $ pip install rdkit-pypi  # community RDKit build</span>

<span class="cm"># Pin versions for reproducibility</span>
<span class="cm"># $ pip freeze > requirements.txt</span>
<span class="cm"># $ pip install -r requirements.txt</span>

<span class="cm"># ─── Python: check your environment ───</span>
<span class="kw">import</span> <span class="nm">sys</span>
<span class="fn">print</span>(<span class="nm">sys</span>.<span class="nm">executable</span>)   <span class="cm"># shows which Python is active</span>
<span class="fn">print</span>(<span class="nm">sys</span>.<span class="nm">prefix</span>)       <span class="cm"># venv path if activated</span>

<span class="cm"># Check installed package versions</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="fn">print</span>(<span class="nm">np</span>.<span class="nm">__version__</span>)   <span class="cm"># e.g., "1.26.4"</span>

<span class="cm"># ─── Jupyter magic commands ───</span>
<span class="cm"># %timeit np.dot(a, b)        # benchmark a line</span>
<span class="cm"># %%time                       # time an entire cell</span>
<span class="cm"># %matplotlib inline           # show plots in notebook</span>
<span class="cm"># !pip install package         # install from notebook</span>

<span class="cm"># ─── requirements.txt example ───</span>
<span class="cm"># numpy==1.26.4</span>
<span class="cm"># scipy==1.12.0</span>
<span class="cm"># ase==3.23.0</span>
<span class="cm"># matplotlib==3.8.2</span>`,

      cheatsheet: [
        { syn: 'python -m venv myenv',                desc: 'Create a virtual environment named myenv' },
        { syn: 'source myenv/bin/activate',            desc: 'Activate the venv (Linux/macOS)' },
        { syn: 'pip install package',                  desc: 'Install a package into the active environment' },
        { syn: 'pip install -r requirements.txt',      desc: 'Install all pinned dependencies from a file' },
        { syn: 'pip freeze > requirements.txt',        desc: 'Export current package versions to a file' },
        { syn: 'jupyter notebook',                     desc: 'Launch Jupyter in the current directory' },
        { syn: '%timeit expression',                   desc: 'Jupyter magic: benchmark a single line' },
        { syn: 'sys.executable',                       desc: 'Print path to the active Python interpreter' },
        { syn: 'conda create -n env python=3.11',      desc: 'Create a conda environment with a specific Python' },
        { syn: 'deactivate',                           desc: 'Leave the current virtual environment' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why should you use a virtual environment for a computational chemistry project?',
          opts: [
            'Virtual environments make Python code run faster',
            'They isolate dependencies so different projects can use different package versions',
            'They automatically install all required packages',
            'They are required by Jupyter notebooks'
          ],
          answer: 1,
          feedback: 'Virtual environments keep each project\'s packages separate. One project can use <code>ase==3.22</code> while another uses <code>ase==3.23</code> without conflict.'
        },
        {
          type: 'fill',
          q: 'Export your current environment\'s packages and versions to a file:',
          pre: 'pip ___ > requirements.txt',
          answer: 'freeze',
          feedback: '<code>pip freeze</code> outputs every installed package and its exact version, which you redirect to a file for reproducibility.'
        },
        {
          type: 'challenge',
          q: 'Write a <code>requirements.txt</code> file for a computational chemistry project that needs NumPy 1.26+, SciPy 1.12+, ASE 3.23+, Matplotlib 3.8+, and RDKit. Use the <code>>=</code> syntax for minimum versions. Then write a Python snippet that imports each package and prints its version.',
          hint: 'Each line: package>=version. Use pkg.__version__ for each import.',
          answer: `# requirements.txt
# numpy>=1.26.0
# scipy>=1.12.0
# ase>=3.23.0
# matplotlib>=3.8.0
# rdkit-pypi>=2023.9.1

import numpy, scipy, ase, matplotlib
for pkg in [numpy, scipy, ase, matplotlib]:
    print(f"{pkg.__name__}: {pkg.__version__}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — venv', url: 'https://docs.python.org/3/library/venv.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Jupyter Documentation', url: 'https://jupyter.org/documentation', tag: 'docs', tagColor: 'blue' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  NUMPY
    // ════════════════════════════════════════════════════════
    {
      id:   'numpy',
      name: 'NumPy',
      desc: 'N-dimensional arrays for atomic coordinates, matrices, and vectorized math',

      explanation: `
        <p><strong>NumPy</strong> is the foundation of scientific Python. Its core
        object, the <code>ndarray</code>, stores homogeneous numerical data in
        contiguous memory — orders of magnitude faster than Python lists for
        element-wise math. In computational chemistry, you represent atomic
        coordinates as <code>(N, 3)</code> arrays, overlap matrices as
        <code>(N, N)</code> arrays, and batch energies as 1D vectors.</p>

        <p><strong>Vectorized operations</strong> apply math to entire arrays
        without explicit loops: <code>coords * 0.529177</code> converts all
        coordinates from bohr to angstrom in one call. <strong>Broadcasting</strong>
        lets arrays with different shapes combine automatically — subtracting a
        <code>(3,)</code> centroid from an <code>(N, 3)</code> coordinate array
        centers the molecule without a loop.</p>

        <p><strong>Linear algebra</strong> routines in <code>np.linalg</code>
        handle matrix operations central to quantum chemistry:
        <code>np.linalg.eigh</code> diagonalizes symmetric Hamiltonian matrices,
        <code>np.linalg.norm</code> computes bond lengths from coordinate
        differences, and <code>np.dot</code> performs matrix multiplication for
        basis set transformations. NumPy also provides <code>np.loadtxt</code>
        and <code>np.savetxt</code> for reading and writing numerical data
        files.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Atomic coordinates for H2O (angstrom)</span>
<span class="nm">coords</span> = <span class="nm">np</span>.<span class="fn">array</span>([
    [<span class="num">0.000</span>, <span class="num">0.000</span>, <span class="num">0.117</span>],   <span class="cm"># O</span>
    [<span class="num">0.000</span>, <span class="num">0.757</span>, <span class="num">-0.469</span>],  <span class="cm"># H</span>
    [<span class="num">0.000</span>, <span class="num">-0.757</span>, <span class="num">-0.469</span>], <span class="cm"># H</span>
])
<span class="fn">print</span>(<span class="nm">coords</span>.<span class="nm">shape</span>)  <span class="cm"># (3, 3) — 3 atoms, 3 dimensions</span>

<span class="cm"># Vectorized unit conversion: angstrom → bohr</span>
<span class="nm">coords_bohr</span> = <span class="nm">coords</span> <span class="op">/</span> <span class="num">0.529177</span>

<span class="cm"># Bond length via vector subtraction + norm</span>
<span class="nm">oh_vec</span> = <span class="nm">coords</span>[<span class="num">1</span>] <span class="op">-</span> <span class="nm">coords</span>[<span class="num">0</span>]
<span class="nm">oh_dist</span> = <span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">norm</span>(<span class="nm">oh_vec</span>)  <span class="cm"># ~0.969 Å</span>

<span class="cm"># Broadcasting: center molecule at origin</span>
<span class="nm">centroid</span> = <span class="nm">coords</span>.<span class="fn">mean</span>(<span class="nm">axis</span>=<span class="num">0</span>)
<span class="nm">centered</span> = <span class="nm">coords</span> <span class="op">-</span> <span class="nm">centroid</span>   <span class="cm"># (3,3) - (3,) broadcasts</span>

<span class="cm"># Diagonalize a symmetric matrix (e.g., Hessian)</span>
<span class="nm">hessian</span> = <span class="nm">np</span>.<span class="fn">array</span>([[<span class="num">0.58</span>, <span class="num">-0.12</span>],
                    [<span class="num">-0.12</span>, <span class="num">0.45</span>]])
<span class="nm">eigenvalues</span>, <span class="nm">eigenvectors</span> = <span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">eigh</span>(<span class="nm">hessian</span>)

<span class="cm"># Batch energies: vectorized statistics</span>
<span class="nm">energies</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">-76.402</span>, <span class="num">-76.398</span>, <span class="num">-76.405</span>, <span class="num">-76.401</span>])
<span class="fn">print</span>(<span class="st">f"Mean: <span class="nm">{energies.mean():.3f}</span> ± <span class="nm">{energies.std():.3f}</span> Ha"</span>)`,

      cheatsheet: [
        { syn: 'np.array([[1,2],[3,4]])',         desc: 'Create an ndarray from nested lists' },
        { syn: 'np.zeros((N, 3))',                desc: 'N×3 array of zeros (e.g., for coordinates)' },
        { syn: 'np.linspace(0.5, 2.0, 50)',       desc: '50 evenly spaced points — for PES scans' },
        { syn: 'arr.shape, arr.dtype',            desc: 'Array dimensions and element type' },
        { syn: 'arr[0, :] / arr[:, 1]',           desc: 'Row / column slicing' },
        { syn: 'np.linalg.norm(v)',               desc: 'Vector magnitude — bond length from Δcoords' },
        { syn: 'np.linalg.eigh(M)',               desc: 'Eigenvalues/vectors of symmetric matrix' },
        { syn: 'np.dot(A, B) / A @ B',            desc: 'Matrix multiplication' },
        { syn: 'arr.mean(axis=0)',                 desc: 'Column-wise mean — centroid of coordinates' },
        { syn: 'np.loadtxt("data.csv")',           desc: 'Read numerical data from a text file' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>coords.mean(axis=0)</code> compute for a <code>(N, 3)</code> coordinate array?',
          opts: [
            'The mean of all N×3 elements (a single number)',
            'The mean of each atom\'s x, y, z (N values)',
            'The centroid — mean x, mean y, mean z (3 values)',
            'The standard deviation along each column'
          ],
          answer: 2,
          feedback: '<code>axis=0</code> averages down each column, producing a shape <code>(3,)</code> array — the x, y, z coordinates of the molecular centroid.'
        },
        {
          type: 'fill',
          q: 'Compute the distance between two atoms from their coordinate difference vector:',
          pre: 'diff = coords[1] - coords[0]\ndistance = np.linalg.___(diff)',
          answer: 'norm',
          feedback: '<code>np.linalg.norm()</code> computes the Euclidean length of a vector, which gives the interatomic distance in the same units as the coordinates.'
        },
        {
          type: 'challenge',
          q: 'Given an (N, 3) NumPy array of atomic coordinates in angstrom, write a function <code>distance_matrix(coords)</code> that returns an (N, N) array where element [i, j] is the distance between atoms i and j. Use broadcasting (no loops). Test it on H2O coordinates.',
          hint: 'Compute diff = coords[:, np.newaxis, :] - coords[np.newaxis, :, :] to get an (N, N, 3) array, then np.linalg.norm along axis=2.',
          answer: `import numpy as np

def distance_matrix(coords):
    diff = coords[:, np.newaxis, :] - coords[np.newaxis, :, :]
    return np.linalg.norm(diff, axis=2)

h2o = np.array([[0.0, 0.0, 0.117], [0.0, 0.757, -0.469], [0.0, -0.757, -0.469]])
print(distance_matrix(h2o))  # 3x3 symmetric matrix`
        }
      ],

      resources: [
        { icon: '📘', title: 'NumPy Documentation', url: 'https://numpy.org/doc/stable/', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'NumPy Quickstart Tutorial', url: 'https://numpy.org/doc/stable/user/quickstart.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '📓', title: 'SciComp for Chemists: NumPy', url: 'https://weisscharlesj.github.io/SciCompforChemists/notebooks/introduction/intro.html', tag: 'textbook', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  PANDAS
    // ════════════════════════════════════════════════════════
    {
      id:   'pandas',
      name: 'Pandas',
      desc: 'Tabular data analysis for reaction benchmarks, screening results, and properties',

      explanation: `
        <p><strong>Pandas</strong> provides the <code>DataFrame</code> — a labeled,
        column-oriented table ideal for structured chemical data. Each column can
        hold a different type: strings for molecule names, floats for energies,
        booleans for convergence flags. Load data with <code>pd.read_csv()</code>,
        explore with <code>.head()</code>, <code>.describe()</code>, and
        <code>.info()</code>, and filter with boolean indexing.</p>

        <p><strong>Indexing</strong> uses <code>.loc[]</code> for label-based access
        and <code>.iloc[]</code> for position-based access. Boolean masks are the
        workhorse for filtering: <code>df[df["converged"] == True]</code> keeps only
        converged calculations. <strong>GroupBy</strong> splits data by a categorical
        column (solvent, method, metal center), applies an aggregate function, and
        combines the results — perfect for comparing mean barriers across catalysts.</p>

        <p><strong>Method chaining</strong> keeps analysis readable:
        <code>df.query("converged").groupby("method")["energy"].mean()</code>
        filters, groups, selects, and aggregates in a single expression. Pandas
        integrates directly with Matplotlib for plotting and with NumPy for
        vectorized column math. Save results with <code>.to_csv()</code>.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>

<span class="cm"># Load the reaction benchmark dataset</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">"datasets/reaction_benchmark.csv"</span>)
<span class="fn">print</span>(<span class="nm">df</span>.<span class="fn">head</span>())     <span class="cm"># first 5 rows</span>
<span class="fn">print</span>(<span class="nm">df</span>.<span class="fn">describe</span>()) <span class="cm"># summary statistics</span>

<span class="cm"># Boolean filtering: converged calculations only</span>
<span class="nm">good</span> = <span class="nm">df</span>[<span class="nm">df</span>[<span class="st">"converged"</span>] <span class="op">==</span> <span class="kw">True</span>]

<span class="cm"># Select and compute: ΔG‡ in kcal/mol column</span>
<span class="nm">barriers</span> = <span class="nm">df</span>[<span class="st">"delta_G_act_kcal"</span>]
<span class="fn">print</span>(<span class="st">f"Mean barrier: <span class="nm">{barriers.mean():.1f}</span> kcal/mol"</span>)

<span class="cm"># GroupBy: average barrier by metal center</span>
<span class="nm">by_metal</span> = <span class="nm">df</span>.<span class="fn">groupby</span>(<span class="st">"metal"</span>)[<span class="st">"delta_G_act_kcal"</span>].<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="nm">by_metal</span>.<span class="fn">sort_values</span>())

<span class="cm"># Method chaining: filter → group → aggregate</span>
<span class="nm">result</span> = (<span class="nm">df</span>
    .<span class="fn">query</span>(<span class="st">"converged and temperature_K == 298"</span>)
    .<span class="fn">groupby</span>(<span class="st">"solvent"</span>)[<span class="st">"yield_pct"</span>]
    .<span class="fn">mean</span>()
    .<span class="fn">sort_values</span>(<span class="nm">ascending</span>=<span class="kw">False</span>))

<span class="cm"># Add a computed column</span>
<span class="nm">df</span>[<span class="st">"selectivity"</span>] = <span class="nm">df</span>[<span class="st">"yield_pct"</span>] <span class="op">/</span> <span class="nm">df</span>[<span class="st">"delta_G_act_kcal"</span>]

<span class="cm"># Save filtered results</span>
<span class="nm">good</span>.<span class="fn">to_csv</span>(<span class="st">"converged_results.csv"</span>, <span class="nm">index</span>=<span class="kw">False</span>)`,

      cheatsheet: [
        { syn: 'pd.read_csv("file.csv")',             desc: 'Load CSV into a DataFrame' },
        { syn: 'df.head() / df.describe()',           desc: 'Preview rows / summary statistics' },
        { syn: 'df["column"]',                        desc: 'Select a single column (returns Series)' },
        { syn: 'df[df["col"] > val]',                 desc: 'Boolean filter — keep rows matching condition' },
        { syn: 'df.loc[row, col]',                    desc: 'Label-based indexing (row/column names)' },
        { syn: 'df.iloc[0:5, 1:3]',                  desc: 'Position-based slicing (row/column indices)' },
        { syn: 'df.groupby("col").mean()',            desc: 'Group by category and aggregate' },
        { syn: 'df.query("col > 10")',                desc: 'Filter rows using a string expression' },
        { syn: 'df.sort_values("col")',               desc: 'Sort by column values' },
        { syn: 'df.to_csv("out.csv", index=False)',   desc: 'Save DataFrame to CSV without row indices' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>df.groupby("metal")["delta_G_act_kcal"].mean()</code> return?',
          opts: [
            'A single float — the global mean barrier',
            'A DataFrame grouped by metal with all columns',
            'A Series with one mean barrier value per metal type',
            'A list of DataFrames, one per metal'
          ],
          answer: 2,
          feedback: '<code>groupby</code> splits the data by metal, selects the barrier column, and <code>.mean()</code> computes the average for each group — returning a Series indexed by metal.'
        },
        {
          type: 'fill',
          q: 'Filter the DataFrame to keep only rows where the calculation converged:',
          pre: 'converged = df[df[___] == True]',
          answer: '"converged"',
          feedback: 'Boolean indexing: <code>df[df["column"] == value]</code> returns rows where the condition is True.'
        },
        {
          type: 'challenge',
          q: 'Load <code>reaction_benchmark.csv</code>, filter to converged calculations at 298 K, group by <code>ligand_type</code>, and compute both the mean and standard deviation of <code>delta_G_act_kcal</code>. Sort by mean barrier ascending. Print the result.',
          hint: 'Use .query() to filter, .groupby().agg() with ["mean", "std"] to compute both statistics.',
          answer: `import pandas as pd

df = pd.read_csv("datasets/reaction_benchmark.csv")
result = (df
    .query("converged and temperature_K == 298")
    .groupby("ligand_type")["delta_G_act_kcal"]
    .agg(["mean", "std"])
    .sort_values("mean"))
print(result)`
        }
      ],

      resources: [
        { icon: '📘', title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: '10 Minutes to Pandas', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '📓', title: 'SciComp for Chemists: Pandas', url: 'https://weisscharlesj.github.io/SciCompforChemists/notebooks/introduction/intro.html', tag: 'textbook', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  MATPLOTLIB
    // ════════════════════════════════════════════════════════
    {
      id:   'matplotlib',
      name: 'Matplotlib',
      desc: 'Plotting potential energy surfaces, spectra, and benchmark comparisons',

      explanation: `
        <p><strong>Matplotlib</strong> is Python's core plotting library. The
        <strong>object-oriented API</strong> — creating <code>fig, ax</code> with
        <code>plt.subplots()</code> — gives you explicit control over every element.
        In computational chemistry you plot potential energy surfaces, IR/UV-Vis
        spectra, convergence curves, and property correlations using
        <code>ax.plot()</code>, <code>ax.scatter()</code>, and
        <code>ax.bar()</code>.</p>

        <p>Every publication-quality figure needs proper <strong>labels</strong>
        (<code>ax.set_xlabel()</code>), <strong>units</strong> in the axis text
        ("Energy (kcal/mol)"), a <strong>legend</strong>, and often a
        <strong>title</strong>. Use <code>ax.set_xlim()</code>/<code>set_ylim()</code>
        to control ranges and <code>fig.savefig("plot.png", dpi=300)</code> for
        high-resolution output.</p>

        <p><strong>Subplots</strong> let you place multiple panels in one figure —
        energy vs. distance on the left, forces on the right. Customize with
        colormaps (<code>plt.cm.viridis</code>) for heatmaps, error bars
        (<code>ax.errorbar()</code>) for uncertainties, and annotations
        (<code>ax.annotate()</code>) to highlight transition states or minima on
        a PES.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">matplotlib.pyplot</span> <span class="kw">as</span> <span class="nm">plt</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Potential energy curve: bond stretch</span>
<span class="nm">r</span> = <span class="nm">np</span>.<span class="fn">linspace</span>(<span class="num">0.5</span>, <span class="num">3.0</span>, <span class="num">100</span>)    <span class="cm"># Å</span>
<span class="nm">D</span>, <span class="nm">a</span>, <span class="nm">r0</span> = <span class="num">0.17</span>, <span class="num">1.93</span>, <span class="num">0.96</span>   <span class="cm"># Morse parameters</span>
<span class="nm">V</span> = <span class="nm">D</span> <span class="op">*</span> (<span class="num">1</span> <span class="op">-</span> <span class="nm">np</span>.<span class="fn">exp</span>(<span class="op">-</span><span class="nm">a</span> <span class="op">*</span> (<span class="nm">r</span> <span class="op">-</span> <span class="nm">r0</span>))) <span class="op">**</span> <span class="num">2</span>

<span class="nm">fig</span>, <span class="nm">ax</span> = <span class="nm">plt</span>.<span class="fn">subplots</span>(<span class="nm">figsize</span>=(<span class="num">6</span>, <span class="num">4</span>))
<span class="nm">ax</span>.<span class="fn">plot</span>(<span class="nm">r</span>, <span class="nm">V</span> <span class="op">*</span> <span class="num">627.509</span>, <span class="nm">color</span>=<span class="st">"steelblue"</span>, <span class="nm">lw</span>=<span class="num">2</span>)
<span class="nm">ax</span>.<span class="fn">set_xlabel</span>(<span class="st">"O–H Distance (Å)"</span>)
<span class="nm">ax</span>.<span class="fn">set_ylabel</span>(<span class="st">"Energy (kcal/mol)"</span>)
<span class="nm">ax</span>.<span class="fn">set_title</span>(<span class="st">"O–H Morse Potential"</span>)
<span class="nm">ax</span>.<span class="fn">axhline</span>(<span class="nm">y</span>=<span class="num">0</span>, <span class="nm">color</span>=<span class="st">"gray"</span>, <span class="nm">ls</span>=<span class="st">"--"</span>, <span class="nm">lw</span>=<span class="num">0.8</span>)

<span class="cm"># Annotate the equilibrium point</span>
<span class="nm">ax</span>.<span class="fn">annotate</span>(<span class="st">"r₀ = 0.96 Å"</span>, <span class="nm">xy</span>=(<span class="num">0.96</span>, <span class="num">0</span>),
            <span class="nm">xytext</span>=(<span class="num">1.5</span>, <span class="num">30</span>), <span class="nm">arrowprops</span>={<span class="st">"arrowstyle"</span>: <span class="st">"->"</span>})

<span class="nm">fig</span>.<span class="fn">tight_layout</span>()
<span class="nm">fig</span>.<span class="fn">savefig</span>(<span class="st">"morse_potential.png"</span>, <span class="nm">dpi</span>=<span class="num">300</span>)
<span class="nm">plt</span>.<span class="fn">show</span>()`,

      cheatsheet: [
        { syn: 'fig, ax = plt.subplots()',            desc: 'Create figure + axes (OO API — preferred)' },
        { syn: 'ax.plot(x, y, "r-")',                 desc: 'Line plot — color and style in format string' },
        { syn: 'ax.scatter(x, y, c=vals, cmap="viridis")', desc: 'Scatter plot with color-mapped values' },
        { syn: 'ax.set_xlabel("Label (unit)")',       desc: 'Set x-axis label — always include units' },
        { syn: 'ax.legend()',                         desc: 'Show legend (uses label= from plot calls)' },
        { syn: 'ax.set_xlim(0, 3)',                   desc: 'Set axis range explicitly' },
        { syn: 'fig, axes = plt.subplots(1, 2)',      desc: 'Multi-panel figure — axes is an array' },
        { syn: 'fig.savefig("fig.png", dpi=300)',     desc: 'Save high-resolution image for publication' },
        { syn: 'ax.errorbar(x, y, yerr=err)',         desc: 'Plot with error bars' },
        { syn: 'ax.annotate("text", xy=(x,y))',       desc: 'Add annotation with optional arrow' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Which approach is preferred for creating publication-quality Matplotlib figures?',
          opts: [
            'plt.plot() followed by plt.xlabel() (pyplot interface)',
            'fig, ax = plt.subplots() then ax.plot(), ax.set_xlabel() (OO interface)',
            'Using only plt.show() with default settings',
            'Matplotlib cannot produce publication-quality figures'
          ],
          answer: 1,
          feedback: 'The object-oriented API (<code>fig, ax = plt.subplots()</code>) gives explicit control over each subplot and is recommended for anything beyond quick exploratory plots.'
        },
        {
          type: 'fill',
          q: 'Save a figure at 300 DPI for publication:',
          pre: 'fig.___(\"figure.png\", dpi=300)',
          answer: 'savefig',
          feedback: '<code>fig.savefig()</code> writes the figure to a file. The <code>dpi</code> parameter controls resolution — 300 is typical for publications.'
        },
        {
          type: 'challenge',
          q: 'Plot a comparison of two methods on the reaction benchmark: load <code>reaction_benchmark.csv</code>, filter to two methods (e.g., B3LYP and CCSD(T)), and create a scatter plot of computed ΔG‡ vs. yield with different colors and markers for each method. Include axis labels with units, a legend, and save at 300 DPI.',
          hint: 'Filter df by method, then ax.scatter() twice with different colors. Use label= for the legend.',
          answer: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("datasets/reaction_benchmark.csv")
fig, ax = plt.subplots(figsize=(7, 5))

for method, marker, color in [("B3LYP", "o", "steelblue"), ("CCSD(T)", "^", "crimson")]:
    sub = df[df["method"] == method]
    ax.scatter(sub["delta_G_act_kcal"], sub["yield_pct"],
               marker=marker, color=color, label=method, alpha=0.7)

ax.set_xlabel("ΔG‡ (kcal/mol)")
ax.set_ylabel("Yield (%)")
ax.set_title("Activation Barrier vs. Yield by Method")
ax.legend()
fig.tight_layout()
fig.savefig("method_comparison.png", dpi=300)`
        }
      ],

      resources: [
        { icon: '📘', title: 'Matplotlib Documentation', url: 'https://matplotlib.org/stable/contents.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Matplotlib Cheat Sheets', url: 'https://matplotlib.org/cheatsheets/', tag: 'reference', tagColor: 'purple' },
        { icon: '📓', title: 'SciComp for Chemists: Visualization', url: 'https://weisscharlesj.github.io/SciCompforChemists/notebooks/introduction/intro.html', tag: 'textbook', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  CLI-TOOLS
    // ════════════════════════════════════════════════════════
    {
      id:   'cli-tools',
      name: 'CLI Tools',
      desc: 'Building command-line scripts with argparse for batch calculations',

      explanation: `
        <p>As your computational chemistry workflows grow, you need
        <strong>command-line interfaces</strong> so scripts can be automated,
        parameterized, and run on HPC clusters. Python's <code>argparse</code>
        module builds CLIs with typed arguments, help text, and validation —
        turning a hard-coded script into a flexible tool:
        <code>python run_calc.py --method B3LYP --basis def2-TZVP h2o.xyz</code>.</p>

        <p>The <code>subprocess</code> module runs external programs from Python —
        essential for launching ORCA, Gaussian, or other codes and capturing their
        output. Combine it with <code>argparse</code> to build submission scripts
        that generate input files and launch calculations with user-specified
        parameters.</p>

        <p>For multi-file workflows, the <code>shutil</code> module copies files
        and creates archives, while <code>logging</code> replaces print statements
        with structured log messages that include timestamps and severity levels.
        A well-built CLI tool with <code>argparse</code> + <code>logging</code> +
        <code>subprocess</code> turns a pile of scripts into a maintainable
        computational chemistry toolkit.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">argparse</span>
<span class="kw">import</span> <span class="nm">subprocess</span>
<span class="kw">import</span> <span class="nm">logging</span>

<span class="cm"># Set up logging</span>
<span class="nm">logging</span>.<span class="fn">basicConfig</span>(<span class="nm">level</span>=<span class="nm">logging</span>.<span class="nm">INFO</span>,
                    <span class="nm">format</span>=<span class="st">"%(asctime)s %(levelname)s %(message)s"</span>)
<span class="nm">log</span> = <span class="nm">logging</span>.<span class="fn">getLogger</span>(<span class="st">"orca_runner"</span>)

<span class="cm"># Build CLI with argparse</span>
<span class="nm">parser</span> = <span class="nm">argparse</span>.<span class="fn">ArgumentParser</span>(
    <span class="nm">description</span>=<span class="st">"Run an ORCA calculation"</span>)
<span class="nm">parser</span>.<span class="fn">add_argument</span>(<span class="st">"xyz_file"</span>, <span class="nm">help</span>=<span class="st">"Path to .xyz input"</span>)
<span class="nm">parser</span>.<span class="fn">add_argument</span>(<span class="st">"--method"</span>, <span class="nm">default</span>=<span class="st">"B3LYP"</span>,
                    <span class="nm">help</span>=<span class="st">"DFT functional (default: B3LYP)"</span>)
<span class="nm">parser</span>.<span class="fn">add_argument</span>(<span class="st">"--basis"</span>, <span class="nm">default</span>=<span class="st">"def2-SVP"</span>,
                    <span class="nm">help</span>=<span class="st">"Basis set (default: def2-SVP)"</span>)
<span class="nm">parser</span>.<span class="fn">add_argument</span>(<span class="st">"--nprocs"</span>, <span class="nm">type</span>=<span class="fn">int</span>, <span class="nm">default</span>=<span class="num">4</span>,
                    <span class="nm">help</span>=<span class="st">"Number of CPU cores"</span>)

<span class="nm">args</span> = <span class="nm">parser</span>.<span class="fn">parse_args</span>()
<span class="nm">log</span>.<span class="fn">info</span>(<span class="st">f"Running <span class="nm">{args.method}</span>/<span class="nm">{args.basis}</span> on <span class="nm">{args.xyz_file}</span>"</span>)

<span class="cm"># subprocess: run an external command</span>
<span class="cm"># result = subprocess.run(</span>
<span class="cm">#     ["orca", "input.inp"],</span>
<span class="cm">#     capture_output=True, text=True, check=True)</span>
<span class="cm"># log.info(f"ORCA finished: {result.returncode}")</span>`,

      cheatsheet: [
        { syn: 'parser = argparse.ArgumentParser()',  desc: 'Create a CLI argument parser' },
        { syn: 'parser.add_argument("pos")',          desc: 'Add a required positional argument' },
        { syn: 'parser.add_argument("--opt")',        desc: 'Add an optional flag argument' },
        { syn: 'parser.add_argument("-n", type=int)', desc: 'Typed argument — auto-converts and validates' },
        { syn: 'args = parser.parse_args()',          desc: 'Parse sys.argv and return namespace object' },
        { syn: 'subprocess.run(["cmd", "arg"])',      desc: 'Run an external command and wait for it' },
        { syn: 'capture_output=True, text=True',      desc: 'Capture stdout/stderr as strings' },
        { syn: 'logging.info("message")',             desc: 'Log at INFO level with timestamp' },
        { syn: 'shutil.copy(src, dst)',               desc: 'Copy a file — useful for archiving inputs' },
        { syn: 'if __name__ == "__main__":',          desc: 'Guard: CLI entry point runs only when executed directly' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>parser.add_argument("--nprocs", type=int, default=4)</code> create?',
          opts: [
            'A required argument that must be an integer',
            'An optional flag that defaults to 4 if not provided',
            'A boolean flag that is True when --nprocs is present',
            'An argument that accepts exactly 4 values'
          ],
          answer: 1,
          feedback: 'The <code>--</code> prefix makes it optional, <code>type=int</code> converts the input to an integer, and <code>default=4</code> is used when the flag is omitted.'
        },
        {
          type: 'fill',
          q: 'Run an external command and capture its output as a string:',
          pre: 'result = subprocess.___(["orca", "h2o.inp"], capture_output=True, text=True)',
          answer: 'run',
          feedback: '<code>subprocess.run()</code> executes a command and waits for completion. <code>capture_output=True</code> captures stdout and stderr.'
        },
        {
          type: 'challenge',
          q: 'Build a CLI tool <code>convert_energies.py</code> that reads a text file containing one energy (in hartree) per line, converts all values to kcal/mol, and writes the results to an output file. Use <code>argparse</code> for input/output paths and an optional <code>--unit</code> flag (choices: "kcal", "ev", "kj") with a default of "kcal". Include logging for each step.',
          hint: 'add_argument("--unit", choices=["kcal","ev","kj"], default="kcal"). Use a dict mapping unit names to conversion factors.',
          answer: `import argparse
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

parser = argparse.ArgumentParser(description="Convert energies from hartree")
parser.add_argument("input", help="Input file (one energy/line in Ha)")
parser.add_argument("output", help="Output file path")
parser.add_argument("--unit", choices=["kcal", "ev", "kj"], default="kcal")
args = parser.parse_args()

factors = {"kcal": 627.509, "ev": 27.2114, "kj": 2625.50}
factor = factors[args.unit]

with open(args.input) as f:
    energies = [float(line) * factor for line in f if line.strip()]
logging.info(f"Converted {len(energies)} values to {args.unit}")

with open(args.output, "w") as f:
    for e in energies:
        f.write(f"{e:.4f}\\n")
logging.info(f"Written to {args.output}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — argparse', url: 'https://docs.python.org/3/library/argparse.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — argparse Tutorial', url: 'https://realpython.com/command-line-interfaces-python-argparse/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

  ],
};
