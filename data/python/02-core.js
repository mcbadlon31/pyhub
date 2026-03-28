/**
 * data/python/02-core.js
 * Stage 02: Core Python
 * Topics: functions,lists,tuples-sets,dicts,file-io,error-handling
 *
 * STATUS: STUB — complete in the relevant sprint (see CLAUDE.md sprint roadmap)
 *
 * Instructions:
 * 1. Read CLAUDE.md before starting
 * 2. Use the 'variables' topic in 01-foundations.js as the exact schema template
 * 3. All challenge exercises must use chemistry/materials science context
 * 4. Code line limits: Python/CS = 15-35 lines, ML 1-4 = 20-50, ML 5-6 = 25-60
 * 5. Run schema validation after completing this file
 */

window.PY_S2 = {
  id: 'py-s2', num: '02', title: 'Core Python',
  color: 'blue', meta: 'Weeks 3-5', track: 'python',
  topics: [

    // ════════════════════════════════════════════════════════
    //  FUNCTIONS
    // ════════════════════════════════════════════════════════
    {
      id:   'functions',
      name: 'Functions',
      desc: 'Encapsulating reusable calculations — unit conversions, energy corrections, and output parsers',

      explanation: `
        <p>A <strong>function</strong> is a named block of code that takes inputs
        (parameters), performs a computation, and returns a result. You define one
        with <code>def name(params):</code> and call it with <code>name(args)</code>.
        Functions are essential for avoiding repetition — if you convert hartree to
        kcal/mol in dozens of places, write it once as a function.</p>

        <p>Functions can have <strong>default parameter values</strong>:
        <code>def convert(energy, factor=627.509)</code> lets callers omit the factor
        when the standard conversion is wanted. They can also return multiple values
        as a tuple: <code>return energy_kcal, energy_ev</code>. Python's
        <strong>docstrings</strong> (triple-quoted strings right after <code>def</code>)
        document what a function does, its parameters, and return values.</p>

        <p>Good function design follows the <strong>single responsibility principle</strong>:
        one function does one thing. A function that parses an ORCA output file should
        not also plot the results. Keep functions short, give them descriptive names
        like <code>parse_orca_energy()</code>, and always include a <code>return</code>
        statement — a function without <code>return</code> implicitly returns
        <code>None</code>.</p>
      `,

      code: `<span class="cm"># Basic function: unit conversion</span>
<span class="kw">def</span> <span class="fn">hartree_to_kcal</span>(<span class="nm">energy_ha</span>):
    <span class="st">"""Convert energy from hartree to kcal/mol."""</span>
    <span class="kw">return</span> <span class="nm">energy_ha</span> <span class="op">*</span> <span class="num">627.509</span>

<span class="nm">e_kcal</span> = <span class="fn">hartree_to_kcal</span>(<span class="num">-76.4026</span>)  <span class="cm"># -47948.9</span>

<span class="cm"># Default parameters + multiple return values</span>
<span class="kw">def</span> <span class="fn">convert_energy</span>(<span class="nm">ha</span>, <span class="nm">to_kcal</span>=<span class="num">627.509</span>, <span class="nm">to_ev</span>=<span class="num">27.2114</span>):
    <span class="st">"""Convert hartree to kcal/mol and eV."""</span>
    <span class="kw">return</span> <span class="nm">ha</span> <span class="op">*</span> <span class="nm">to_kcal</span>, <span class="nm">ha</span> <span class="op">*</span> <span class="nm">to_ev</span>

<span class="nm">kcal</span>, <span class="nm">ev</span> = <span class="fn">convert_energy</span>(<span class="num">-76.4026</span>)

<span class="cm"># Function that processes data: parse ORCA energy line</span>
<span class="kw">def</span> <span class="fn">parse_orca_energy</span>(<span class="nm">line</span>):
    <span class="st">"""Extract SCF energy from an ORCA output line."""</span>
    <span class="kw">if</span> <span class="st">"FINAL SINGLE POINT"</span> <span class="kw">in</span> <span class="nm">line</span>:
        <span class="kw">return</span> <span class="fn">float</span>(<span class="nm">line</span>.<span class="fn">split</span>()[<span class="num">-1</span>])
    <span class="kw">return</span> <span class="kw">None</span>

<span class="nm">e</span> = <span class="fn">parse_orca_energy</span>(<span class="st">"FINAL SINGLE POINT ENERGY   -152.983"</span>)

<span class="cm"># Reaction energy helper</span>
<span class="kw">def</span> <span class="fn">reaction_energy</span>(<span class="nm">e_react</span>, <span class="nm">e_prod</span>):
    <span class="st">"""Return ΔE in Ha and kcal/mol."""</span>
    <span class="nm">de_ha</span> = <span class="nm">e_prod</span> <span class="op">-</span> <span class="nm">e_react</span>
    <span class="kw">return</span> <span class="nm">de_ha</span>, <span class="fn">hartree_to_kcal</span>(<span class="nm">de_ha</span>)`,

      cheatsheet: [
        { syn: 'def fn(x):',              desc: 'Define a function with one parameter' },
        { syn: 'def fn(x, y=1):',         desc: 'Default parameter value (optional argument)' },
        { syn: 'return value',             desc: 'Send a result back to the caller' },
        { syn: 'return a, b',             desc: 'Return multiple values as a tuple' },
        { syn: 'x, y = fn(args)',          desc: 'Unpack multiple return values' },
        { syn: '"""Docstring."""',         desc: 'Document the function (first line after def)' },
        { syn: 'fn(x, y=2)',              desc: 'Call with positional + keyword argument' },
        { syn: 'fn(*args)',               desc: 'Accept variable number of positional args' },
        { syn: 'fn(**kwargs)',            desc: 'Accept variable number of keyword args' },
        { syn: 'lambda x: x * 627.509',  desc: 'Anonymous one-liner function' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does a function return if it has no explicit return statement?',
          opts: ['0', 'False', 'None', 'An empty string'],
          answer: 2,
          feedback: 'Correct — Python functions without a return statement implicitly return None.',
        },
        {
          type: 'fill',
          q: 'Define a function that converts hartree to eV:',
          pre: '___ hartree_to_ev(energy):\n    return energy * 27.2114',
          answer: 'def',
          feedback: 'Correct! The def keyword defines a new function.',
        },
        {
          type: 'challenge',
          q: 'Write a function zpve_corrected(scf_energy, zpve) that:\n' +
             '(1) takes an SCF energy and ZPVE (both in hartree),\n' +
             '(2) computes the corrected energy (scf + zpve),\n' +
             '(3) returns a tuple of (corrected_ha, corrected_kcal).\n' +
             'Then call it with scf = -152.983417 and zpve = 0.04521.',
          hint: 'Add the two energies, convert to kcal/mol by multiplying by 627.509, and return both values.',
          answer:
`def zpve_corrected(scf_energy, zpve):
    """Return ZPVE-corrected energy in Ha and kcal/mol."""
    corrected = scf_energy + zpve
    return corrected, corrected * 627.509

e_ha, e_kcal = zpve_corrected(-152.983417, 0.04521)
print(f"Corrected: {e_ha:.6f} Ha ({e_kcal:.2f} kcal/mol)")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Defining Functions',
          url:  'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Defining Your Own Functions',
          url:  'https://realpython.com/defining-your-own-python-function/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python Functions',
          url:  'https://www.w3schools.com/python/python_functions.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  LISTS
    // ════════════════════════════════════════════════════════
    {
      id:   'lists',
      name: 'Lists',
      desc: 'Collecting energies, atomic coordinates, and molecular datasets in ordered mutable sequences',

      explanation: `
        <p>A <strong>list</strong> is an ordered, mutable collection created with square
        brackets: <code>[item1, item2, ...]</code>. Lists are the workhorse data structure
        in computational chemistry scripts — you store conformer energies, atom symbols,
        Cartesian coordinates, and parsed output values in lists.</p>

        <p>Lists support <strong>indexing</strong> (<code>lst[0]</code> for the first item,
        <code>lst[-1]</code> for the last) and <strong>slicing</strong>
        (<code>lst[2:5]</code>). Key methods include <code>.append()</code> to add items,
        <code>.sort()</code> to sort in place, and <code>.pop()</code> to remove and return
        the last item. Built-in functions <code>len()</code>, <code>min()</code>,
        <code>max()</code>, and <code>sum()</code> work directly on numeric lists.</p>

        <p>Lists are <strong>mutable</strong> — you can change elements in place with
        <code>lst[i] = new_value</code>. This differs from tuples and strings, which are
        immutable. Use lists when you need to accumulate results during a loop (e.g.,
        collecting energies from multiple output files) or when the data may change
        (e.g., filtering molecules by convergence status).</p>
      `,

      code: `<span class="cm"># List of SCF energies from conformer search (Ha)</span>
<span class="nm">energies</span> = [<span class="num">-152.9834</span>, <span class="num">-152.9801</span>, <span class="num">-152.9912</span>, <span class="num">-152.9756</span>]

<span class="cm"># Indexing and slicing</span>
<span class="nm">first</span> = <span class="nm">energies</span>[<span class="num">0</span>]         <span class="cm"># -152.9834</span>
<span class="nm">last</span>  = <span class="nm">energies</span>[<span class="num">-1</span>]        <span class="cm"># -152.9756</span>
<span class="nm">top2</span>  = <span class="nm">energies</span>[:<span class="num">2</span>]         <span class="cm"># [-152.9834, -152.9801]</span>

<span class="cm"># Built-in aggregations</span>
<span class="fn">print</span>(<span class="fn">min</span>(<span class="nm">energies</span>))          <span class="cm"># -152.9912 (most stable)</span>
<span class="fn">print</span>(<span class="fn">len</span>(<span class="nm">energies</span>))          <span class="cm"># 4 conformers</span>

<span class="cm"># Append new result from additional calculation</span>
<span class="nm">energies</span>.<span class="fn">append</span>(<span class="num">-152.9878</span>)

<span class="cm"># Sort: lowest energy first</span>
<span class="nm">energies</span>.<span class="fn">sort</span>()
<span class="fn">print</span>(<span class="nm">energies</span>[<span class="num">0</span>])            <span class="cm"># -152.9912 (global minimum)</span>

<span class="cm"># Atom symbols and coordinates</span>
<span class="nm">atoms</span> = [<span class="st">"O"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>]
<span class="nm">coords</span> = [
    [<span class="num">0.000</span>, <span class="num">0.000</span>, <span class="num">0.117</span>],
    [<span class="num">0.000</span>, <span class="num">0.757</span>, <span class="num">-0.469</span>],
    [<span class="num">0.000</span>, <span class="num">-0.757</span>, <span class="num">-0.469</span>],
]

<span class="cm"># Find index of minimum energy conformer</span>
<span class="nm">best_idx</span> = <span class="nm">energies</span>.<span class="fn">index</span>(<span class="fn">min</span>(<span class="nm">energies</span>))`,

      cheatsheet: [
        { syn: 'lst = [a, b, c]',         desc: 'Create a list with initial elements' },
        { syn: 'lst[0]  lst[-1]',          desc: 'First / last element (0-indexed)' },
        { syn: 'lst[a:b]',                desc: 'Slice from index a up to (not including) b' },
        { syn: 'lst.append(x)',            desc: 'Add element to end (grow the list)' },
        { syn: 'lst.insert(i, x)',         desc: 'Insert x at position i' },
        { syn: 'lst.pop()',                desc: 'Remove and return last element' },
        { syn: 'lst.sort()',               desc: 'Sort in place (ascending by default)' },
        { syn: 'sorted(lst)',              desc: 'Return new sorted list (original unchanged)' },
        { syn: 'lst.index(x)',             desc: 'Index of first occurrence of x' },
        { syn: 'len(lst)',                 desc: 'Number of elements' },
        { syn: 'min(lst)  max(lst)',       desc: 'Smallest / largest value in a numeric list' },
        { syn: 'sum(lst)',                 desc: 'Sum of all elements (total energy, etc.)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Given energies = [-76.40, -56.56, -40.52], what does energies[-1] return?',
          opts: ['-76.40', '-56.56', '-40.52', 'IndexError'],
          answer: 2,
          feedback: 'Correct — negative indexing counts from the end. Index -1 is the last element: -40.52.',
        },
        {
          type: 'fill',
          q: 'Add a new conformer energy to the list:',
          pre: 'energies.___(−152.9878)',
          answer: 'append',
          feedback: 'Correct! append() adds a single element to the end of the list.',
        },
        {
          type: 'challenge',
          q: 'You have a list of conformer energies in hartree:\n' +
             'energies = [-152.9834, -152.9801, -152.9912, -152.9756, -152.9878]\n' +
             'Write code that: (1) finds the minimum energy (most stable conformer),\n' +
             '(2) computes relative energies in kcal/mol (each minus the minimum, times 627.509),\n' +
             '(3) prints a numbered table of conformers with absolute and relative energies.',
          hint: 'Use min() to find the lowest, then loop with enumerate to compute and print relative energies.',
          answer:
`energies = [-152.9834, -152.9801, -152.9912, -152.9756, -152.9878]

e_min = min(energies)
print(f"{'Conf':>6} {'E (Ha)':>14} {'ΔE (kcal/mol)':>14}")
for i, e in enumerate(energies):
    de_kcal = (e - e_min) * 627.509
    print(f"{i+1:>6} {e:>14.6f} {de_kcal:>14.2f}")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Lists',
          url:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Python Lists and Tuples',
          url:  'https://realpython.com/python-lists-tuples/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python Lists',
          url:  'https://www.w3schools.com/python/python_lists.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  TUPLES & SETS
    // ════════════════════════════════════════════════════════
    {
      id:   'tuples-sets',
      name: 'Tuples & Sets',
      desc: 'Immutable coordinates, function return values, and unique element collections for chemistry data',

      explanation: `
        <p>A <strong>tuple</strong> is an immutable ordered sequence created with parentheses:
        <code>(x, y, z)</code>. Tuples are used when data should not change after creation —
        atomic coordinates, cell parameters, and function return values are natural tuples.
        Because they are immutable, tuples can serve as dictionary keys (lists cannot).</p>

        <p>Tuples support indexing and slicing just like lists, but you cannot assign to
        elements: <code>coords[0] = 1.0</code> raises <code>TypeError</code>. Tuple
        <strong>unpacking</strong> is a powerful pattern:
        <code>x, y, z = (0.0, 0.757, -0.469)</code> assigns each element to a separate
        variable in one line — commonly used when a function returns multiple values.</p>

        <p>A <strong>set</strong> is an unordered collection of unique elements created with
        <code>{a, b, c}</code> or <code>set()</code>. Sets are ideal for collecting unique
        atom types from a molecule, finding common elements between two structures, or
        removing duplicates from a list. Set operations — union (<code>|</code>),
        intersection (<code>&amp;</code>), difference (<code>-</code>) — map directly
        to comparing molecular compositions.</p>
      `,

      code: `<span class="cm"># Tuple: atomic coordinate (immutable)</span>
<span class="nm">oxygen_pos</span> = (<span class="num">0.000</span>, <span class="num">0.000</span>, <span class="num">0.117</span>)
<span class="nm">x</span>, <span class="nm">y</span>, <span class="nm">z</span> = <span class="nm">oxygen_pos</span>  <span class="cm"># unpack into three variables</span>

<span class="cm"># Tuple as function return value</span>
<span class="kw">def</span> <span class="fn">cell_params</span>():
    <span class="kw">return</span> <span class="num">5.43</span>, <span class="num">5.43</span>, <span class="num">5.43</span>, <span class="num">90.0</span>, <span class="num">90.0</span>, <span class="num">90.0</span>  <span class="cm"># Si cubic</span>

<span class="nm">a</span>, <span class="nm">b</span>, <span class="nm">c</span>, <span class="nm">alpha</span>, <span class="nm">beta</span>, <span class="nm">gamma</span> = <span class="fn">cell_params</span>()

<span class="cm"># Tuple as dict key (atom type + index)</span>
<span class="nm">charges</span> = {(<span class="st">"O"</span>, <span class="num">1</span>): <span class="num">-0.82</span>, (<span class="st">"H"</span>, <span class="num">2</span>): <span class="num">0.41</span>}

<span class="cm"># Set: unique atom types in a molecule</span>
<span class="nm">atoms</span> = [<span class="st">"C"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>, <span class="st">"O"</span>, <span class="st">"H"</span>]  <span class="cm"># methanol</span>
<span class="nm">unique</span> = <span class="fn">set</span>(<span class="nm">atoms</span>)         <span class="cm"># {'C', 'H', 'O'}</span>
<span class="fn">print</span>(<span class="fn">len</span>(<span class="nm">unique</span>))           <span class="cm"># 3 element types</span>

<span class="cm"># Set operations: compare compositions</span>
<span class="nm">mol_a</span> = {<span class="st">"C"</span>, <span class="st">"H"</span>, <span class="st">"O"</span>}    <span class="cm"># methanol</span>
<span class="nm">mol_b</span> = {<span class="st">"C"</span>, <span class="st">"H"</span>, <span class="st">"N"</span>}    <span class="cm"># methylamine</span>
<span class="fn">print</span>(<span class="nm">mol_a</span> <span class="op">&</span> <span class="nm">mol_b</span>)         <span class="cm"># {'C', 'H'} — shared elements</span>
<span class="fn">print</span>(<span class="nm">mol_a</span> <span class="op">|</span> <span class="nm">mol_b</span>)         <span class="cm"># {'C', 'H', 'O', 'N'} — all elements</span>
<span class="fn">print</span>(<span class="nm">mol_a</span> <span class="op">-</span> <span class="nm">mol_b</span>)         <span class="cm"># {'O'} — in methanol but not methylamine</span>`,

      cheatsheet: [
        { syn: 't = (a, b, c)',           desc: 'Create a tuple (immutable sequence)' },
        { syn: 'x, y, z = t',            desc: 'Unpack tuple into variables' },
        { syn: 't[0]  t[-1]',            desc: 'Index a tuple (same as list)' },
        { syn: 'len(t)',                  desc: 'Number of elements in tuple' },
        { syn: 's = {a, b, c}',          desc: 'Create a set (unique, unordered)' },
        { syn: 'set(list)',               desc: 'Convert list to set (removes duplicates)' },
        { syn: 's.add(x)',               desc: 'Add one element to a set' },
        { syn: 'a & b',                  desc: 'Intersection — elements in both sets' },
        { syn: 'a | b',                  desc: 'Union — elements in either set' },
        { syn: 'a - b',                  desc: 'Difference — in a but not in b' },
        { syn: 'x in s',                 desc: 'Membership test (O(1) for sets)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why would you store an atomic coordinate as a tuple (0.0, 0.757, -0.469) rather than a list?',
          opts: [
            'Tuples are faster to sort',
            'Tuples are immutable — coordinates should not accidentally change',
            'Tuples use less syntax to create',
            'Lists cannot store floats'
          ],
          answer: 1,
          feedback: 'Correct — immutability protects coordinate data from accidental modification and allows use as dict keys.',
        },
        {
          type: 'fill',
          q: 'Get the unique atom types from a list of symbols:',
          pre: 'unique_atoms = ___(["C", "H", "H", "O", "H"])',
          answer: 'set',
          feedback: 'Correct! set() creates a set of unique elements: {"C", "H", "O"}.',
        },
        {
          type: 'challenge',
          q: 'Two molecules are described by their atom lists:\n' +
             'ethanol = ["C", "C", "H", "H", "H", "H", "H", "O", "H"]\n' +
             'acetic_acid = ["C", "C", "H", "H", "H", "O", "O", "H"]\n' +
             'Write code that: (1) finds the unique elements in each molecule,\n' +
             '(2) finds elements shared by both (intersection),\n' +
             '(3) finds elements unique to each molecule (symmetric difference),\n' +
             '(4) prints all results.',
          hint: 'Convert to sets with set(), then use & for intersection and ^ for symmetric difference.',
          answer:
`ethanol = ["C", "C", "H", "H", "H", "H", "H", "O", "H"]
acetic_acid = ["C", "C", "H", "H", "H", "O", "O", "H"]

elems_eth = set(ethanol)       # {'C', 'H', 'O'}
elems_aa  = set(acetic_acid)   # {'C', 'H', 'O'}

shared = elems_eth & elems_aa
unique_to_each = elems_eth ^ elems_aa

print(f"Ethanol elements:     {elems_eth}")
print(f"Acetic acid elements: {elems_aa}")
print(f"Shared:               {shared}")
print(f"Symmetric difference: {unique_to_each}")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Tuples and Sequences',
          url:  'https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '📘', title: 'Python Docs: Sets',
          url:  'https://docs.python.org/3/tutorial/datastructures.html#sets',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Sets in Python',
          url:  'https://realpython.com/python-sets/',
          tag: 'tutorial', tagColor: 'green',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  DICTIONARIES
    // ════════════════════════════════════════════════════════
    {
      id:   'dicts',
      name: 'Dictionaries',
      desc: 'Mapping molecule names to properties, storing parsed output data, and building result records',

      explanation: `
        <p>A <strong>dictionary</strong> (<code>dict</code>) maps keys to values:
        <code>{"H2O": -76.4026, "NH3": -56.5640}</code>. Dictionaries are the natural
        structure for molecular property databases — map molecule names to energies,
        atom symbols to masses, or basis set names to sizes. Key lookup is O(1), making
        dicts far faster than scanning a list.</p>

        <p>Access values with <code>d[key]</code> (raises <code>KeyError</code> if missing)
        or <code>d.get(key, default)</code> (returns a fallback). Add or update entries with
        <code>d[key] = value</code>. Iterate with <code>.keys()</code>,
        <code>.values()</code>, or <code>.items()</code> — the last gives
        <code>(key, value)</code> tuples, ideal for printing result tables.</p>

        <p>Nested dictionaries model hierarchical data naturally: a calculation result
        might be <code>{"energy": -76.40, "dipole": 1.85, "converged": True}</code>.
        In practice, you build these by parsing output files line by line, adding each
        extracted quantity as a key-value pair. This is the foundation for building
        structured datasets from raw computational output.</p>
      `,

      code: `<span class="cm"># Map molecule names to SCF energies (Ha)</span>
<span class="nm">energies</span> = {
    <span class="st">"H2O"</span>: <span class="num">-76.4026</span>,
    <span class="st">"NH3"</span>: <span class="num">-56.5640</span>,
    <span class="st">"CH4"</span>: <span class="num">-40.5180</span>,
}

<span class="cm"># Access and safe access</span>
<span class="nm">e_water</span> = <span class="nm">energies</span>[<span class="st">"H2O"</span>]              <span class="cm"># -76.4026</span>
<span class="nm">e_co2</span>   = <span class="nm">energies</span>.<span class="fn">get</span>(<span class="st">"CO2"</span>, <span class="kw">None</span>)   <span class="cm"># None (not found)</span>

<span class="cm"># Add new entry</span>
<span class="nm">energies</span>[<span class="st">"CO2"</span>] = <span class="num">-188.5892</span>

<span class="cm"># Iterate: print all molecules</span>
<span class="kw">for</span> <span class="nm">mol</span>, <span class="nm">e</span> <span class="kw">in</span> <span class="nm">energies</span>.<span class="fn">items</span>():
    <span class="fn">print</span>(<span class="st">f"<span class="nm">{mol:&lt;5}</span> E = <span class="nm">{e:.4f}</span> Ha"</span>)

<span class="cm"># Nested dict: full calculation record</span>
<span class="nm">result</span> = {
    <span class="st">"molecule"</span>:  <span class="st">"H2O"</span>,
    <span class="st">"method"</span>:    <span class="st">"B3LYP/def2-TZVP"</span>,
    <span class="st">"energy_ha"</span>: <span class="num">-76.4026</span>,
    <span class="st">"converged"</span>: <span class="kw">True</span>,
    <span class="st">"dipole_D"</span>:  <span class="num">1.847</span>,
}
<span class="fn">print</span>(<span class="nm">result</span>[<span class="st">"energy_ha"</span>])             <span class="cm"># -76.4026</span>

<span class="cm"># Atomic masses lookup</span>
<span class="nm">MASS</span> = {<span class="st">"H"</span>: <span class="num">1.008</span>, <span class="st">"C"</span>: <span class="num">12.011</span>, <span class="st">"O"</span>: <span class="num">15.999</span>}
<span class="nm">mol_mass</span> = <span class="num">2</span> <span class="op">*</span> <span class="nm">MASS</span>[<span class="st">"H"</span>] <span class="op">+</span> <span class="nm">MASS</span>[<span class="st">"O"</span>]   <span class="cm"># 18.015 g/mol</span>`,

      cheatsheet: [
        { syn: 'd = {"key": val}',         desc: 'Create a dictionary with initial pairs' },
        { syn: 'd[key]',                   desc: 'Get value (raises KeyError if missing)' },
        { syn: 'd.get(key, default)',      desc: 'Get value with fallback (no error)' },
        { syn: 'd[key] = val',            desc: 'Set or update a key-value pair' },
        { syn: 'del d[key]',              desc: 'Remove a key-value pair' },
        { syn: 'd.keys()',                desc: 'View of all keys' },
        { syn: 'd.values()',              desc: 'View of all values' },
        { syn: 'd.items()',               desc: 'View of (key, value) pairs — ideal for loops' },
        { syn: 'key in d',                desc: 'Check if key exists (O(1) lookup)' },
        { syn: 'len(d)',                  desc: 'Number of key-value pairs' },
        { syn: 'd.update(other)',         desc: 'Merge another dict into d' },
        { syn: '{**d1, **d2}',            desc: 'Merge two dicts into a new one (Python 3.5+)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What happens when you access energies["CO2"] and "CO2" is not a key in the dictionary?',
          opts: [
            'Returns None',
            'Returns 0',
            'Raises KeyError',
            'Adds "CO2" with value None'
          ],
          answer: 2,
          feedback: 'Correct — d[key] raises KeyError for missing keys. Use d.get(key, default) for safe access.',
        },
        {
          type: 'fill',
          q: 'Safely get a value from a dict with a fallback of 0.0:',
          pre: 'energy = results.___(\"CH4\", 0.0)',
          answer: 'get',
          feedback: 'Correct! get() returns the default value (0.0) when the key is not found.',
        },
        {
          type: 'challenge',
          q: 'Build a molecular property database. Given these ORCA results:\n' +
             'H2O: E = -76.4026 Ha, dipole = 1.847 D, converged = True\n' +
             'NH3: E = -56.5640 Ha, dipole = 1.470 D, converged = True\n' +
             'CH4: E = -40.5180 Ha, dipole = 0.000 D, converged = True\n' +
             'Write code that: (1) stores each molecule as a nested dict,\n' +
             '(2) collects them in a dict keyed by formula,\n' +
             '(3) loops through and prints a formatted table,\n' +
             '(4) finds the molecule with the lowest energy.',
          hint: 'Create a dict of dicts. Use .items() to iterate. Use min() with a key function to find the lowest energy.',
          answer:
`database = {
    "H2O": {"energy": -76.4026, "dipole": 1.847, "converged": True},
    "NH3": {"energy": -56.5640, "dipole": 1.470, "converged": True},
    "CH4": {"energy": -40.5180, "dipole": 0.000, "converged": True},
}

print(f"{'Mol':>5} {'E (Ha)':>12} {'Dipole (D)':>10}")
for mol, props in database.items():
    print(f"{mol:>5} {props['energy']:>12.4f} {props['dipole']:>10.3f}")

most_stable = min(database, key=lambda m: database[m]["energy"])
print(f"\\nMost stable: {most_stable}")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Dictionaries',
          url:  'https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Dictionaries in Python',
          url:  'https://realpython.com/python-dicts/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python Dictionaries',
          url:  'https://www.w3schools.com/python/python_dictionaries.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  FILE I/O
    // ════════════════════════════════════════════════════════
    {
      id:   'file-io',
      name: 'File I/O',
      desc: 'Reading ORCA output files, writing input decks, and processing computational chemistry results',

      explanation: `
        <p><strong>File I/O</strong> is how your script interacts with the filesystem —
        reading output files from ORCA, Gaussian, or VASP, and writing input files or
        result summaries. Python's built-in <code>open()</code> function returns a file
        object. Always use the <code>with</code> statement (context manager) which
        automatically closes the file even if an error occurs.</p>

        <p>For <strong>reading</strong>, open in <code>"r"</code> mode (the default).
        Use <code>.read()</code> for the entire file as one string, <code>.readlines()</code>
        for a list of lines, or iterate directly with <code>for line in f:</code> — the
        most memory-efficient approach for large output files. Each line includes the
        trailing newline, so call <code>.strip()</code> before processing.</p>

        <p>For <strong>writing</strong>, open in <code>"w"</code> mode (overwrites) or
        <code>"a"</code> mode (appends). Use <code>f.write(string)</code> for raw output
        or <code>print(..., file=f)</code> for formatted output with automatic newlines.
        Writing ORCA input files, generating batch submission scripts, and saving parsed
        energy tables to CSV are everyday file I/O tasks in compchem workflows.</p>
      `,

      code: `<span class="cm"># Read an ORCA output file and extract the SCF energy</span>
<span class="nm">energy</span> = <span class="kw">None</span>
<span class="kw">with</span> <span class="fn">open</span>(<span class="st">"water.out"</span>, <span class="st">"r"</span>) <span class="kw">as</span> <span class="nm">f</span>:
    <span class="kw">for</span> <span class="nm">line</span> <span class="kw">in</span> <span class="nm">f</span>:
        <span class="kw">if</span> <span class="st">"FINAL SINGLE POINT"</span> <span class="kw">in</span> <span class="nm">line</span>:
            <span class="nm">energy</span> = <span class="fn">float</span>(<span class="nm">line</span>.<span class="fn">split</span>()[<span class="num">-1</span>])

<span class="cm"># Write an ORCA input file</span>
<span class="kw">with</span> <span class="fn">open</span>(<span class="st">"water_opt.inp"</span>, <span class="st">"w"</span>) <span class="kw">as</span> <span class="nm">f</span>:
    <span class="nm">f</span>.<span class="fn">write</span>(<span class="st">"! B3LYP def2-TZVP Opt\n"</span>)
    <span class="nm">f</span>.<span class="fn">write</span>(<span class="st">"* xyz 0 1\n"</span>)
    <span class="nm">f</span>.<span class="fn">write</span>(<span class="st">"O  0.000  0.000  0.117\n"</span>)
    <span class="nm">f</span>.<span class="fn">write</span>(<span class="st">"H  0.000  0.757 -0.469\n"</span>)
    <span class="nm">f</span>.<span class="fn">write</span>(<span class="st">"H  0.000 -0.757 -0.469\n"</span>)
    <span class="nm">f</span>.<span class="fn">write</span>(<span class="st">"*\n"</span>)

<span class="cm"># Read all lines at once (small files only)</span>
<span class="kw">with</span> <span class="fn">open</span>(<span class="st">"results.csv"</span>, <span class="st">"r"</span>) <span class="kw">as</span> <span class="nm">f</span>:
    <span class="nm">header</span> = <span class="nm">f</span>.<span class="fn">readline</span>().<span class="fn">strip</span>()
    <span class="nm">rows</span> = [<span class="nm">line</span>.<span class="fn">strip</span>().<span class="fn">split</span>(<span class="st">","</span>) <span class="kw">for</span> <span class="nm">line</span> <span class="kw">in</span> <span class="nm">f</span>]

<span class="cm"># Append a result to a log file</span>
<span class="kw">with</span> <span class="fn">open</span>(<span class="st">"energies.log"</span>, <span class="st">"a"</span>) <span class="kw">as</span> <span class="nm">f</span>:
    <span class="fn">print</span>(<span class="st">f"H2O  -76.4026  converged"</span>, <span class="nm">file</span>=<span class="nm">f</span>)`,

      cheatsheet: [
        { syn: 'with open(f) as fh:',     desc: 'Open file with automatic close (context manager)' },
        { syn: 'open(f, "r")',             desc: 'Open for reading (default mode)' },
        { syn: 'open(f, "w")',             desc: 'Open for writing (overwrites existing file)' },
        { syn: 'open(f, "a")',             desc: 'Open for appending (adds to end)' },
        { syn: 'for line in fh:',          desc: 'Iterate over lines (memory-efficient)' },
        { syn: 'fh.read()',                desc: 'Read entire file as one string' },
        { syn: 'fh.readlines()',           desc: 'Read all lines into a list' },
        { syn: 'fh.readline()',            desc: 'Read one line at a time' },
        { syn: 'fh.write(s)',              desc: 'Write string to file (no auto newline)' },
        { syn: 'print(s, file=fh)',        desc: 'Write with auto newline' },
        { syn: 'line.strip()',             desc: 'Remove trailing newline from each line' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why should you use "with open(...) as f:" instead of "f = open(...)" when reading output files?',
          opts: [
            'It runs faster',
            'It automatically closes the file even if an error occurs',
            'It reads the file in binary mode',
            'It prevents other programs from reading the file'
          ],
          answer: 1,
          feedback: 'Correct — the with statement guarantees the file is closed when the block exits, even on exceptions.',
        },
        {
          type: 'fill',
          q: 'Open a file for writing an ORCA input deck:',
          pre: 'with open("mol.inp", "___") as f:',
          answer: 'w',
          feedback: 'Correct! Mode "w" opens the file for writing, creating it if it does not exist.',
        },
        {
          type: 'challenge',
          q: 'Write code that reads an ORCA output file (simulated as a multi-line string).\n' +
             'The file contains lines like:\n' +
             '"SCF CONVERGED AFTER 8 CYCLES"\n' +
             '"FINAL SINGLE POINT ENERGY      -152.983417"\n' +
             '"Total Dipole Moment    :    1.847 Debye"\n' +
             'Extract: (1) whether SCF converged, (2) the energy as float, (3) the dipole as float.\n' +
             'Store results in a dict and print it.',
          hint: 'Loop through lines, check for keywords with "in", extract values with split() and float().',
          answer:
`# Simulated output (in practice: open("calc.out") as f)
output_lines = [
    "SCF CONVERGED AFTER 8 CYCLES",
    "FINAL SINGLE POINT ENERGY      -152.983417",
    "Total Dipole Moment    :    1.847 Debye",
]

result = {"converged": False, "energy": None, "dipole": None}
for line in output_lines:
    if "SCF CONVERGED" in line:
        result["converged"] = True
    elif "FINAL SINGLE POINT" in line:
        result["energy"] = float(line.split()[-1])
    elif "Dipole Moment" in line:
        result["dipole"] = float(line.split()[-2])

for key, val in result.items():
    print(f"{key:>12}: {val}")`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Reading and Writing Files',
          url:  'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Read and Write Files',
          url:  'https://realpython.com/read-write-files-python/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python File Handling',
          url:  'https://www.w3schools.com/python/python_file_handling.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

    // ════════════════════════════════════════════════════════
    //  ERROR HANDLING
    // ════════════════════════════════════════════════════════
    {
      id:   'error-handling',
      name: 'Error Handling',
      desc: 'Catching file-not-found errors, invalid conversions, and failed calculations gracefully',

      explanation: `
        <p><strong>Exceptions</strong> are Python's mechanism for handling errors at runtime.
        When something goes wrong — a file doesn't exist, a string can't convert to float,
        or a dictionary key is missing — Python raises an exception. Without handling, the
        program crashes. The <code>try</code>/<code>except</code> block lets you catch
        exceptions and respond gracefully.</p>

        <p>Common exceptions in compchem scripts: <code>FileNotFoundError</code> when an
        output file is missing, <code>ValueError</code> when a parsed string can't convert
        to float (corrupt output), <code>KeyError</code> for missing dictionary entries, and
        <code>IndexError</code> when split() returns fewer tokens than expected.
        Always catch <strong>specific</strong> exceptions — bare <code>except:</code>
        hides real bugs.</p>

        <p>The full pattern is <code>try</code>/<code>except</code>/<code>else</code>/<code>finally</code>.
        The <code>else</code> block runs only if no exception occurred (useful for post-processing),
        and <code>finally</code> always runs (cleanup code). You can also <code>raise</code>
        your own exceptions to signal invalid input — e.g., raising <code>ValueError</code>
        if a user specifies a negative multiplicity.</p>
      `,

      code: `<span class="cm"># Safely read an output file that might not exist</span>
<span class="kw">try</span>:
    <span class="kw">with</span> <span class="fn">open</span>(<span class="st">"water.out"</span>) <span class="kw">as</span> <span class="nm">f</span>:
        <span class="nm">data</span> = <span class="nm">f</span>.<span class="fn">read</span>()
<span class="kw">except</span> <span class="bi">FileNotFoundError</span>:
    <span class="fn">print</span>(<span class="st">"Output file not found — run calculation first"</span>)
    <span class="nm">data</span> = <span class="st">""</span>

<span class="cm"># Safely parse an energy value from a corrupted line</span>
<span class="nm">line</span> = <span class="st">"FINAL SINGLE POINT ENERGY      ****"</span>
<span class="kw">try</span>:
    <span class="nm">energy</span> = <span class="fn">float</span>(<span class="nm">line</span>.<span class="fn">split</span>()[<span class="num">-1</span>])
<span class="kw">except</span> <span class="bi">ValueError</span>:
    <span class="fn">print</span>(<span class="st">"Could not parse energy — SCF may have failed"</span>)
    <span class="nm">energy</span> = <span class="kw">None</span>

<span class="cm"># Multiple exception types</span>
<span class="kw">def</span> <span class="fn">get_energy</span>(<span class="nm">results</span>, <span class="nm">mol_name</span>):
    <span class="kw">try</span>:
        <span class="kw">return</span> <span class="fn">float</span>(<span class="nm">results</span>[<span class="nm">mol_name</span>])
    <span class="kw">except</span> <span class="bi">KeyError</span>:
        <span class="fn">print</span>(<span class="st">f"No result for <span class="nm">{mol_name}</span>"</span>)
    <span class="kw">except</span> <span class="bi">ValueError</span>:
        <span class="fn">print</span>(<span class="st">f"Invalid energy for <span class="nm">{mol_name}</span>"</span>)
    <span class="kw">return</span> <span class="kw">None</span>

<span class="cm"># Raise your own exception for invalid input</span>
<span class="kw">def</span> <span class="fn">validate_mult</span>(<span class="nm">mult</span>):
    <span class="kw">if</span> <span class="nm">mult</span> <span class="op">&lt;</span> <span class="num">1</span>:
        <span class="kw">raise</span> <span class="bi">ValueError</span>(<span class="st">f"Multiplicity must be ≥ 1, got <span class="nm">{mult}</span>"</span>)
    <span class="kw">return</span> <span class="nm">mult</span>`,

      cheatsheet: [
        { syn: 'try: ... except E:',       desc: 'Catch exception of type E' },
        { syn: 'except E as e:',           desc: 'Catch and bind the error message to e' },
        { syn: 'except (E1, E2):',         desc: 'Catch multiple exception types' },
        { syn: 'else:',                    desc: 'Runs only if no exception was raised' },
        { syn: 'finally:',                 desc: 'Always runs (cleanup code)' },
        { syn: 'raise ValueError(msg)',    desc: 'Raise an exception explicitly' },
        { syn: 'FileNotFoundError',        desc: 'File does not exist (missing .out file)' },
        { syn: 'ValueError',              desc: 'Invalid conversion (e.g., float("****"))' },
        { syn: 'KeyError',                desc: 'Missing dictionary key' },
        { syn: 'IndexError',              desc: 'Index out of range (empty split() result)' },
        { syn: 'TypeError',               desc: 'Wrong type (e.g., adding str to float)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What exception is raised by float("****") when parsing a failed SCF energy?',
          opts: ['TypeError', 'ValueError', 'RuntimeError', 'SyntaxError'],
          answer: 1,
          feedback: 'Correct — ValueError is raised when a string cannot be converted to the target numeric type.',
        },
        {
          type: 'fill',
          q: 'Catch the error when an output file does not exist:',
          pre: 'try:\n    f = open("calc.out")\nexcept ___:\n    print("File missing")',
          answer: 'FileNotFoundError',
          feedback: 'Correct! FileNotFoundError is raised when open() cannot find the specified file.',
        },
        {
          type: 'challenge',
          q: 'Write a robust ORCA output parser function parse_output(filename) that:\n' +
             '(1) opens the file (handle FileNotFoundError),\n' +
             '(2) searches for the energy line (handle the case where it is not found),\n' +
             '(3) converts the energy to float (handle ValueError for corrupted output),\n' +
             '(4) returns a dict {"energy": float_or_None, "error": error_message_or_None}.\n' +
             'Test with a simulated call.',
          hint: 'Use try/except for file open, loop through lines to find the keyword, and try/except again for the float conversion.',
          answer:
`def parse_output(filename):
    """Parse ORCA output file for SCF energy, with error handling."""
    try:
        with open(filename) as f:
            lines = f.readlines()
    except FileNotFoundError:
        return {"energy": None, "error": f"File not found: {filename}"}

    for line in lines:
        if "FINAL SINGLE POINT" in line:
            try:
                energy = float(line.split()[-1])
                return {"energy": energy, "error": None}
            except ValueError:
                return {"energy": None, "error": "Corrupt energy value"}

    return {"energy": None, "error": "Energy line not found in output"}

# Test
result = parse_output("missing.out")
print(result)  # {'energy': None, 'error': 'File not found: missing.out'}`,
        },
      ],

      resources: [
        {
          icon: '📘', title: 'Python Docs: Errors and Exceptions',
          url:  'https://docs.python.org/3/tutorial/errors.html',
          tag: 'official', tagColor: 'blue',
        },
        {
          icon: '🎓', title: 'Real Python: Exception Handling',
          url:  'https://realpython.com/python-exceptions/',
          tag: 'tutorial', tagColor: 'green',
        },
        {
          icon: '⚡', title: 'W3Schools: Python Try Except',
          url:  'https://www.w3schools.com/python/python_try_except.asp',
          tag: 'quick ref', tagColor: 'orange',
        },
      ],
    },

  ],
};
