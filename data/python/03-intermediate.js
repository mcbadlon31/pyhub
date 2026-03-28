/**
 * data/python/03-intermediate.js
 * Stage 03: Intermediate
 * Topics: comprehensions,oop,modules,args-kwargs,lambda-map-filter,decorators,generators
 *
 * All challenge exercises use computational chemistry / materials science context.
 * Code line limits: 15–35 lines per topic.
 */

window.PY_S3 = {
  id: 'py-s3', num: '03', title: 'Intermediate',
  color: 'purple', meta: 'Weeks 6-9', track: 'python',
  topics: [

    // ════════════════════════════════════════════════════════
    //  COMPREHENSIONS
    // ════════════════════════════════════════════════════════
    {
      id:   'comprehensions',
      name: 'Comprehensions',
      desc: 'Concise list, dict, and set construction from molecular data',

      explanation: `
        <p><strong>List comprehensions</strong> are a compact way to build a new list
        by transforming or filtering an existing iterable. The syntax
        <code>[expr for x in iterable]</code> replaces a multi-line <code>for</code>
        loop with a single readable expression. In computational chemistry you use
        them constantly — converting a list of energies from hartree to kcal/mol,
        extracting atom symbols from coordinate blocks, or collecting converged
        results from a batch of calculations.</p>

        <p>Add an <code>if</code> clause to <strong>filter</strong>:
        <code>[e for e in energies if e &lt; threshold]</code> keeps only values
        below the threshold. You can also <strong>nest</strong> comprehensions for
        multi-level data, though readability drops quickly — prefer a regular loop
        when nesting beyond two levels.</p>

        <p><strong>Dict comprehensions</strong> (<code>{k: v for ...}</code>) and
        <strong>set comprehensions</strong> (<code>{x for ...}</code>) follow the
        same pattern. Dict comps are perfect for building lookup tables —
        mapping molecule names to energies, or atom indices to coordinates.
        Set comps give unique elements, such as the distinct element symbols in a
        molecular system.</p>
      `,

      code: `<span class="cm"># Convert a list of energies from hartree to kcal/mol</span>
<span class="nm">energies_ha</span> = [<span class="num">-76.4026</span>, <span class="num">-152.983</span>, <span class="num">-230.715</span>]
<span class="nm">energies_kcal</span> = [<span class="nm">e</span> <span class="op">*</span> <span class="num">627.509</span> <span class="kw">for</span> <span class="nm">e</span> <span class="kw">in</span> <span class="nm">energies_ha</span>]

<span class="cm"># Filter: keep only converged calculations</span>
<span class="nm">results</span> = [
    {<span class="st">"name"</span>: <span class="st">"H2O"</span>,  <span class="st">"converged"</span>: <span class="kw">True</span>,  <span class="st">"energy"</span>: <span class="num">-76.4026</span>},
    {<span class="st">"name"</span>: <span class="st">"NH3"</span>,  <span class="st">"converged"</span>: <span class="kw">False</span>, <span class="st">"energy"</span>: <span class="kw">None</span>},
    {<span class="st">"name"</span>: <span class="st">"CH4"</span>,  <span class="st">"converged"</span>: <span class="kw">True</span>,  <span class="st">"energy"</span>: <span class="num">-40.5184</span>},
]
<span class="nm">good</span> = [<span class="nm">r</span>[<span class="st">"energy"</span>] <span class="kw">for</span> <span class="nm">r</span> <span class="kw">in</span> <span class="nm">results</span> <span class="kw">if</span> <span class="nm">r</span>[<span class="st">"converged"</span>]]

<span class="cm"># Dict comprehension: molecule → energy lookup</span>
<span class="nm">energy_table</span> = {<span class="nm">r</span>[<span class="st">"name"</span>]: <span class="nm">r</span>[<span class="st">"energy"</span>] <span class="kw">for</span> <span class="nm">r</span> <span class="kw">in</span> <span class="nm">results</span> <span class="kw">if</span> <span class="nm">r</span>[<span class="st">"converged"</span>]}

<span class="cm"># Set comprehension: unique elements in a molecule</span>
<span class="nm">atoms</span> = [<span class="st">"C"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>, <span class="st">"O"</span>, <span class="st">"H"</span>]
<span class="nm">elements</span> = {<span class="nm">a</span> <span class="kw">for</span> <span class="nm">a</span> <span class="kw">in</span> <span class="nm">atoms</span>}  <span class="cm"># {'C', 'H', 'O'}</span>

<span class="cm"># Nested: flatten multi-conformer coordinates</span>
<span class="nm">conformers</span> = [[[<span class="num">0.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>], [<span class="num">0.96</span>, <span class="num">0.0</span>, <span class="num">0.0</span>]],
              [[<span class="num">0.1</span>, <span class="num">0.0</span>, <span class="num">0.0</span>], [<span class="num">0.97</span>, <span class="num">0.0</span>, <span class="num">0.0</span>]]]
<span class="nm">all_coords</span> = [<span class="nm">c</span> <span class="kw">for</span> <span class="nm">conf</span> <span class="kw">in</span> <span class="nm">conformers</span> <span class="kw">for</span> <span class="nm">c</span> <span class="kw">in</span> <span class="nm">conf</span>]`,

      cheatsheet: [
        { syn: '[x*2 for x in lst]',               desc: 'List comprehension — transform each element' },
        { syn: '[x for x in lst if cond]',          desc: 'Filtered comprehension — keep matching items' },
        { syn: '{k: v for k, v in pairs}',          desc: 'Dict comprehension from key-value pairs' },
        { syn: '{x for x in lst}',                  desc: 'Set comprehension — unique elements only' },
        { syn: '[f(x) for x in lst if g(x)]',       desc: 'Transform + filter in one expression' },
        { syn: '[x for row in mat for x in row]',   desc: 'Nested comprehension — flatten 2D to 1D' },
        { syn: '(x for x in lst)',                   desc: 'Generator expression — lazy, memory-efficient' },
        { syn: '[x if cond else y for ...]',         desc: 'Conditional expression inside comprehension' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>[e * 627.509 for e in [-76.4, -152.9] if e > -100]</code> return?',
          opts: [
            '[-47948.5, -95944.8]',
            '[-47948.5]',
            '[-95944.8]',
            'A generator object'
          ],
          answer: 1,
          feedback: 'The <code>if e > -100</code> filter keeps only -76.4 (since -76.4 > -100 is True), then multiplies it by 627.509.'
        },
        {
          type: 'fill',
          q: 'Complete the dict comprehension to map molecule names to energies:',
          pre: 'lookup = {r["name"]: r["energy"] ___ r in results}',
          answer: 'for',
          feedback: 'Dict comprehensions use <code>for</code> to iterate, just like list comprehensions: <code>{key: val for item in iterable}</code>.'
        },
        {
          type: 'challenge',
          q: 'Given a list of ORCA calculation dicts with keys "molecule", "method", "energy_ha", and "converged", write a dict comprehension that maps molecule names to energies in kcal/mol, including only converged calculations.',
          hint: 'Filter with <code>if calc["converged"]</code> and multiply energy by 627.509.',
          answer: `# calcs = [{"molecule": "H2O", "method": "B3LYP", "energy_ha": -76.4026, "converged": True}, ...]
kcal_lookup = {c["molecule"]: c["energy_ha"] * 627.509
               for c in calcs if c["converged"]}`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — List Comprehensions', url: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — Comprehensions Guide', url: 'https://realpython.com/list-comprehension-python/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  OOP
    // ════════════════════════════════════════════════════════
    {
      id:   'oop',
      name: 'Object-Oriented Programming',
      desc: 'Building a Molecule class with attributes, methods, and dunder methods',

      explanation: `
        <p>A <strong>class</strong> bundles data (attributes) and behaviour (methods)
        into a single object. You define one with <code>class Name:</code> and
        initialize instances via the <code>__init__</code> method. In computational
        chemistry, a <code>Molecule</code> class naturally groups a formula, charge,
        spin multiplicity, and energy together — far cleaner than passing five
        separate variables to every function.</p>

        <p>Instance methods receive <code>self</code> as the first argument, giving
        them access to the object's data. <strong>Dunder methods</strong> (double
        underscore) let your class work with Python's built-in operations:
        <code>__repr__</code> for a developer-friendly string, <code>__str__</code>
        for user-facing output, and <code>__lt__</code> to enable sorting molecules
        by energy with the standard <code>sorted()</code> function.</p>

        <p><strong>Inheritance</strong> creates specialized versions of a class.
        A <code>ORCAMolecule</code> subclass might add an <code>input_block()</code>
        method that generates ORCA input text, while reusing everything in the
        parent <code>Molecule</code>. Use inheritance sparingly — prefer composition
        (storing another object as an attribute) when the relationship is "has a"
        rather than "is a".</p>
      `,

      code: `<span class="kw">class</span> <span class="fn">Molecule</span>:
    <span class="st">"""Represents a molecular system with its computed properties."""</span>

    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">formula</span>, <span class="nm">charge</span>=<span class="num">0</span>, <span class="nm">mult</span>=<span class="num">1</span>, <span class="nm">energy</span>=<span class="kw">None</span>):
        <span class="nm">self</span>.<span class="nm">formula</span> = <span class="nm">formula</span>
        <span class="nm">self</span>.<span class="nm">charge</span>  = <span class="nm">charge</span>
        <span class="nm">self</span>.<span class="nm">mult</span>    = <span class="nm">mult</span>
        <span class="nm">self</span>.<span class="nm">energy</span>  = <span class="nm">energy</span>   <span class="cm"># hartree</span>

    <span class="kw">def</span> <span class="fn">energy_kcal</span>(<span class="nm">self</span>):
        <span class="st">"""Return energy in kcal/mol, or None if not set."""</span>
        <span class="kw">return</span> <span class="nm">self</span>.<span class="nm">energy</span> <span class="op">*</span> <span class="num">627.509</span> <span class="kw">if</span> <span class="nm">self</span>.<span class="nm">energy</span> <span class="kw">else</span> <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">__repr__</span>(<span class="nm">self</span>):
        <span class="kw">return</span> <span class="st">f"Molecule('<span class="nm">{self.formula}</span>', charge=<span class="nm">{self.charge}</span>, mult=<span class="nm">{self.mult}</span>)"</span>

    <span class="kw">def</span> <span class="fn">__lt__</span>(<span class="nm">self</span>, <span class="nm">other</span>):
        <span class="kw">return</span> (<span class="nm">self</span>.<span class="nm">energy</span> <span class="kw">or</span> <span class="num">0</span>) <span class="op">&lt;</span> (<span class="nm">other</span>.<span class="nm">energy</span> <span class="kw">or</span> <span class="num">0</span>)

<span class="cm"># Create instances</span>
<span class="nm">h2o</span> = <span class="fn">Molecule</span>(<span class="st">"H2O"</span>, <span class="nm">energy</span>=<span class="num">-76.4026</span>)
<span class="nm">ch4</span> = <span class="fn">Molecule</span>(<span class="st">"CH4"</span>, <span class="nm">energy</span>=<span class="num">-40.5184</span>)

<span class="cm"># Sort molecules by energy (uses __lt__)</span>
<span class="nm">ordered</span> = <span class="fn">sorted</span>([<span class="nm">h2o</span>, <span class="nm">ch4</span>])
<span class="fn">print</span>(<span class="nm">ordered</span>[<span class="num">0</span>])  <span class="cm"># Molecule('H2O', charge=0, mult=1)</span>`,

      cheatsheet: [
        { syn: 'class Mol:',                     desc: 'Define a new class' },
        { syn: 'def __init__(self, ...):',        desc: 'Constructor — called when creating an instance' },
        { syn: 'self.attr = val',                 desc: 'Set instance attribute inside __init__ or method' },
        { syn: 'mol = Mol("H2O")',                desc: 'Create an instance (calls __init__)' },
        { syn: 'mol.energy_kcal()',               desc: 'Call an instance method' },
        { syn: '__repr__(self)',                   desc: 'Developer-friendly string (shown in REPL)' },
        { syn: '__str__(self)',                    desc: 'User-friendly string (used by print)' },
        { syn: '__lt__(self, other)',              desc: 'Enable < comparison and sorted()' },
        { syn: 'class Sub(Parent):',              desc: 'Inherit from a parent class' },
        { syn: 'super().__init__(...)',            desc: 'Call the parent constructor from subclass' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the purpose of <code>self</code> in a Python class method?',
          opts: [
            'It refers to the class itself',
            'It refers to the current instance of the class',
            'It is a required keyword that Python ignores',
            'It imports the class into the current scope'
          ],
          answer: 1,
          feedback: '<code>self</code> is a reference to the current instance, allowing each object to access its own attributes and methods.'
        },
        {
          type: 'fill',
          q: 'Complete the constructor so it stores the formula:',
          pre: 'def __init__(self, formula):\n    self.___ = formula',
          answer: 'formula',
          feedback: 'Instance attributes are set with <code>self.name = value</code> inside <code>__init__</code>.'
        },
        {
          type: 'challenge',
          q: 'Create a <code>Molecule</code> class with attributes <code>formula</code>, <code>charge</code>, <code>mult</code>, and <code>energy</code> (in hartree). Add a method <code>energy_ev()</code> that returns the energy in electron-volts (1 Ha = 27.2114 eV). Include a <code>__repr__</code> that prints like <code>Molecule(\'H2O\', E=-76.4026 Ha)</code>.',
          hint: 'Multiply self.energy by 27.2114 for eV. Handle None with a conditional.',
          answer: `class Molecule:
    def __init__(self, formula, charge=0, mult=1, energy=None):
        self.formula = formula
        self.charge = charge
        self.mult = mult
        self.energy = energy

    def energy_ev(self):
        return self.energy * 27.2114 if self.energy else None

    def __repr__(self):
        return f"Molecule('{self.formula}', E={self.energy} Ha)"`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — Classes', url: 'https://docs.python.org/3/tutorial/classes.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — OOP in Python', url: 'https://realpython.com/python3-object-oriented-programming/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  MODULES
    // ════════════════════════════════════════════════════════
    {
      id:   'modules',
      name: 'Modules & Imports',
      desc: 'Organizing compchem code into reusable modules and packages',

      explanation: `
        <p>A <strong>module</strong> is simply a <code>.py</code> file containing
        functions, classes, and variables. When your ORCA parser grows beyond a
        single script, you split it into modules: <code>parsers.py</code> for output
        parsing, <code>converters.py</code> for unit conversions, and
        <code>plotters.py</code> for visualization. Import what you need with
        <code>import module</code> or <code>from module import func</code>.</p>

        <p>A <strong>package</strong> is a directory of modules with an
        <code>__init__.py</code> file. Real compchem projects organize code as
        packages: <code>myproject/parsers/orca.py</code>,
        <code>myproject/parsers/gaussian.py</code>, etc. The
        <code>if __name__ == "__main__":</code> guard lets a module run as a script
        while still being importable — critical for writing test scripts that double
        as library code.</p>

        <p>Python's <strong>standard library</strong> provides modules you use daily:
        <code>os.path</code> for file paths, <code>json</code> for configuration
        files, <code>math</code> for constants like π. Third-party packages like
        <code>numpy</code> and <code>ase</code> are installed with <code>pip</code>
        and imported the same way. Always use <strong>absolute imports</strong>
        (<code>from myproject.parsers import orca</code>) over relative imports
        for clarity.</p>
      `,

      code: `<span class="cm"># ─── converters.py ───</span>
<span class="nm">HA_TO_KCAL</span> = <span class="num">627.509</span>
<span class="nm">HA_TO_EV</span>   = <span class="num">27.2114</span>

<span class="kw">def</span> <span class="fn">to_kcal</span>(<span class="nm">energy_ha</span>):
    <span class="kw">return</span> <span class="nm">energy_ha</span> <span class="op">*</span> <span class="nm">HA_TO_KCAL</span>

<span class="cm"># ─── main.py ───</span>
<span class="kw">import</span> <span class="nm">os</span>
<span class="kw">import</span> <span class="nm">json</span>
<span class="kw">from</span> <span class="nm">math</span> <span class="kw">import</span> <span class="nm">pi</span>
<span class="kw">from</span> <span class="nm">converters</span> <span class="kw">import</span> <span class="fn">to_kcal</span>, <span class="nm">HA_TO_EV</span>

<span class="cm"># Use the imported function</span>
<span class="nm">e_kcal</span> = <span class="fn">to_kcal</span>(<span class="num">-76.4026</span>)

<span class="cm"># os.path for robust file handling</span>
<span class="nm">output_dir</span> = <span class="nm">os</span>.<span class="nm">path</span>.<span class="fn">join</span>(<span class="st">"calculations"</span>, <span class="st">"h2o"</span>)
<span class="nm">orca_file</span>  = <span class="nm">os</span>.<span class="nm">path</span>.<span class="fn">join</span>(<span class="nm">output_dir</span>, <span class="st">"h2o.out"</span>)

<span class="cm"># json for config files</span>
<span class="nm">config</span> = {<span class="st">"method"</span>: <span class="st">"B3LYP"</span>, <span class="st">"basis"</span>: <span class="st">"def2-TZVP"</span>}
<span class="kw">with</span> <span class="fn">open</span>(<span class="st">"config.json"</span>, <span class="st">"w"</span>) <span class="kw">as</span> <span class="nm">f</span>:
    <span class="nm">json</span>.<span class="fn">dump</span>(<span class="nm">config</span>, <span class="nm">f</span>)

<span class="cm"># __name__ guard — runs only when executed directly</span>
<span class="kw">if</span> <span class="nm">__name__</span> <span class="op">==</span> <span class="st">"__main__"</span>:
    <span class="fn">print</span>(<span class="st">f"H2O energy: <span class="nm">{e_kcal:.1f}</span> kcal/mol"</span>)`,

      cheatsheet: [
        { syn: 'import os',                          desc: 'Import entire module — access via os.path, os.listdir' },
        { syn: 'from math import pi, sqrt',          desc: 'Import specific names into current scope' },
        { syn: 'import numpy as np',                 desc: 'Import with alias — convention for common libraries' },
        { syn: 'from . import parser',               desc: 'Relative import within a package' },
        { syn: 'if __name__ == "__main__":',          desc: 'Guard block — runs only when file is executed directly' },
        { syn: '__init__.py',                         desc: 'Marks a directory as a Python package' },
        { syn: 'os.path.join("a", "b")',              desc: 'Build file paths — OS-independent separator' },
        { syn: 'json.load(f) / json.dump(obj, f)',    desc: 'Read/write JSON configuration files' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>if __name__ == "__main__":</code> do?',
          opts: [
            'Declares the main class of the module',
            'Runs the block only when the file is imported',
            'Runs the block only when the file is executed directly as a script',
            'Defines the module\'s public API'
          ],
          answer: 2,
          feedback: 'When a file is run directly, <code>__name__</code> is set to <code>"__main__"</code>. When imported, it is set to the module\'s name, so the guarded block is skipped.'
        },
        {
          type: 'fill',
          q: 'Import only the <code>to_kcal</code> function from the converters module:',
          pre: '___ converters import to_kcal',
          answer: 'from',
          feedback: '<code>from module import name</code> imports a specific function or variable into the current namespace.'
        },
        {
          type: 'challenge',
          q: 'Write a module called <code>units.py</code> that defines constants <code>HA_TO_KCAL = 627.509</code>, <code>HA_TO_EV = 27.2114</code>, and <code>BOHR_TO_ANG = 0.529177</code>, plus functions <code>to_kcal(ha)</code>, <code>to_ev(ha)</code>, and <code>to_angstrom(bohr)</code>. Include a <code>__name__</code> guard that tests each conversion on the H2O SCF energy (-76.4026 Ha).',
          hint: 'Each function multiplies by its constant. The guard block calls all three and prints results.',
          answer: `# units.py
HA_TO_KCAL = 627.509
HA_TO_EV = 27.2114
BOHR_TO_ANG = 0.529177

def to_kcal(ha):
    return ha * HA_TO_KCAL

def to_ev(ha):
    return ha * HA_TO_EV

def to_angstrom(bohr):
    return bohr * BOHR_TO_ANG

if __name__ == "__main__":
    e = -76.4026
    print(f"{e} Ha = {to_kcal(e):.1f} kcal/mol")
    print(f"{e} Ha = {to_ev(e):.4f} eV")
    print(f"1.0 bohr = {to_angstrom(1.0):.6f} Å")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — Modules', url: 'https://docs.python.org/3/tutorial/modules.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — Modules & Packages', url: 'https://realpython.com/python-modules-packages/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  ARGS-KWARGS
    // ════════════════════════════════════════════════════════
    {
      id:   'args-kwargs',
      name: '*args & **kwargs',
      desc: 'Flexible function signatures for wrapping calculation engines',

      explanation: `
        <p><code>*args</code> collects <strong>positional arguments</strong> into a
        tuple, and <code>**kwargs</code> collects <strong>keyword arguments</strong>
        into a dictionary. Together they let you write functions that accept an
        arbitrary number of inputs — essential when wrapping computational chemistry
        codes where the set of keywords varies between methods and calculation
        types.</p>

        <p>A function <code>def run_calc(molecule, *args, **kwargs)</code> can accept
        any extra parameters and forward them. This pattern appears constantly in
        scientific Python: ASE calculators pass <code>**kwargs</code> to underlying
        engines, and plotting wrappers forward extra arguments to Matplotlib. The
        key rule is that <code>*args</code> must come before <code>**kwargs</code>
        in the function signature.</p>

        <p>The <code>*</code> and <code>**</code> operators also work in reverse:
        <strong>unpacking</strong>. Calling <code>func(*my_list)</code> spreads a
        list into positional arguments, and <code>func(**my_dict)</code> spreads a
        dict into keyword arguments. This is how you dynamically construct ORCA
        input parameters from a dictionary of settings.</p>
      `,

      code: `<span class="cm"># *args: accept variable number of energies</span>
<span class="kw">def</span> <span class="fn">reaction_energy</span>(<span class="op">*</span><span class="nm">energies</span>):
    <span class="st">"""ΔE = E_products - E_reactants (last - sum of rest)."""</span>
    <span class="kw">return</span> <span class="nm">energies</span>[<span class="num">-1</span>] <span class="op">-</span> <span class="fn">sum</span>(<span class="nm">energies</span>[:<span class="num">-1</span>])

<span class="nm">de</span> = <span class="fn">reaction_energy</span>(<span class="num">-76.4026</span>, <span class="num">-1.1753</span>, <span class="num">-77.5812</span>)

<span class="cm"># **kwargs: flexible ORCA input generator</span>
<span class="kw">def</span> <span class="fn">orca_input</span>(<span class="nm">molecule</span>, <span class="nm">method</span>=<span class="st">"B3LYP"</span>, <span class="op">**</span><span class="nm">kwargs</span>):
    <span class="st">"""Generate ORCA input header from keyword arguments."""</span>
    <span class="nm">keywords</span> = [<span class="nm">method</span>]
    <span class="kw">for</span> <span class="nm">key</span>, <span class="nm">val</span> <span class="kw">in</span> <span class="nm">kwargs</span>.<span class="fn">items</span>():
        <span class="nm">keywords</span>.<span class="fn">append</span>(<span class="st">f"<span class="nm">{key}</span> <span class="nm">{val}</span>"</span>)
    <span class="kw">return</span> <span class="st">f"! <span class="nm">{' '.join(keywords)}</span>"</span>

<span class="nm">header</span> = <span class="fn">orca_input</span>(<span class="st">"H2O"</span>, <span class="nm">basis</span>=<span class="st">"def2-TZVP"</span>, <span class="nm">grid</span>=<span class="st">"Grid5"</span>)
<span class="cm"># "! B3LYP basis def2-TZVP grid Grid5"</span>

<span class="cm"># Unpacking: spread a dict as keyword arguments</span>
<span class="nm">settings</span> = {<span class="st">"method"</span>: <span class="st">"DLPNO-CCSD(T)"</span>, <span class="st">"basis"</span>: <span class="st">"cc-pVTZ"</span>}
<span class="nm">header2</span> = <span class="fn">orca_input</span>(<span class="st">"CH4"</span>, <span class="op">**</span><span class="nm">settings</span>)

<span class="cm"># Forwarding kwargs to another function</span>
<span class="kw">def</span> <span class="fn">run_batch</span>(<span class="nm">molecules</span>, <span class="op">**</span><span class="nm">calc_kwargs</span>):
    <span class="kw">return</span> [<span class="fn">orca_input</span>(<span class="nm">m</span>, <span class="op">**</span><span class="nm">calc_kwargs</span>) <span class="kw">for</span> <span class="nm">m</span> <span class="kw">in</span> <span class="nm">molecules</span>]`,

      cheatsheet: [
        { syn: 'def f(*args):',                desc: 'Collect extra positional args into a tuple' },
        { syn: 'def f(**kwargs):',             desc: 'Collect extra keyword args into a dict' },
        { syn: 'def f(x, *args, **kwargs):',   desc: 'Required arg + variable positional + variable keyword' },
        { syn: 'f(*my_list)',                  desc: 'Unpack list as positional arguments' },
        { syn: 'f(**my_dict)',                 desc: 'Unpack dict as keyword arguments' },
        { syn: 'kwargs.get("key", default)',   desc: 'Safely access a kwarg with fallback' },
        { syn: 'def f(*, key=val):',           desc: 'Keyword-only argument (after bare *)' },
        { syn: 'a, *rest = [1,2,3]',          desc: 'Extended unpacking — rest collects extras' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'In <code>def calc(mol, *args, **kwargs)</code>, what type is <code>args</code> inside the function?',
          opts: ['list', 'tuple', 'dict', 'set'],
          answer: 1,
          feedback: '<code>*args</code> collects extra positional arguments into a <strong>tuple</strong>, not a list. <code>**kwargs</code> collects keyword arguments into a dict.'
        },
        {
          type: 'fill',
          q: 'Unpack a settings dictionary as keyword arguments to a function:',
          pre: 'settings = {"method": "B3LYP", "basis": "def2-SVP"}\nheader = orca_input("H2O", ___settings)',
          answer: '**',
          feedback: 'The <code>**</code> operator unpacks a dictionary into keyword arguments: <code>func(**dict)</code>.'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>combine_energies(*components, unit="ha")</code> that sums any number of energy values. If <code>unit="kcal"</code>, convert the sum to kcal/mol (×627.509). Test it with three fragment energies: -38.123, -76.402, and -1.175.',
          hint: 'Use <code>sum(components)</code> and a conditional on the unit parameter.',
          answer: `def combine_energies(*components, unit="ha"):
    total = sum(components)
    if unit == "kcal":
        return total * 627.509
    return total

print(combine_energies(-38.123, -76.402, -1.175))
print(combine_energies(-38.123, -76.402, -1.175, unit="kcal"))`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — More on Functions', url: 'https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — *args and **kwargs', url: 'https://realpython.com/python-kwargs-and-args/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  LAMBDA-MAP-FILTER
    // ════════════════════════════════════════════════════════
    {
      id:   'lambda-map-filter',
      name: 'Lambda, Map & Filter',
      desc: 'Quick inline transformations on molecular datasets',

      explanation: `
        <p>A <strong>lambda</strong> is an anonymous, single-expression function:
        <code>lambda x: x * 627.509</code> converts hartree to kcal/mol without
        needing a <code>def</code> block. Lambdas are ideal for short, throwaway
        operations you pass to higher-order functions or use as sort keys —
        for instance, sorting molecules by energy with
        <code>sorted(mols, key=lambda m: m.energy)</code>.</p>

        <p><code>map(func, iterable)</code> applies a function to every element and
        returns a lazy iterator. <code>filter(func, iterable)</code> keeps only
        elements where the function returns <code>True</code>. Both are
        <strong>functional programming</strong> tools that pair naturally with
        lambda: <code>map(lambda e: e * 627.509, energies)</code> converts a
        whole list without a loop. Wrap with <code>list()</code> to materialize
        the result.</p>

        <p>In modern Python, <strong>comprehensions</strong> are usually preferred
        over <code>map</code>/<code>filter</code> for readability. Use lambdas
        primarily as <strong>sort keys</strong>, <strong>callback functions</strong>,
        and quick one-off transforms. If your lambda exceeds one line or gets
        hard to read, write a named function instead — clarity always wins over
        cleverness in scientific code.</p>
      `,

      code: `<span class="cm"># Lambda: quick unit conversion</span>
<span class="nm">to_kcal</span> = <span class="kw">lambda</span> <span class="nm">ha</span>: <span class="nm">ha</span> <span class="op">*</span> <span class="num">627.509</span>
<span class="fn">print</span>(<span class="nm">to_kcal</span>(<span class="num">-76.4026</span>))  <span class="cm"># -47948.9...</span>

<span class="cm"># map: convert all energies</span>
<span class="nm">energies_ha</span> = [<span class="num">-76.4026</span>, <span class="num">-152.983</span>, <span class="num">-40.5184</span>]
<span class="nm">energies_kcal</span> = <span class="fn">list</span>(<span class="fn">map</span>(<span class="nm">to_kcal</span>, <span class="nm">energies_ha</span>))

<span class="cm"># filter: keep only low-energy structures</span>
<span class="nm">threshold</span> = <span class="num">-50.0</span>  <span class="cm"># Ha</span>
<span class="nm">low_e</span> = <span class="fn">list</span>(<span class="fn">filter</span>(<span class="kw">lambda</span> <span class="nm">e</span>: <span class="nm">e</span> <span class="op">&lt;</span> <span class="nm">threshold</span>, <span class="nm">energies_ha</span>))
<span class="cm"># [-76.4026, -152.983]</span>

<span class="cm"># Sort molecules by energy (lambda as key)</span>
<span class="nm">mols</span> = [
    {<span class="st">"name"</span>: <span class="st">"H2O"</span>,  <span class="st">"energy"</span>: <span class="num">-76.4026</span>},
    {<span class="st">"name"</span>: <span class="st">"CH4"</span>,  <span class="st">"energy"</span>: <span class="num">-40.5184</span>},
    {<span class="st">"name"</span>: <span class="st">"C2H6"</span>, <span class="st">"energy"</span>: <span class="num">-79.7280</span>},
]
<span class="nm">by_energy</span> = <span class="fn">sorted</span>(<span class="nm">mols</span>, <span class="nm">key</span>=<span class="kw">lambda</span> <span class="nm">m</span>: <span class="nm">m</span>[<span class="st">"energy"</span>])

<span class="cm"># Combine map + filter: kcal values of stable structures</span>
<span class="nm">stable_kcal</span> = <span class="fn">list</span>(<span class="fn">map</span>(<span class="nm">to_kcal</span>, <span class="fn">filter</span>(<span class="kw">lambda</span> <span class="nm">e</span>: <span class="nm">e</span> <span class="op">&lt;</span> <span class="nm">threshold</span>, <span class="nm">energies_ha</span>)))`,

      cheatsheet: [
        { syn: 'lambda x: x * 627.509',              desc: 'Anonymous function — single expression, no def needed' },
        { syn: 'map(func, iterable)',                 desc: 'Apply func to every element — returns lazy iterator' },
        { syn: 'filter(func, iterable)',              desc: 'Keep elements where func returns True' },
        { syn: 'list(map(...))',                      desc: 'Materialize a map/filter result into a list' },
        { syn: 'sorted(lst, key=lambda x: x.e)',      desc: 'Sort using a lambda as the key function' },
        { syn: 'max(lst, key=lambda x: x.e)',          desc: 'Find maximum by a computed value' },
        { syn: 'lambda x, y: x + y',                  desc: 'Lambda with multiple parameters' },
        { syn: 'map(str, [1, 2, 3])',                  desc: 'Use a built-in as the mapping function' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>list(filter(lambda e: e < -50, [-76.4, -40.5, -152.9]))</code> return?',
          opts: [
            '[-76.4, -40.5, -152.9]',
            '[-40.5]',
            '[-76.4, -152.9]',
            '[True, False, True]'
          ],
          answer: 2,
          feedback: '<code>filter</code> keeps elements where the lambda returns True. Only -76.4 and -152.9 are less than -50.'
        },
        {
          type: 'fill',
          q: 'Sort molecules by energy using a lambda key:',
          pre: 'sorted(molecules, key=___ m: m["energy"])',
          answer: 'lambda',
          feedback: '<code>sorted()</code> accepts a <code>key</code> function. A lambda provides a quick inline function for the sort criterion.'
        },
        {
          type: 'challenge',
          q: 'Given a list of calculation dicts with keys "molecule", "energy_ha", and "converged", use <code>filter</code> to keep only converged results, then <code>map</code> to extract their energies in kcal/mol. Return the results as a list.',
          hint: 'Chain filter (on converged) then map (energy * 627.509), wrapping in list().',
          answer: `calcs = [
    {"molecule": "H2O", "energy_ha": -76.4026, "converged": True},
    {"molecule": "NH3", "energy_ha": -56.5548, "converged": False},
    {"molecule": "CH4", "energy_ha": -40.5184, "converged": True},
]
converged = filter(lambda c: c["converged"], calcs)
kcal_energies = list(map(lambda c: c["energy_ha"] * 627.509, converged))`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — Lambda Expressions', url: 'https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — Lambda Functions', url: 'https://realpython.com/python-lambda/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  DECORATORS
    // ════════════════════════════════════════════════════════
    {
      id:   'decorators',
      name: 'Decorators',
      desc: 'Wrapping functions with timing, caching, and logging for calculations',

      explanation: `
        <p>A <strong>decorator</strong> is a function that takes another function as
        input and returns an enhanced version of it. The <code>@decorator</code>
        syntax placed above a function definition is syntactic sugar for
        <code>func = decorator(func)</code>. Decorators let you add cross-cutting
        behaviour — timing, logging, caching — without modifying the function's
        core logic.</p>

        <p>In computational chemistry, decorators are immediately useful: a
        <code>@timer</code> decorator tracks how long each SCF calculation step
        takes, a <code>@cache</code> decorator avoids recomputing expensive
        integrals, and a <code>@validate_charge</code> decorator checks that charge
        and multiplicity are consistent before running a calculation. Python's
        built-in <code>@functools.lru_cache</code> provides memoization out of the
        box — perfect for caching repeated energy lookups.</p>

        <p>Writing a custom decorator follows a standard pattern: define an outer
        function that accepts the target function, define an inner
        <strong>wrapper</strong> function that adds behaviour around a call to the
        original, and return the wrapper. Always use
        <code>@functools.wraps(func)</code> on the wrapper to preserve the
        original function's name and docstring.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">time</span>
<span class="kw">import</span> <span class="nm">functools</span>

<span class="cm"># Custom decorator: time a calculation</span>
<span class="kw">def</span> <span class="fn">timer</span>(<span class="nm">func</span>):
    <span class="nm">@functools</span>.<span class="fn">wraps</span>(<span class="nm">func</span>)
    <span class="kw">def</span> <span class="fn">wrapper</span>(<span class="op">*</span><span class="nm">args</span>, <span class="op">**</span><span class="nm">kwargs</span>):
        <span class="nm">start</span> = <span class="nm">time</span>.<span class="fn">perf_counter</span>()
        <span class="nm">result</span> = <span class="nm">func</span>(<span class="op">*</span><span class="nm">args</span>, <span class="op">**</span><span class="nm">kwargs</span>)
        <span class="nm">elapsed</span> = <span class="nm">time</span>.<span class="fn">perf_counter</span>() <span class="op">-</span> <span class="nm">start</span>
        <span class="fn">print</span>(<span class="st">f"<span class="nm">{func.__name__}</span> took <span class="nm">{elapsed:.3f}</span>s"</span>)
        <span class="kw">return</span> <span class="nm">result</span>
    <span class="kw">return</span> <span class="nm">wrapper</span>

<span class="nm">@timer</span>
<span class="kw">def</span> <span class="fn">compute_distances</span>(<span class="nm">coords</span>):
    <span class="st">"""Compute all pairwise distances from coordinates."""</span>
    <span class="nm">n</span> = <span class="fn">len</span>(<span class="nm">coords</span>)
    <span class="kw">return</span> [(<span class="nm">coords</span>[<span class="nm">i</span>][<span class="num">0</span>] <span class="op">-</span> <span class="nm">coords</span>[<span class="nm">j</span>][<span class="num">0</span>]) <span class="op">**</span> <span class="num">2</span>
            <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">n</span>) <span class="kw">for</span> <span class="nm">j</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">i</span> <span class="op">+</span> <span class="num">1</span>, <span class="nm">n</span>)]

<span class="cm"># Built-in caching: memoize energy lookups</span>
<span class="nm">@functools</span>.<span class="fn">lru_cache</span>(<span class="nm">maxsize</span>=<span class="num">128</span>)
<span class="kw">def</span> <span class="fn">lookup_energy</span>(<span class="nm">formula</span>, <span class="nm">method</span>=<span class="st">"B3LYP"</span>):
    <span class="st">"""Simulate an expensive database lookup."""</span>
    <span class="nm">db</span> = {<span class="st">"H2O"</span>: <span class="num">-76.4026</span>, <span class="st">"CH4"</span>: <span class="num">-40.5184</span>}
    <span class="kw">return</span> <span class="nm">db</span>.<span class="fn">get</span>(<span class="nm">formula</span>, <span class="kw">None</span>)`,

      cheatsheet: [
        { syn: '@decorator',                       desc: 'Apply a decorator to the function below' },
        { syn: 'def deco(func): ... return wrapper', desc: 'Standard decorator pattern: outer → inner wrapper' },
        { syn: '@functools.wraps(func)',            desc: 'Preserve original function name and docstring' },
        { syn: '@functools.lru_cache(maxsize=128)', desc: 'Built-in memoization — caches function results' },
        { syn: '*args, **kwargs in wrapper',        desc: 'Accept any arguments so the decorator is generic' },
        { syn: 'result = func(*args, **kwargs)',    desc: 'Call the original function inside the wrapper' },
        { syn: '@deco1 @deco2 def f():',            desc: 'Stack decorators — applied bottom to top' },
        { syn: 'func = decorator(func)',            desc: 'Manual form — equivalent to @decorator syntax' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>@functools.wraps(func)</code> do inside a decorator?',
          opts: [
            'Makes the decorator run faster',
            'Prevents the decorator from being called twice',
            'Preserves the original function\'s __name__ and __doc__',
            'Automatically caches the function results'
          ],
          answer: 2,
          feedback: 'Without <code>@wraps</code>, the decorated function\'s name and docstring would be replaced by the wrapper\'s. <code>@wraps</code> copies these attributes from the original function.'
        },
        {
          type: 'fill',
          q: 'Complete the decorator to cache expensive energy lookups:',
          pre: '@functools.___(maxsize=64)\ndef lookup_energy(formula):\n    ...',
          answer: 'lru_cache',
          feedback: '<code>functools.lru_cache</code> memoizes function results. Repeated calls with the same arguments return the cached value instantly.'
        },
        {
          type: 'challenge',
          q: 'Write a <code>@validate_inputs</code> decorator that checks whether the first argument (a molecular formula string) is non-empty and the second argument (charge, an int) satisfies <code>abs(charge) <= 10</code>. If validation fails, raise a <code>ValueError</code> with a descriptive message. Apply it to a function <code>run_calculation(formula, charge)</code>.',
          hint: 'The wrapper checks len(args[0]) > 0 and abs(args[1]) <= 10 before calling the original function.',
          answer: `import functools

def validate_inputs(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        formula, charge = args[0], args[1]
        if not formula:
            raise ValueError("Formula cannot be empty")
        if abs(charge) > 10:
            raise ValueError(f"Charge {charge} is unreasonable (|charge| > 10)")
        return func(*args, **kwargs)
    return wrapper

@validate_inputs
def run_calculation(formula, charge):
    print(f"Running calculation for {formula} with charge {charge}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — Decorators', url: 'https://docs.python.org/3/glossary.html#term-decorator', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — Primer on Decorators', url: 'https://realpython.com/primer-on-python-decorators/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  GENERATORS
    // ════════════════════════════════════════════════════════
    {
      id:   'generators',
      name: 'Generators',
      desc: 'Lazily streaming large trajectory files and output data line by line',

      explanation: `
        <p>A <strong>generator</strong> is a function that uses <code>yield</code>
        instead of <code>return</code>. Each time it yields, it pauses and hands a
        value to the caller; the next call resumes where it left off. This
        <strong>lazy evaluation</strong> means only one value exists in memory at a
        time — critical when processing gigabyte ORCA output files or multi-frame
        molecular dynamics trajectories.</p>

        <p>Generators are <strong>iterators</strong>: you consume them with a
        <code>for</code> loop, <code>next()</code>, or by passing them to functions
        like <code>sum()</code> and <code>list()</code>. A <strong>generator
        expression</strong> — <code>(x for x in iterable)</code> with parentheses
        instead of brackets — creates one inline. Use it when you need to sum or
        process values without building an intermediate list.</p>

        <p>Generators shine in pipeline patterns: one generator reads lines from a
        file, another filters for energy lines, and a third extracts the numerical
        values. Each processes one item at a time with constant memory. Once
        exhausted, a generator cannot be restarted — create a new one if you need
        to iterate again.</p>
      `,

      code: `<span class="cm"># Generator: yield energies from an ORCA output file</span>
<span class="kw">def</span> <span class="fn">read_energies</span>(<span class="nm">filepath</span>):
    <span class="st">"""Yield SCF energies from an ORCA output, line by line."""</span>
    <span class="kw">with</span> <span class="fn">open</span>(<span class="nm">filepath</span>) <span class="kw">as</span> <span class="nm">f</span>:
        <span class="kw">for</span> <span class="nm">line</span> <span class="kw">in</span> <span class="nm">f</span>:
            <span class="kw">if</span> <span class="st">"FINAL SINGLE POINT"</span> <span class="kw">in</span> <span class="nm">line</span>:
                <span class="kw">yield</span> <span class="fn">float</span>(<span class="nm">line</span>.<span class="fn">split</span>()[<span class="num">-1</span>])

<span class="cm"># Consume lazily — never loads entire file into memory</span>
<span class="cm"># for e in read_energies("opt_scan.out"):</span>
<span class="cm">#     print(f"{e:.6f} Ha")</span>

<span class="cm"># Generator expression: sum energies without a list</span>
<span class="nm">energies</span> = [<span class="num">-76.4026</span>, <span class="num">-152.983</span>, <span class="num">-40.5184</span>]
<span class="nm">total_kcal</span> = <span class="fn">sum</span>(<span class="nm">e</span> <span class="op">*</span> <span class="num">627.509</span> <span class="kw">for</span> <span class="nm">e</span> <span class="kw">in</span> <span class="nm">energies</span>)

<span class="cm"># Pipeline: filter → transform → aggregate</span>
<span class="kw">def</span> <span class="fn">filter_converged</span>(<span class="nm">records</span>):
    <span class="kw">for</span> <span class="nm">r</span> <span class="kw">in</span> <span class="nm">records</span>:
        <span class="kw">if</span> <span class="nm">r</span>[<span class="st">"converged"</span>]:
            <span class="kw">yield</span> <span class="nm">r</span>

<span class="kw">def</span> <span class="fn">extract_energies</span>(<span class="nm">records</span>):
    <span class="kw">for</span> <span class="nm">r</span> <span class="kw">in</span> <span class="nm">records</span>:
        <span class="kw">yield</span> <span class="nm">r</span>[<span class="st">"energy"</span>] <span class="op">*</span> <span class="num">627.509</span>

<span class="cm"># Chain generators — constant memory usage</span>
<span class="cm"># kcal_values = extract_energies(filter_converged(all_results))</span>`,

      cheatsheet: [
        { syn: 'def gen(): yield x',                desc: 'Define a generator function — yield pauses execution' },
        { syn: 'for val in gen():',                  desc: 'Consume generator values with a for loop' },
        { syn: 'next(gen_obj)',                      desc: 'Get the next yielded value manually' },
        { syn: '(x for x in lst)',                   desc: 'Generator expression — lazy comprehension' },
        { syn: 'sum(x for x in lst)',                desc: 'Aggregate without building an intermediate list' },
        { syn: 'yield from other_gen',               desc: 'Delegate to another generator (Python 3.3+)' },
        { syn: 'list(gen())',                        desc: 'Materialize all generator values into a list' },
        { syn: 'val = gen.send(x)',                  desc: 'Send a value into a generator (advanced coroutine)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the key advantage of a generator over a list for processing a 10 GB trajectory file?',
          opts: [
            'Generators are faster at arithmetic operations',
            'Generators process one item at a time using constant memory',
            'Generators can be indexed like lists',
            'Generators automatically parallelize across CPU cores'
          ],
          answer: 1,
          feedback: 'Generators yield one item at a time and discard it before producing the next. A list would load all 10 GB into memory at once.'
        },
        {
          type: 'fill',
          q: 'Complete the generator to yield lines containing "ENERGY":',
          pre: 'def energy_lines(filepath):\n    with open(filepath) as f:\n        for line in f:\n            if "ENERGY" in line:\n                ___ line',
          answer: 'yield',
          feedback: '<code>yield</code> makes the function a generator — it pauses and returns the value, resuming on the next iteration.'
        },
        {
          type: 'challenge',
          q: 'Write a generator <code>parse_xyz_frames(filepath)</code> that reads a multi-frame XYZ file. Each frame starts with an integer (atom count) on its own line, followed by a comment line, then that many coordinate lines. Yield each frame as a dict: <code>{"n_atoms": int, "comment": str, "coords": [list of lines]}</code>.',
          hint: 'Read n_atoms = int(next line), then comment = next line, then read n_atoms coordinate lines into a list. Yield the dict, then loop.',
          answer: `def parse_xyz_frames(filepath):
    with open(filepath) as f:
        for line in f:
            n_atoms = int(line.strip())
            comment = next(f).strip()
            coords = [next(f).strip() for _ in range(n_atoms)]
            yield {"n_atoms": n_atoms, "comment": comment, "coords": coords}

# Usage: for frame in parse_xyz_frames("trajectory.xyz"):
#            print(frame["comment"], frame["n_atoms"], "atoms")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — Generators', url: 'https://docs.python.org/3/howto/functional.html#generators', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — Generators Introduction', url: 'https://realpython.com/introduction-to-python-generators/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

  ],
};
