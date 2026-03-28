/**
 * data/cs/02-algorithms.js
 * Stage 02: Algorithms
 * Topics: big-o,sorting,binary-search,recursion,dynamic-programming,graph-traversal,string-algorithms
 *
 * All challenge exercises use computational chemistry / materials science context.
 * Code line limits: 15–35 lines per topic.
 */

window.CS_S2 = {
  id: 'cs-s2', num: '02', title: 'Algorithms',
  color: 'blue', meta: '~2 weeks', track: 'cs',
  topics: [

    // ════════════════════════════════════════════════════════
    //  BIG-O
    // ════════════════════════════════════════════════════════
    {
      id:   'big-o',
      name: 'Big-O Notation',
      desc: 'Analyzing algorithm efficiency for scaling molecular computations',

      explanation: `
        <p><strong>Big-O notation</strong> describes how an algorithm's time or
        space grows as the input size n increases. O(1) is constant time
        (dictionary lookup), O(n) is linear (scanning a list of energies),
        O(n²) is quadratic (computing all pairwise distances), and O(2ⁿ) is
        exponential (brute-force conformer search).</p>

        <p>Big-O captures the <strong>dominant term</strong> and drops constants:
        3n² + 5n + 10 is O(n²). This matters in computational chemistry where
        DFT scales as O(N³) with system size, MP2 as O(N⁵), and CCSD(T) as
        O(N⁷). Choosing the right algorithm (or approximation) is the difference
        between a calculation finishing in hours vs. never.</p>

        <p>Common complexity classes ranked: O(1) < O(log n) < O(n) <
        O(n log n) < O(n²) < O(n³) < O(2ⁿ). When analyzing code, count nested
        loops: one loop over n atoms is O(n), two nested loops over n atoms is
        O(n²). Recursive algorithms often have O(2ⁿ) or O(n!) complexity
        unless memoized.</p>
      `,

      code: `<span class="cm"># O(1) — constant: dictionary lookup</span>
<span class="nm">masses</span> = {<span class="st">"H"</span>: <span class="num">1.008</span>, <span class="st">"C"</span>: <span class="num">12.011</span>, <span class="st">"N"</span>: <span class="num">14.007</span>, <span class="st">"O"</span>: <span class="num">15.999</span>}
<span class="nm">m</span> = <span class="nm">masses</span>[<span class="st">"O"</span>]  <span class="cm"># O(1) regardless of dict size</span>

<span class="cm"># O(n) — linear: sum all energies</span>
<span class="nm">energies</span> = [<span class="num">-76.40</span>, <span class="num">-40.52</span>, <span class="num">-152.98</span>, <span class="num">-56.55</span>]
<span class="nm">total</span> = <span class="fn">sum</span>(<span class="nm">energies</span>)  <span class="cm"># visits each element once</span>

<span class="cm"># O(n²) — quadratic: all pairwise distances</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">def</span> <span class="fn">pairwise_naive</span>(<span class="nm">coords</span>):
    <span class="nm">n</span> = <span class="fn">len</span>(<span class="nm">coords</span>)
    <span class="nm">dists</span> = <span class="nm">np</span>.<span class="fn">zeros</span>((<span class="nm">n</span>, <span class="nm">n</span>))
    <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">n</span>):          <span class="cm"># outer loop: n</span>
        <span class="kw">for</span> <span class="nm">j</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">i</span>+<span class="num">1</span>, <span class="nm">n</span>): <span class="cm"># inner loop: ~n/2</span>
            <span class="nm">d</span> = <span class="nm">np</span>.<span class="nm">linalg</span>.<span class="fn">norm</span>(<span class="nm">coords</span>[<span class="nm">i</span>] <span class="op">-</span> <span class="nm">coords</span>[<span class="nm">j</span>])
            <span class="nm">dists</span>[<span class="nm">i</span>][<span class="nm">j</span>] = <span class="nm">dists</span>[<span class="nm">j</span>][<span class="nm">i</span>] = <span class="nm">d</span>
    <span class="kw">return</span> <span class="nm">dists</span>  <span class="cm"># O(n²) total</span>

<span class="cm"># O(n log n) — sorting energies</span>
<span class="nm">sorted_e</span> = <span class="fn">sorted</span>(<span class="nm">energies</span>)  <span class="cm"># Timsort: O(n log n)</span>

<span class="cm"># Scaling comparison for N atoms:</span>
<span class="cm"># DFT   ~ O(N³)     — practical for ~1000 atoms</span>
<span class="cm"># MP2   ~ O(N⁵)     — practical for ~50 atoms</span>
<span class="cm"># CCSD(T) ~ O(N⁷)   — practical for ~20 atoms</span>`,

      cheatsheet: [
        { syn: 'O(1)',          desc: 'Constant — dict lookup, array index access' },
        { syn: 'O(log n)',      desc: 'Logarithmic — binary search' },
        { syn: 'O(n)',          desc: 'Linear — single pass over data' },
        { syn: 'O(n log n)',    desc: 'Linearithmic — efficient sorting (merge, Timsort)' },
        { syn: 'O(n²)',         desc: 'Quadratic — nested loops, pairwise comparisons' },
        { syn: 'O(n³)',         desc: 'Cubic — matrix multiply, DFT scaling' },
        { syn: 'O(2ⁿ)',         desc: 'Exponential — brute-force combinatorics' },
        { syn: 'Drop constants', desc: '3n² + 5n → O(n²) — only dominant term matters' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the Big-O complexity of computing all pairwise distances between N atoms using two nested loops?',
          opts: ['O(N)', 'O(N log N)', 'O(N²)', 'O(N³)'],
          answer: 2,
          feedback: 'Two nested loops over N atoms produce N*(N-1)/2 pairs. Dropping the constant factor gives O(N²).'
        },
        {
          type: 'fill',
          q: 'Python\'s built-in <code>sorted()</code> function has time complexity:',
          pre: 'O(n ___ n)',
          answer: 'log',
          feedback: 'Python uses Timsort, which has O(n log n) worst-case time complexity.'
        },
        {
          type: 'challenge',
          q: 'You have a list of N conformer energies. Analyze the Big-O of these three approaches to find the minimum: (1) scan the list once, (2) sort then take first element, (3) use a heap to extract minimum. Write each approach and state its complexity.',
          hint: 'min() is O(n), sorted()[0] is O(n log n), heapq.nsmallest(1, lst) is O(n).',
          answer: `import heapq

energies = [-76.40, -40.52, -152.98, -56.55, -79.73]

# Approach 1: Linear scan — O(n)
minimum = min(energies)

# Approach 2: Sort + first element — O(n log n)
minimum = sorted(energies)[0]

# Approach 3: Heap — O(n) to heapify, O(log n) to extract
heapq.heapify(energies)  # O(n)
minimum = heapq.heappop(energies)  # O(log n)
# Total: O(n), same as linear scan for single minimum`
        }
      ],

      resources: [
        { icon: '📘', title: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/', tag: 'reference', tagColor: 'purple' },
        { icon: '📗', title: 'Python Time Complexity', url: 'https://wiki.python.org/moin/TimeComplexity', tag: 'reference', tagColor: 'purple' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  SORTING
    // ════════════════════════════════════════════════════════
    {
      id:   'sorting',
      name: 'Sorting Algorithms',
      desc: 'Ordering energies, ranking candidates, and understanding merge/quick sort',

      explanation: `
        <p><strong>Sorting</strong> arranges elements in order — ascending energies,
        alphabetical formulas, or ranked reaction yields. Python's
        <code>sorted()</code> and <code>list.sort()</code> use <strong>Timsort</strong>,
        a hybrid merge/insertion sort with O(n log n) worst case. Always prefer
        built-in sorting unless you need a specialized algorithm.</p>

        <p><strong>Merge sort</strong> divides the list in half, recursively sorts
        each half, then merges them — guaranteed O(n log n) but uses O(n) extra
        space. <strong>Quick sort</strong> picks a pivot, partitions elements
        around it, then recurses — O(n log n) average but O(n²) worst case with
        bad pivots. Understanding these helps you choose the right tool and
        recognize when a problem is "just sorting" in disguise.</p>

        <p>For chemistry data, you often sort <strong>by a key</strong>:
        <code>sorted(mols, key=lambda m: m.energy)</code>. <strong>Stable sorts</strong>
        preserve the relative order of equal elements — Python's sort is stable,
        which matters when sorting molecules by energy then by name as a tiebreaker.</p>
      `,

      code: `<span class="cm"># Built-in sorting: Timsort O(n log n)</span>
<span class="nm">energies</span> = [<span class="num">-76.40</span>, <span class="num">-40.52</span>, <span class="num">-152.98</span>, <span class="num">-56.55</span>]
<span class="nm">ascending</span> = <span class="fn">sorted</span>(<span class="nm">energies</span>)             <span class="cm"># new list</span>
<span class="nm">energies</span>.<span class="fn">sort</span>(<span class="nm">reverse</span>=<span class="kw">True</span>)             <span class="cm"># in-place, descending</span>

<span class="cm"># Sort by key: molecules by energy</span>
<span class="nm">mols</span> = [(<span class="st">"H2O"</span>, <span class="num">-76.40</span>), (<span class="st">"CH4"</span>, <span class="num">-40.52</span>), (<span class="st">"NH3"</span>, <span class="num">-56.55</span>)]
<span class="nm">by_energy</span> = <span class="fn">sorted</span>(<span class="nm">mols</span>, <span class="nm">key</span>=<span class="kw">lambda</span> <span class="nm">m</span>: <span class="nm">m</span>[<span class="num">1</span>])

<span class="cm"># Merge sort implementation (educational)</span>
<span class="kw">def</span> <span class="fn">merge_sort</span>(<span class="nm">arr</span>):
    <span class="kw">if</span> <span class="fn">len</span>(<span class="nm">arr</span>) <span class="op">&lt;=</span> <span class="num">1</span>:
        <span class="kw">return</span> <span class="nm">arr</span>
    <span class="nm">mid</span> = <span class="fn">len</span>(<span class="nm">arr</span>) <span class="op">//</span> <span class="num">2</span>
    <span class="nm">left</span>  = <span class="fn">merge_sort</span>(<span class="nm">arr</span>[:<span class="nm">mid</span>])
    <span class="nm">right</span> = <span class="fn">merge_sort</span>(<span class="nm">arr</span>[<span class="nm">mid</span>:])
    <span class="kw">return</span> <span class="fn">merge</span>(<span class="nm">left</span>, <span class="nm">right</span>)

<span class="kw">def</span> <span class="fn">merge</span>(<span class="nm">a</span>, <span class="nm">b</span>):
    <span class="nm">result</span>, <span class="nm">i</span>, <span class="nm">j</span> = [], <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">while</span> <span class="nm">i</span> <span class="op">&lt;</span> <span class="fn">len</span>(<span class="nm">a</span>) <span class="kw">and</span> <span class="nm">j</span> <span class="op">&lt;</span> <span class="fn">len</span>(<span class="nm">b</span>):
        <span class="kw">if</span> <span class="nm">a</span>[<span class="nm">i</span>] <span class="op">&lt;=</span> <span class="nm">b</span>[<span class="nm">j</span>]: <span class="nm">result</span>.<span class="fn">append</span>(<span class="nm">a</span>[<span class="nm">i</span>]); <span class="nm">i</span> <span class="op">+=</span> <span class="num">1</span>
        <span class="kw">else</span>:            <span class="nm">result</span>.<span class="fn">append</span>(<span class="nm">b</span>[<span class="nm">j</span>]); <span class="nm">j</span> <span class="op">+=</span> <span class="num">1</span>
    <span class="kw">return</span> <span class="nm">result</span> <span class="op">+</span> <span class="nm">a</span>[<span class="nm">i</span>:] <span class="op">+</span> <span class="nm">b</span>[<span class="nm">j</span>:]

<span class="fn">print</span>(<span class="fn">merge_sort</span>([<span class="num">-40.52</span>, <span class="num">-152.98</span>, <span class="num">-76.40</span>]))`,

      cheatsheet: [
        { syn: 'sorted(lst)',                   desc: 'Return new sorted list — O(n log n)' },
        { syn: 'lst.sort()',                    desc: 'Sort in-place — O(n log n), no new list' },
        { syn: 'sorted(lst, key=func)',         desc: 'Sort by a computed key value' },
        { syn: 'sorted(lst, reverse=True)',     desc: 'Sort in descending order' },
        { syn: 'Merge sort: O(n log n)',        desc: 'Guaranteed, stable, O(n) extra space' },
        { syn: 'Quick sort: O(n log n) avg',    desc: 'In-place, O(n²) worst case' },
        { syn: 'Timsort: Python built-in',      desc: 'Hybrid merge+insertion, adaptive, stable' },
        { syn: 'Stable sort',                   desc: 'Equal elements keep original relative order' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Which sorting algorithm does Python use internally?',
          opts: ['Quick sort', 'Merge sort', 'Timsort (hybrid merge + insertion)', 'Heap sort'],
          answer: 2,
          feedback: 'Python uses Timsort — a stable, adaptive algorithm combining merge sort and insertion sort, with O(n log n) worst case.'
        },
        {
          type: 'fill',
          q: 'Sort molecules by energy using a key function:',
          pre: 'ranked = sorted(molecules, ___=lambda m: m.energy)',
          answer: 'key',
          feedback: 'The <code>key</code> parameter accepts a function that extracts a comparison value from each element.'
        },
        {
          type: 'challenge',
          q: 'Implement a function <code>rank_conformers(conformers)</code> that takes a list of dicts with keys "name", "energy", and "rmsd", and returns them sorted by energy (ascending), using RMSD as a tiebreaker (ascending). Use Python\'s stable sort with a tuple key.',
          hint: 'sorted(lst, key=lambda c: (c["energy"], c["rmsd"])) sorts by energy first, then RMSD for ties.',
          answer: `def rank_conformers(conformers):
    return sorted(conformers, key=lambda c: (c["energy"], c["rmsd"]))

confs = [
    {"name": "conf_A", "energy": -76.402, "rmsd": 0.5},
    {"name": "conf_B", "energy": -76.402, "rmsd": 0.3},
    {"name": "conf_C", "energy": -76.405, "rmsd": 0.8},
]
for c in rank_conformers(confs):
    print(f"{c['name']}: {c['energy']:.3f} Ha, RMSD={c['rmsd']}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Sorting HOW TO', url: 'https://docs.python.org/3/howto/sorting.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Sorting', url: 'https://visualgo.net/en/sorting', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  BINARY-SEARCH
    // ════════════════════════════════════════════════════════
    {
      id:   'binary-search',
      name: 'Binary Search',
      desc: 'O(log n) lookup in sorted energy tables and spectral data',

      explanation: `
        <p><strong>Binary search</strong> finds an element in a sorted array by
        repeatedly halving the search space. Compare the target to the middle
        element: if smaller, search the left half; if larger, search the right
        half. This gives O(log n) time — finding an element in 1 million sorted
        energies takes only ~20 comparisons.</p>

        <p>Python provides <code>bisect</code> module for binary search on sorted
        lists: <code>bisect_left</code> finds the insertion point for a value,
        and <code>insort</code> inserts while maintaining sort order. These are
        essential for maintaining sorted energy databases, spectral peak lists,
        and threshold lookups.</p>

        <p>Binary search extends beyond simple lookups: <strong>binary search on
        the answer</strong> finds optimal parameters (e.g., the minimum basis set
        size that achieves a target accuracy). The pattern: if you can phrase a
        problem as "is X large enough?" with a monotonic yes/no boundary, binary
        search finds the boundary in O(log n).</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">bisect</span>

<span class="cm"># Sorted energy levels (eV)</span>
<span class="nm">levels</span> = [<span class="num">-20.56</span>, <span class="num">-1.35</span>, <span class="num">-0.71</span>, <span class="num">-0.58</span>, <span class="num">-0.50</span>, <span class="num">0.25</span>, <span class="num">1.83</span>]

<span class="cm"># bisect_left: find insertion point (O(log n))</span>
<span class="nm">idx</span> = <span class="nm">bisect</span>.<span class="fn">bisect_left</span>(<span class="nm">levels</span>, <span class="num">-0.60</span>)
<span class="fn">print</span>(<span class="st">f"Insert -0.60 at index <span class="nm">{idx}</span>"</span>)  <span class="cm"># 3</span>

<span class="cm"># Manual binary search implementation</span>
<span class="kw">def</span> <span class="fn">binary_search</span>(<span class="nm">arr</span>, <span class="nm">target</span>, <span class="nm">tol</span>=<span class="num">1e-6</span>):
    <span class="st">"""Find index of target in sorted array (within tolerance)."""</span>
    <span class="nm">lo</span>, <span class="nm">hi</span> = <span class="num">0</span>, <span class="fn">len</span>(<span class="nm">arr</span>) <span class="op">-</span> <span class="num">1</span>
    <span class="kw">while</span> <span class="nm">lo</span> <span class="op">&lt;=</span> <span class="nm">hi</span>:
        <span class="nm">mid</span> = (<span class="nm">lo</span> <span class="op">+</span> <span class="nm">hi</span>) <span class="op">//</span> <span class="num">2</span>
        <span class="kw">if</span> <span class="fn">abs</span>(<span class="nm">arr</span>[<span class="nm">mid</span>] <span class="op">-</span> <span class="nm">target</span>) <span class="op">&lt;</span> <span class="nm">tol</span>:
            <span class="kw">return</span> <span class="nm">mid</span>
        <span class="kw">elif</span> <span class="nm">arr</span>[<span class="nm">mid</span>] <span class="op">&lt;</span> <span class="nm">target</span>:
            <span class="nm">lo</span> = <span class="nm">mid</span> <span class="op">+</span> <span class="num">1</span>
        <span class="kw">else</span>:
            <span class="nm">hi</span> = <span class="nm">mid</span> <span class="op">-</span> <span class="num">1</span>
    <span class="kw">return</span> <span class="num">-1</span>

<span class="fn">print</span>(<span class="fn">binary_search</span>(<span class="nm">levels</span>, <span class="num">-0.71</span>))  <span class="cm"># 2</span>

<span class="cm"># insort: insert while keeping sorted — O(n) for shift</span>
<span class="nm">bisect</span>.<span class="fn">insort</span>(<span class="nm">levels</span>, <span class="num">-0.65</span>)
<span class="cm"># levels now has -0.65 in the correct position</span>

<span class="cm"># Find nearest energy to a target</span>
<span class="kw">def</span> <span class="fn">find_nearest</span>(<span class="nm">sorted_arr</span>, <span class="nm">target</span>):
    <span class="nm">i</span> = <span class="nm">bisect</span>.<span class="fn">bisect_left</span>(<span class="nm">sorted_arr</span>, <span class="nm">target</span>)
    <span class="kw">if</span> <span class="nm">i</span> <span class="op">==</span> <span class="num">0</span>: <span class="kw">return</span> <span class="nm">sorted_arr</span>[<span class="num">0</span>]
    <span class="kw">if</span> <span class="nm">i</span> <span class="op">==</span> <span class="fn">len</span>(<span class="nm">sorted_arr</span>): <span class="kw">return</span> <span class="nm">sorted_arr</span>[<span class="num">-1</span>]
    <span class="kw">return</span> <span class="fn">min</span>(<span class="nm">sorted_arr</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>], <span class="nm">sorted_arr</span>[<span class="nm">i</span>], <span class="nm">key</span>=<span class="kw">lambda</span> <span class="nm">x</span>: <span class="fn">abs</span>(<span class="nm">x</span><span class="op">-</span><span class="nm">target</span>))`,

      cheatsheet: [
        { syn: 'bisect.bisect_left(a, x)',    desc: 'Find leftmost insertion point — O(log n)' },
        { syn: 'bisect.bisect_right(a, x)',   desc: 'Find rightmost insertion point — O(log n)' },
        { syn: 'bisect.insort(a, x)',         desc: 'Insert x keeping a sorted — O(n) for shift' },
        { syn: 'lo, hi = 0, len(a)-1',       desc: 'Binary search: initialize two pointers' },
        { syn: 'mid = (lo + hi) // 2',       desc: 'Compute middle index' },
        { syn: 'O(log n) comparisons',        desc: 'Halving search space each step' },
        { syn: 'Requires sorted input',       desc: 'Binary search only works on sorted data' },
        { syn: 'Binary search on answer',     desc: 'Find optimal threshold via monotonic predicate' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'How many comparisons does binary search need to find an element in a sorted array of 1024 values?',
          opts: ['1024', '512', '~10 (log₂ 1024)', '32'],
          answer: 2,
          feedback: 'Binary search halves the search space each step. log₂(1024) = 10, so at most 10 comparisons are needed.'
        },
        {
          type: 'fill',
          q: 'Find the insertion point for a value in a sorted list:',
          pre: 'import bisect\nidx = bisect.___(sorted_energies, -0.65)',
          answer: 'bisect_left',
          feedback: '<code>bisect_left</code> returns the index where the value would be inserted to maintain sorted order. O(log n).'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>find_band_gap(levels)</code> that takes a sorted list of orbital energy levels (eV) and finds the HOMO-LUMO gap. The HOMO is the highest occupied level (<0) and LUMO is the lowest unoccupied level (>=0). Use binary search to find the boundary efficiently.',
          hint: 'Use bisect_left to find the index of the first non-negative value. HOMO is the element before it, LUMO is at that index.',
          answer: `import bisect

def find_band_gap(levels):
    i = bisect.bisect_left(levels, 0)
    if i == 0 or i == len(levels):
        return None  # no gap found
    homo = levels[i - 1]
    lumo = levels[i]
    return lumo - homo

levels = [-20.56, -1.35, -0.71, -0.58, -0.50, 0.25, 1.83]
gap = find_band_gap(levels)
print(f"HOMO-LUMO gap: {gap:.2f} eV")  # 0.75 eV`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python bisect Module', url: 'https://docs.python.org/3/library/bisect.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Binary Search', url: 'https://visualgo.net/en/bst', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  RECURSION
    // ════════════════════════════════════════════════════════
    {
      id:   'recursion',
      name: 'Recursion',
      desc: 'Self-referential algorithms for tree traversal and molecular fragmentation',

      explanation: `
        <p><strong>Recursion</strong> is when a function calls itself to solve
        smaller subproblems. Every recursive function needs a <strong>base case</strong>
        (stop condition) and a <strong>recursive case</strong> (smaller subproblem).
        Without a base case, you get infinite recursion and a stack overflow.</p>

        <p>Recursion naturally handles <strong>hierarchical structures</strong>:
        traversing molecular fragmentation trees, exploring all branches of a
        reaction network, and enumerating conformers. The call stack tracks each
        level automatically — no explicit stack data structure needed (though you
        can convert any recursion to an iterative approach with an explicit stack).</p>

        <p>Watch for <strong>exponential blowup</strong>: naive recursive Fibonacci
        is O(2ⁿ). Use <strong>memoization</strong> (caching results of subproblems)
        to drop this to O(n). Python's recursion limit (default 1000) means very
        deep recursion needs <code>sys.setrecursionlimit()</code> or conversion
        to iteration.</p>
      `,

      code: `<span class="cm"># Factorial — classic recursion example</span>
<span class="kw">def</span> <span class="fn">factorial</span>(<span class="nm">n</span>):
    <span class="kw">if</span> <span class="nm">n</span> <span class="op">&lt;=</span> <span class="num">1</span>: <span class="kw">return</span> <span class="num">1</span>            <span class="cm"># base case</span>
    <span class="kw">return</span> <span class="nm">n</span> <span class="op">*</span> <span class="fn">factorial</span>(<span class="nm">n</span> <span class="op">-</span> <span class="num">1</span>)  <span class="cm"># recursive case</span>

<span class="cm"># Molecular formula parser: count atoms recursively</span>
<span class="cm"># (simplified — handles nested parentheses)</span>
<span class="kw">def</span> <span class="fn">count_atoms_simple</span>(<span class="nm">symbols</span>):
    <span class="st">"""Count unique atoms in a flat list (recursive)."""</span>
    <span class="kw">if</span> <span class="kw">not</span> <span class="nm">symbols</span>:
        <span class="kw">return</span> {}
    <span class="nm">rest</span> = <span class="fn">count_atoms_simple</span>(<span class="nm">symbols</span>[<span class="num">1</span>:])
    <span class="nm">rest</span>[<span class="nm">symbols</span>[<span class="num">0</span>]] = <span class="nm">rest</span>.<span class="fn">get</span>(<span class="nm">symbols</span>[<span class="num">0</span>], <span class="num">0</span>) <span class="op">+</span> <span class="num">1</span>
    <span class="kw">return</span> <span class="nm">rest</span>

<span class="fn">print</span>(<span class="fn">count_atoms_simple</span>([<span class="st">"C"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>, <span class="st">"O"</span>, <span class="st">"H"</span>]))

<span class="cm"># Tree traversal: sum energies in fragmentation tree</span>
<span class="kw">def</span> <span class="fn">sum_leaf_energies</span>(<span class="nm">node</span>):
    <span class="st">"""Sum energies of leaf nodes (terminal fragments)."""</span>
    <span class="kw">if</span> <span class="nm">node</span> <span class="kw">is</span> <span class="kw">None</span>:
        <span class="kw">return</span> <span class="num">0.0</span>
    <span class="kw">if</span> <span class="nm">node</span>.<span class="nm">left</span> <span class="kw">is</span> <span class="kw">None</span> <span class="kw">and</span> <span class="nm">node</span>.<span class="nm">right</span> <span class="kw">is</span> <span class="kw">None</span>:
        <span class="kw">return</span> <span class="nm">node</span>.<span class="nm">energy</span>  <span class="cm"># leaf = terminal fragment</span>
    <span class="kw">return</span> <span class="fn">sum_leaf_energies</span>(<span class="nm">node</span>.<span class="nm">left</span>) <span class="op">+</span> <span class="fn">sum_leaf_energies</span>(<span class="nm">node</span>.<span class="nm">right</span>)

<span class="cm"># Memoized Fibonacci (avoid exponential blowup)</span>
<span class="kw">from</span> <span class="nm">functools</span> <span class="kw">import</span> <span class="nm">lru_cache</span>

<span class="nm">@lru_cache</span>
<span class="kw">def</span> <span class="fn">fib</span>(<span class="nm">n</span>):
    <span class="kw">if</span> <span class="nm">n</span> <span class="op">&lt;</span> <span class="num">2</span>: <span class="kw">return</span> <span class="nm">n</span>
    <span class="kw">return</span> <span class="fn">fib</span>(<span class="nm">n</span><span class="op">-</span><span class="num">1</span>) <span class="op">+</span> <span class="fn">fib</span>(<span class="nm">n</span><span class="op">-</span><span class="num">2</span>)`,

      cheatsheet: [
        { syn: 'Base case: if n <= 1: return',  desc: 'Stop condition — prevents infinite recursion' },
        { syn: 'Recursive case: f(n-1)',        desc: 'Call with smaller input toward base case' },
        { syn: 'Call stack',                    desc: 'Each call adds a frame; unwinds on return' },
        { syn: 'sys.setrecursionlimit(N)',      desc: 'Increase Python default limit of 1000' },
        { syn: '@lru_cache',                    desc: 'Memoize: cache results of recursive calls' },
        { syn: 'Tail recursion',                desc: 'Recursive call is the last operation (Python doesn\'t optimize this)' },
        { syn: 'Recursion → iteration',         desc: 'Any recursion can use an explicit stack instead' },
        { syn: 'Divide and conquer',            desc: 'Split problem in half, solve, combine (merge sort)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What happens if a recursive function has no base case?',
          opts: [
            'It returns None',
            'It runs forever until a RecursionError (stack overflow)',
            'Python automatically adds a base case',
            'It returns an empty list'
          ],
          answer: 1,
          feedback: 'Without a base case, the function calls itself indefinitely. Python\'s default recursion limit (1000 frames) triggers a RecursionError.'
        },
        {
          type: 'fill',
          q: 'Cache recursive results to avoid recomputation:',
          pre: 'from functools import ___\n@___\ndef fib(n): ...',
          answer: 'lru_cache',
          feedback: '<code>@lru_cache</code> stores previously computed results. This turns O(2ⁿ) naive Fibonacci into O(n).'
        },
        {
          type: 'challenge',
          q: 'Write a recursive function <code>generate_compositions(elements, n)</code> that generates all combinations of n elements (with repetition) from a list of chemical elements. For example, <code>generate_compositions(["H", "C", "O"], 2)</code> should return all 2-element combinations like ["H","H"], ["H","C"], etc.',
          hint: 'Base case: n==0 returns [[]]. Recursive case: for each element, prepend it to all compositions of length n-1.',
          answer: `def generate_compositions(elements, n):
    if n == 0:
        return [[]]
    result = []
    for elem in elements:
        for combo in generate_compositions(elements, n - 1):
            result.append([elem] + combo)
    return result

combos = generate_compositions(["H", "C", "O"], 2)
print(f"{len(combos)} combinations")  # 9
for c in combos:
    print(c)`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — Recursion', url: 'https://docs.python.org/3/tutorial/controlflow.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Recursion Tree', url: 'https://visualgo.net/en/recursion', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  DYNAMIC-PROGRAMMING
    // ════════════════════════════════════════════════════════
    {
      id:   'dynamic-programming',
      name: 'Dynamic Programming',
      desc: 'Optimal substructure for sequence alignment and energy minimization',

      explanation: `
        <p><strong>Dynamic programming</strong> (DP) solves problems by breaking
        them into overlapping subproblems and storing intermediate results. If a
        problem has <strong>optimal substructure</strong> (the optimal solution
        contains optimal sub-solutions) and <strong>overlapping subproblems</strong>
        (the same subproblems recur), DP avoids redundant computation.</p>

        <p>Two approaches: <strong>top-down</strong> (memoized recursion) starts
        from the original problem and caches results, while <strong>bottom-up</strong>
        (tabulation) fills a table from the smallest subproblems up. Bottom-up
        avoids recursion overhead and is often preferred for large inputs.</p>

        <p>In computational chemistry, DP appears in <strong>sequence alignment</strong>
        (Needleman-Wunsch), <strong>optimal reaction pathways</strong> (finding
        minimum-energy routes through a reaction network), and
        <strong>knapsack-like</strong> problems (selecting the best set of basis
        functions within a computational budget).</p>
      `,

      code: `<span class="cm"># Bottom-up DP: minimum cost reaction pathway</span>
<span class="cm"># Given step costs, find cheapest path from reactant to product</span>
<span class="kw">def</span> <span class="fn">min_cost_path</span>(<span class="nm">barriers</span>):
    <span class="st">"""DP: min cost to reach each step in a reaction."""</span>
    <span class="nm">n</span> = <span class="fn">len</span>(<span class="nm">barriers</span>)
    <span class="nm">dp</span> = [<span class="num">0</span>] <span class="op">*</span> <span class="nm">n</span>
    <span class="nm">dp</span>[<span class="num">0</span>] = <span class="nm">barriers</span>[<span class="num">0</span>]
    <span class="kw">if</span> <span class="nm">n</span> <span class="op">></span> <span class="num">1</span>: <span class="nm">dp</span>[<span class="num">1</span>] = <span class="fn">min</span>(<span class="nm">barriers</span>[<span class="num">0</span>] <span class="op">+</span> <span class="nm">barriers</span>[<span class="num">1</span>], <span class="nm">barriers</span>[<span class="num">1</span>])
    <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>, <span class="nm">n</span>):
        <span class="nm">dp</span>[<span class="nm">i</span>] = <span class="nm">barriers</span>[<span class="nm">i</span>] <span class="op">+</span> <span class="fn">min</span>(<span class="nm">dp</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>], <span class="nm">dp</span>[<span class="nm">i</span><span class="op">-</span><span class="num">2</span>])
    <span class="kw">return</span> <span class="nm">dp</span>[<span class="num">-1</span>]

<span class="cm"># Barriers in kcal/mol for each reaction step</span>
<span class="nm">barriers</span> = [<span class="num">15.3</span>, <span class="num">8.7</span>, <span class="num">22.1</span>, <span class="num">5.4</span>, <span class="num">12.8</span>]
<span class="fn">print</span>(<span class="st">f"Min cost: <span class="nm">{min_cost_path(barriers):.1f}</span> kcal/mol"</span>)

<span class="cm"># Longest common subsequence: sequence alignment</span>
<span class="kw">def</span> <span class="fn">lcs_length</span>(<span class="nm">seq1</span>, <span class="nm">seq2</span>):
    <span class="st">"""Length of longest common subsequence (DP table)."""</span>
    <span class="nm">m</span>, <span class="nm">n</span> = <span class="fn">len</span>(<span class="nm">seq1</span>), <span class="fn">len</span>(<span class="nm">seq2</span>)
    <span class="nm">dp</span> = [[<span class="num">0</span>] <span class="op">*</span> (<span class="nm">n</span> <span class="op">+</span> <span class="num">1</span>) <span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">m</span> <span class="op">+</span> <span class="num">1</span>)]
    <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="nm">m</span> <span class="op">+</span> <span class="num">1</span>):
        <span class="kw">for</span> <span class="nm">j</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="nm">n</span> <span class="op">+</span> <span class="num">1</span>):
            <span class="kw">if</span> <span class="nm">seq1</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>] <span class="op">==</span> <span class="nm">seq2</span>[<span class="nm">j</span><span class="op">-</span><span class="num">1</span>]:
                <span class="nm">dp</span>[<span class="nm">i</span>][<span class="nm">j</span>] = <span class="nm">dp</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>][<span class="nm">j</span><span class="op">-</span><span class="num">1</span>] <span class="op">+</span> <span class="num">1</span>
            <span class="kw">else</span>:
                <span class="nm">dp</span>[<span class="nm">i</span>][<span class="nm">j</span>] = <span class="fn">max</span>(<span class="nm">dp</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>][<span class="nm">j</span>], <span class="nm">dp</span>[<span class="nm">i</span>][<span class="nm">j</span><span class="op">-</span><span class="num">1</span>])
    <span class="kw">return</span> <span class="nm">dp</span>[<span class="nm">m</span>][<span class="nm">n</span>]

<span class="cm"># Compare amino acid sequences</span>
<span class="fn">print</span>(<span class="fn">lcs_length</span>(<span class="st">"ALANINE"</span>, <span class="st">"VALINE"</span>))  <span class="cm"># 5: ALINE</span>`,

      cheatsheet: [
        { syn: 'dp[i] = f(dp[i-1], dp[i-2])',  desc: 'Recurrence relation — core of any DP' },
        { syn: 'Bottom-up (tabulation)',         desc: 'Fill table from base cases up — iterative' },
        { syn: 'Top-down (memoization)',         desc: 'Recursion + cache — often easier to write' },
        { syn: 'Optimal substructure',           desc: 'Optimal solution built from optimal sub-solutions' },
        { syn: 'Overlapping subproblems',        desc: 'Same subproblems solved repeatedly' },
        { syn: 'O(n) or O(n²) typical',         desc: 'Usually polynomial, vs exponential brute force' },
        { syn: 'LCS / edit distance',            desc: 'Classic DP: sequence alignment' },
        { syn: 'Knapsack / subset sum',          desc: 'Classic DP: optimization under constraints' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What two properties must a problem have for dynamic programming to apply?',
          opts: [
            'Sorted input and binary structure',
            'Optimal substructure and overlapping subproblems',
            'Linear structure and constant space',
            'Random access and hash-ability'
          ],
          answer: 1,
          feedback: 'DP requires (1) optimal substructure — the solution is built from optimal sub-solutions, and (2) overlapping subproblems — the same sub-solutions are needed multiple times.'
        },
        {
          type: 'fill',
          q: 'Fill in the DP recurrence for minimum cost path:',
          pre: 'dp[i] = cost[i] + ___(dp[i-1], dp[i-2])',
          answer: 'min',
          feedback: 'At each step, choose the cheaper of the two previous states (one step back or two steps back) and add the current cost.'
        },
        {
          type: 'challenge',
          q: 'Implement a DP solution for the "basis set budget" problem: given N basis functions with computational costs and accuracy improvements, and a total time budget, find the maximum accuracy achievable. This is the 0/1 knapsack problem with costs as weights and accuracy as values.',
          hint: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w-cost[i]] + acc[i]). Iterate over items and budget.',
          answer: `def max_accuracy(costs, accuracies, budget):
    n = len(costs)
    dp = [[0] * (budget + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(budget + 1):
            dp[i][w] = dp[i-1][w]  # skip this basis function
            if costs[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w - costs[i-1]] + accuracies[i-1])
    return dp[n][budget]

costs = [10, 20, 15, 25]       # CPU minutes
accs  = [0.5, 1.2, 0.8, 1.5]  # accuracy gain (kcal/mol)
print(max_accuracy(costs, accs, 35))  # best accuracy within 35 min`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python DP Patterns', url: 'https://docs.python.org/3/faq/programming.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — DP', url: 'https://visualgo.net/en', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  GRAPH-TRAVERSAL
    // ════════════════════════════════════════════════════════
    {
      id:   'graph-traversal',
      name: 'Graph Traversal',
      desc: 'BFS and DFS algorithms for molecular graphs and reaction networks',

      explanation: `
        <p><strong>Breadth-First Search (BFS)</strong> explores a graph layer by
        layer using a queue. It finds the <strong>shortest path</strong> in
        unweighted graphs — in chemistry, the minimum number of bonds between
        two atoms. BFS guarantees visiting all nodes at distance d before any
        at distance d+1.</p>

        <p><strong>Depth-First Search (DFS)</strong> explores as deep as possible
        before backtracking, using a stack (or recursion). DFS is natural for
        detecting <strong>cycles</strong> (ring systems), finding
        <strong>connected components</strong> (separate molecules in a system),
        and <strong>topological sorting</strong> (ordering reaction steps by
        dependencies).</p>

        <p><strong>Dijkstra's algorithm</strong> extends BFS to
        <strong>weighted graphs</strong> using a priority queue. It finds the
        shortest weighted path — in chemistry, the minimum-energy pathway through
        a reaction network where each edge has an activation barrier. Time
        complexity: O((V + E) log V) with a heap.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">collections</span> <span class="kw">import</span> <span class="nm">deque</span>
<span class="kw">import</span> <span class="nm">heapq</span>

<span class="cm"># BFS: shortest bond path between two atoms</span>
<span class="kw">def</span> <span class="fn">shortest_bond_path</span>(<span class="nm">adj</span>, <span class="nm">start</span>, <span class="nm">end</span>):
    <span class="nm">queue</span> = <span class="fn">deque</span>([(<span class="nm">start</span>, [<span class="nm">start</span>])])
    <span class="nm">visited</span> = {<span class="nm">start</span>}
    <span class="kw">while</span> <span class="nm">queue</span>:
        <span class="nm">node</span>, <span class="nm">path</span> = <span class="nm">queue</span>.<span class="fn">popleft</span>()
        <span class="kw">if</span> <span class="nm">node</span> <span class="op">==</span> <span class="nm">end</span>: <span class="kw">return</span> <span class="nm">path</span>
        <span class="kw">for</span> <span class="nm">nb</span> <span class="kw">in</span> <span class="nm">adj</span>[<span class="nm">node</span>]:
            <span class="kw">if</span> <span class="nm">nb</span> <span class="kw">not</span> <span class="kw">in</span> <span class="nm">visited</span>:
                <span class="nm">visited</span>.<span class="fn">add</span>(<span class="nm">nb</span>)
                <span class="nm">queue</span>.<span class="fn">append</span>((<span class="nm">nb</span>, <span class="nm">path</span> <span class="op">+</span> [<span class="nm">nb</span>]))
    <span class="kw">return</span> []

<span class="cm"># Dijkstra: minimum-barrier pathway in reaction network</span>
<span class="kw">def</span> <span class="fn">dijkstra</span>(<span class="nm">graph</span>, <span class="nm">start</span>):
    <span class="st">"""graph = {node: [(neighbor, barrier), ...]}"""</span>
    <span class="nm">dist</span> = {<span class="nm">start</span>: <span class="num">0</span>}
    <span class="nm">heap</span> = [(<span class="num">0</span>, <span class="nm">start</span>)]
    <span class="kw">while</span> <span class="nm">heap</span>:
        <span class="nm">d</span>, <span class="nm">u</span> = <span class="nm">heapq</span>.<span class="fn">heappop</span>(<span class="nm">heap</span>)
        <span class="kw">if</span> <span class="nm">d</span> <span class="op">></span> <span class="nm">dist</span>.<span class="fn">get</span>(<span class="nm">u</span>, <span class="fn">float</span>(<span class="st">"inf"</span>)): <span class="kw">continue</span>
        <span class="kw">for</span> <span class="nm">v</span>, <span class="nm">w</span> <span class="kw">in</span> <span class="nm">graph</span>[<span class="nm">u</span>]:
            <span class="nm">nd</span> = <span class="nm">d</span> <span class="op">+</span> <span class="nm">w</span>
            <span class="kw">if</span> <span class="nm">nd</span> <span class="op">&lt;</span> <span class="nm">dist</span>.<span class="fn">get</span>(<span class="nm">v</span>, <span class="fn">float</span>(<span class="st">"inf"</span>)):
                <span class="nm">dist</span>[<span class="nm">v</span>] = <span class="nm">nd</span>
                <span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">heap</span>, (<span class="nm">nd</span>, <span class="nm">v</span>))
    <span class="kw">return</span> <span class="nm">dist</span>

<span class="cm"># Reaction network: barriers in kcal/mol</span>
<span class="nm">rxn_net</span> = {<span class="st">"R"</span>: [(<span class="st">"I1"</span>,<span class="num">15.3</span>),(<span class="st">"I2"</span>,<span class="num">22.0</span>)], <span class="st">"I1"</span>: [(<span class="st">"P"</span>,<span class="num">8.7</span>)],
           <span class="st">"I2"</span>: [(<span class="st">"P"</span>,<span class="num">5.4</span>)], <span class="st">"P"</span>: []}
<span class="fn">print</span>(<span class="fn">dijkstra</span>(<span class="nm">rxn_net</span>, <span class="st">"R"</span>))  <span class="cm"># min barriers from R</span>`,

      cheatsheet: [
        { syn: 'BFS: deque, popleft',            desc: 'Layer-by-layer — shortest unweighted path' },
        { syn: 'DFS: stack or recursion',        desc: 'Go deep first — cycles, components, toposort' },
        { syn: 'Dijkstra: heapq',                desc: 'Shortest weighted path — O((V+E) log V)' },
        { syn: 'visited set',                    desc: 'Track seen nodes to avoid infinite loops' },
        { syn: 'Topological sort',               desc: 'Order DAG nodes so all edges point forward' },
        { syn: 'Connected components',           desc: 'Groups of reachable nodes (separate molecules)' },
        { syn: 'Cycle detection (DFS)',          desc: 'Back edge in DFS tree = cycle (ring)' },
        { syn: 'A* search',                      desc: 'Dijkstra + heuristic for faster pathfinding' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Which algorithm finds the shortest path in a weighted reaction network?',
          opts: ['BFS', 'DFS', 'Dijkstra\'s algorithm', 'Merge sort'],
          answer: 2,
          feedback: 'BFS only finds shortest paths in unweighted graphs. Dijkstra handles weighted edges (activation barriers) using a priority queue.'
        },
        {
          type: 'fill',
          q: 'Track which nodes have been visited to avoid cycles:',
          pre: 'visited = ___()\nvisited.add(start)',
          answer: 'set',
          feedback: 'A <code>set</code> provides O(1) membership testing, making it ideal for tracking visited nodes during graph traversal.'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>find_all_paths(adj, start, end)</code> that finds ALL paths between two atoms in a molecular graph using DFS. Return a list of paths (each path is a list of node labels). Avoid cycles by tracking visited nodes per path.',
          hint: 'Recursive DFS: at each node, try each unvisited neighbor. Pass the current path and a visited set. When you reach end, save the path.',
          answer: `def find_all_paths(adj, start, end):
    paths = []
    def dfs(node, path, visited):
        if node == end:
            paths.append(path[:])
            return
        for nb in adj[node]:
            if nb not in visited:
                visited.add(nb)
                path.append(nb)
                dfs(nb, path, visited)
                path.pop()
                visited.remove(nb)
    dfs(start, [start], {start})
    return paths

adj = {"A": ["B","C"], "B": ["A","C","D"], "C": ["A","B","D"], "D": ["B","C"]}
for p in find_all_paths(adj, "A", "D"):
    print(" -> ".join(p))`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python — Graph Algorithms', url: 'https://docs.python.org/3/library/heapq.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Graph Traversal', url: 'https://visualgo.net/en/dfsbfs', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  STRING-ALGORITHMS
    // ════════════════════════════════════════════════════════
    {
      id:   'string-algorithms',
      name: 'String Algorithms',
      desc: 'Pattern matching for SMILES parsing, output extraction, and sequence search',

      explanation: `
        <p><strong>String algorithms</strong> solve problems involving text search,
        matching, and transformation. In computational chemistry, you parse ORCA
        output files for energy patterns, search SMILES strings for substructures,
        and align amino acid sequences. The naive approach — checking every
        position — is O(n·m) but specialized algorithms do much better.</p>

        <p>The <strong>KMP algorithm</strong> (Knuth-Morris-Pratt) preprocesses
        the pattern to skip redundant comparisons, achieving O(n + m). Python's
        built-in <code>str.find()</code> and <code>in</code> operator use optimized
        algorithms internally, so prefer them for simple searches. For complex
        patterns, use <code>re</code> (regular expressions).</p>

        <p><strong>Edit distance</strong> (Levenshtein distance) counts the minimum
        insertions, deletions, and substitutions to transform one string into
        another — used to compare molecular names, match similar SMILES, and
        align sequences. This is a classic DP problem with O(n·m) time and
        space.</p>
      `,

      code: `<span class="cm"># Built-in string search: find pattern in ORCA output</span>
<span class="nm">output</span> = <span class="st">"SCF converged\\nFINAL SINGLE POINT ENERGY -76.402683"</span>
<span class="nm">idx</span> = <span class="nm">output</span>.<span class="fn">find</span>(<span class="st">"FINAL SINGLE POINT"</span>)  <span class="cm"># 15</span>

<span class="cm"># Edit distance (Levenshtein) — DP approach</span>
<span class="kw">def</span> <span class="fn">edit_distance</span>(<span class="nm">s1</span>, <span class="nm">s2</span>):
    <span class="nm">m</span>, <span class="nm">n</span> = <span class="fn">len</span>(<span class="nm">s1</span>), <span class="fn">len</span>(<span class="nm">s2</span>)
    <span class="nm">dp</span> = [[<span class="num">0</span>] <span class="op">*</span> (<span class="nm">n</span> <span class="op">+</span> <span class="num">1</span>) <span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">m</span> <span class="op">+</span> <span class="num">1</span>)]
    <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">m</span> <span class="op">+</span> <span class="num">1</span>): <span class="nm">dp</span>[<span class="nm">i</span>][<span class="num">0</span>] = <span class="nm">i</span>
    <span class="kw">for</span> <span class="nm">j</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">n</span> <span class="op">+</span> <span class="num">1</span>): <span class="nm">dp</span>[<span class="num">0</span>][<span class="nm">j</span>] = <span class="nm">j</span>
    <span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="nm">m</span> <span class="op">+</span> <span class="num">1</span>):
        <span class="kw">for</span> <span class="nm">j</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="nm">n</span> <span class="op">+</span> <span class="num">1</span>):
            <span class="kw">if</span> <span class="nm">s1</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>] <span class="op">==</span> <span class="nm">s2</span>[<span class="nm">j</span><span class="op">-</span><span class="num">1</span>]:
                <span class="nm">dp</span>[<span class="nm">i</span>][<span class="nm">j</span>] = <span class="nm">dp</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>][<span class="nm">j</span><span class="op">-</span><span class="num">1</span>]
            <span class="kw">else</span>:
                <span class="nm">dp</span>[<span class="nm">i</span>][<span class="nm">j</span>] = <span class="num">1</span> <span class="op">+</span> <span class="fn">min</span>(<span class="nm">dp</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>][<span class="nm">j</span>], <span class="nm">dp</span>[<span class="nm">i</span>][<span class="nm">j</span><span class="op">-</span><span class="num">1</span>], <span class="nm">dp</span>[<span class="nm">i</span><span class="op">-</span><span class="num">1</span>][<span class="nm">j</span><span class="op">-</span><span class="num">1</span>])
    <span class="kw">return</span> <span class="nm">dp</span>[<span class="nm">m</span>][<span class="nm">n</span>]

<span class="cm"># Compare similar SMILES strings</span>
<span class="fn">print</span>(<span class="fn">edit_distance</span>(<span class="st">"CC(=O)O"</span>, <span class="st">"CC(=O)N"</span>))   <span class="cm"># 1 (O→N)</span>
<span class="fn">print</span>(<span class="fn">edit_distance</span>(<span class="st">"c1ccccc1"</span>, <span class="st">"c1ccncc1"</span>)) <span class="cm"># 1 (c→n)</span>

<span class="cm"># Count occurrences of a pattern</span>
<span class="kw">def</span> <span class="fn">count_pattern</span>(<span class="nm">text</span>, <span class="nm">pattern</span>):
    <span class="nm">count</span>, <span class="nm">start</span> = <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">while</span> <span class="kw">True</span>:
        <span class="nm">idx</span> = <span class="nm">text</span>.<span class="fn">find</span>(<span class="nm">pattern</span>, <span class="nm">start</span>)
        <span class="kw">if</span> <span class="nm">idx</span> <span class="op">==</span> <span class="num">-1</span>: <span class="kw">break</span>
        <span class="nm">count</span> <span class="op">+=</span> <span class="num">1</span>; <span class="nm">start</span> = <span class="nm">idx</span> <span class="op">+</span> <span class="num">1</span>
    <span class="kw">return</span> <span class="nm">count</span>`,

      cheatsheet: [
        { syn: 's.find(pattern)',               desc: 'Find first occurrence — O(n·m) worst case' },
        { syn: 'pattern in s',                  desc: 'Boolean membership check — optimized internally' },
        { syn: 's.count(sub)',                  desc: 'Count non-overlapping occurrences' },
        { syn: 'Edit distance (Levenshtein)',   desc: 'Min edits to transform one string to another' },
        { syn: 'KMP algorithm: O(n + m)',       desc: 'Pattern matching with prefix table preprocessing' },
        { syn: 're.search(pattern, text)',      desc: 'Regex search for complex patterns' },
        { syn: 'Suffix array / trie',           desc: 'Advanced: fast multi-pattern search' },
        { syn: 's.startswith() / s.endswith()', desc: 'Check prefix/suffix — O(k) for length k' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does edit distance measure between two strings?',
          opts: [
            'The number of characters they share',
            'The minimum insertions, deletions, and substitutions to transform one into the other',
            'The length difference between them',
            'The number of positions where they differ'
          ],
          answer: 1,
          feedback: 'Edit distance (Levenshtein) counts the minimum number of single-character edits (insert, delete, substitute) needed to change one string into another.'
        },
        {
          type: 'fill',
          q: 'Find the position of a pattern in a string, or -1 if not found:',
          pre: 'idx = orca_output.___(\"FINAL SINGLE POINT\")',
          answer: 'find',
          feedback: '<code>str.find()</code> returns the index of the first occurrence, or -1 if not found. Use this over <code>index()</code> when the pattern might be absent.'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>find_similar_smiles(query, database, max_dist)</code> that takes a SMILES string, a list of SMILES strings, and a maximum edit distance. Return all database entries within the distance threshold, sorted by distance (most similar first).',
          hint: 'Compute edit_distance for each database entry, filter by max_dist, sort by distance.',
          answer: `def find_similar_smiles(query, database, max_dist):
    results = []
    for smiles in database:
        dist = edit_distance(query, smiles)
        if dist <= max_dist:
            results.append((dist, smiles))
    return [s for _, s in sorted(results)]

db = ["CC(=O)O", "CC(=O)N", "CCO", "c1ccccc1", "CC(=O)OC"]
similar = find_similar_smiles("CC(=O)O", db, 2)
print(similar)  # sorted by edit distance from acetic acid`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — String Methods', url: 'https://docs.python.org/3/library/stdtypes.html#string-methods', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Python Docs — re module', url: 'https://docs.python.org/3/library/re.html', tag: 'docs', tagColor: 'blue' },
      ]
    },

  ],
};
