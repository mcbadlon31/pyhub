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
    //  TODO — Sprint S1, Session 1a
    //  Add: operators, strings, conditionals, loops
    //  Schema template: copy the 'variables' topic above exactly
    //  Chemistry context per topic:
    //    operators:    E_corr = E_SCF + ZPVE, Boltzmann weights, unit conversions
    //    strings:      parse ORCA output lines, build SLURM job names with f-strings
    //    conditionals: check convergence, route by spin state, validate charge×mult
    //    loops:        iterate over .out files, generate PES scan inputs, collect energies
    // ════════════════════════════════════════════════════════

  ],
};
