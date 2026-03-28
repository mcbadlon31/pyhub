/**
 * data/ml/01-math-foundations.js
 * Stage 01: Math Foundations
 * Topics: lin-alg,stats-prob,calculus-gradients
 *
 * All challenge exercises use computational chemistry / materials science context.
 * Code line limits: ML 1-4 = 20–50 lines per topic.
 */

window.ML_S1 = {
  id: 'ml-s1', num: '01', title: 'Math Foundations',
  color: 'pink', meta: '~1 week', track: 'ml',
  topics: [

    // ════════════════════════════════════════════════════════
    //  LIN-ALG
    // ════════════════════════════════════════════════════════
    {
      id:   'lin-alg',
      name: 'Linear Algebra',
      desc: 'Vectors, matrices, and eigenvalues for molecular representations and quantum chemistry',

      explanation: `
        <p><strong>Linear algebra</strong> is the mathematical backbone of both
        quantum chemistry and machine learning. Atomic coordinates are
        <strong>vectors</strong> in ℝ³, overlap and Fock matrices are
        <strong>symmetric matrices</strong>, and solving the Schrödinger equation
        reduces to an <strong>eigenvalue problem</strong>: Hψ = Eψ. In ML, feature
        matrices are (samples × features) arrays, and PCA finds principal
        components via eigendecomposition.</p>

        <p><strong>Matrix multiplication</strong> combines transformations: rotating
        a molecule is multiplying its coordinate matrix by a rotation matrix.
        The <strong>dot product</strong> measures similarity between vectors — two
        molecular fingerprints with a high dot product represent similar molecules.
        <strong>Matrix inversion</strong> solves linear systems, and the
        <strong>determinant</strong> tells you if a system has a unique solution.</p>

        <p><strong>Eigendecomposition</strong> of a symmetric matrix A = QΛQ⁻¹
        reveals its principal axes and magnitudes. In quantum chemistry, eigenvalues
        of the Hamiltonian are energy levels; eigenvectors are molecular orbitals.
        In ML, eigenvalues of the covariance matrix tell you which features carry
        the most variance (PCA). NumPy's <code>np.linalg</code> handles all of
        these efficiently.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Vectors: atomic positions in 3D</span>
<span class="nm">O</span>  = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">0.000</span>, <span class="num">0.000</span>, <span class="num">0.117</span>])
<span class="nm">H1</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">0.000</span>, <span class="num">0.757</span>, <span class="num">-0.469</span>])

<span class="cm"># Vector operations: bond vector, length, angle</span>
<span class="nm">bond_vec</span> = <span class="nm">H1</span> <span class="op">-</span> <span class="nm">O</span>
<span class="nm">bond_len</span> = <span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">norm</span>(<span class="nm">bond_vec</span>)  <span class="cm"># 0.969 Å</span>

<span class="cm"># Dot product: similarity between molecular fingerprints</span>
<span class="nm">fp_a</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>])
<span class="nm">fp_b</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>])
<span class="nm">similarity</span> = <span class="nm">np</span>.<span class="fn">dot</span>(<span class="nm">fp_a</span>, <span class="nm">fp_b</span>) <span class="op">/</span> (<span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">norm</span>(<span class="nm">fp_a</span>) <span class="op">*</span> <span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">norm</span>(<span class="nm">fp_b</span>))

<span class="cm"># Matrix multiplication: rotate coordinates</span>
<span class="nm">theta</span> = <span class="nm">np</span>.<span class="fn">radians</span>(<span class="num">90</span>)
<span class="nm">R</span> = <span class="nm">np</span>.<span class="fn">array</span>([[<span class="nm">np</span>.<span class="fn">cos</span>(<span class="nm">theta</span>), <span class="op">-</span><span class="nm">np</span>.<span class="fn">sin</span>(<span class="nm">theta</span>)],
              [<span class="nm">np</span>.<span class="fn">sin</span>(<span class="nm">theta</span>),  <span class="nm">np</span>.<span class="fn">cos</span>(<span class="nm">theta</span>)]])
<span class="nm">point</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">1.0</span>, <span class="num">0.0</span>])
<span class="nm">rotated</span> = <span class="nm">R</span> <span class="op">@</span> <span class="nm">point</span>  <span class="cm"># [0, 1] — 90° rotation</span>

<span class="cm"># Eigendecomposition: diagonalize a Hamiltonian-like matrix</span>
<span class="nm">H</span> = <span class="nm">np</span>.<span class="fn">array</span>([
    [<span class="num">-13.6</span>, <span class="num">-1.2</span>],   <span class="cm"># diagonal: orbital energies (eV)</span>
    [<span class="num">-1.2</span>,  <span class="num">-3.4</span>]])  <span class="cm"># off-diagonal: coupling</span>
<span class="nm">eigenvalues</span>, <span class="nm">eigenvectors</span> = <span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">eigh</span>(<span class="nm">H</span>)
<span class="fn">print</span>(<span class="st">f"Energy levels: <span class="nm">{eigenvalues}</span> eV"</span>)  <span class="cm"># bonding, antibonding</span>

<span class="cm"># Solve linear system: AX = B (e.g., least-squares fit)</span>
<span class="nm">A</span> = <span class="nm">np</span>.<span class="fn">array</span>([[<span class="num">1</span>, <span class="num">1</span>], [<span class="num">1</span>, <span class="num">2</span>], [<span class="num">1</span>, <span class="num">3</span>]])
<span class="nm">b</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">-76.40</span>, <span class="num">-76.38</span>, <span class="num">-76.35</span>])
<span class="nm">x</span>, <span class="nm">_</span>, <span class="nm">_</span>, <span class="nm">_</span> = <span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">lstsq</span>(<span class="nm">A</span>, <span class="nm">b</span>, <span class="nm">rcond</span>=<span class="kw">None</span>)  <span class="cm"># linear fit</span>`,

      cheatsheet: [
        { syn: 'np.dot(a, b) / a @ b',           desc: 'Dot product / matrix multiplication' },
        { syn: 'np.linalg.norm(v)',               desc: 'Vector magnitude (L2 norm) — bond length' },
        { syn: 'np.linalg.eigh(M)',               desc: 'Eigenvalues + eigenvectors of symmetric matrix' },
        { syn: 'np.linalg.inv(M)',                desc: 'Matrix inverse — use only when truly needed' },
        { syn: 'np.linalg.det(M)',                desc: 'Determinant — zero means singular (no inverse)' },
        { syn: 'np.linalg.lstsq(A, b)',           desc: 'Least-squares solution to Ax = b' },
        { syn: 'np.linalg.svd(M)',                desc: 'Singular value decomposition' },
        { syn: 'M.T / M.transpose()',             desc: 'Matrix transpose' },
        { syn: 'np.eye(n)',                       desc: 'n×n identity matrix' },
        { syn: 'np.outer(a, b)',                  desc: 'Outer product — rank-1 matrix from two vectors' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What do the eigenvalues of the Hamiltonian matrix represent in quantum chemistry?',
          opts: [
            'Atomic positions',
            'Energy levels of the system',
            'Bond lengths between atoms',
            'Electron spin values'
          ],
          answer: 1,
          feedback: 'The eigenvalue equation Hψ = Eψ gives energy levels (E) as eigenvalues and molecular orbitals (ψ) as eigenvectors.'
        },
        {
          type: 'fill',
          q: 'Compute the bond length from a displacement vector:',
          pre: 'bond_vec = H_pos - O_pos\nbond_length = np.linalg.___(bond_vec)',
          answer: 'norm',
          feedback: '<code>np.linalg.norm()</code> computes the Euclidean (L2) norm of a vector, which gives the distance between two points.'
        },
        {
          type: 'challenge',
          q: 'Given a (3, 3) Hessian matrix (second derivatives of energy w.r.t. coordinates), compute its eigenvalues (vibrational frequencies squared) and eigenvectors (normal modes) using NumPy. Then sort the modes by frequency (ascending eigenvalue). Test with a sample Hessian: [[0.58, -0.12, 0.0], [-0.12, 0.45, -0.08], [0.0, -0.08, 0.32]].',
          hint: 'Use np.linalg.eigh for symmetric matrices. np.argsort on eigenvalues gives the sorting order.',
          answer: `import numpy as np

hessian = np.array([
    [0.58, -0.12, 0.0],
    [-0.12, 0.45, -0.08],
    [0.0, -0.08, 0.32]])

eigenvalues, eigenvectors = np.linalg.eigh(hessian)
order = np.argsort(eigenvalues)
sorted_freqs = eigenvalues[order]
sorted_modes = eigenvectors[:, order]

for i, (freq, mode) in enumerate(zip(sorted_freqs, sorted_modes.T)):
    print(f"Mode {i}: freq²={freq:.4f}, direction={mode.round(3)}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'NumPy Linear Algebra', url: 'https://numpy.org/doc/stable/reference/routines.linalg.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: '3Blue1Brown — Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra', tag: 'video', tagColor: 'red' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  STATS-PROB
    // ════════════════════════════════════════════════════════
    {
      id:   'stats-prob',
      name: 'Statistics & Probability',
      desc: 'Distributions, hypothesis testing, and Bayesian reasoning for molecular data',

      explanation: `
        <p><strong>Descriptive statistics</strong> summarize data: mean, median,
        standard deviation, and percentiles. For computational chemistry, these
        quantify the spread of energies across conformers, the reproducibility
        of MD simulations, and the error distribution of ML model predictions.
        Always report uncertainties — a mean energy without its standard
        deviation is incomplete.</p>

        <p><strong>Probability distributions</strong> model randomness: the
        <strong>normal distribution</strong> describes DFT energy errors, the
        <strong>Boltzmann distribution</strong> gives population weights at
        thermal equilibrium, and the <strong>Poisson distribution</strong> models
        rare events like reaction occurrences. Understanding these is essential
        for interpreting ML model outputs and designing experiments.</p>

        <p><strong>Hypothesis testing</strong> asks: "Is the difference between
        two methods statistically significant?" A t-test compares mean energies
        from two DFT functionals. The <strong>p-value</strong> is the probability
        of observing data this extreme if the null hypothesis (no difference) is
        true. <strong>Bayesian reasoning</strong> updates beliefs given new
        evidence — central to active learning for MLIPs.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">scipy</span> <span class="kw">import</span> <span class="nm">stats</span>

<span class="cm"># Descriptive stats: DFT energy predictions</span>
<span class="nm">errors_kcal</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">0.8</span>, <span class="num">-1.2</span>, <span class="num">0.3</span>, <span class="num">-0.5</span>, <span class="num">1.1</span>, <span class="num">-0.9</span>, <span class="num">0.6</span>, <span class="num">-0.2</span>])
<span class="fn">print</span>(<span class="st">f"Mean error: <span class="nm">{np.mean(errors_kcal):.2f}</span> kcal/mol"</span>)
<span class="fn">print</span>(<span class="st">f"Std dev:    <span class="nm">{np.std(errors_kcal, ddof=1):.2f}</span> kcal/mol"</span>)
<span class="fn">print</span>(<span class="st">f"MAE:        <span class="nm">{np.mean(np.abs(errors_kcal)):.2f}</span> kcal/mol"</span>)

<span class="cm"># Normal distribution: model error distribution</span>
<span class="nm">mu</span>, <span class="nm">sigma</span> = <span class="nm">np</span>.<span class="fn">mean</span>(<span class="nm">errors_kcal</span>), <span class="nm">np</span>.<span class="fn">std</span>(<span class="nm">errors_kcal</span>, <span class="nm">ddof</span>=<span class="num">1</span>)
<span class="nm">dist</span> = <span class="nm">stats</span>.<span class="fn">norm</span>(<span class="nm">loc</span>=<span class="nm">mu</span>, <span class="nm">scale</span>=<span class="nm">sigma</span>)
<span class="fn">print</span>(<span class="st">f"P(error &lt; 1.0): <span class="nm">{dist.cdf(1.0):.3f}</span>"</span>)

<span class="cm"># Boltzmann weights at 298 K</span>
<span class="nm">kT</span> = <span class="num">0.593</span>  <span class="cm"># kcal/mol at 298 K</span>
<span class="nm">rel_energies</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">0.0</span>, <span class="num">0.8</span>, <span class="num">1.5</span>, <span class="num">2.3</span>])  <span class="cm"># kcal/mol</span>
<span class="nm">weights</span> = <span class="nm">np</span>.<span class="fn">exp</span>(<span class="op">-</span><span class="nm">rel_energies</span> <span class="op">/</span> <span class="nm">kT</span>)
<span class="nm">populations</span> = <span class="nm">weights</span> <span class="op">/</span> <span class="nm">weights</span>.<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="st">f"Conformer populations: <span class="nm">{populations.round(3)}</span>"</span>)

<span class="cm"># Hypothesis test: are two methods' energies different?</span>
<span class="nm">method_a</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">-76.40</span>, <span class="num">-76.38</span>, <span class="num">-76.41</span>, <span class="num">-76.39</span>])
<span class="nm">method_b</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">-76.35</span>, <span class="num">-76.33</span>, <span class="num">-76.36</span>, <span class="num">-76.34</span>])
<span class="nm">t_stat</span>, <span class="nm">p_value</span> = <span class="nm">stats</span>.<span class="fn">ttest_ind</span>(<span class="nm">method_a</span>, <span class="nm">method_b</span>)
<span class="fn">print</span>(<span class="st">f"t={t_stat:.2f}, p={p_value:.4f}"</span>)

<span class="cm"># Correlation: do barrier and yield correlate?</span>
<span class="nm">barriers</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">15.3</span>, <span class="num">8.7</span>, <span class="num">22.1</span>, <span class="num">12.5</span>, <span class="num">18.9</span>])
<span class="nm">yields</span>   = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">45.0</span>, <span class="num">82.0</span>, <span class="num">23.0</span>, <span class="num">67.0</span>, <span class="num">31.0</span>])
<span class="nm">r</span>, <span class="nm">p</span> = <span class="nm">stats</span>.<span class="fn">pearsonr</span>(<span class="nm">barriers</span>, <span class="nm">yields</span>)
<span class="fn">print</span>(<span class="st">f"Pearson r={r:.3f}, p={p:.4f}"</span>)`,

      cheatsheet: [
        { syn: 'np.mean(x) / np.median(x)',         desc: 'Central tendency measures' },
        { syn: 'np.std(x, ddof=1)',                  desc: 'Sample standard deviation (Bessel correction)' },
        { syn: 'np.percentile(x, [25, 50, 75])',     desc: 'Quartiles — useful for distribution summaries' },
        { syn: 'stats.norm(loc=μ, scale=σ)',         desc: 'Normal distribution object' },
        { syn: 'dist.cdf(x) / dist.ppf(q)',         desc: 'Cumulative probability / quantile function' },
        { syn: 'stats.ttest_ind(a, b)',              desc: 'Two-sample t-test — compare group means' },
        { syn: 'stats.pearsonr(x, y)',               desc: 'Pearson correlation coefficient and p-value' },
        { syn: 'np.exp(-E / kT)',                    desc: 'Boltzmann weight for energy E at temperature T' },
        { syn: 'np.random.normal(μ, σ, n)',          desc: 'Sample n values from normal distribution' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does a p-value of 0.03 from a t-test comparing two DFT methods mean?',
          opts: [
            'There is a 3% chance that method A is better',
            'The methods give identical results with 3% probability',
            'If the methods were truly equivalent, there is a 3% chance of seeing this large a difference by random variation',
            'Method A is 3% more accurate than method B'
          ],
          answer: 2,
          feedback: 'The p-value is the probability of observing a difference this extreme under the null hypothesis (no true difference). A small p-value (< 0.05) suggests the difference is statistically significant.'
        },
        {
          type: 'fill',
          q: 'Compute the sample standard deviation with Bessel\'s correction:',
          pre: 'std = np.std(energies, ___=1)',
          answer: 'ddof',
          feedback: '<code>ddof=1</code> (degrees of freedom) applies Bessel\'s correction, dividing by (n-1) instead of n for unbiased sample variance.'
        },
        {
          type: 'challenge',
          q: 'Given conformer relative energies in kcal/mol, compute Boltzmann populations at a given temperature. Write a function <code>boltzmann_populations(energies_kcal, temp_K)</code> that returns normalized weights. Use R = 1.987e-3 kcal/(mol·K). Test at 298 K and 500 K to show how temperature affects populations.',
          hint: 'kT = R * T. weights = exp(-E / kT). Normalize by dividing by sum.',
          answer: `import numpy as np

def boltzmann_populations(energies_kcal, temp_K):
    R = 1.987e-3  # kcal/(mol·K)
    kT = R * temp_K
    weights = np.exp(-np.array(energies_kcal) / kT)
    return weights / weights.sum()

energies = [0.0, 0.5, 1.0, 2.0]
print("298 K:", boltzmann_populations(energies, 298).round(3))
print("500 K:", boltzmann_populations(energies, 500).round(3))`
        }
      ],

      resources: [
        { icon: '📘', title: 'SciPy Statistics', url: 'https://docs.scipy.org/doc/scipy/reference/stats.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: '3Blue1Brown — Probability', url: 'https://www.3blue1brown.com/topics/probability', tag: 'video', tagColor: 'red' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  CALCULUS-GRADIENTS
    // ════════════════════════════════════════════════════════
    {
      id:   'calculus-gradients',
      name: 'Calculus & Gradients',
      desc: 'Derivatives, gradients, and optimization for energy minimization and ML training',

      explanation: `
        <p>The <strong>derivative</strong> measures the rate of change of a function.
        In computational chemistry, forces are the negative gradient of energy with
        respect to atomic positions: F = −∇E. In machine learning, the gradient of
        the loss function tells you which direction to adjust model parameters to
        reduce prediction error. Both domains rely on the same calculus.</p>

        <p><strong>Gradient descent</strong> is the core optimization algorithm in
        ML: compute the gradient of the loss, step in the opposite direction by a
        <strong>learning rate</strong> α, and repeat. The update rule is
        θ_new = θ - α · ∇L(θ). Too large a step overshoots; too small crawls.
        This is exactly analogous to geometry optimization in quantum chemistry,
        where atoms are moved along the energy gradient toward a minimum.</p>

        <p>The <strong>chain rule</strong> is fundamental to backpropagation in
        neural networks: ∂L/∂w = (∂L/∂y)(∂y/∂w). Numerically, you can approximate
        derivatives with <strong>finite differences</strong>:
        f'(x) ≈ (f(x+h) − f(x−h)) / 2h. In practice, automatic differentiation
        (autograd in PyTorch) computes exact gradients efficiently.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Numerical derivative: finite differences</span>
<span class="kw">def</span> <span class="fn">numerical_gradient</span>(<span class="nm">f</span>, <span class="nm">x</span>, <span class="nm">h</span>=<span class="num">1e-5</span>):
    <span class="st">"""Central finite difference approximation of f'(x)."""</span>
    <span class="kw">return</span> (<span class="nm">f</span>(<span class="nm">x</span> <span class="op">+</span> <span class="nm">h</span>) <span class="op">-</span> <span class="nm">f</span>(<span class="nm">x</span> <span class="op">-</span> <span class="nm">h</span>)) <span class="op">/</span> (<span class="num">2</span> <span class="op">*</span> <span class="nm">h</span>)

<span class="cm"># Morse potential and its analytical gradient (force)</span>
<span class="kw">def</span> <span class="fn">morse</span>(<span class="nm">r</span>, <span class="nm">D</span>=<span class="num">0.17</span>, <span class="nm">a</span>=<span class="num">1.93</span>, <span class="nm">r0</span>=<span class="num">0.96</span>):
    <span class="kw">return</span> <span class="nm">D</span> <span class="op">*</span> (<span class="num">1</span> <span class="op">-</span> <span class="nm">np</span>.<span class="fn">exp</span>(<span class="op">-</span><span class="nm">a</span> <span class="op">*</span> (<span class="nm">r</span> <span class="op">-</span> <span class="nm">r0</span>))) <span class="op">**</span> <span class="num">2</span>

<span class="kw">def</span> <span class="fn">morse_force</span>(<span class="nm">r</span>, <span class="nm">D</span>=<span class="num">0.17</span>, <span class="nm">a</span>=<span class="num">1.93</span>, <span class="nm">r0</span>=<span class="num">0.96</span>):
    <span class="st">"""F = -dV/dr for Morse potential."""</span>
    <span class="kw">return</span> <span class="op">-</span><span class="num">2</span> <span class="op">*</span> <span class="nm">D</span> <span class="op">*</span> <span class="nm">a</span> <span class="op">*</span> (<span class="num">1</span> <span class="op">-</span> <span class="nm">np</span>.<span class="fn">exp</span>(<span class="op">-</span><span class="nm">a</span> <span class="op">*</span> (<span class="nm">r</span> <span class="op">-</span> <span class="nm">r0</span>))) <span class="op">*</span> <span class="nm">np</span>.<span class="fn">exp</span>(<span class="op">-</span><span class="nm">a</span> <span class="op">*</span> (<span class="nm">r</span> <span class="op">-</span> <span class="nm">r0</span>))

<span class="cm"># Compare numerical vs analytical force at r = 1.2 Å</span>
<span class="nm">r</span> = <span class="num">1.2</span>
<span class="fn">print</span>(<span class="st">f"Numerical: <span class="nm">{numerical_gradient(morse, r):.6f}</span>"</span>)
<span class="fn">print</span>(<span class="st">f"Analytical: <span class="nm">{-morse_force(r):.6f}</span>"</span>)  <span class="cm"># negate: grad = -force</span>

<span class="cm"># Gradient descent: minimize a 1D loss function</span>
<span class="kw">def</span> <span class="fn">gradient_descent_1d</span>(<span class="nm">f</span>, <span class="nm">x0</span>, <span class="nm">lr</span>=<span class="num">0.01</span>, <span class="nm">steps</span>=<span class="num">100</span>):
    <span class="nm">x</span> = <span class="nm">x0</span>
    <span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">steps</span>):
        <span class="nm">grad</span> = <span class="fn">numerical_gradient</span>(<span class="nm">f</span>, <span class="nm">x</span>)
        <span class="nm">x</span> = <span class="nm">x</span> <span class="op">-</span> <span class="nm">lr</span> <span class="op">*</span> <span class="nm">grad</span>  <span class="cm"># θ_new = θ - α·∇f</span>
    <span class="kw">return</span> <span class="nm">x</span>

<span class="cm"># Find equilibrium bond length (energy minimum)</span>
<span class="nm">r_min</span> = <span class="fn">gradient_descent_1d</span>(<span class="nm">morse</span>, <span class="nm">x0</span>=<span class="num">1.5</span>, <span class="nm">lr</span>=<span class="num">0.1</span>)
<span class="fn">print</span>(<span class="st">f"Equilibrium r: <span class="nm">{r_min:.4f}</span> Å"</span>)  <span class="cm"># ~0.96</span>

<span class="cm"># Multi-dimensional gradient (for 2+ parameters)</span>
<span class="kw">def</span> <span class="fn">multi_grad</span>(<span class="nm">f</span>, <span class="nm">x</span>, <span class="nm">h</span>=<span class="num">1e-5</span>):
    <span class="nm">grad</span> = <span class="nm">np</span>.<span class="fn">zeros_like</span>(<span class="nm">x</span>)
    <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(<span class="nm">x</span>)):
        <span class="nm">x_plus</span> = <span class="nm">x</span>.<span class="fn">copy</span>(); <span class="nm">x_plus</span>[<span class="nm">i</span>] <span class="op">+=</span> <span class="nm">h</span>
        <span class="nm">x_minus</span> = <span class="nm">x</span>.<span class="fn">copy</span>(); <span class="nm">x_minus</span>[<span class="nm">i</span>] <span class="op">-=</span> <span class="nm">h</span>
        <span class="nm">grad</span>[<span class="nm">i</span>] = (<span class="nm">f</span>(<span class="nm">x_plus</span>) <span class="op">-</span> <span class="nm">f</span>(<span class="nm">x_minus</span>)) <span class="op">/</span> (<span class="num">2</span> <span class="op">*</span> <span class="nm">h</span>)
    <span class="kw">return</span> <span class="nm">grad</span>`,

      cheatsheet: [
        { syn: 'f\'(x) ≈ (f(x+h) - f(x-h)) / 2h',   desc: 'Central finite difference — numerical derivative' },
        { syn: 'F = -∇E',                              desc: 'Force is negative gradient of energy' },
        { syn: 'θ_new = θ - α · ∇L',                   desc: 'Gradient descent update rule' },
        { syn: 'Learning rate α',                       desc: 'Step size — too large overshoots, too small crawls' },
        { syn: 'Chain rule: ∂L/∂w = (∂L/∂y)(∂y/∂w)',   desc: 'Foundation of backpropagation' },
        { syn: 'np.gradient(y, x)',                     desc: 'NumPy numerical gradient along an array' },
        { syn: 'Partial derivative ∂f/∂xᵢ',            desc: 'Derivative w.r.t. one variable, others fixed' },
        { syn: 'Hessian: second derivatives',           desc: 'Matrix of ∂²f/∂xᵢ∂xⱼ — curvature info' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'In gradient descent, what happens if the learning rate is too large?',
          opts: [
            'The algorithm converges faster',
            'The algorithm overshoots the minimum and may diverge',
            'The algorithm always finds the global minimum',
            'The learning rate has no effect on convergence'
          ],
          answer: 1,
          feedback: 'A learning rate that is too large causes the parameter updates to overshoot the minimum, potentially oscillating or diverging instead of converging.'
        },
        {
          type: 'fill',
          q: 'The gradient descent update rule is:',
          pre: 'theta_new = theta ___ lr * gradient',
          answer: '-',
          feedback: 'We subtract the gradient (times learning rate) because the gradient points uphill. To minimize, we step in the opposite direction: θ - α∇L.'
        },
        {
          type: 'challenge',
          q: 'Implement gradient descent to fit a line y = mx + b to reaction barrier vs. temperature data. Define a mean squared error loss function, compute gradients numerically, and run 1000 steps. Use barriers = [15.3, 12.1, 18.7, 10.5, 20.2] at temperatures = [300, 350, 250, 400, 200].',
          hint: 'Loss = mean((y_pred - y_actual)²). Compute numerical gradients w.r.t. m and b. Update both each step.',
          answer: `import numpy as np

T = np.array([300, 350, 250, 400, 200], dtype=float)
barriers = np.array([15.3, 12.1, 18.7, 10.5, 20.2])

def loss(params):
    m, b = params
    pred = m * T + b
    return np.mean((pred - barriers) ** 2)

def numerical_grad(f, x, h=1e-5):
    grad = np.zeros_like(x)
    for i in range(len(x)):
        x_p, x_m = x.copy(), x.copy()
        x_p[i] += h; x_m[i] -= h
        grad[i] = (f(x_p) - f(x_m)) / (2 * h)
    return grad

params = np.array([0.0, 15.0])  # initial m, b
for _ in range(1000):
    params -= 0.00001 * numerical_grad(loss, params)

print(f"y = {params[0]:.4f} * T + {params[1]:.2f}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'NumPy Gradient', url: 'https://numpy.org/doc/stable/reference/generated/numpy.gradient.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: '3Blue1Brown — Calculus', url: 'https://www.3blue1brown.com/topics/calculus', tag: 'video', tagColor: 'red' },
      ]
    },

  ],
};
