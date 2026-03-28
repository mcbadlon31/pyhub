/**
 * data/python/05-advanced.js
 * Stage 05: Advanced
 * Topics: type-hints,async,testing,packaging,design-patterns
 *
 * All challenge exercises use computational chemistry / materials science context.
 * Code line limits: 15–35 lines per topic.
 */

window.PY_S5 = {
  id: 'py-s5', num: '05', title: 'Advanced',
  color: 'red', meta: 'Weeks 15+', track: 'python',
  topics: [

    // ════════════════════════════════════════════════════════
    //  TYPE-HINTS
    // ════════════════════════════════════════════════════════
    {
      id:   'type-hints',
      name: 'Type Hints',
      desc: 'Adding static type annotations for safer scientific code',

      explanation: `
        <p><strong>Type hints</strong> annotate function signatures and variables
        with expected types: <code>def to_kcal(energy: float) -> float:</code>.
        Python does not enforce them at runtime — they are documentation that
        tools like <code>mypy</code> and your IDE can verify statically. In
        computational chemistry codebases, type hints catch bugs early: passing
        a string where a float is expected, or returning <code>None</code> when
        the caller expects a number.</p>

        <p>The <code>typing</code> module provides advanced types:
        <code>list[float]</code> for a list of energies,
        <code>dict[str, float]</code> for a molecule-to-energy mapping,
        <code>Optional[float]</code> for values that might be <code>None</code>
        (like an energy before a calculation runs), and <code>Union[str, Path]</code>
        for arguments accepting multiple types. Python 3.10+ allows
        <code>float | None</code> instead of <code>Optional[float]</code>.</p>

        <p>Use type hints on all public functions, class attributes, and return
        values. For complex objects, define <code>TypeAlias</code> or use
        <code>dataclasses</code> (which pair naturally with type hints) to keep
        annotations readable. Run <code>mypy</code> in CI to catch type errors
        before they reach production calculations.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">typing</span> <span class="kw">import</span> <span class="nm">Optional</span>
<span class="kw">from</span> <span class="nm">dataclasses</span> <span class="kw">import</span> <span class="nm">dataclass</span>

<span class="cm"># Basic function type hints</span>
<span class="kw">def</span> <span class="fn">to_kcal</span>(<span class="nm">energy_ha</span>: <span class="bi">float</span>) <span class="op">-></span> <span class="bi">float</span>:
    <span class="kw">return</span> <span class="nm">energy_ha</span> <span class="op">*</span> <span class="num">627.509</span>

<span class="cm"># Optional: value might be None</span>
<span class="kw">def</span> <span class="fn">parse_energy</span>(<span class="nm">line</span>: <span class="bi">str</span>) <span class="op">-></span> <span class="nm">Optional</span>[<span class="bi">float</span>]:
    <span class="kw">if</span> <span class="st">"FINAL SINGLE POINT"</span> <span class="kw">in</span> <span class="nm">line</span>:
        <span class="kw">return</span> <span class="fn">float</span>(<span class="nm">line</span>.<span class="fn">split</span>()[<span class="num">-1</span>])
    <span class="kw">return</span> <span class="kw">None</span>

<span class="cm"># Collection types (Python 3.9+)</span>
<span class="kw">def</span> <span class="fn">mean_energy</span>(<span class="nm">energies</span>: <span class="bi">list</span>[<span class="bi">float</span>]) <span class="op">-></span> <span class="bi">float</span>:
    <span class="kw">return</span> <span class="fn">sum</span>(<span class="nm">energies</span>) <span class="op">/</span> <span class="fn">len</span>(<span class="nm">energies</span>)

<span class="cm"># Dataclass: typed fields + auto __init__/__repr__</span>
<span class="nm">@dataclass</span>
<span class="kw">class</span> <span class="fn">Molecule</span>:
    <span class="nm">formula</span>: <span class="bi">str</span>
    <span class="nm">charge</span>:  <span class="bi">int</span> = <span class="num">0</span>
    <span class="nm">mult</span>:    <span class="bi">int</span> = <span class="num">1</span>
    <span class="nm">energy</span>:  <span class="nm">Optional</span>[<span class="bi">float</span>] = <span class="kw">None</span>  <span class="cm"># Ha</span>

    <span class="kw">def</span> <span class="fn">energy_kcal</span>(<span class="nm">self</span>) <span class="op">-></span> <span class="nm">Optional</span>[<span class="bi">float</span>]:
        <span class="kw">return</span> <span class="nm">self</span>.<span class="nm">energy</span> <span class="op">*</span> <span class="num">627.509</span> <span class="kw">if</span> <span class="nm">self</span>.<span class="nm">energy</span> <span class="kw">else</span> <span class="kw">None</span>

<span class="nm">h2o</span> = <span class="fn">Molecule</span>(<span class="st">"H2O"</span>, <span class="nm">energy</span>=<span class="num">-76.4026</span>)
<span class="fn">print</span>(<span class="nm">h2o</span>)  <span class="cm"># Molecule(formula='H2O', charge=0, mult=1, energy=-76.4026)</span>

<span class="cm"># Dict type hint: lookup table</span>
<span class="nm">basis_sizes</span>: <span class="bi">dict</span>[<span class="bi">str</span>, <span class="bi">int</span>] = {<span class="st">"STO-3G"</span>: <span class="num">7</span>, <span class="st">"def2-SVP"</span>: <span class="num">14</span>, <span class="st">"def2-TZVP"</span>: <span class="num">31</span>}`,

      cheatsheet: [
        { syn: 'def f(x: float) -> float:',        desc: 'Annotate parameter and return types' },
        { syn: 'Optional[float]',                   desc: 'Value is float or None' },
        { syn: 'list[float]',                       desc: 'List of floats (Python 3.9+)' },
        { syn: 'dict[str, float]',                  desc: 'Dict mapping strings to floats' },
        { syn: 'tuple[str, int, float]',            desc: 'Fixed-length tuple with typed elements' },
        { syn: 'float | None',                      desc: 'Union syntax (Python 3.10+)' },
        { syn: '@dataclass',                        desc: 'Auto-generate __init__, __repr__ from type hints' },
        { syn: 'mypy script.py',                    desc: 'Run static type checker on your code' },
        { syn: 'TypeAlias = dict[str, list[float]]', desc: 'Name a complex type for readability' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What happens if you pass a string to <code>def to_kcal(energy: float) -> float:</code>?',
          opts: [
            'Python raises a TypeError at runtime',
            'The type hint prevents the call from executing',
            'Nothing — Python ignores type hints at runtime',
            'The string is automatically converted to float'
          ],
          answer: 2,
          feedback: 'Type hints are not enforced at runtime — they are documentation. You need a tool like <code>mypy</code> to catch mismatches statically.'
        },
        {
          type: 'fill',
          q: 'Annotate a function that may return None if the energy is not found:',
          pre: 'from typing import Optional\ndef parse(line: str) -> ___(float):\n    ...',
          answer: 'Optional',
          feedback: '<code>Optional[float]</code> means the return type is <code>float | None</code>. Use this when a function legitimately returns None in some cases.'
        },
        {
          type: 'challenge',
          q: 'Create a <code>@dataclass</code> named <code>Calculation</code> with typed fields: <code>molecule: str</code>, <code>method: str</code>, <code>basis: str</code>, <code>energy: Optional[float] = None</code>, <code>converged: bool = False</code>. Add a method <code>summary(self) -> str</code> that returns a formatted string like <code>"H2O/B3LYP/def2-SVP: -76.4026 Ha (converged)"</code>.',
          hint: 'Use @dataclass and Optional from typing. The summary method uses an f-string with a conditional for the convergence status.',
          answer: `from dataclasses import dataclass
from typing import Optional

@dataclass
class Calculation:
    molecule: str
    method: str
    basis: str
    energy: Optional[float] = None
    converged: bool = False

    def summary(self) -> str:
        status = "converged" if self.converged else "not converged"
        e = f"{self.energy:.4f} Ha" if self.energy else "no energy"
        return f"{self.molecule}/{self.method}/{self.basis}: {e} ({status})"

calc = Calculation("H2O", "B3LYP", "def2-SVP", -76.4026, True)
print(calc.summary())`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — typing', url: 'https://docs.python.org/3/library/typing.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'mypy Documentation', url: 'https://mypy.readthedocs.io/en/stable/', tag: 'docs', tagColor: 'blue' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  ASYNC
    // ════════════════════════════════════════════════════════
    {
      id:   'async',
      name: 'Async Programming',
      desc: 'Concurrent I/O for batch job submission and result retrieval',

      explanation: `
        <p><strong>Asynchronous programming</strong> lets your code do other work
        while waiting for slow I/O operations — network requests, file reads, or
        job status checks. In computational chemistry, you submit hundreds of
        calculations to a cluster and poll for results; <code>async</code> lets you
        check all jobs concurrently instead of waiting for each one sequentially.</p>

        <p>Define coroutines with <code>async def</code> and pause them with
        <code>await</code>. The <code>asyncio</code> event loop manages switching
        between coroutines when one awaits. <code>asyncio.gather()</code> runs
        multiple coroutines concurrently — submit 50 calculations and wait for
        all of them in parallel. <code>aiohttp</code> provides async HTTP for
        querying databases like Materials Project or PubChem.</p>

        <p>Async is for <strong>I/O-bound</strong> concurrency, not CPU-bound
        parallelism. If you need to run DFT calculations in parallel, use
        <code>multiprocessing</code> or <code>concurrent.futures</code> instead.
        A common pattern: async for job submission and monitoring, multiprocessing
        for local parallel computation.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">asyncio</span>

<span class="cm"># Simulate checking ORCA job status (I/O wait)</span>
<span class="kw">async</span> <span class="kw">def</span> <span class="fn">check_job</span>(<span class="nm">job_id</span>: <span class="bi">str</span>) <span class="op">-></span> <span class="bi">dict</span>:
    <span class="st">"""Poll a job and return its status."""</span>
    <span class="fn">print</span>(<span class="st">f"Checking job <span class="nm">{job_id}</span>..."</span>)
    <span class="kw">await</span> <span class="nm">asyncio</span>.<span class="fn">sleep</span>(<span class="num">1</span>)  <span class="cm"># simulates network delay</span>
    <span class="kw">return</span> {<span class="st">"id"</span>: <span class="nm">job_id</span>, <span class="st">"status"</span>: <span class="st">"complete"</span>, <span class="st">"energy"</span>: <span class="num">-76.4026</span>}

<span class="cm"># Run multiple job checks concurrently</span>
<span class="kw">async</span> <span class="kw">def</span> <span class="fn">monitor_batch</span>(<span class="nm">job_ids</span>: <span class="bi">list</span>[<span class="bi">str</span>]):
    <span class="nm">tasks</span> = [<span class="fn">check_job</span>(<span class="nm">jid</span>) <span class="kw">for</span> <span class="nm">jid</span> <span class="kw">in</span> <span class="nm">job_ids</span>]
    <span class="nm">results</span> = <span class="kw">await</span> <span class="nm">asyncio</span>.<span class="fn">gather</span>(<span class="op">*</span><span class="nm">tasks</span>)
    <span class="kw">for</span> <span class="nm">r</span> <span class="kw">in</span> <span class="nm">results</span>:
        <span class="fn">print</span>(<span class="st">f"Job <span class="nm">{r['id']}</span>: <span class="nm">{r['status']}</span>, E=<span class="nm">{r['energy']}</span> Ha"</span>)
    <span class="kw">return</span> <span class="nm">results</span>

<span class="cm"># Entry point</span>
<span class="nm">jobs</span> = [<span class="st">"h2o_opt"</span>, <span class="st">"ch4_opt"</span>, <span class="st">"nh3_opt"</span>, <span class="st">"c2h6_opt"</span>]
<span class="nm">asyncio</span>.<span class="fn">run</span>(<span class="fn">monitor_batch</span>(<span class="nm">jobs</span>))
<span class="cm"># All 4 checks run concurrently — ~1s total, not 4s</span>

<span class="cm"># concurrent.futures for CPU-bound tasks</span>
<span class="kw">from</span> <span class="nm">concurrent.futures</span> <span class="kw">import</span> <span class="nm">ProcessPoolExecutor</span>

<span class="kw">def</span> <span class="fn">compute_energy</span>(<span class="nm">coords</span>):
    <span class="kw">return</span> <span class="fn">sum</span>(<span class="nm">x</span><span class="op">**</span><span class="num">2</span> <span class="kw">for</span> <span class="nm">x</span> <span class="kw">in</span> <span class="nm">coords</span>) <span class="op">*</span> <span class="num">-0.5</span>

<span class="cm"># with ProcessPoolExecutor(max_workers=4) as pool:</span>
<span class="cm">#     futures = [pool.submit(compute_energy, c) for c in coord_list]</span>
<span class="cm">#     results = [f.result() for f in futures]</span>`,

      cheatsheet: [
        { syn: 'async def func():',               desc: 'Define a coroutine (async function)' },
        { syn: 'await coroutine',                  desc: 'Pause until the coroutine completes' },
        { syn: 'asyncio.run(main())',              desc: 'Run the top-level coroutine (entry point)' },
        { syn: 'asyncio.gather(*tasks)',           desc: 'Run multiple coroutines concurrently' },
        { syn: 'asyncio.sleep(n)',                 desc: 'Async sleep — yields control to event loop' },
        { syn: 'ProcessPoolExecutor()',            desc: 'CPU-parallel execution across processes' },
        { syn: 'ThreadPoolExecutor()',             desc: 'Thread-based concurrency for I/O tasks' },
        { syn: 'pool.submit(func, *args)',         desc: 'Submit a task and get a Future object' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'When should you use <code>async/await</code> vs. <code>multiprocessing</code>?',
          opts: [
            'async for CPU-heavy calculations, multiprocessing for I/O',
            'async for I/O-bound tasks (network, file), multiprocessing for CPU-bound work',
            'They are interchangeable — use whichever you prefer',
            'async only works with web servers, not scientific code'
          ],
          answer: 1,
          feedback: '<code>async</code> excels at I/O concurrency (waiting for network/disk). <code>multiprocessing</code> parallelizes CPU-intensive work across cores.'
        },
        {
          type: 'fill',
          q: 'Run three coroutines concurrently and collect all results:',
          pre: 'results = await asyncio.___(task1(), task2(), task3())',
          answer: 'gather',
          feedback: '<code>asyncio.gather()</code> runs all coroutines concurrently and returns a list of their results in the same order.'
        },
        {
          type: 'challenge',
          q: 'Write an async function <code>fetch_energies(molecules: list[str])</code> that simulates querying a database for each molecule\'s energy. Each query takes 0.5s (use <code>asyncio.sleep</code>). Run all queries concurrently with <code>asyncio.gather</code> and return a dict mapping molecule names to energies. Test with ["H2O", "CH4", "NH3", "C2H6"].',
          hint: 'Define an inner async function for a single lookup, then gather all of them.',
          answer: `import asyncio

async def fetch_energy(molecule: str) -> tuple[str, float]:
    await asyncio.sleep(0.5)  # simulate network delay
    db = {"H2O": -76.4026, "CH4": -40.5184, "NH3": -56.5548, "C2H6": -79.7280}
    return molecule, db.get(molecule, 0.0)

async def fetch_energies(molecules: list[str]) -> dict[str, float]:
    results = await asyncio.gather(*(fetch_energy(m) for m in molecules))
    return dict(results)

energies = asyncio.run(fetch_energies(["H2O", "CH4", "NH3", "C2H6"]))
print(energies)  # all fetched in ~0.5s, not 2s`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — asyncio', url: 'https://docs.python.org/3/library/asyncio.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — Async IO Guide', url: 'https://realpython.com/async-io-python/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  TESTING
    // ════════════════════════════════════════════════════════
    {
      id:   'testing',
      name: 'Testing',
      desc: 'Writing pytest tests for energy converters, parsers, and chemistry logic',

      explanation: `
        <p><strong>Testing</strong> verifies that your code produces correct results.
        In computational chemistry, a wrong sign in an energy conversion or a
        mis-parsed output file can invalidate months of research.
        <code>pytest</code> is the standard framework: write functions starting with
        <code>test_</code>, use <code>assert</code> statements, and run
        <code>pytest</code> to check everything automatically.</p>

        <p>Test scientific code with <code>pytest.approx()</code> for floating-point
        comparisons — never use <code>==</code> on floats. Organize tests by module:
        <code>test_converters.py</code> tests unit conversions,
        <code>test_parsers.py</code> tests ORCA output parsing. Use
        <strong>fixtures</strong> (<code>@pytest.fixture</code>) to set up shared
        test data like sample molecules or reference output files.</p>

        <p><strong>Parametrize</strong> tests with
        <code>@pytest.mark.parametrize</code> to run the same test with multiple
        inputs — test your conversion function with H2O, CH4, and NH3 energies in
        one test definition. Aim for tests that are fast, independent, and
        deterministic. Run tests before every commit and in CI pipelines.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pytest</span>

<span class="cm"># ─── Module under test (converters.py) ───</span>
<span class="kw">def</span> <span class="fn">to_kcal</span>(<span class="nm">ha</span>):
    <span class="kw">return</span> <span class="nm">ha</span> <span class="op">*</span> <span class="num">627.509</span>

<span class="kw">def</span> <span class="fn">parse_energy</span>(<span class="nm">line</span>):
    <span class="kw">if</span> <span class="st">"FINAL SINGLE POINT"</span> <span class="kw">in</span> <span class="nm">line</span>:
        <span class="kw">return</span> <span class="fn">float</span>(<span class="nm">line</span>.<span class="fn">split</span>()[<span class="num">-1</span>])
    <span class="kw">return</span> <span class="kw">None</span>

<span class="cm"># ─── Tests (test_converters.py) ───</span>
<span class="kw">def</span> <span class="fn">test_to_kcal_h2o</span>():
    <span class="kw">assert</span> <span class="fn">to_kcal</span>(<span class="num">-76.4026</span>) <span class="op">==</span> <span class="nm">pytest</span>.<span class="fn">approx</span>(<span class="num">-47948.9</span>, <span class="nm">rel</span>=<span class="num">1e-4</span>)

<span class="kw">def</span> <span class="fn">test_to_kcal_zero</span>():
    <span class="kw">assert</span> <span class="fn">to_kcal</span>(<span class="num">0.0</span>) <span class="op">==</span> <span class="num">0.0</span>

<span class="cm"># Parametrize: test multiple molecules in one go</span>
<span class="nm">@pytest</span>.<span class="nm">mark</span>.<span class="fn">parametrize</span>(<span class="st">"ha, expected_kcal"</span>, [
    (<span class="num">-76.4026</span>,  <span class="num">-47948.9</span>),
    (<span class="num">-40.5184</span>,  <span class="num">-25425.5</span>),
    (<span class="num">-152.983</span>,  <span class="num">-96000.0</span>),
])
<span class="kw">def</span> <span class="fn">test_to_kcal_parametrized</span>(<span class="nm">ha</span>, <span class="nm">expected_kcal</span>):
    <span class="kw">assert</span> <span class="fn">to_kcal</span>(<span class="nm">ha</span>) <span class="op">==</span> <span class="nm">pytest</span>.<span class="fn">approx</span>(<span class="nm">expected_kcal</span>, <span class="nm">rel</span>=<span class="num">1e-3</span>)

<span class="kw">def</span> <span class="fn">test_parse_energy_valid</span>():
    <span class="nm">line</span> = <span class="st">"FINAL SINGLE POINT ENERGY   -76.402683"</span>
    <span class="kw">assert</span> <span class="fn">parse_energy</span>(<span class="nm">line</span>) <span class="op">==</span> <span class="nm">pytest</span>.<span class="fn">approx</span>(<span class="num">-76.402683</span>)

<span class="kw">def</span> <span class="fn">test_parse_energy_no_match</span>():
    <span class="kw">assert</span> <span class="fn">parse_energy</span>(<span class="st">"SCF NOT CONVERGED"</span>) <span class="kw">is</span> <span class="kw">None</span>

<span class="cm"># Run: pytest test_converters.py -v</span>`,

      cheatsheet: [
        { syn: 'def test_func():',                     desc: 'Test function — must start with test_' },
        { syn: 'assert result == expected',             desc: 'Check that the result matches' },
        { syn: 'pytest.approx(val, rel=1e-4)',          desc: 'Float comparison with relative tolerance' },
        { syn: '@pytest.mark.parametrize("a,b", [...])', desc: 'Run one test with multiple input sets' },
        { syn: '@pytest.fixture',                       desc: 'Reusable setup — shared test data or objects' },
        { syn: 'pytest.raises(ValueError)',             desc: 'Assert that an exception is raised' },
        { syn: 'pytest -v',                             desc: 'Run tests with verbose output' },
        { syn: 'pytest --cov=module',                   desc: 'Measure code coverage of your tests' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why should you use <code>pytest.approx()</code> instead of <code>==</code> when comparing float results?',
          opts: [
            'pytest.approx is faster than ==',
            'Float arithmetic has rounding errors, so exact equality often fails',
            'Python does not support == for floats',
            'pytest.approx converts the result to an integer first'
          ],
          answer: 1,
          feedback: 'Floating-point arithmetic introduces tiny rounding errors. <code>pytest.approx(-76.4, rel=1e-4)</code> allows a small tolerance so the test passes despite minor imprecision.'
        },
        {
          type: 'fill',
          q: 'Test that a function raises ValueError for invalid input:',
          pre: 'with pytest.___(ValueError):\n    parse_charge("invalid")',
          answer: 'raises',
          feedback: '<code>pytest.raises(ExceptionType)</code> is a context manager that passes only if the specified exception is raised inside the block.'
        },
        {
          type: 'challenge',
          q: 'Write a <code>pytest</code> test suite for a <code>reaction_energy(e_reactant, e_product)</code> function that returns ΔE in both Ha and kcal/mol. Include: (1) a basic test with H2O energies, (2) a parametrized test with 3 different reactions, and (3) a test that verifies the function raises <code>TypeError</code> when passed a string.',
          hint: 'Use pytest.approx for float checks, @pytest.mark.parametrize for multiple cases, and pytest.raises for the error test.',
          answer: `import pytest

def reaction_energy(e_react, e_prod):
    de_ha = e_prod - e_react
    return de_ha, de_ha * 627.509

def test_basic():
    de_ha, de_kcal = reaction_energy(-76.402, -76.410)
    assert de_ha == pytest.approx(-0.008, rel=1e-3)
    assert de_kcal == pytest.approx(-5.02, rel=1e-2)

@pytest.mark.parametrize("react,prod,expected_ha", [
    (-76.402, -76.410, -0.008),
    (-152.983, -152.990, -0.007),
    (-40.518, -40.510, 0.008),
])
def test_parametrized(react, prod, expected_ha):
    de_ha, _ = reaction_energy(react, prod)
    assert de_ha == pytest.approx(expected_ha, rel=1e-3)

def test_type_error():
    with pytest.raises(TypeError):
        reaction_energy("not_a_number", -76.4)`
        }
      ],

      resources: [
        { icon: '📘', title: 'pytest Documentation', url: 'https://docs.pytest.org/en/stable/', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Real Python — Testing with pytest', url: 'https://realpython.com/pytest-python-testing/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  PACKAGING
    // ════════════════════════════════════════════════════════
    {
      id:   'packaging',
      name: 'Packaging',
      desc: 'Distributing your compchem tools as installable Python packages',

      explanation: `
        <p><strong>Packaging</strong> transforms a collection of scripts into an
        installable library. Instead of copying <code>converters.py</code> between
        projects, you <code>pip install</code> your own package and import it
        anywhere. The modern standard uses <code>pyproject.toml</code> as the single
        configuration file — it replaces the legacy <code>setup.py</code> approach.</p>

        <p>A minimal package needs a <strong>source layout</strong>: a project
        directory with <code>pyproject.toml</code>, a <code>src/</code> folder
        containing your package (a directory with <code>__init__.py</code>), and
        optionally a <code>tests/</code> folder. The <code>pyproject.toml</code>
        declares the package name, version, dependencies, and build system.</p>

        <p>Install locally in <strong>editable mode</strong> with
        <code>pip install -e .</code> — changes to your source code take effect
        immediately without reinstalling. For sharing with collaborators, build a
        wheel with <code>python -m build</code> and upload to PyPI with
        <code>twine upload</code>. Many compchem groups publish internal tools
        this way: <code>pip install group-orca-tools</code>.</p>
      `,

      code: `<span class="cm"># ─── Project layout ───</span>
<span class="cm"># compchem-tools/</span>
<span class="cm"># ├── pyproject.toml</span>
<span class="cm"># ├── src/</span>
<span class="cm"># │   └── compchem_tools/</span>
<span class="cm"># │       ├── __init__.py</span>
<span class="cm"># │       ├── converters.py</span>
<span class="cm"># │       └── parsers.py</span>
<span class="cm"># └── tests/</span>
<span class="cm">#     └── test_converters.py</span>

<span class="cm"># ─── pyproject.toml ───</span>
<span class="cm"># [build-system]</span>
<span class="cm"># requires = ["setuptools>=68.0"]</span>
<span class="cm"># build-backend = "setuptools.build_meta"</span>
<span class="cm">#</span>
<span class="cm"># [project]</span>
<span class="cm"># name = "compchem-tools"</span>
<span class="cm"># version = "0.1.0"</span>
<span class="cm"># dependencies = ["numpy>=1.26", "scipy>=1.12"]</span>

<span class="cm"># ─── __init__.py — define public API ───</span>
<span class="kw">from</span> <span class="nm">compchem_tools.converters</span> <span class="kw">import</span> <span class="fn">to_kcal</span>, <span class="fn">to_ev</span>
<span class="kw">from</span> <span class="nm">compchem_tools.parsers</span> <span class="kw">import</span> <span class="fn">parse_orca_energy</span>

<span class="nm">__version__</span> = <span class="st">"0.1.0"</span>

<span class="cm"># ─── Usage after: pip install -e . ───</span>
<span class="kw">from</span> <span class="nm">compchem_tools</span> <span class="kw">import</span> <span class="fn">to_kcal</span>, <span class="fn">parse_orca_energy</span>
<span class="nm">e</span> = <span class="fn">parse_orca_energy</span>(<span class="st">"FINAL SINGLE POINT ENERGY   -76.402683"</span>)
<span class="fn">print</span>(<span class="fn">to_kcal</span>(<span class="nm">e</span>))
<span class="cm"># $ python -m build   → create wheel + sdist</span>
<span class="cm"># $ twine upload dist/* → publish to PyPI</span>`,

      cheatsheet: [
        { syn: 'pyproject.toml',                    desc: 'Modern package configuration (replaces setup.py)' },
        { syn: '[project] name = "pkg"',             desc: 'Declare package name in pyproject.toml' },
        { syn: 'dependencies = ["numpy>=1.26"]',     desc: 'Declare runtime dependencies' },
        { syn: '__init__.py',                        desc: 'Marks directory as package, defines public API' },
        { syn: 'pip install -e .',                   desc: 'Editable install — changes take effect immediately' },
        { syn: 'python -m build',                    desc: 'Build wheel and source distribution' },
        { syn: 'twine upload dist/*',                desc: 'Upload package to PyPI' },
        { syn: '__version__ = "0.1.0"',              desc: 'Version string — accessible at runtime' },
        { syn: 'src/ layout',                        desc: 'Recommended layout: src/pkg/ prevents import confusion' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the modern replacement for <code>setup.py</code> in Python packaging?',
          opts: [
            'requirements.txt',
            'Makefile',
            'pyproject.toml',
            'conda.yml'
          ],
          answer: 2,
          feedback: '<code>pyproject.toml</code> is the PEP 621 standard for declaring project metadata, dependencies, and build configuration in one file.'
        },
        {
          type: 'fill',
          q: 'Install your package in development mode so changes take effect immediately:',
          pre: 'pip install ___ .',
          answer: '-e',
          feedback: '<code>pip install -e .</code> creates an editable install that links to your source code. You can modify files and the changes are reflected without reinstalling.'
        },
        {
          type: 'challenge',
          q: 'Write a complete <code>pyproject.toml</code> for a package called <code>qchem-utils</code> (version 0.2.0) that depends on numpy>=1.26, scipy>=1.12, and matplotlib>=3.8. Include a <code>[project.scripts]</code> entry that creates a CLI command <code>qchem-convert</code> pointing to <code>qchem_utils.cli:main</code>.',
          hint: 'Use [build-system], [project] with name/version/dependencies, and [project.scripts] sections.',
          answer: `# pyproject.toml
# [build-system]
# requires = ["setuptools>=68.0"]
# build-backend = "setuptools.build_meta"
#
# [project]
# name = "qchem-utils"
# version = "0.2.0"
# description = "Utility tools for quantum chemistry workflows"
# requires-python = ">=3.10"
# dependencies = [
#     "numpy>=1.26",
#     "scipy>=1.12",
#     "matplotlib>=3.8",
# ]
#
# [project.scripts]
# qchem-convert = "qchem_utils.cli:main"`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Packaging Guide', url: 'https://packaging.python.org/en/latest/', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'pyproject.toml Specification', url: 'https://packaging.python.org/en/latest/specifications/pyproject-toml/', tag: 'reference', tagColor: 'purple' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  DESIGN-PATTERNS
    // ════════════════════════════════════════════════════════
    {
      id:   'design-patterns',
      name: 'Design Patterns',
      desc: 'Strategy, factory, and observer patterns for extensible chemistry code',

      explanation: `
        <p><strong>Design patterns</strong> are reusable solutions to common
        software architecture problems. In computational chemistry, you encounter
        these constantly: a <strong>Strategy</strong> pattern lets you swap
        DFT functionals or basis sets without changing the calculation runner,
        a <strong>Factory</strong> creates the right parser for each output file
        format, and the <strong>Observer</strong> pattern notifies logging systems
        when calculations complete.</p>

        <p>The <strong>Strategy pattern</strong> encapsulates interchangeable
        algorithms behind a common interface. Define a base class
        <code>Calculator</code> with a <code>compute()</code> method, then implement
        <code>DFTCalculator</code>, <code>MP2Calculator</code>, etc. The calling
        code works with any calculator through the same interface — swapping methods
        requires changing one line, not restructuring the workflow.</p>

        <p>The <strong>Factory pattern</strong> centralizes object creation.
        <code>ParserFactory.create("orca")</code> returns an <code>ORCAParser</code>,
        while <code>ParserFactory.create("gaussian")</code> returns a
        <code>GaussianParser</code>. This decouples the code that uses parsers from
        the code that instantiates them — adding a new format means adding one class
        and one factory entry, not modifying every caller.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">abc</span> <span class="kw">import</span> <span class="nm">ABC</span>, <span class="nm">abstractmethod</span>

<span class="cm"># Strategy pattern: swappable calculators</span>
<span class="kw">class</span> <span class="fn">Calculator</span>(<span class="nm">ABC</span>):
    <span class="nm">@abstractmethod</span>
    <span class="kw">def</span> <span class="fn">compute</span>(<span class="nm">self</span>, <span class="nm">molecule</span>: <span class="bi">str</span>) <span class="op">-></span> <span class="bi">float</span>:
        ...

<span class="kw">class</span> <span class="fn">DFTCalculator</span>(<span class="nm">Calculator</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">functional</span>=<span class="st">"B3LYP"</span>):
        <span class="nm">self</span>.<span class="nm">functional</span> = <span class="nm">functional</span>
    <span class="kw">def</span> <span class="fn">compute</span>(<span class="nm">self</span>, <span class="nm">molecule</span>):
        <span class="kw">return</span> <span class="num">-76.4026</span>  <span class="cm"># placeholder</span>

<span class="kw">class</span> <span class="fn">MP2Calculator</span>(<span class="nm">Calculator</span>):
    <span class="kw">def</span> <span class="fn">compute</span>(<span class="nm">self</span>, <span class="nm">molecule</span>):
        <span class="kw">return</span> <span class="num">-76.3180</span>

<span class="cm"># Use any calculator through the same interface</span>
<span class="kw">def</span> <span class="fn">run_workflow</span>(<span class="nm">calc</span>: <span class="nm">Calculator</span>, <span class="nm">mol</span>: <span class="bi">str</span>):
    <span class="nm">e</span> = <span class="nm">calc</span>.<span class="fn">compute</span>(<span class="nm">mol</span>)
    <span class="fn">print</span>(<span class="st">f"<span class="nm">{mol}</span> energy: <span class="nm">{e:.4f}</span> Ha"</span>)

<span class="fn">run_workflow</span>(<span class="fn">DFTCalculator</span>(), <span class="st">"H2O"</span>)
<span class="fn">run_workflow</span>(<span class="fn">MP2Calculator</span>(), <span class="st">"H2O"</span>)

<span class="cm"># Factory pattern: create the right parser</span>
<span class="kw">class</span> <span class="fn">ParserFactory</span>:
    <span class="nm">_registry</span> = {}
    <span class="nm">@classmethod</span>
    <span class="kw">def</span> <span class="fn">register</span>(<span class="nm">cls</span>, <span class="nm">name</span>, <span class="nm">parser_cls</span>):
        <span class="nm">cls</span>.<span class="nm">_registry</span>[<span class="nm">name</span>] = <span class="nm">parser_cls</span>
    <span class="nm">@classmethod</span>
    <span class="kw">def</span> <span class="fn">create</span>(<span class="nm">cls</span>, <span class="nm">name</span>):
        <span class="kw">return</span> <span class="nm">cls</span>.<span class="nm">_registry</span>[<span class="nm">name</span>]()`,

      cheatsheet: [
        { syn: 'class Base(ABC):',                   desc: 'Abstract base class — cannot be instantiated' },
        { syn: '@abstractmethod',                    desc: 'Method that subclasses must implement' },
        { syn: 'Strategy pattern',                   desc: 'Swap algorithms via a common interface' },
        { syn: 'Factory pattern',                    desc: 'Centralize object creation by name/type' },
        { syn: 'Observer pattern',                   desc: 'Notify subscribers when state changes' },
        { syn: '@classmethod',                       desc: 'Method bound to the class, not an instance' },
        { syn: '@staticmethod',                      desc: 'Method with no access to class or instance' },
        { syn: 'Protocol (typing)',                  desc: 'Structural subtyping — duck typing with type hints' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Which design pattern lets you swap between DFT and MP2 calculators without changing the calling code?',
          opts: [
            'Observer',
            'Singleton',
            'Strategy',
            'Decorator'
          ],
          answer: 2,
          feedback: 'The Strategy pattern encapsulates interchangeable algorithms behind a common interface. The caller works with the abstract <code>Calculator</code> type and is unaware of which concrete implementation it uses.'
        },
        {
          type: 'fill',
          q: 'Mark a method as abstract so subclasses must implement it:',
          pre: 'from abc import ABC, abstractmethod\nclass Parser(ABC):\n    @___\n    def parse(self, text): ...',
          answer: 'abstractmethod',
          feedback: '<code>@abstractmethod</code> forces every subclass to provide its own implementation. Attempting to instantiate a class with unimplemented abstract methods raises <code>TypeError</code>.'
        },
        {
          type: 'challenge',
          q: 'Implement a Factory pattern for output file parsers. Create an abstract <code>OutputParser</code> with a <code>parse(text: str) -> float</code> method, then concrete <code>ORCAParser</code> and <code>GaussianParser</code> subclasses. The ORCA parser extracts energy from "FINAL SINGLE POINT ENERGY" lines; the Gaussian parser extracts from "SCF Done:" lines. Write a factory function <code>get_parser(program: str)</code> that returns the correct parser.',
          hint: 'ORCA: look for "FINAL SINGLE POINT ENERGY", split and take last token. Gaussian: look for "SCF Done:", split on "=" and parse.',
          answer: `from abc import ABC, abstractmethod

class OutputParser(ABC):
    @abstractmethod
    def parse(self, text: str) -> float:
        ...

class ORCAParser(OutputParser):
    def parse(self, text):
        for line in text.splitlines():
            if "FINAL SINGLE POINT ENERGY" in line:
                return float(line.split()[-1])

class GaussianParser(OutputParser):
    def parse(self, text):
        for line in text.splitlines():
            if "SCF Done:" in line:
                return float(line.split("=")[1].split()[0])

def get_parser(program: str) -> OutputParser:
    parsers = {"orca": ORCAParser, "gaussian": GaussianParser}
    return parsers[program.lower()]()`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — abc module', url: 'https://docs.python.org/3/library/abc.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Refactoring Guru — Design Patterns', url: 'https://refactoring.guru/design-patterns/python', tag: 'tutorial', tagColor: 'green' },
      ]
    },

  ],
};
