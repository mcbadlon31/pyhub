/**
 * data/cs/01-data-structures.js
 * Stage 01: Data Structures
 * Topics: arrays,linked-lists,stacks,queues,hash-tables,trees,graphs,heaps
 *
 * All challenge exercises use computational chemistry / materials science context.
 * Code line limits: 15–35 lines per topic.
 */

window.CS_S1 = {
  id: 'cs-s1', num: '01', title: 'Data Structures',
  color: 'teal', meta: '~2 weeks', track: 'cs',
  topics: [

    // ════════════════════════════════════════════════════════
    //  ARRAYS
    // ════════════════════════════════════════════════════════
    {
      id:   'arrays',
      name: 'Arrays & Lists',
      desc: 'Contiguous storage for coordinates, energies, and basis function indices',

      explanation: `
        <p>An <strong>array</strong> stores elements in contiguous memory, giving
        O(1) access by index. Python's <code>list</code> is a dynamic array that
        resizes automatically. In computational chemistry, arrays hold atomic
        coordinates, orbital energies, and basis function coefficients — any data
        you index by position.</p>

        <p>Key operations: <strong>append</strong> is amortized O(1),
        <strong>insert/delete</strong> at an arbitrary position is O(n) because
        elements must shift. <strong>Slicing</strong> <code>arr[i:j]</code>
        creates a new list in O(j−i). For numerical arrays, use NumPy — its
        fixed-type contiguous storage is orders of magnitude faster for
        element-wise math than Python lists.</p>

        <p>Understand the tradeoff: arrays give fast random access but slow
        insertion in the middle. If you need frequent insertions/deletions at
        arbitrary positions, a linked list may be better. For most scientific
        computing, arrays (and NumPy ndarrays) are the right default choice.</p>
      `,

      code: `<span class="cm"># Python list as dynamic array</span>
<span class="nm">energies</span> = [<span class="num">-76.4026</span>, <span class="num">-152.983</span>, <span class="num">-40.5184</span>]

<span class="cm"># O(1) access by index</span>
<span class="nm">first</span> = <span class="nm">energies</span>[<span class="num">0</span>]   <span class="cm"># -76.4026</span>
<span class="nm">last</span>  = <span class="nm">energies</span>[<span class="num">-1</span>]  <span class="cm"># -40.5184</span>

<span class="cm"># O(1) amortized append</span>
<span class="nm">energies</span>.<span class="fn">append</span>(<span class="num">-230.715</span>)

<span class="cm"># O(n) insert — shifts all elements after index</span>
<span class="nm">energies</span>.<span class="fn">insert</span>(<span class="num">1</span>, <span class="num">-56.5548</span>)  <span class="cm"># insert NH3 energy at index 1</span>

<span class="cm"># Slicing: O(k) where k = slice size</span>
<span class="nm">subset</span> = <span class="nm">energies</span>[<span class="num">1</span>:<span class="num">3</span>]  <span class="cm"># [-56.5548, -152.983]</span>

<span class="cm"># Two-pointer technique: find pair summing to target</span>
<span class="kw">def</span> <span class="fn">find_pair_sum</span>(<span class="nm">sorted_arr</span>, <span class="nm">target</span>):
    <span class="nm">lo</span>, <span class="nm">hi</span> = <span class="num">0</span>, <span class="fn">len</span>(<span class="nm">sorted_arr</span>) <span class="op">-</span> <span class="num">1</span>
    <span class="kw">while</span> <span class="nm">lo</span> <span class="op">&lt;</span> <span class="nm">hi</span>:
        <span class="nm">s</span> = <span class="nm">sorted_arr</span>[<span class="nm">lo</span>] <span class="op">+</span> <span class="nm">sorted_arr</span>[<span class="nm">hi</span>]
        <span class="kw">if</span> <span class="nm">s</span> <span class="op">==</span> <span class="nm">target</span>: <span class="kw">return</span> (<span class="nm">lo</span>, <span class="nm">hi</span>)
        <span class="kw">elif</span> <span class="nm">s</span> <span class="op">&lt;</span> <span class="nm">target</span>: <span class="nm">lo</span> <span class="op">+=</span> <span class="num">1</span>
        <span class="kw">else</span>: <span class="nm">hi</span> <span class="op">-=</span> <span class="num">1</span>
    <span class="kw">return</span> <span class="kw">None</span>

<span class="cm"># Find two orbital energies summing to a given value</span>
<span class="nm">orbitals</span> = <span class="fn">sorted</span>([<span class="num">-20.56</span>, <span class="num">-1.35</span>, <span class="num">-0.71</span>, <span class="num">-0.58</span>, <span class="num">-0.50</span>])
<span class="fn">print</span>(<span class="fn">find_pair_sum</span>(<span class="nm">orbitals</span>, <span class="num">-1.21</span>))  <span class="cm"># (-0.71, -0.50)</span>`,

      cheatsheet: [
        { syn: 'arr[i]',            desc: 'Access by index — O(1)' },
        { syn: 'arr.append(x)',     desc: 'Add to end — amortized O(1)' },
        { syn: 'arr.insert(i, x)',  desc: 'Insert at position — O(n) shifts elements' },
        { syn: 'arr.pop()',         desc: 'Remove last — O(1)' },
        { syn: 'arr.pop(i)',        desc: 'Remove at index — O(n)' },
        { syn: 'arr[i:j]',         desc: 'Slice — O(j-i) new list' },
        { syn: 'len(arr)',          desc: 'Length — O(1)' },
        { syn: 'x in arr',         desc: 'Search — O(n) linear scan' },
        { syn: 'sorted(arr)',       desc: 'Return new sorted list — O(n log n)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the time complexity of inserting an element at the beginning of a Python list of length n?',
          opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          answer: 2,
          feedback: 'Inserting at index 0 requires shifting all n existing elements one position to the right, giving O(n) time.'
        },
        {
          type: 'fill',
          q: 'Remove and return the last element from a list:',
          pre: 'energies = [-76.4, -152.9, -40.5]\nlast = energies.___()',
          answer: 'pop',
          feedback: '<code>list.pop()</code> removes and returns the last element in O(1) time. <code>pop(i)</code> removes at index i in O(n).'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>find_closest_pair(energies)</code> that finds the two energies in a list whose absolute difference is smallest. Return the pair as a tuple. Use sorting for an O(n log n) solution instead of O(n²) brute force.',
          hint: 'Sort first, then compare adjacent elements — the closest pair must be neighbors after sorting.',
          answer: `def find_closest_pair(energies):
    s = sorted(energies)
    min_diff = float("inf")
    pair = (s[0], s[1])
    for i in range(len(s) - 1):
        diff = abs(s[i+1] - s[i])
        if diff < min_diff:
            min_diff = diff
            pair = (s[i], s[i+1])
    return pair

print(find_closest_pair([-76.4026, -76.3980, -76.4100, -76.3850]))`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — Lists', url: 'https://docs.python.org/3/tutorial/datastructures.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Python Time Complexity', url: 'https://wiki.python.org/moin/TimeComplexity', tag: 'reference', tagColor: 'purple' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  LINKED-LISTS
    // ════════════════════════════════════════════════════════
    {
      id:   'linked-lists',
      name: 'Linked Lists',
      desc: 'Node-based chains for reaction pathways and dynamic insertion',

      explanation: `
        <p>A <strong>linked list</strong> stores elements as nodes, each pointing
        to the next. Unlike arrays, insertion and deletion at a known position is
        O(1) — just rewire pointers. The tradeoff: no random access, so reaching
        element i requires traversing i nodes (O(n)).</p>

        <p>In chemistry, linked lists model <strong>reaction pathways</strong> where
        each step (reactant → TS → intermediate → TS → product) points to the next.
        Inserting a newly discovered intermediate is O(1) once you have the
        reference, whereas inserting into a sorted array of energies would require
        shifting all subsequent elements.</p>

        <p><strong>Doubly linked lists</strong> add a <code>prev</code> pointer,
        allowing traversal in both directions — useful for stepping forward and
        backward through an IRC path. Python's <code>collections.deque</code> is
        implemented as a doubly linked list, giving O(1) append and pop from
        both ends.</p>
      `,

      code: `<span class="cm"># Singly linked list node for reaction steps</span>
<span class="kw">class</span> <span class="fn">ReactionNode</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">label</span>, <span class="nm">energy</span>, <span class="nm">next_node</span>=<span class="kw">None</span>):
        <span class="nm">self</span>.<span class="nm">label</span>  = <span class="nm">label</span>    <span class="cm"># e.g., "reactant", "TS1"</span>
        <span class="nm">self</span>.<span class="nm">energy</span> = <span class="nm">energy</span>   <span class="cm"># kcal/mol</span>
        <span class="nm">self</span>.<span class="nm">next</span>   = <span class="nm">next_node</span>

<span class="cm"># Build a reaction pathway</span>
<span class="nm">product</span>  = <span class="fn">ReactionNode</span>(<span class="st">"product"</span>,  <span class="num">-5.2</span>)
<span class="nm">ts</span>       = <span class="fn">ReactionNode</span>(<span class="st">"TS"</span>,       <span class="num">15.3</span>, <span class="nm">product</span>)
<span class="nm">reactant</span> = <span class="fn">ReactionNode</span>(<span class="st">"reactant"</span>, <span class="num">0.0</span>,  <span class="nm">ts</span>)

<span class="cm"># Traverse the pathway</span>
<span class="nm">node</span> = <span class="nm">reactant</span>
<span class="kw">while</span> <span class="nm">node</span>:
    <span class="fn">print</span>(<span class="st">f"<span class="nm">{node.label}</span>: <span class="nm">{node.energy:+.1f}</span> kcal/mol"</span>)
    <span class="nm">node</span> = <span class="nm">node</span>.<span class="nm">next</span>

<span class="cm"># Insert a new intermediate after TS (O(1) rewiring)</span>
<span class="nm">intermediate</span> = <span class="fn">ReactionNode</span>(<span class="st">"intermediate"</span>, <span class="num">2.1</span>, <span class="nm">ts</span>.<span class="nm">next</span>)
<span class="nm">ts</span>.<span class="nm">next</span> = <span class="nm">intermediate</span>

<span class="cm"># collections.deque: doubly linked list</span>
<span class="kw">from</span> <span class="nm">collections</span> <span class="kw">import</span> <span class="nm">deque</span>
<span class="nm">path</span> = <span class="fn">deque</span>([<span class="st">"reactant"</span>, <span class="st">"TS"</span>, <span class="st">"product"</span>])
<span class="nm">path</span>.<span class="fn">appendleft</span>(<span class="st">"pre-complex"</span>)  <span class="cm"># O(1) prepend</span>`,

      cheatsheet: [
        { syn: 'node.next = new_node',       desc: 'Link current node to next — O(1)' },
        { syn: 'Traverse: while node:',      desc: 'Walk the list — O(n) to visit all' },
        { syn: 'Insert after node: O(1)',    desc: 'Rewire prev.next → new → old_next' },
        { syn: 'Delete node: O(1)',          desc: 'Rewire prev.next → node.next' },
        { syn: 'Search: O(n)',               desc: 'Must traverse from head to find element' },
        { syn: 'deque()',                    desc: 'Python doubly linked list (collections)' },
        { syn: 'deque.appendleft(x)',        desc: 'O(1) prepend (vs O(n) for list.insert(0,x))' },
        { syn: 'deque.popleft()',            desc: 'O(1) remove from front' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the time complexity of accessing the k-th element in a singly linked list?',
          opts: ['O(1)', 'O(log n)', 'O(k)', 'O(n²)'],
          answer: 2,
          feedback: 'You must traverse k nodes from the head to reach the k-th element, giving O(k) time. There is no random access.'
        },
        {
          type: 'fill',
          q: 'Insert a new node after the current node in a singly linked list:',
          pre: 'new_node = ReactionNode("intermediate", 2.1)\nnew_node.next = current.___ \ncurrent.next = new_node',
          answer: 'next',
          feedback: 'To insert after <code>current</code>: point the new node to <code>current.next</code>, then point <code>current.next</code> to the new node.'
        },
        {
          type: 'challenge',
          q: 'Implement a function <code>find_max_energy(head)</code> that traverses a linked list of ReactionNode objects and returns the node with the highest energy. Then implement <code>reverse_pathway(head)</code> that reverses the linked list in-place and returns the new head.',
          hint: 'For max: traverse and track the max. For reverse: use three pointers (prev, curr, next) and rewire.',
          answer: `def find_max_energy(head):
    max_node = head
    node = head
    while node:
        if node.energy > max_node.energy:
            max_node = node
        node = node.next
    return max_node

def reverse_pathway(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python collections.deque', url: 'https://docs.python.org/3/library/collections.html#collections.deque', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Linked List', url: 'https://visualgo.net/en/list', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  STACKS
    // ════════════════════════════════════════════════════════
    {
      id:   'stacks',
      name: 'Stacks',
      desc: 'LIFO structures for undo operations, bracket matching, and DFS',

      explanation: `
        <p>A <strong>stack</strong> follows <strong>Last In, First Out</strong>
        (LIFO): the most recently added item is the first removed. Think of a
        stack of printed ORCA output pages — you always take from the top. The
        two core operations are <code>push</code> (add to top) and <code>pop</code>
        (remove from top), both O(1).</p>

        <p>Stacks appear everywhere in computing: the <strong>call stack</strong>
        manages function calls during recursion, <strong>undo/redo</strong> in
        editors uses stacks, and <strong>depth-first search</strong> (DFS) of
        molecular graphs uses an explicit or implicit stack. Bracket matching
        in chemical notation (SMILES parentheses, input file block markers) is
        a classic stack problem.</p>

        <p>In Python, use a <code>list</code> as a stack: <code>append()</code>
        for push, <code>pop()</code> for pop. Both are O(1). For thread-safe
        stacks, use <code>queue.LifoQueue</code>. The key insight: whenever you
        need to process items in reverse order of arrival, reach for a stack.</p>
      `,

      code: `<span class="cm"># Stack using Python list</span>
<span class="nm">undo_stack</span> = []

<span class="cm"># Push: record geometry changes for undo</span>
<span class="nm">undo_stack</span>.<span class="fn">append</span>({<span class="st">"action"</span>: <span class="st">"move_atom"</span>, <span class="st">"idx"</span>: <span class="num">2</span>, <span class="st">"old_pos"</span>: [<span class="num">0.0</span>, <span class="num">0.757</span>, <span class="num">-0.469</span>]})
<span class="nm">undo_stack</span>.<span class="fn">append</span>({<span class="st">"action"</span>: <span class="st">"delete_atom"</span>, <span class="st">"idx"</span>: <span class="num">3</span>})

<span class="cm"># Pop: undo the most recent action (LIFO)</span>
<span class="nm">last_action</span> = <span class="nm">undo_stack</span>.<span class="fn">pop</span>()  <span class="cm"># delete_atom</span>

<span class="cm"># Classic problem: validate nested brackets in SMILES</span>
<span class="kw">def</span> <span class="fn">validate_brackets</span>(<span class="nm">smiles</span>):
    <span class="st">"""Check that parentheses are balanced in SMILES."""</span>
    <span class="nm">stack</span> = []
    <span class="kw">for</span> <span class="nm">ch</span> <span class="kw">in</span> <span class="nm">smiles</span>:
        <span class="kw">if</span> <span class="nm">ch</span> <span class="op">==</span> <span class="st">"("</span>:
            <span class="nm">stack</span>.<span class="fn">append</span>(<span class="nm">ch</span>)
        <span class="kw">elif</span> <span class="nm">ch</span> <span class="op">==</span> <span class="st">")"</span>:
            <span class="kw">if</span> <span class="kw">not</span> <span class="nm">stack</span>:
                <span class="kw">return</span> <span class="kw">False</span>
            <span class="nm">stack</span>.<span class="fn">pop</span>()
    <span class="kw">return</span> <span class="fn">len</span>(<span class="nm">stack</span>) <span class="op">==</span> <span class="num">0</span>

<span class="fn">print</span>(<span class="fn">validate_brackets</span>(<span class="st">"CC(=O)O"</span>))    <span class="cm"># True  (acetic acid)</span>
<span class="fn">print</span>(<span class="fn">validate_brackets</span>(<span class="st">"CC(=O"</span>))      <span class="cm"># False (unmatched)</span>
<span class="fn">print</span>(<span class="fn">validate_brackets</span>(<span class="st">"c1ccc(O)cc1"</span>)) <span class="cm"># True  (phenol)</span>`,

      cheatsheet: [
        { syn: 'stack.append(x)',     desc: 'Push — add to top, O(1)' },
        { syn: 'stack.pop()',         desc: 'Pop — remove from top, O(1)' },
        { syn: 'stack[-1]',          desc: 'Peek — view top without removing, O(1)' },
        { syn: 'len(stack) == 0',    desc: 'Check if stack is empty' },
        { syn: 'LIFO',               desc: 'Last In, First Out ordering' },
        { syn: 'Call stack',         desc: 'Python uses a stack for function call frames' },
        { syn: 'DFS uses a stack',   desc: 'Depth-first traversal of graphs/trees' },
        { syn: 'queue.LifoQueue',    desc: 'Thread-safe stack from stdlib' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'You push A, B, C onto a stack, then pop twice. What remains?',
          opts: ['[B, C]', '[A]', '[C]', '[A, B]'],
          answer: 1,
          feedback: 'LIFO: push A (bottom), B, C (top). Pop returns C, then B. Only A remains.'
        },
        {
          type: 'fill',
          q: 'View the top element of a stack without removing it:',
          pre: 'top = stack[___]',
          answer: '-1',
          feedback: '<code>stack[-1]</code> accesses the last element (top of stack) without modifying the stack. This is the "peek" operation.'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>evaluate_rpn(tokens)</code> that evaluates a Reverse Polish Notation expression using a stack. Support +, -, *, / operators. Test with: <code>["3.14", "2.0", "*", "1.0", "+"]</code> (should give 7.28, representing a scaled molecular property).',
          hint: 'Push numbers onto the stack. When you encounter an operator, pop two operands, apply the operator, push the result.',
          answer: `def evaluate_rpn(tokens):
    stack = []
    for t in tokens:
        if t in "+-*/":
            b, a = stack.pop(), stack.pop()
            if t == "+": stack.append(a + b)
            elif t == "-": stack.append(a - b)
            elif t == "*": stack.append(a * b)
            elif t == "/": stack.append(a / b)
        else:
            stack.append(float(t))
    return stack[0]

print(evaluate_rpn(["3.14", "2.0", "*", "1.0", "+"]))  # 7.28`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python — Using Lists as Stacks', url: 'https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Stack', url: 'https://visualgo.net/en/list', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  QUEUES
    // ════════════════════════════════════════════════════════
    {
      id:   'queues',
      name: 'Queues',
      desc: 'FIFO structures for job scheduling and breadth-first search',

      explanation: `
        <p>A <strong>queue</strong> follows <strong>First In, First Out</strong>
        (FIFO): elements are added at the back and removed from the front — like
        a line of calculations waiting to run on a cluster. The core operations
        are <code>enqueue</code> (add to back) and <code>dequeue</code> (remove
        from front), both O(1) with the right implementation.</p>

        <p>Use <code>collections.deque</code> for queues in Python — it provides
        O(1) <code>append</code> and <code>popleft</code>. Never use a plain
        <code>list</code> with <code>pop(0)</code>, which is O(n). Queues power
        <strong>breadth-first search</strong> (BFS) of molecular graphs, job
        schedulers, and any workflow where tasks must be processed in arrival
        order.</p>

        <p>A <strong>priority queue</strong> dequeues the highest-priority item
        first, regardless of arrival order. Python's <code>heapq</code> module
        implements a min-heap for this. Priority queues are essential for
        algorithms like Dijkstra's shortest path and for scheduling calculations
        by estimated cost or importance.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">collections</span> <span class="kw">import</span> <span class="nm">deque</span>

<span class="cm"># FIFO queue: job scheduler for calculations</span>
<span class="nm">job_queue</span> = <span class="fn">deque</span>()
<span class="nm">job_queue</span>.<span class="fn">append</span>({<span class="st">"mol"</span>: <span class="st">"H2O"</span>,  <span class="st">"method"</span>: <span class="st">"B3LYP"</span>})
<span class="nm">job_queue</span>.<span class="fn">append</span>({<span class="st">"mol"</span>: <span class="st">"CH4"</span>,  <span class="st">"method"</span>: <span class="st">"CCSD(T)"</span>})
<span class="nm">job_queue</span>.<span class="fn">append</span>({<span class="st">"mol"</span>: <span class="st">"NH3"</span>,  <span class="st">"method"</span>: <span class="st">"B3LYP"</span>})

<span class="cm"># Dequeue: process in arrival order (FIFO)</span>
<span class="nm">next_job</span> = <span class="nm">job_queue</span>.<span class="fn">popleft</span>()  <span class="cm"># H2O goes first</span>

<span class="cm"># BFS: find shortest bond path between atoms</span>
<span class="kw">def</span> <span class="fn">bfs_shortest_path</span>(<span class="nm">adj</span>, <span class="nm">start</span>, <span class="nm">end</span>):
    <span class="st">"""BFS on adjacency list — returns distance in bonds."""</span>
    <span class="nm">visited</span> = {<span class="nm">start</span>}
    <span class="nm">queue</span> = <span class="fn">deque</span>([(<span class="nm">start</span>, <span class="num">0</span>)])
    <span class="kw">while</span> <span class="nm">queue</span>:
        <span class="nm">node</span>, <span class="nm">dist</span> = <span class="nm">queue</span>.<span class="fn">popleft</span>()
        <span class="kw">if</span> <span class="nm">node</span> <span class="op">==</span> <span class="nm">end</span>:
            <span class="kw">return</span> <span class="nm">dist</span>
        <span class="kw">for</span> <span class="nm">neighbor</span> <span class="kw">in</span> <span class="nm">adj</span>[<span class="nm">node</span>]:
            <span class="kw">if</span> <span class="nm">neighbor</span> <span class="kw">not</span> <span class="kw">in</span> <span class="nm">visited</span>:
                <span class="nm">visited</span>.<span class="fn">add</span>(<span class="nm">neighbor</span>)
                <span class="nm">queue</span>.<span class="fn">append</span>((<span class="nm">neighbor</span>, <span class="nm">dist</span> <span class="op">+</span> <span class="num">1</span>))
    <span class="kw">return</span> <span class="num">-1</span>

<span class="cm"># Ethanol bond graph: CH3-CH2-OH</span>
<span class="nm">adj</span> = {<span class="num">0</span>:[<span class="num">1</span>], <span class="num">1</span>:[<span class="num">0</span>,<span class="num">2</span>], <span class="num">2</span>:[<span class="num">1</span>,<span class="num">3</span>], <span class="num">3</span>:[<span class="num">2</span>]}  <span class="cm"># C-C-O-H</span>
<span class="fn">print</span>(<span class="fn">bfs_shortest_path</span>(<span class="nm">adj</span>, <span class="num">0</span>, <span class="num">3</span>))  <span class="cm"># 3 bonds apart</span>`,

      cheatsheet: [
        { syn: 'deque()',                 desc: 'Create an empty deque (double-ended queue)' },
        { syn: 'q.append(x)',            desc: 'Enqueue — add to back, O(1)' },
        { syn: 'q.popleft()',            desc: 'Dequeue — remove from front, O(1)' },
        { syn: 'q.appendleft(x)',        desc: 'Add to front — O(1)' },
        { syn: 'len(q)',                 desc: 'Number of elements in the queue' },
        { syn: 'FIFO',                   desc: 'First In, First Out ordering' },
        { syn: 'BFS uses a queue',       desc: 'Breadth-first search processes layer by layer' },
        { syn: 'queue.Queue()',          desc: 'Thread-safe FIFO queue from stdlib' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'You enqueue A, B, C into a FIFO queue, then dequeue once. What is returned?',
          opts: ['C', 'B', 'A', 'None'],
          answer: 2,
          feedback: 'FIFO: first in is first out. A was enqueued first, so A is dequeued first.'
        },
        {
          type: 'fill',
          q: 'Remove an element from the front of a deque in O(1):',
          pre: 'from collections import deque\nq = deque([1, 2, 3])\nfirst = q.___()',
          answer: 'popleft',
          feedback: '<code>deque.popleft()</code> removes from the front in O(1). Never use <code>list.pop(0)</code> which is O(n).'
        },
        {
          type: 'challenge',
          q: 'Implement a BFS function that finds all atoms within N bonds of a given atom in a molecular graph. The graph is represented as an adjacency list <code>adj = {0: [1,2], 1: [0,3], ...}</code>. Return a set of atom indices reachable within N hops.',
          hint: 'BFS with a distance counter. Stop expanding when distance exceeds N.',
          answer: `from collections import deque

def atoms_within_n_bonds(adj, start, n):
    visited = {start}
    queue = deque([(start, 0)])
    result = {start}
    while queue:
        node, dist = queue.popleft()
        if dist >= n:
            continue
        for neighbor in adj[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                result.add(neighbor)
                queue.append((neighbor, dist + 1))
    return result`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python collections.deque', url: 'https://docs.python.org/3/library/collections.html#collections.deque', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Queue', url: 'https://visualgo.net/en/list', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  HASH-TABLES
    // ════════════════════════════════════════════════════════
    {
      id:   'hash-tables',
      name: 'Hash Tables',
      desc: 'O(1) lookups for molecule registries, memoization, and deduplication',

      explanation: `
        <p>A <strong>hash table</strong> maps keys to values with average O(1)
        lookup, insert, and delete. Python's <code>dict</code> and <code>set</code>
        are both hash tables. In computational chemistry, dicts store molecule-to-energy
        mappings, element-to-mass lookups, and memoization caches for expensive
        computations.</p>

        <p>A <strong>hash function</strong> converts a key into an array index.
        <strong>Collisions</strong> — different keys mapping to the same index —
        are handled by chaining (linked lists at each slot) or open addressing
        (probing for the next empty slot). Python uses open addressing with
        perturbed probing.</p>

        <p>Sets are hash tables without values — they provide O(1)
        <code>in</code> checks, making them ideal for deduplication. Use
        <code>frozenset</code> when you need a hashable set (e.g., as a dict
        key). The main caveat: keys must be <strong>hashable</strong> — immutable
        types like strings, numbers, and tuples. Lists and dicts cannot be keys.</p>
      `,

      code: `<span class="cm"># Dict: molecule → energy lookup (O(1) access)</span>
<span class="nm">energy_db</span> = {
    <span class="st">"H2O"</span>:  <span class="num">-76.4026</span>,
    <span class="st">"CH4"</span>:  <span class="num">-40.5184</span>,
    <span class="st">"NH3"</span>:  <span class="num">-56.5548</span>,
    <span class="st">"C2H6"</span>: <span class="num">-79.7280</span>,
}
<span class="nm">e</span> = <span class="nm">energy_db</span>[<span class="st">"H2O"</span>]         <span class="cm"># O(1) lookup</span>
<span class="nm">energy_db</span>[<span class="st">"CO2"</span>] = <span class="num">-188.580</span>  <span class="cm"># O(1) insert</span>

<span class="cm"># Set: deduplicate elements in a system</span>
<span class="nm">atoms</span> = [<span class="st">"C"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>, <span class="st">"O"</span>, <span class="st">"H"</span>, <span class="st">"H"</span>]
<span class="nm">unique</span> = <span class="fn">set</span>(<span class="nm">atoms</span>)   <span class="cm"># {'C', 'H', 'O'}</span>
<span class="fn">print</span>(<span class="st">"O"</span> <span class="kw">in</span> <span class="nm">unique</span>)   <span class="cm"># True — O(1) membership test</span>

<span class="cm"># Memoization with dict: cache expensive lookups</span>
<span class="nm">cache</span> = {}
<span class="kw">def</span> <span class="fn">get_energy</span>(<span class="nm">formula</span>):
    <span class="kw">if</span> <span class="nm">formula</span> <span class="kw">not</span> <span class="kw">in</span> <span class="nm">cache</span>:
        <span class="nm">cache</span>[<span class="nm">formula</span>] = <span class="nm">energy_db</span>.<span class="fn">get</span>(<span class="nm">formula</span>, <span class="kw">None</span>)
    <span class="kw">return</span> <span class="nm">cache</span>[<span class="nm">formula</span>]

<span class="cm"># Count atom occurrences — equivalent to Counter</span>
<span class="nm">counts</span> = {}
<span class="kw">for</span> <span class="nm">atom</span> <span class="kw">in</span> <span class="nm">atoms</span>:
    <span class="nm">counts</span>[<span class="nm">atom</span>] = <span class="nm">counts</span>.<span class="fn">get</span>(<span class="nm">atom</span>, <span class="num">0</span>) <span class="op">+</span> <span class="num">1</span>
<span class="cm"># {'C': 1, 'H': 4, 'O': 1}</span>

<span class="cm"># defaultdict: auto-initialize missing keys</span>
<span class="kw">from</span> <span class="nm">collections</span> <span class="kw">import</span> <span class="nm">defaultdict</span>
<span class="nm">by_element</span> = <span class="fn">defaultdict</span>(<span class="bi">list</span>)
<span class="kw">for</span> <span class="nm">i</span>, <span class="nm">a</span> <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="nm">atoms</span>):
    <span class="nm">by_element</span>[<span class="nm">a</span>].<span class="fn">append</span>(<span class="nm">i</span>)  <span class="cm"># {'C': [0], 'H': [1,2,4,5], 'O': [3]}</span>`,

      cheatsheet: [
        { syn: 'd[key]',              desc: 'Lookup by key — O(1) average' },
        { syn: 'd[key] = val',        desc: 'Insert or update — O(1) average' },
        { syn: 'key in d',            desc: 'Membership test — O(1) average' },
        { syn: 'd.get(key, default)', desc: 'Lookup with fallback (no KeyError)' },
        { syn: 'set(iterable)',       desc: 'Create a set — deduplicates, O(1) lookup' },
        { syn: 'a & b, a | b, a - b', desc: 'Set intersection, union, difference' },
        { syn: 'defaultdict(list)',   desc: 'Dict that auto-creates empty list for missing keys' },
        { syn: 'frozenset()',         desc: 'Immutable set — can be used as a dict key' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the average time complexity of looking up a key in a Python dict?',
          opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
          answer: 2,
          feedback: 'Hash tables provide O(1) average-case lookup by computing a hash of the key and jumping directly to the correct slot.'
        },
        {
          type: 'fill',
          q: 'Look up a value with a default if the key is missing:',
          pre: 'energy = db.___(\"Unknown\", None)',
          answer: 'get',
          feedback: '<code>dict.get(key, default)</code> returns the value if the key exists, or the default value otherwise — no KeyError.'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>two_sum_energies(energies, target)</code> that given a list of energies and a target sum, returns the indices of the two energies that add up to the target. Use a hash map for O(n) time instead of O(n²) brute force.',
          hint: 'Store {value: index} as you iterate. For each energy, check if (target - energy) is already in the map.',
          answer: `def two_sum_energies(energies, target):
    seen = {}
    for i, e in enumerate(energies):
        complement = target - e
        if complement in seen:
            return (seen[complement], i)
        seen[e] = i
    return None

print(two_sum_energies([-76.4, -40.5, -56.5, -152.9], -116.9))
# (0, 2) because -76.4 + (-40.5) = -116.9`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — dict', url: 'https://docs.python.org/3/library/stdtypes.html#dict', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Python Docs — set', url: 'https://docs.python.org/3/library/stdtypes.html#set', tag: 'docs', tagColor: 'blue' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  TREES
    // ════════════════════════════════════════════════════════
    {
      id:   'trees',
      name: 'Trees',
      desc: 'Hierarchical structures for molecular fragmentation and decision trees',

      explanation: `
        <p>A <strong>tree</strong> is a hierarchical data structure with a root
        node and child nodes. Each node has zero or more children but exactly one
        parent (except the root). A <strong>binary tree</strong> has at most two
        children per node. Trees model hierarchies: molecular fragmentation trees
        (parent molecule → fragments), file system directories, and decision
        trees for property prediction.</p>

        <p><strong>Binary Search Trees</strong> (BSTs) maintain a sorted invariant:
        left child < parent < right child, giving O(log n) search, insert, and
        delete on balanced trees. <strong>Traversal orders</strong> are crucial:
        in-order gives sorted output, pre-order copies the tree structure, and
        level-order (BFS) processes nodes by depth.</p>

        <p>In chemistry, the <strong>Morgan algorithm</strong> for canonical SMILES
        uses a tree-like expansion from each atom. Hierarchical clustering of
        molecular conformers produces dendrograms (trees). Decision trees in ML
        split molecular descriptors to predict properties like solubility or
        toxicity.</p>
      `,

      code: `<span class="cm"># Binary tree node for molecular fragmentation</span>
<span class="kw">class</span> <span class="fn">FragNode</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">formula</span>, <span class="nm">mass</span>, <span class="nm">left</span>=<span class="kw">None</span>, <span class="nm">right</span>=<span class="kw">None</span>):
        <span class="nm">self</span>.<span class="nm">formula</span> = <span class="nm">formula</span>
        <span class="nm">self</span>.<span class="nm">mass</span> = <span class="nm">mass</span>
        <span class="nm">self</span>.<span class="nm">left</span> = <span class="nm">left</span>
        <span class="nm">self</span>.<span class="nm">right</span> = <span class="nm">right</span>

<span class="cm"># Fragmentation tree: ethanol → fragments</span>
<span class="nm">tree</span> = <span class="fn">FragNode</span>(<span class="st">"C2H6O"</span>, <span class="num">46.07</span>,
    <span class="fn">FragNode</span>(<span class="st">"CH3"</span>, <span class="num">15.03</span>),
    <span class="fn">FragNode</span>(<span class="st">"CH2OH"</span>, <span class="num">31.03</span>,
        <span class="fn">FragNode</span>(<span class="st">"CH2"</span>, <span class="num">14.03</span>),
        <span class="fn">FragNode</span>(<span class="st">"OH"</span>, <span class="num">17.01</span>)))

<span class="cm"># In-order traversal: visits nodes in sorted order (BST)</span>
<span class="kw">def</span> <span class="fn">inorder</span>(<span class="nm">node</span>):
    <span class="kw">if</span> <span class="nm">node</span> <span class="kw">is</span> <span class="kw">None</span>:
        <span class="kw">return</span> []
    <span class="kw">return</span> <span class="fn">inorder</span>(<span class="nm">node</span>.<span class="nm">left</span>) <span class="op">+</span> [<span class="nm">node</span>.<span class="nm">formula</span>] <span class="op">+</span> <span class="fn">inorder</span>(<span class="nm">node</span>.<span class="nm">right</span>)

<span class="cm"># Max depth: how many fragmentation levels?</span>
<span class="kw">def</span> <span class="fn">max_depth</span>(<span class="nm">node</span>):
    <span class="kw">if</span> <span class="nm">node</span> <span class="kw">is</span> <span class="kw">None</span>:
        <span class="kw">return</span> <span class="num">0</span>
    <span class="kw">return</span> <span class="num">1</span> <span class="op">+</span> <span class="fn">max</span>(<span class="fn">max_depth</span>(<span class="nm">node</span>.<span class="nm">left</span>), <span class="fn">max_depth</span>(<span class="nm">node</span>.<span class="nm">right</span>))

<span class="fn">print</span>(<span class="fn">inorder</span>(<span class="nm">tree</span>))      <span class="cm"># ['CH3', 'C2H6O', 'CH2', 'CH2OH', 'OH']</span>
<span class="fn">print</span>(<span class="fn">max_depth</span>(<span class="nm">tree</span>))    <span class="cm"># 3</span>`,

      cheatsheet: [
        { syn: 'node.left / node.right',     desc: 'Access child nodes of a binary tree' },
        { syn: 'In-order: L → N → R',        desc: 'Sorted traversal of a BST' },
        { syn: 'Pre-order: N → L → R',       desc: 'Copy tree structure / serialize' },
        { syn: 'Post-order: L → R → N',      desc: 'Delete tree / evaluate expressions' },
        { syn: 'Level-order (BFS)',           desc: 'Process nodes by depth using a queue' },
        { syn: 'BST: left < node < right',   desc: 'Binary search tree invariant' },
        { syn: 'Balanced BST: O(log n)',      desc: 'Search, insert, delete on balanced tree' },
        { syn: 'Leaf node: no children',      desc: 'Terminal node in the tree' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Which traversal order visits binary tree nodes in sorted order?',
          opts: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
          answer: 1,
          feedback: 'In-order traversal (left → node → right) visits BST nodes in ascending sorted order.'
        },
        {
          type: 'fill',
          q: 'Complete the base case for a recursive tree function:',
          pre: 'def tree_size(node):\n    if node is ___:\n        return 0\n    return 1 + tree_size(node.left) + tree_size(node.right)',
          answer: 'None',
          feedback: 'The base case checks if the node is <code>None</code> (empty subtree) and returns 0. This stops the recursion at leaf boundaries.'
        },
        {
          type: 'challenge',
          q: 'Build a binary search tree that stores molecules sorted by molecular weight. Implement <code>insert(root, formula, mass)</code> and <code>find_lightest(root)</code> (returns the molecule with smallest mass). Test with: H2O (18.015), CH4 (16.04), NH3 (17.03), C2H6 (30.07).',
          hint: 'Insert: compare mass to current node, go left if smaller, right if larger. Lightest: follow left children to the leftmost node.',
          answer: `class MolNode:
    def __init__(self, formula, mass):
        self.formula = formula
        self.mass = mass
        self.left = self.right = None

def insert(root, formula, mass):
    if root is None:
        return MolNode(formula, mass)
    if mass < root.mass:
        root.left = insert(root.left, formula, mass)
    else:
        root.right = insert(root.right, formula, mass)
    return root

def find_lightest(root):
    while root.left:
        root = root.left
    return root.formula, root.mass

root = None
for f, m in [("H2O", 18.015), ("CH4", 16.04), ("NH3", 17.03), ("C2H6", 30.07)]:
    root = insert(root, f, m)
print(find_lightest(root))  # ('CH4', 16.04)`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python — Binary Trees', url: 'https://docs.python.org/3/library/heapq.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Binary Search Tree', url: 'https://visualgo.net/en/bst', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  GRAPHS
    // ════════════════════════════════════════════════════════
    {
      id:   'graphs',
      name: 'Graphs',
      desc: 'Modeling molecular structures, reaction networks, and crystal lattices',

      explanation: `
        <p>A <strong>graph</strong> is a set of <strong>nodes</strong> (vertices)
        connected by <strong>edges</strong>. Molecules are graphs: atoms are nodes,
        bonds are edges. Crystal structures, reaction networks, and protein
        interaction maps are all naturally represented as graphs.</p>

        <p>Two main representations: an <strong>adjacency list</strong>
        (<code>dict[node, list[neighbor]]</code>) is space-efficient for sparse
        graphs (most molecules), while an <strong>adjacency matrix</strong>
        (2D array where <code>M[i][j] = 1</code> if edge exists) enables fast
        edge queries and matrix operations (useful for spectral graph theory).</p>

        <p>Graph algorithms are central to computational chemistry:
        <strong>BFS</strong> finds shortest bond paths, <strong>DFS</strong>
        detects rings and connected components, <strong>topological sort</strong>
        orders reaction dependencies, and <strong>cycle detection</strong>
        identifies ring systems in molecules. NetworkX is the standard Python
        library for graph analysis.</p>
      `,

      code: `<span class="cm"># Adjacency list: molecular graph of ethanol (C2H5OH)</span>
<span class="nm">mol_graph</span> = {
    <span class="st">"C0"</span>: [<span class="st">"C1"</span>, <span class="st">"H0"</span>, <span class="st">"H1"</span>, <span class="st">"H2"</span>],
    <span class="st">"C1"</span>: [<span class="st">"C0"</span>, <span class="st">"H3"</span>, <span class="st">"H4"</span>, <span class="st">"O0"</span>],
    <span class="st">"O0"</span>: [<span class="st">"C1"</span>, <span class="st">"H5"</span>],
    <span class="st">"H0"</span>: [<span class="st">"C0"</span>], <span class="st">"H1"</span>: [<span class="st">"C0"</span>], <span class="st">"H2"</span>: [<span class="st">"C0"</span>],  <span class="cm"># H atoms</span>
    <span class="st">"H3"</span>: [<span class="st">"C1"</span>], <span class="st">"H4"</span>: [<span class="st">"C1"</span>], <span class="st">"H5"</span>: [<span class="st">"O0"</span>]}

<span class="cm"># DFS: find all atoms connected to a starting atom</span>
<span class="kw">def</span> <span class="fn">dfs_component</span>(<span class="nm">graph</span>, <span class="nm">start</span>):
    <span class="nm">visited</span> = <span class="fn">set</span>()
    <span class="nm">stack</span> = [<span class="nm">start</span>]
    <span class="kw">while</span> <span class="nm">stack</span>:
        <span class="nm">node</span> = <span class="nm">stack</span>.<span class="fn">pop</span>()
        <span class="kw">if</span> <span class="nm">node</span> <span class="kw">not</span> <span class="kw">in</span> <span class="nm">visited</span>:
            <span class="nm">visited</span>.<span class="fn">add</span>(<span class="nm">node</span>)
            <span class="nm">stack</span>.<span class="fn">extend</span>(<span class="nm">graph</span>[<span class="nm">node</span>])
    <span class="kw">return</span> <span class="nm">visited</span>

<span class="cm"># Degree = number of bonds per atom</span>
<span class="nm">degrees</span> = {<span class="nm">a</span>: <span class="fn">len</span>(<span class="nm">nb</span>) <span class="kw">for</span> <span class="nm">a</span>, <span class="nm">nb</span> <span class="kw">in</span> <span class="nm">mol_graph</span>.<span class="fn">items</span>()}

<span class="cm"># Detect if molecular graph has a cycle (ring)</span>
<span class="kw">def</span> <span class="fn">has_ring</span>(<span class="nm">graph</span>):
    <span class="nm">visited</span> = <span class="fn">set</span>()
    <span class="kw">for</span> <span class="nm">start</span> <span class="kw">in</span> <span class="nm">graph</span>:
        <span class="kw">if</span> <span class="nm">start</span> <span class="kw">in</span> <span class="nm">visited</span>: <span class="kw">continue</span>
        <span class="nm">stack</span> = [(<span class="nm">start</span>, <span class="kw">None</span>)]
        <span class="kw">while</span> <span class="nm">stack</span>:
            <span class="nm">node</span>, <span class="nm">parent</span> = <span class="nm">stack</span>.<span class="fn">pop</span>()
            <span class="kw">if</span> <span class="nm">node</span> <span class="kw">in</span> <span class="nm">visited</span>: <span class="kw">return</span> <span class="kw">True</span>
            <span class="nm">visited</span>.<span class="fn">add</span>(<span class="nm">node</span>)
            <span class="kw">for</span> <span class="nm">nb</span> <span class="kw">in</span> <span class="nm">graph</span>[<span class="nm">node</span>]:
                <span class="kw">if</span> <span class="nm">nb</span> <span class="op">!=</span> <span class="nm">parent</span>: <span class="nm">stack</span>.<span class="fn">append</span>((<span class="nm">nb</span>, <span class="nm">node</span>))
    <span class="kw">return</span> <span class="kw">False</span>`,

      cheatsheet: [
        { syn: 'adj = {node: [neighbors]}',    desc: 'Adjacency list — space O(V+E)' },
        { syn: 'matrix[i][j] = 1',            desc: 'Adjacency matrix — O(V²) space, O(1) edge check' },
        { syn: 'DFS: stack or recursion',      desc: 'Explore deep first — finds components, cycles' },
        { syn: 'BFS: queue',                   desc: 'Explore level by level — shortest paths' },
        { syn: 'degree(v) = len(adj[v])',      desc: 'Number of edges at a vertex' },
        { syn: 'Connected component',          desc: 'Maximal set of reachable nodes' },
        { syn: 'Cycle = ring in chemistry',    desc: 'Path that returns to start node' },
        { syn: 'import networkx as nx',        desc: 'Full-featured graph library for Python' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'For a sparse molecular graph with V atoms and E bonds, which representation is more memory-efficient?',
          opts: [
            'Adjacency matrix — always O(V²)',
            'Adjacency list — O(V + E), better when E << V²',
            'They use the same amount of memory',
            'A simple Python list'
          ],
          answer: 1,
          feedback: 'Most molecules are sparse (each atom bonds to 1-4 neighbors). An adjacency list stores only existing edges, using O(V+E) vs O(V²) for a matrix.'
        },
        {
          type: 'fill',
          q: 'Get the number of bonds (degree) of atom C1 in the graph:',
          pre: 'degree = ___(mol_graph["C1"])',
          answer: 'len',
          feedback: 'The degree of a node in an adjacency list is the length of its neighbor list: <code>len(adj[node])</code>.'
        },
        {
          type: 'challenge',
          q: 'Write a function <code>count_rings(mol_graph)</code> that counts the number of independent rings in a molecular graph using Euler\'s formula: rings = E - V + C, where E is edges, V is vertices, and C is the number of connected components. Test on benzene (C6H6: 6 C in a ring + 6 H) which has 1 ring.',
          hint: 'Count edges as sum of degrees / 2. Count components with DFS. Apply: rings = E - V + components.',
          answer: `def count_rings(graph):
    V = len(graph)
    E = sum(len(nb) for nb in graph.values()) // 2
    # Count connected components via DFS
    visited = set()
    C = 0
    for node in graph:
        if node not in visited:
            C += 1
            stack = [node]
            while stack:
                n = stack.pop()
                if n not in visited:
                    visited.add(n)
                    stack.extend(graph[n])
    return E - V + C

# Benzene: C6H6 ring
benzene = {f"C{i}": [f"C{(i-1)%6}", f"C{(i+1)%6}", f"H{i}"] for i in range(6)}
benzene.update({f"H{i}": [f"C{i}"] for i in range(6)})
print(count_rings(benzene))  # 1`
        }
      ],

      resources: [
        { icon: '📘', title: 'NetworkX Documentation', url: 'https://networkx.org/documentation/stable/', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Graph Traversal', url: 'https://visualgo.net/en/dfsbfs', tag: 'interactive', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  HEAPS
    // ════════════════════════════════════════════════════════
    {
      id:   'heaps',
      name: 'Heaps & Priority Queues',
      desc: 'Efficient min/max extraction for energy ranking and scheduling',

      explanation: `
        <p>A <strong>heap</strong> is a complete binary tree where each parent is
        smaller (min-heap) or larger (max-heap) than its children. The minimum
        element is always at the root, giving O(1) access to the smallest item.
        Insertion and extraction are both O(log n). Python's <code>heapq</code>
        module implements a min-heap on top of a list.</p>

        <p>Heaps implement <strong>priority queues</strong>: instead of FIFO order,
        the highest-priority item is dequeued first. In computational chemistry,
        use a priority queue to always process the lowest-energy conformer first,
        schedule the most important calculations, or implement Dijkstra's algorithm
        for shortest paths in reaction networks.</p>

        <p><code>heapq.nsmallest(k, iterable)</code> efficiently finds the k
        smallest elements — perfect for extracting the top-k lowest-energy
        structures from a screening run. For a max-heap, negate the values
        before insertion (Python only provides min-heap).</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">heapq</span>

<span class="cm"># Min-heap: always get the lowest-energy structure</span>
<span class="nm">energies</span> = []
<span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">energies</span>, (<span class="num">-76.4026</span>, <span class="st">"H2O"</span>))
<span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">energies</span>, (<span class="num">-40.5184</span>, <span class="st">"CH4"</span>))
<span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">energies</span>, (<span class="num">-152.983</span>, <span class="st">"ethane_dimer"</span>))
<span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">energies</span>, (<span class="num">-56.5548</span>, <span class="st">"NH3"</span>))

<span class="cm"># Pop minimum energy — O(log n)</span>
<span class="nm">lowest</span> = <span class="nm">heapq</span>.<span class="fn">heappop</span>(<span class="nm">energies</span>)
<span class="fn">print</span>(<span class="nm">lowest</span>)  <span class="cm"># (-152.983, 'ethane_dimer')</span>

<span class="cm"># Top-3 lowest energies from a large screening</span>
<span class="nm">all_results</span> = [<span class="num">-76.40</span>, <span class="num">-40.52</span>, <span class="num">-152.98</span>, <span class="num">-56.55</span>, <span class="num">-79.73</span>]
<span class="nm">top3</span> = <span class="nm">heapq</span>.<span class="fn">nsmallest</span>(<span class="num">3</span>, <span class="nm">all_results</span>)
<span class="fn">print</span>(<span class="nm">top3</span>)  <span class="cm"># [-152.98, -79.73, -76.40]</span>

<span class="cm"># Heapify an existing list in-place — O(n)</span>
<span class="nm">data</span> = [<span class="num">-40.5</span>, <span class="num">-76.4</span>, <span class="num">-152.9</span>, <span class="num">-56.5</span>]
<span class="nm">heapq</span>.<span class="fn">heapify</span>(<span class="nm">data</span>)
<span class="fn">print</span>(<span class="nm">data</span>[<span class="num">0</span>])  <span class="cm"># -152.9 (min is at index 0)</span>

<span class="cm"># Priority queue for job scheduling</span>
<span class="nm">jobs</span> = []
<span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">jobs</span>, (<span class="num">3</span>, <span class="st">"low_priority_opt"</span>))
<span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">jobs</span>, (<span class="num">1</span>, <span class="st">"urgent_ts_search"</span>))
<span class="nm">heapq</span>.<span class="fn">heappush</span>(<span class="nm">jobs</span>, (<span class="num">2</span>, <span class="st">"medium_freq_calc"</span>))
<span class="nm">next_job</span> = <span class="nm">heapq</span>.<span class="fn">heappop</span>(<span class="nm">jobs</span>)  <span class="cm"># (1, 'urgent_ts_search')</span>`,

      cheatsheet: [
        { syn: 'heapq.heappush(h, x)',       desc: 'Insert element — O(log n)' },
        { syn: 'heapq.heappop(h)',           desc: 'Remove and return smallest — O(log n)' },
        { syn: 'h[0]',                       desc: 'Peek at minimum without removing — O(1)' },
        { syn: 'heapq.heapify(lst)',         desc: 'Convert list to heap in-place — O(n)' },
        { syn: 'heapq.nsmallest(k, lst)',    desc: 'Return k smallest elements efficiently' },
        { syn: 'heapq.nlargest(k, lst)',     desc: 'Return k largest elements' },
        { syn: 'heappush(h, (-val, item))',  desc: 'Max-heap trick: negate values' },
        { syn: 'heapq.merge(*iters)',        desc: 'Merge sorted iterables — lazy, O(1) memory per step' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What is the time complexity of extracting the minimum from a min-heap of n elements?',
          opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          answer: 1,
          feedback: 'Extracting the min (heappop) removes the root and re-heapifies, which requires O(log n) comparisons to maintain the heap property.'
        },
        {
          type: 'fill',
          q: 'Get the 5 lowest energies from a large list efficiently:',
          pre: 'top5 = heapq.___(5, all_energies)',
          answer: 'nsmallest',
          feedback: '<code>heapq.nsmallest(k, iterable)</code> efficiently returns the k smallest elements. For large lists with small k, this is faster than sorting.'
        },
        {
          type: 'challenge',
          q: 'Implement a function <code>merge_sorted_results(*sorted_lists)</code> that takes multiple sorted lists of energies (e.g., from different calculation batches) and merges them into a single sorted list. Use <code>heapq.merge</code> for an efficient O(n log k) solution where k is the number of lists.',
          hint: 'heapq.merge returns a lazy iterator over sorted inputs. Wrap in list() to materialize.',
          answer: `import heapq

def merge_sorted_results(*sorted_lists):
    return list(heapq.merge(*sorted_lists))

batch1 = [-152.98, -79.73, -40.52]  # sorted
batch2 = [-130.45, -76.40, -56.55]  # sorted
batch3 = [-188.58, -100.22]         # sorted

merged = merge_sorted_results(batch1, batch2, batch3)
print(merged)  # all values in sorted order`
        }
      ],

      resources: [
        { icon: '📘', title: 'Python Docs — heapq', url: 'https://docs.python.org/3/library/heapq.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Visualgo — Heap', url: 'https://visualgo.net/en/heap', tag: 'interactive', tagColor: 'green' },
      ]
    },

  ],
};
