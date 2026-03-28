/**
 * data/python/01-foundations.js
 * Python Track — Stage 1: Foundations
 * Topics: variables, operators, strings, conditionals, loops
 *
 * HOW TO COMPLETE THIS FILE (Sprint S1):
 * 1. Read CLAUDE.md first (schema, chemistry rules, code line limits 15–35)
 * 2. Use the 'variables' topic below as the exact schema template
 * 3. Add topics in this order: operators, strings, conditionals, loops
 * 4. Every challenge exercise must involve ORCA output parsing or molecular data
 * 5. Run schema validation after completing the file
 */

window.PY_S1 = {
  id: 'py-s1', num: '01', title: 'Foundations',
  color: 'green', meta: 'Weeks 1–2', track: 'python',
  topics: [

    // ════════════════════════════════════════════════════════
    //  SEED TOPIC — use this as the schema template
    // ════════════════════════════════════════════════════════
    {
      id:   'variables',
      name: 'Variables & Data Types',
      desc: 'Storing molecular properties, energies, and flags in typed Python variables',

      explanation: `
        <p>A <strong>variable</strong> is a named container that holds a value in memory.
        In Python, you create one by assigning a value with <code>=</code>. Python is
        <strong>dynamically typed</strong> — the type is inferred automatically, so you
        never write <code>float energy;</code> as you would in C or Fortran.</p>

        <p>The four core types map directly to quantities in computational chemistry:
        <code>str</code> for molecular formulas and basis set names,
        <code>int</code> for charge and spin multiplicity,
        <code>float</code> for energies in hartree or kcal/mol, and
        <code>bool</code> for convergence flags and selection criteria.
        Understanding types matters because mixing them silently causes bugs —
        adding a hartree string to a float crashes, and comparing a float energy
        to an integer threshold requires understanding Python's type rules.</p>

        <p>Check any variable's type at runtime with <code>type()</code>.
        Convert between types explicitly with <code>int()</code>, <code>float()</code>,
        and <code>str()</code> — essential when parsing ORCA or Gaussian output files,
        where every number arrives as a string. Python uses <strong>snake_case</strong>
        by convention: <code>scf_energy</code> not <code>SCFEnergy</code>.</p>
      `,

      code: `<span class="cm"># Storing properties of an H2O molecule</span>
<span class="nm">formula</span>       = <span class="st">"H2O"</span>          <span class="cm"># str  — molecular formula</span>
<span class="nm">charge</span>        = <span class="num">0</span>              <span class="cm"># int  — total charge</span>
<span class="nm">multiplicity</span>  = <span class="num">1</span>              <span class="cm"># int  — spin multiplicity</span>
<span class="nm">scf_energy</span>    = <span class="num">-76.4026831</span>    <span class="cm"># float — SCF energy in hartree</span>
<span class="nm">converged</span>     = <span class="kw">True</span>           <span class="cm"># bool — geometry optimization converged?</span>

<span class="cm"># Check types (useful when debugging parsed output files)</span>
<span class="fn">print</span>(<span class="fn">type</span>(<span class="nm">scf_energy</span>))      <span class="cm"># &lt;class 'float'&gt;</span>
<span class="fn">print</span>(<span class="fn">type</span>(<span class="nm">converged</span>))       <span class="cm"># &lt;class 'bool'&gt;</span>

<span class="cm"># Type conversion — essential when parsing output files</span>
<span class="nm">energy_str</span>  = <span class="st">"  -76.4026831  "</span>   <span class="cm"># what you read from a file</span>
<span class="nm">energy_f</span>    = <span class="fn">float</span>(<span class="nm">energy_str</span>)     <span class="cm"># convert string → float</span>
<span class="nm">hartree_int</span> = <span class="fn">int</span>(<span class="nm">energy_f</span>)         <span class="cm"># float → int (drops decimal)</span>

<span class="cm"># Multiple assignment in one line</span>
<span class="nm">n_alpha</span>, <span class="nm">n_beta</span> = <span class="num">5</span>, <span class="num">5</span>           <span class="cm"># 5 alpha, 5 beta electrons</span>

<span class="cm"># f-string output (Python 3.6+) — clear result reporting</span>
<span class="fn">print</span>(<span class="st">f"<span class="nm">{formula}</span>  E = <span class="nm">{scf_energy:.6f}</span> Ha  converged: <span class="nm">{converged}</span>"</span>)
<span class="cm"># H2O  E = -76.402683 Ha  converged: True</span>`,

      cheatsheet: [
        { syn: 'x = -76.4026',    desc: 'Assign float (SCF energy in hartree)' },
        { syn: 'x = "H2O"',       desc: 'Assign string (formula, basis set name, method)' },
        { syn: 'x = 1',           desc: 'Assign integer (charge, multiplicity, n_atoms)' },
        { syn: 'x = True',        desc: 'Assign boolean — capitalized in Python' },
        { syn: 'type(x)',          desc: 'Return the type of x at runtime' },
        { syn: 'float("−76.4")',   desc: 'Convert string from output file → float' },
        { syn: 'int(x)',           desc: 'Convert to integer (truncates decimals)' },
        { syn: 'str(x)',           desc: 'Convert number → string for concatenation' },
        { syn: 'bool(0)',          desc: '0, "", None, [] → False; everything else → True' },
        { syn: 'a, b = 5, 5',     desc: 'Multiple assignment in one line (n_alpha, n_beta)' },
        { syn: 'f"{e:.6f} Ha"',   desc: 'f-string with 6 decimal places + units label' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'An ORCA output line contains: "FINAL SINGLE POINT ENERGY   -152.983417". After splitting and indexing the last element, what type is the extracted value?',
          opts: ['float', 'int', 'str', 'bool'],
          answer: 2,
          feedback: 'Correct — file I/O always yields strings. You must explicitly convert with float() before doing arithmetic.',
        },
        {
          type: 'fill',
          q: 'Convert the string energy extracted from an output file to a float:',
          pre: 'scf_energy = ___(energy_string)',
          answer: 'float',
          feedback: 'Correct! float() converts a string like "-152.983417" to a Python float for arithmetic.',
        },
        {
          type: 'challenge',
          q: 'A geometry optimization produces these variables extracted from an ORCA output file:\n' +
             'method = "B3LYP", basis = "def2-TZVP", charge = 0, mult = 1,\n' +
             'final_energy_str = "-152.983417" (read from file as a string),\n' +
             'converged_flag = "YES" (read as a string).\n' +
             'Write code that: (1) converts final_energy_str to float, ' +
             '(2) converts converged_flag to bool, ' +
             '(3) converts the energy from hartree to kcal/mol (1 Ha = 627.509 kcal/mol), ' +
             '(4) prints a formatted summary line.',
          hint: 'Use float() for the energy, check converged_flag == "YES" for the bool, multiply by 627.509 for the conversion.',
          answer:
`method = "B3LYP"
basis  = "def2-TZVP"
charge = 0
mult   = 1
final_energy_str = "-152.983417"
converged_flag   = "YES"

# Type conversions
scf_energy  = float(final_energy_str)    # str → float
converged   = converged_flag == "YES"    # str → bool
energy_kcal = scf_energy * 627.509       # hartree → kcal/mol

print(f"Method:     {method}/{basis}")
print(f"Energy:     {scf_energy:.6f} Ha  ({energy_kcal:.2f} kcal/mol)")
print(f"Charge/Mult: {charge}/{mult}")
print(f"Converged:  {converged}")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Built-in Types',
          url:  'https://docs.python.org/3/library/stdtypes.html',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Python Variables',
          url:  'https://realpython.com/python-variables/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python Data Types',
          url:  'https://www.w3schools.com/python/python_datatypes.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  OPERATORS
    // ════════════════════════════════════════════════════════
    {
      id:   'operators',
      name: 'Operators & Expressions',
      desc: 'Arithmetic, comparison, and logical operators for energy calculations and unit conversions',

      explanation: `
        <p><strong>Operators</strong> are symbols that perform computations on values.
        Python's arithmetic operators (<code>+</code>, <code>-</code>, <code>*</code>,
        <code>/</code>, <code>**</code>, <code>//</code>, <code>%</code>) work on
        <code>int</code> and <code>float</code> values. In computational chemistry you
        use them constantly — computing corrected energies, converting units between
        hartree, eV, and kcal/mol, and calculating Boltzmann weights.</p>

        <p><strong>Comparison operators</strong> (<code>==</code>, <code>!=</code>,
        <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>)
        return <code>bool</code> values. They are essential for checking convergence
        thresholds, filtering molecules by energy, and validating that computed
        properties fall within expected ranges. Note that <code>==</code> tests
        equality — a single <code>=</code> is assignment.</p>

        <p><strong>Logical operators</strong> (<code>and</code>, <code>or</code>,
        <code>not</code>) combine boolean expressions. Use them to build complex
        selection criteria: e.g., a geometry is acceptable if it converged
        <code>and</code> the energy is below a threshold. Python also supports
        <strong>augmented assignment</strong> (<code>+=</code>, <code>*=</code>)
        for accumulating sums of energies across multiple conformers.</p>
      `,

      code: `<span class="cm"># Unit conversion: hartree → kcal/mol → eV</span>
<span class="nm">HA_TO_KCAL</span> = <span class="num">627.509</span>
<span class="nm">HA_TO_EV</span>   = <span class="num">27.2114</span>
<span class="nm">scf_energy</span> = <span class="num">-76.4026831</span>   <span class="cm"># H2O SCF energy (Ha)</span>

<span class="nm">energy_kcal</span> = <span class="nm">scf_energy</span> <span class="op">*</span> <span class="nm">HA_TO_KCAL</span>
<span class="nm">energy_ev</span>   = <span class="nm">scf_energy</span> <span class="op">*</span> <span class="nm">HA_TO_EV</span>

<span class="cm"># Corrected energy: E_total = E_SCF + ZPVE</span>
<span class="nm">zpve_hartree</span> = <span class="num">0.02109</span>    <span class="cm"># zero-point vibrational energy</span>
<span class="nm">e_total</span>      = <span class="nm">scf_energy</span> <span class="op">+</span> <span class="nm">zpve_hartree</span>

<span class="cm"># Comparison: check convergence threshold</span>
<span class="nm">delta_e</span> = <span class="fn">abs</span>(<span class="nm">e_total</span> <span class="op">-</span> <span class="nm">scf_energy</span>)
<span class="fn">print</span>(<span class="nm">delta_e</span> <span class="op">&lt;</span> <span class="num">1e-4</span>)          <span class="cm"># False (0.02109 &gt; 0.0001)</span>

<span class="cm"># Logical operators: filter by multiple criteria</span>
<span class="nm">converged</span> = <span class="kw">True</span>
<span class="nm">below_thresh</span> = <span class="nm">energy_kcal</span> <span class="op">&lt;</span> <span class="num">-47000</span>
<span class="nm">acceptable</span> = <span class="nm">converged</span> <span class="kw">and</span> <span class="nm">below_thresh</span>  <span class="cm"># True</span>

<span class="cm"># Exponentiation: Boltzmann weight</span>
<span class="kw">import</span> <span class="nm">math</span>
<span class="nm">kT</span> = <span class="num">0.001987</span> <span class="op">*</span> <span class="num">298.15</span>     <span class="cm"># kcal/mol at 298 K</span>
<span class="nm">dG</span> = <span class="num">2.5</span>                       <span class="cm"># ΔG in kcal/mol</span>
<span class="nm">weight</span> = <span class="nm">math</span>.<span class="fn">exp</span>(<span class="op">-</span><span class="nm">dG</span> <span class="op">/</span> <span class="nm">kT</span>)    <span class="cm"># ≈ 0.015</span>`,

      cheatsheet: [
        { syn: 'a + b',          desc: 'Addition — E_total = E_SCF + ZPVE' },
        { syn: 'a - b',          desc: 'Subtraction — ΔE = E_prod - E_react' },
        { syn: 'a * b',          desc: 'Multiplication — unit conversion (Ha × 627.509)' },
        { syn: 'a / b',          desc: 'True division — always returns float' },
        { syn: 'a // b',         desc: 'Floor division — integer quotient' },
        { syn: 'a % b',          desc: 'Modulo — remainder (check even/odd electron count)' },
        { syn: 'a ** b',         desc: 'Exponentiation — r**2 for distance squared' },
        { syn: 'abs(x)',         desc: 'Absolute value — |ΔE| for unsigned energy difference' },
        { syn: '==  !=',         desc: 'Equal / not equal — compare spin states' },
        { syn: '<  <=  >  >=',   desc: 'Comparisons — check energy thresholds' },
        { syn: 'and  or  not',   desc: 'Logical — combine convergence + energy checks' },
        { syn: 'x += 1',        desc: 'Augmented assignment — accumulate running sums' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does the expression -76.4026 * 627.509 compute in a computational chemistry context?',
          opts: [
            'Conversion from kcal/mol to hartree',
            'Conversion from hartree to kcal/mol',
            'Boltzmann weight at 298 K',
            'Zero-point energy correction'
          ],
          answer: 1,
          feedback: 'Correct — multiplying a hartree energy by 627.509 converts it to kcal/mol.',
        },
        {
          type: 'fill',
          q: 'Compute the zero-point corrected energy:',
          pre: 'e_corrected = scf_energy ___ zpve',
          answer: '+',
          feedback: 'Correct! The ZPVE is added to the SCF energy to obtain the corrected total energy.',
        },
        {
          type: 'challenge',
          q: 'Given two ORCA-computed energies for a reaction:\n' +
             'e_reactant = -152.983417 Ha, e_product = -152.978231 Ha.\n' +
             'Write code that: (1) computes ΔE in hartree (product − reactant), ' +
             '(2) converts to kcal/mol (1 Ha = 627.509 kcal/mol) and eV (1 Ha = 27.2114 eV), ' +
             '(3) checks if the reaction is endothermic (ΔE > 0), ' +
             '(4) prints a formatted summary with all three units.',
          hint: 'delta_e = e_product - e_reactant, then multiply by conversion factors. Use a comparison operator for endothermic check.',
          answer:
`e_reactant = -152.983417  # Ha
e_product  = -152.978231  # Ha

# Reaction energy in three unit systems
delta_e_ha   = e_product - e_reactant
delta_e_kcal = delta_e_ha * 627.509
delta_e_ev   = delta_e_ha * 27.2114

# Thermodynamic check
is_endothermic = delta_e_ha > 0

print(f"ΔE = {delta_e_ha:.6f} Ha")
print(f"   = {delta_e_kcal:.2f} kcal/mol")
print(f"   = {delta_e_ev:.4f} eV")
print(f"Endothermic: {is_endothermic}")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Expressions',
          url:  'https://docs.python.org/3/reference/expressions.html',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Operators and Expressions',
          url:  'https://realpython.com/python-operators-expressions/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python Operators',
          url:  'https://www.w3schools.com/python/python_operators.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  STRINGS
    // ════════════════════════════════════════════════════════
    {
      id:   'strings',
      name: 'Strings & Text Processing',
      desc: 'Parsing ORCA output lines, building SLURM job names, and formatting results with f-strings',

      explanation: `
        <p>A <strong>string</strong> (<code>str</code>) is an immutable sequence of characters.
        In computational chemistry, nearly every workflow begins and ends with strings:
        you read text from ORCA or Gaussian output files, extract numbers, build input
        file templates, and format result tables. Python strings support indexing
        (<code>s[0]</code>), slicing (<code>s[2:5]</code>), and a rich set of methods.</p>

        <p>The most critical string methods for output parsing are <code>.split()</code>,
        which breaks a line into a list of tokens, <code>.strip()</code> to remove
        whitespace, and <code>.startswith()</code> / <code>in</code> to detect key lines.
        When parsing ORCA output, the pattern is: find the line containing a keyword,
        split it, and grab the value by index — then convert with <code>float()</code>.</p>

        <p><strong>f-strings</strong> (formatted string literals, Python 3.6+) are the
        modern way to embed expressions in strings: <code>f"E = {energy:.6f} Ha"</code>.
        They replace older <code>%</code> formatting and <code>.format()</code> calls.
        Use them for building SLURM job names, writing input file headers, and
        printing result summaries with controlled decimal precision.</p>
      `,

      code: `<span class="cm"># Parsing an ORCA output line</span>
<span class="nm">line</span> = <span class="st">"FINAL SINGLE POINT ENERGY      -152.983417"</span>
<span class="nm">tokens</span> = <span class="nm">line</span>.<span class="fn">split</span>()         <span class="cm"># ['FINAL','SINGLE','POINT','ENERGY','-152.983417']</span>
<span class="nm">energy</span> = <span class="fn">float</span>(<span class="nm">tokens</span>[<span class="num">-1</span>])    <span class="cm"># -152.983417</span>

<span class="cm"># Detecting keywords in output files</span>
<span class="nm">converged</span> = <span class="st">"SCF CONVERGED"</span> <span class="kw">in</span> <span class="nm">line</span>   <span class="cm"># False for this line</span>

<span class="cm"># String methods for cleanup</span>
<span class="nm">raw</span> = <span class="st">"  def2-TZVP  \n"</span>
<span class="nm">basis</span> = <span class="nm">raw</span>.<span class="fn">strip</span>()             <span class="cm"># "def2-TZVP"</span>
<span class="fn">print</span>(<span class="nm">basis</span>.<span class="fn">upper</span>())             <span class="cm"># "DEF2-TZVP"</span>
<span class="fn">print</span>(<span class="nm">basis</span>.<span class="fn">startswith</span>(<span class="st">"def2"</span>))  <span class="cm"># True</span>

<span class="cm"># f-strings: build SLURM job name</span>
<span class="nm">mol</span>    = <span class="st">"water"</span>
<span class="nm">method</span> = <span class="st">"B3LYP"</span>
<span class="nm">job_name</span> = <span class="st">f"<span class="nm">{mol}</span>_<span class="nm">{method}</span>_opt"</span>   <span class="cm"># "water_B3LYP_opt"</span>

<span class="cm"># Formatted output with precision control</span>
<span class="fn">print</span>(<span class="st">f"E = <span class="nm">{energy:.6f}</span> Ha  (<span class="nm">{energy <span class="op">*</span> 627.509:.2f}</span> kcal/mol)"</span>)

<span class="cm"># Multi-line string: ORCA input template</span>
<span class="nm">inp</span> = <span class="st">f"""! <span class="nm">{method}</span> <span class="nm">{basis}</span> Opt
* xyz 0 1
H  0.0  0.0  0.0
O  0.0  0.0  0.96
H  0.0  0.76  -0.24
*"""</span>`,

      cheatsheet: [
        { syn: 's.split()',         desc: 'Split on whitespace → list of tokens' },
        { syn: 's.split(",")',      desc: 'Split on comma (CSV parsing)' },
        { syn: 's.strip()',         desc: 'Remove leading/trailing whitespace + newlines' },
        { syn: 's.startswith(x)',   desc: 'True if s begins with x (detect output sections)' },
        { syn: '"key" in s',       desc: 'Substring search (find convergence lines)' },
        { syn: 's.replace(a, b)',   desc: 'Replace all occurrences of a with b' },
        { syn: 's.upper() .lower()',desc: 'Case conversion (normalize method names)' },
        { syn: 's[i]  s[a:b]',     desc: 'Indexing and slicing (extract substrings)' },
        { syn: 'f"E = {e:.6f}"',   desc: 'f-string with 6 decimal places' },
        { syn: 'f"{x:>12}"',       desc: 'Right-align in 12-char field (table columns)' },
        { syn: '"\\n".join(lst)',   desc: 'Join list of lines into one string' },
        { syn: 'len(s)',            desc: 'String length (count characters)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Given line = "FINAL SINGLE POINT ENERGY   -76.4026831", what does line.split()[-1] return?',
          opts: [
            '-76.4026831 (float)',
            "'-76.4026831' (str)",
            'ENERGY (str)',
            'IndexError'
          ],
          answer: 1,
          feedback: "Correct — split() returns strings. The last element is the string '-76.4026831', not a float.",
        },
        {
          type: 'fill',
          q: 'Remove leading/trailing whitespace from a parsed line:',
          pre: 'basis_set = raw_text.___()',
          answer: 'strip',
          feedback: 'Correct! strip() removes whitespace and newlines from both ends of a string.',
        },
        {
          type: 'challenge',
          q: 'You have a multi-line string from an ORCA output file:\n' +
             'output = """FINAL SINGLE POINT ENERGY      -152.983417\\n' +
             'Total Dipole Moment    :    1.84720 Debye\\n' +
             'TOTAL RUN TIME: 0 days 0 hours 2 min 34 sec"""\n' +
             'Write code that: (1) splits into individual lines, ' +
             '(2) extracts the energy from the first line as a float, ' +
             '(3) extracts the dipole moment from the second line as a float, ' +
             '(4) builds a summary string with f-string formatting.',
          hint: 'Use splitlines() to get a list of lines, then split() each line and index the value. Convert with float().',
          answer:
`output = """FINAL SINGLE POINT ENERGY      -152.983417
Total Dipole Moment    :    1.84720 Debye
TOTAL RUN TIME: 0 days 0 hours 2 min 34 sec"""

lines = output.splitlines()
energy = float(lines[0].split()[-1])         # -152.983417
dipole = float(lines[1].split()[-2])         # 1.84720

summary = f"SCF Energy: {energy:.6f} Ha | Dipole: {dipole:.3f} D"
print(summary)`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: String Methods',
          url:  'https://docs.python.org/3/library/stdtypes.html#string-methods',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: f-Strings',
          url:  'https://realpython.com/python-f-strings/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python Strings',
          url:  'https://www.w3schools.com/python/python_strings.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  CONDITIONALS
    // ════════════════════════════════════════════════════════
    {
      id:   'conditionals',
      name: 'Conditionals & Control Flow',
      desc: 'Branching on convergence status, spin state, and energy thresholds',

      explanation: `
        <p><strong>Conditional statements</strong> let your program take different paths
        based on boolean conditions. The <code>if</code> / <code>elif</code> /
        <code>else</code> pattern is Python's core branching mechanism. Indentation
        (4 spaces by convention) defines each block — there are no braces like C/Fortran.
        In computational chemistry, you use conditionals constantly: checking whether
        an SCF calculation converged, routing by spin multiplicity, or validating
        that charge and multiplicity are physically consistent.</p>

        <p>Conditions can use comparison operators (<code>==</code>, <code>&lt;</code>,
        <code>&gt;=</code>), membership tests (<code>in</code>), and logical
        combinators (<code>and</code>, <code>or</code>, <code>not</code>). Python
        evaluates them left to right and short-circuits — if the first operand of
        <code>and</code> is <code>False</code>, the second is never evaluated.</p>

        <p>A common pattern in compchem scripts: after parsing an output file,
        check convergence before extracting properties. If the SCF didn't converge,
        the energy is meaningless — so you gate downstream calculations behind
        <code>if converged:</code>. For multi-level decisions (singlet vs. doublet
        vs. triplet), use an <code>elif</code> chain rather than nested <code>if</code>s.</p>
      `,

      code: `<span class="cm"># Check SCF convergence before using the energy</span>
<span class="nm">converged</span>  = <span class="kw">True</span>
<span class="nm">scf_energy</span> = <span class="num">-152.983417</span>  <span class="cm"># Ha</span>

<span class="kw">if</span> <span class="nm">converged</span>:
    <span class="fn">print</span>(<span class="st">f"SCF energy: <span class="nm">{scf_energy:.6f}</span> Ha"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="st">"WARNING: SCF did not converge"</span>)

<span class="cm"># Route calculation by spin multiplicity</span>
<span class="nm">mult</span> = <span class="num">3</span>  <span class="cm"># triplet oxygen</span>
<span class="kw">if</span> <span class="nm">mult</span> <span class="op">==</span> <span class="num">1</span>:
    <span class="nm">method</span> = <span class="st">"RHF"</span>        <span class="cm"># restricted for singlets</span>
<span class="kw">elif</span> <span class="nm">mult</span> <span class="op">==</span> <span class="num">2</span>:
    <span class="nm">method</span> = <span class="st">"UHF"</span>        <span class="cm"># unrestricted for doublets</span>
<span class="kw">else</span>:
    <span class="nm">method</span> = <span class="st">"UHF"</span>        <span class="cm"># unrestricted for triplets+</span>

<span class="cm"># Validate charge and multiplicity compatibility</span>
<span class="nm">n_electrons</span> = <span class="num">16</span>
<span class="nm">charge</span> = <span class="num">0</span>
<span class="nm">n_eff</span> = <span class="nm">n_electrons</span> <span class="op">-</span> <span class="nm">charge</span>
<span class="kw">if</span> (<span class="nm">n_eff</span> <span class="op">%</span> <span class="num">2</span> <span class="op">==</span> <span class="num">0</span> <span class="kw">and</span> <span class="nm">mult</span> <span class="op">%</span> <span class="num">2</span> <span class="op">==</span> <span class="num">0</span>) <span class="kw">or</span> \
   (<span class="nm">n_eff</span> <span class="op">%</span> <span class="num">2</span> <span class="op">==</span> <span class="num">1</span> <span class="kw">and</span> <span class="nm">mult</span> <span class="op">%</span> <span class="num">2</span> <span class="op">==</span> <span class="num">1</span>):
    <span class="fn">print</span>(<span class="st">"ERROR: charge/mult incompatible"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="st">f"Valid: <span class="nm">{n_eff}</span>e⁻, mult=<span class="nm">{mult}</span> → <span class="nm">{method}</span>"</span>)`,

      cheatsheet: [
        { syn: 'if condition:',           desc: 'Execute block if condition is True' },
        { syn: 'elif condition:',         desc: 'Check next condition if previous was False' },
        { syn: 'else:',                   desc: 'Execute if all previous conditions were False' },
        { syn: 'if a and b:',            desc: 'Both must be True (converged and below threshold)' },
        { syn: 'if a or b:',             desc: 'At least one True (singlet or triplet)' },
        { syn: 'if not converged:',       desc: 'Negate a boolean value' },
        { syn: 'if x in [1, 2, 3]:',     desc: 'Membership test (check against allowed values)' },
        { syn: 'if x is None:',          desc: 'Identity check (missing value sentinel)' },
        { syn: 'x if cond else y',       desc: 'Ternary / conditional expression (inline)' },
        { syn: 'if 0 < x < 10:',        desc: 'Chained comparison (range check)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'A molecule has 15 electrons and multiplicity 2. The check (n_electrons % 2 != mult % 2) returns True. What does this mean?',
          opts: [
            'The charge/multiplicity combination is invalid',
            'The charge/multiplicity combination is valid',
            'The molecule is a closed-shell singlet',
            'The SCF calculation will not converge'
          ],
          answer: 1,
          feedback: 'Correct — odd electron count requires even multiplicity (doublet=2, quartet=4). 15 is odd, 2 is even, so they are compatible.',
        },
        {
          type: 'fill',
          q: 'Complete the conditional to check if SCF converged before printing energy:',
          pre: '___ converged:\n    print(f"E = {energy:.6f} Ha")',
          answer: 'if',
          feedback: 'Correct! The if keyword starts a conditional block that executes only when the condition is True.',
        },
        {
          type: 'challenge',
          q: 'Write a function that classifies an ORCA calculation result.\n' +
             'Given: converged (bool), scf_energy (float in Ha), mult (int).\n' +
             'Rules: (1) if not converged → print "FAILED: SCF did not converge", ' +
             '(2) if converged and mult == 1 → print "Singlet, E = {energy} Ha", ' +
             '(3) if converged and mult == 2 → print "Doublet (open-shell), E = {energy} Ha", ' +
             '(4) otherwise → print "High-spin (mult={mult}), E = {energy} Ha".',
          hint: 'Use if/elif/else chain. Check converged first, then branch on mult.',
          answer:
`converged  = True
scf_energy = -152.983417
mult       = 1

if not converged:
    print("FAILED: SCF did not converge")
elif mult == 1:
    print(f"Singlet, E = {scf_energy:.6f} Ha")
elif mult == 2:
    print(f"Doublet (open-shell), E = {scf_energy:.6f} Ha")
else:
    print(f"High-spin (mult={mult}), E = {scf_energy:.6f} Ha")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: if Statements',
          url:  'https://docs.python.org/3/tutorial/controlflow.html#if-statements',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Conditional Statements',
          url:  'https://realpython.com/python-conditional-statements/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python If...Else',
          url:  'https://www.w3schools.com/python/python_conditions.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  LOOPS
    // ════════════════════════════════════════════════════════
    {
      id:   'loops',
      name: 'Loops & Iteration',
      desc: 'Iterating over output files, generating PES scan inputs, and collecting energies',

      explanation: `
        <p><strong>Loops</strong> let you repeat code over sequences of data. Python has
        two loop types: <code>for</code> iterates over items in a sequence (a list,
        range, or file), and <code>while</code> repeats as long as a condition holds.
        In computational chemistry, <code>for</code> loops dominate — you iterate over
        molecules in a dataset, lines in an output file, or bond lengths in a PES scan.</p>

        <p>The <code>range()</code> function generates integer sequences:
        <code>range(10)</code> gives 0–9, <code>range(90, 181, 5)</code> gives angles
        from 90° to 180° in 5° steps — perfect for generating scan input files.
        Use <code>enumerate()</code> when you need both the index and value, and
        <code>zip()</code> to iterate over two lists in parallel (e.g., molecule names
        and their energies).</p>

        <p>Control flow inside loops: <code>break</code> exits the loop early (e.g., stop
        once you find the energy line), and <code>continue</code> skips to the next
        iteration (e.g., skip blank lines in an output file). The accumulator pattern —
        initialize a variable before the loop, update it inside — is how you collect
        sums, build lists of energies, or find minimum-energy conformers.</p>
      `,

      code: `<span class="cm"># Parse ORCA output: find energy lines</span>
<span class="nm">orca_output</span> = [
    <span class="st">"SCF CONVERGED AFTER 12 CYCLES"</span>,
    <span class="st">"FINAL SINGLE POINT ENERGY      -152.983417"</span>,
    <span class="st">"Total Dipole Moment    :    1.847 Debye"</span>,
]
<span class="kw">for</span> <span class="nm">line</span> <span class="kw">in</span> <span class="nm">orca_output</span>:
    <span class="kw">if</span> <span class="st">"FINAL SINGLE POINT"</span> <span class="kw">in</span> <span class="nm">line</span>:
        <span class="nm">energy</span> = <span class="fn">float</span>(<span class="nm">line</span>.<span class="fn">split</span>()[<span class="num">-1</span>])
        <span class="kw">break</span>

<span class="cm"># Generate PES scan: O-H bond lengths from 0.8 to 1.4 Å</span>
<span class="nm">distances</span> = []
<span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>, <span class="num">15</span>):
    <span class="nm">r</span> = <span class="nm">i</span> <span class="op">/</span> <span class="num">10</span>   <span class="cm"># 0.8, 0.9, ... 1.4</span>
    <span class="nm">distances</span>.<span class="fn">append</span>(<span class="nm">r</span>)

<span class="cm"># Accumulator: sum energies across conformers</span>
<span class="nm">conformer_energies</span> = [<span class="num">-152.9834</span>, <span class="num">-152.9801</span>, <span class="num">-152.9756</span>]
<span class="nm">total</span> = <span class="num">0.0</span>
<span class="kw">for</span> <span class="nm">e</span> <span class="kw">in</span> <span class="nm">conformer_energies</span>:
    <span class="nm">total</span> <span class="op">+=</span> <span class="nm">e</span>
<span class="nm">avg_energy</span> = <span class="nm">total</span> <span class="op">/</span> <span class="fn">len</span>(<span class="nm">conformer_energies</span>)

<span class="cm"># enumerate + zip: print molecule table</span>
<span class="nm">molecules</span> = [<span class="st">"H2O"</span>, <span class="st">"NH3"</span>, <span class="st">"CH4"</span>]
<span class="nm">energies</span>  = [<span class="num">-76.403</span>, <span class="num">-56.564</span>, <span class="num">-40.518</span>]
<span class="kw">for</span> <span class="nm">i</span>, (<span class="nm">mol</span>, <span class="nm">e</span>) <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="fn">zip</span>(<span class="nm">molecules</span>, <span class="nm">energies</span>)):
    <span class="fn">print</span>(<span class="st">f"<span class="nm">{i+1}</span>. <span class="nm">{mol:&lt;5}</span> E = <span class="nm">{e:.3f}</span> Ha"</span>)`,

      cheatsheet: [
        { syn: 'for x in list:',          desc: 'Iterate over items (molecules, energies, lines)' },
        { syn: 'for i in range(n):',      desc: 'Loop n times (0 to n-1)' },
        { syn: 'range(start, stop, step)', desc: 'Integer sequence (PES scan angles/distances)' },
        { syn: 'for i, x in enumerate(lst):', desc: 'Loop with index and value' },
        { syn: 'for a, b in zip(x, y):',  desc: 'Iterate two lists in parallel' },
        { syn: 'while condition:',         desc: 'Repeat until condition is False (convergence loop)' },
        { syn: 'break',                    desc: 'Exit loop immediately (found target line)' },
        { syn: 'continue',                 desc: 'Skip to next iteration (skip blank lines)' },
        { syn: 'total += x',              desc: 'Accumulator pattern (sum energies in loop)' },
        { syn: 'for line in open(f):',    desc: 'Iterate over lines in a file' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does range(90, 181, 5) produce in the context of a dihedral angle scan?',
          opts: [
            'Angles from 90 to 181 in steps of 5',
            'Angles from 90 to 180 (inclusive) in steps of 5',
            'Angles from 90 to 175 in steps of 5',
            '5 angles between 90 and 181'
          ],
          answer: 1,
          feedback: 'Correct — range(90, 181, 5) gives 90, 95, 100, ..., 175, 180. The stop value 181 is exclusive, so 180 is included.',
        },
        {
          type: 'fill',
          q: 'Loop over a list of output lines with both index and line content:',
          pre: 'for idx, line in ___(lines):',
          answer: 'enumerate',
          feedback: 'Correct! enumerate() yields (index, value) pairs, useful for tracking line numbers in output files.',
        },
        {
          type: 'challenge',
          q: 'You have a list of ORCA output lines. Write code that:\n' +
             '(1) loops through the lines to find all lines containing "FINAL SINGLE POINT ENERGY",\n' +
             '(2) extracts each energy as a float and stores in a list,\n' +
             '(3) finds the minimum energy (most stable conformer),\n' +
             '(4) prints the index and value of the lowest-energy conformer.\n' +
             'Lines: ["Conf 1:", "FINAL SINGLE POINT ENERGY   -152.983417",\n' +
             '"Conf 2:", "FINAL SINGLE POINT ENERGY   -152.991203",\n' +
             '"Conf 3:", "FINAL SINGLE POINT ENERGY   -152.978654"]',
          hint: 'Use a for loop with "if ... in line:" to detect energy lines, append float values to a list, then use min() and .index().',
          answer:
`lines = [
    "Conf 1:", "FINAL SINGLE POINT ENERGY   -152.983417",
    "Conf 2:", "FINAL SINGLE POINT ENERGY   -152.991203",
    "Conf 3:", "FINAL SINGLE POINT ENERGY   -152.978654",
]

energies = []
for line in lines:
    if "FINAL SINGLE POINT ENERGY" in line:
        energies.append(float(line.split()[-1]))

min_e = min(energies)
best  = energies.index(min_e)
print(f"Lowest conformer: #{best + 1}, E = {min_e:.6f} Ha")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: for Statements',
          url:  'https://docs.python.org/3/tutorial/controlflow.html#for-statements',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Python for Loops',
          url:  'https://realpython.com/python-for-loop/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python For Loops',
          url:  'https://www.w3schools.com/python/python_for_loops.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

  ],
};
