/**
 * data/ml/04-deep-learning.js
 * Stage 04: Deep Learning
 * Topics: nn-basics,pytorch-tensors,nn-module,training-loop,cnns
 *
 * All examples use compchem/materials context.
 * Code line limits: ML 1-4 = 20–50 lines per topic.
 */

window.ML_S4 = {
  id: 'ml-s4', num: '04', title: 'Deep Learning',
  color: 'purple', meta: '~3 weeks', track: 'ml',
  topics: [

    // ════════════════════════════════════════════════════════
    //  NN-BASICS
    // ════════════════════════════════════════════════════════
    {
      id:   'nn-basics',
      name: 'Neural Network Basics',
      desc: 'Perceptrons, activation functions, and forward passes for predicting molecular properties',

      explanation: `
        <p>A <strong>neural network</strong> is a stack of linear transformations
        followed by non-linear <strong>activation functions</strong>. A single
        neuron computes <code>z = w·x + b</code>, then applies an activation
        like ReLU: <code>a = max(0, z)</code>. Stacking neurons into layers lets
        the network learn complex mappings — e.g., from molecular descriptors
        to ΔG‡ values that no linear model can capture.</p>

        <p>Common activations: <strong>ReLU</strong> (fast, default for hidden
        layers), <strong>sigmoid</strong> (output layer for binary classification),
        <strong>tanh</strong> (centred around zero), and <strong>softmax</strong>
        (output layer for multi-class probabilities). The choice of output
        activation depends on your task: no activation for regression (predict
        energy in kcal/mol), sigmoid for binary (converged vs. not), softmax for
        multi-class (solvent category).</p>

        <p>The <strong>universal approximation theorem</strong> guarantees that
        a sufficiently wide single-hidden-layer network can approximate any
        continuous function — but in practice, <strong>deeper networks</strong>
        with fewer neurons per layer learn more efficiently. For molecular
        property prediction, 2–4 hidden layers with 64–256 neurons each is a
        common starting architecture.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">torch.nn.functional</span> <span class="kw">as</span> <span class="nm">F</span>

<span class="cm"># A single neuron: linear transform + activation</span>
<span class="nm">x</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([<span class="num">0.45</span>, <span class="num">-3.2</span>, <span class="num">298.0</span>])  <span class="cm"># logP, HOMO(eV), T(K)</span>
<span class="nm">w</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">3</span>)
<span class="nm">b</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>(<span class="num">0.1</span>)
<span class="nm">z</span> = <span class="nm">torch</span>.<span class="fn">dot</span>(<span class="nm">w</span>, <span class="nm">x</span>) + <span class="nm">b</span>           <span class="cm"># linear combination</span>
<span class="nm">a</span> = <span class="nm">F</span>.<span class="fn">relu</span>(<span class="nm">z</span>)                       <span class="cm"># ReLU activation</span>
<span class="fn">print</span>(<span class="st">f"z=</span>{<span class="nm">z</span>.<span class="fn">item</span>()<span class="st">:.4f}, a=</span>{<span class="nm">a</span>.<span class="fn">item</span>()<span class="st">:.4f}"</span>)

<span class="cm"># Forward pass through a 2-layer network (manual)</span>
<span class="nm">n_features</span> = <span class="num">3</span>   <span class="cm"># molecular descriptors</span>
<span class="nm">n_hidden</span> = <span class="num">64</span>
<span class="nm">n_out</span> = <span class="num">1</span>        <span class="cm"># predict ΔG‡</span>

<span class="nm">W1</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="nm">n_features</span>, <span class="nm">n_hidden</span>)
<span class="nm">b1</span> = <span class="nm">torch</span>.<span class="fn">zeros</span>(<span class="nm">n_hidden</span>)
<span class="nm">W2</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="nm">n_hidden</span>, <span class="nm">n_out</span>)
<span class="nm">b2</span> = <span class="nm">torch</span>.<span class="fn">zeros</span>(<span class="nm">n_out</span>)

<span class="cm"># Batch of 5 molecules</span>
<span class="nm">X</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">5</span>, <span class="nm">n_features</span>)
<span class="nm">h</span> = <span class="nm">F</span>.<span class="fn">relu</span>(<span class="nm">X</span> @ <span class="nm">W1</span> + <span class="nm">b1</span>)            <span class="cm"># hidden layer</span>
<span class="nm">y_pred</span> = <span class="nm">h</span> @ <span class="nm">W2</span> + <span class="nm">b2</span>               <span class="cm"># output: no activation for regression</span>
<span class="fn">print</span>(<span class="st">f"Predicted ΔG‡ (kcal/mol): </span>{<span class="nm">y_pred</span>.<span class="fn">squeeze</span>().<span class="fn">tolist</span>()}<span class="st">"</span>)

<span class="cm"># Common activations compared</span>
<span class="nm">z_demo</span> = <span class="nm">torch</span>.<span class="fn">linspace</span>(-<span class="num">3</span>, <span class="num">3</span>, <span class="num">7</span>)
<span class="fn">print</span>(<span class="st">f"ReLU:    </span>{<span class="nm">F</span>.<span class="fn">relu</span>(<span class="nm">z_demo</span>).<span class="fn">tolist</span>()}<span class="st">"</span>)
<span class="fn">print</span>(<span class="st">f"Sigmoid: </span>{<span class="nm">torch</span>.<span class="fn">sigmoid</span>(<span class="nm">z_demo</span>).<span class="fn">tolist</span>()}<span class="st">"</span>)
<span class="fn">print</span>(<span class="st">f"Tanh:    </span>{<span class="nm">torch</span>.<span class="fn">tanh</span>(<span class="nm">z_demo</span>).<span class="fn">tolist</span>()}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'F.relu(x)', desc: 'ReLU activation: max(0, x) — default for hidden layers' },
        { syn: 'torch.sigmoid(x)', desc: 'Sigmoid: 1/(1+e^-x) — squashes to [0,1] for binary output' },
        { syn: 'torch.tanh(x)', desc: 'Tanh: squashes to [-1,1] — centered alternative to sigmoid' },
        { syn: 'F.softmax(x, dim=-1)', desc: 'Softmax: probabilities summing to 1 for multi-class' },
        { syn: 'x @ W + b', desc: 'Linear transformation — matrix multiply + bias' },
        { syn: 'F.leaky_relu(x, 0.01)', desc: 'Leaky ReLU: small negative slope prevents dead neurons' },
        { syn: 'F.gelu(x)', desc: 'GELU: smooth approximation of ReLU, popular in transformers' },
        { syn: 'torch.randn(in, out)', desc: 'Random normal weights for initialising a layer' },
        { syn: 'z.item()', desc: 'Extract Python scalar from a 0-d tensor' },
        { syn: 'y.squeeze()', desc: 'Remove dimensions of size 1 — e.g., (5,1)→(5,)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'You are building a neural network to predict ΔG‡ (a continuous value in kcal/mol). What activation should the output layer use?',
          opts: [
            'ReLU — to ensure non-negative predictions',
            'Sigmoid — to constrain output between 0 and 1',
            'No activation — regression targets are unbounded',
            'Softmax — to normalise the output'
          ],
          answer: 2,
          feedback: 'For regression, the output layer should have no activation function. ΔG‡ values can be any real number, so constraining the output would limit the model.'
        },
        {
          type: 'fill',
          q: 'Complete the forward pass to apply ReLU activation after the linear transformation:',
          pre: 'h = F._____(X @ W1 + b1)',
          answer: 'relu',
          feedback: 'F.relu() applies the ReLU activation element-wise: max(0, z) for each value in the tensor.'
        },
        {
          type: 'challenge',
          q: 'Build a manual 3-layer forward pass: input (4 features) → hidden1 (32 neurons, ReLU) → hidden2 (16 neurons, ReLU) → output (1, no activation). Create random weights, pass a batch of 10 molecules through, and print the output shape.',
          hint: 'Create W1(4,32), b1(32), W2(32,16), b2(16), W3(16,1), b3(1). Apply ReLU after each hidden layer.',
          answer: `import torch
import torch.nn.functional as F

W1, b1 = torch.randn(4, 32), torch.zeros(32)
W2, b2 = torch.randn(32, 16), torch.zeros(16)
W3, b3 = torch.randn(16, 1), torch.zeros(1)

X = torch.randn(10, 4)  # 10 molecules, 4 descriptors
h1 = F.relu(X @ W1 + b1)
h2 = F.relu(h1 @ W2 + b2)
out = h2 @ W3 + b3
print(f"Output shape: {out.shape}")  # torch.Size([10, 1])`
        }
      ],

      resources: [
        { icon: '📘', title: 'PyTorch Neural Network Tutorial', url: 'https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: '3Blue1Brown: Neural Networks', url: 'https://www.youtube.com/watch?v=aircAruvnKk', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'Activation Functions Compared', url: 'https://pytorch.org/docs/stable/nn.functional.html#non-linear-activation-functions', tag: 'reference', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  PYTORCH-TENSORS
    // ════════════════════════════════════════════════════════
    {
      id:   'pytorch-tensors',
      name: 'PyTorch Tensors',
      desc: 'GPU-accelerated tensors with autograd for molecular descriptor arrays and gradient computation',

      explanation: `
        <p><strong>PyTorch tensors</strong> are the GPU-accelerated equivalent of
        NumPy arrays. They store molecular feature matrices, model parameters, and
        intermediate computations. Key difference from NumPy: tensors track
        <strong>computation graphs</strong> for automatic differentiation. Set
        <code>requires_grad=True</code> and PyTorch records every operation, so
        calling <code>.backward()</code> computes gradients automatically.</p>

        <p>Tensors live on a <strong>device</strong>: CPU (default) or GPU
        (<code>torch.device('cuda')</code>). For molecular property prediction
        with thousands of descriptors, GPU acceleration provides 10–100× speedup.
        Use <code>.to(device)</code> to move tensors between devices. All tensors
        in a computation must be on the same device.</p>

        <p><strong>Autograd</strong> is PyTorch's automatic differentiation engine.
        When you compute a loss (e.g., MSE between predicted and DFT energies)
        and call <code>loss.backward()</code>, gradients flow back through the
        entire network. These gradients are stored in <code>param.grad</code>
        and used by optimisers to update weights. This is the engine behind
        all neural network training.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>

<span class="cm"># Create tensors from molecular data</span>
<span class="nm">energies</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([<span class="num">-76.026</span>, <span class="num">-40.518</span>, <span class="num">-115.035</span>])  <span class="cm"># Ha</span>
<span class="nm">coords</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([[<span class="num">0.0</span>, <span class="num">0.0</span>, <span class="num">0.0</span>],
                       [<span class="num">0.96</span>, <span class="num">0.0</span>, <span class="num">0.0</span>],
                       [<span class="num">-0.24</span>, <span class="num">0.93</span>, <span class="num">0.0</span>]])  <span class="cm"># H2O in Å</span>
<span class="fn">print</span>(<span class="st">f"Shape: </span>{<span class="nm">coords</span>.<span class="nm">shape</span>}<span class="st">, dtype: </span>{<span class="nm">coords</span>.<span class="nm">dtype</span>}<span class="st">"</span>)

<span class="cm"># Unit conversion: vectorised like NumPy</span>
<span class="nm">energies_kcal</span> = <span class="nm">energies</span> * <span class="num">627.509</span>
<span class="fn">print</span>(<span class="st">f"Energies (kcal/mol): </span>{<span class="nm">energies_kcal</span>}<span class="st">"</span>)

<span class="cm"># Autograd: compute gradient of energy w.r.t. coordinates</span>
<span class="nm">r</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([<span class="num">0.96</span>], <span class="nm">requires_grad</span>=<span class="kw">True</span>)  <span class="cm"># O-H distance (Å)</span>
<span class="nm">D_e</span>, <span class="nm">alpha</span>, <span class="nm">r_eq</span> = <span class="num">0.1747</span>, <span class="num">2.297</span>, <span class="num">0.9572</span>  <span class="cm"># Morse params</span>
<span class="nm">V</span> = <span class="nm">D_e</span> * (<span class="num">1</span> - <span class="nm">torch</span>.<span class="fn">exp</span>(-<span class="nm">alpha</span> * (<span class="nm">r</span> - <span class="nm">r_eq</span>)))**<span class="num">2</span>  <span class="cm"># Morse potential</span>
<span class="nm">V</span>.<span class="fn">backward</span>()
<span class="fn">print</span>(<span class="st">f"Force (dV/dr): </span>{<span class="nm">r</span>.<span class="nm">grad</span>.<span class="fn">item</span>()<span class="st">:.6f} Ha/Å"</span>)

<span class="cm"># Device management for GPU acceleration</span>
<span class="nm">device</span> = <span class="nm">torch</span>.<span class="fn">device</span>(<span class="st">'cuda'</span> <span class="kw">if</span> <span class="nm">torch</span>.<span class="nm">cuda</span>.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="st">'cpu'</span>)
<span class="nm">X</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">10</span>, <span class="nm">device</span>=<span class="nm">device</span>)  <span class="cm"># 100 mols × 10 features</span>
<span class="fn">print</span>(<span class="st">f"Tensor on: </span>{<span class="nm">X</span>.<span class="nm">device</span>}<span class="st">"</span>)

<span class="cm"># NumPy ↔ Tensor conversion</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="nm">arr</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">1.5</span>, <span class="num">2.3</span>, <span class="num">-0.8</span>])
<span class="nm">t</span> = <span class="nm">torch</span>.<span class="fn">from_numpy</span>(<span class="nm">arr</span>)              <span class="cm"># shares memory</span>
<span class="nm">back</span> = <span class="nm">t</span>.<span class="fn">numpy</span>()                       <span class="cm"># back to numpy</span>`,

      cheatsheet: [
        { syn: 'torch.tensor([1.0, 2.0])', desc: 'Create tensor from Python list — copies data' },
        { syn: 'torch.zeros(3, 4)', desc: 'Zero-filled tensor of shape (3, 4)' },
        { syn: 'torch.randn(n, m)', desc: 'Random normal tensor — used for weight initialisation' },
        { syn: 'x.requires_grad_(True)', desc: 'Enable gradient tracking in-place for autograd' },
        { syn: 'loss.backward()', desc: 'Compute gradients via backpropagation' },
        { syn: 'x.grad', desc: 'Accumulated gradient tensor after .backward()' },
        { syn: 'x.to(device)', desc: 'Move tensor to CPU or GPU' },
        { syn: 'torch.from_numpy(arr)', desc: 'Create tensor from NumPy array — shares memory' },
        { syn: 't.numpy()', desc: 'Convert tensor to NumPy (must be on CPU, no grad)' },
        { syn: 'x.shape / x.dtype', desc: 'Inspect tensor dimensions and data type' },
        { syn: 'torch.no_grad()', desc: 'Context manager to disable gradient tracking (inference)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why must you call loss.backward() before optimizer.step() in PyTorch training?',
          opts: [
            'backward() saves the model to disk',
            'backward() computes gradients that step() uses to update weights',
            'backward() shuffles the training data',
            'backward() normalises the loss value'
          ],
          answer: 1,
          feedback: 'backward() runs backpropagation, computing ∂loss/∂param for every parameter. The optimizer then uses these gradients (stored in param.grad) to update weights.'
        },
        {
          type: 'fill',
          q: 'Complete the code to compute the gradient of a Morse potential energy:',
          pre: 'r = torch.tensor([0.96], requires_grad=True)\nV = D_e * (1 - torch.exp(-alpha * (r - r_eq)))**2\nV._____()\nprint(f"Force: {r.grad}")',
          answer: 'backward',
          feedback: '.backward() traces the computation graph from V back to r and computes dV/dr, storing the result in r.grad.'
        },
        {
          type: 'challenge',
          q: 'Create a tensor of 5 bond lengths (in Å) with requires_grad=True. Compute Morse potential energies (D_e=0.1747, alpha=2.297, r_eq=0.9572 Å) for each. Call .backward() on the sum and print the forces (negative gradients).',
          hint: 'Use torch.tensor([...], requires_grad=True). After V.sum().backward(), forces = -r.grad.',
          answer: `import torch

r = torch.tensor([0.90, 0.95, 0.96, 1.00, 1.10], requires_grad=True)
D_e, alpha, r_eq = 0.1747, 2.297, 0.9572
V = D_e * (1 - torch.exp(-alpha * (r - r_eq)))**2
V.sum().backward()
forces = -r.grad
print(f"Forces (Ha/Å): {forces.tolist()}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'PyTorch Tensor Tutorial', url: 'https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'PyTorch Autograd Explained', url: 'https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '📄', title: 'CUDA Tensors Guide', url: 'https://pytorch.org/docs/stable/notes/cuda.html', tag: 'docs', tagColor: 'blue' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  NN-MODULE
    // ════════════════════════════════════════════════════════
    {
      id:   'nn-module',
      name: 'nn.Module',
      desc: 'Building reusable neural network architectures with PyTorch\'s module system for molecular property prediction',

      explanation: `
        <p><strong>nn.Module</strong> is PyTorch's base class for all neural
        network components. You define your architecture by subclassing it,
        declaring layers in <code>__init__</code> and implementing the
        <code>forward()</code> method. PyTorch automatically tracks all
        parameters for gradient computation — no manual weight management.</p>

        <p>Built-in layers: <code>nn.Linear(in, out)</code> for fully connected
        layers, <code>nn.ReLU()</code> for activations, <code>nn.Dropout(p)</code>
        for regularisation, <code>nn.BatchNorm1d(n)</code> for normalisation.
        <code>nn.Sequential</code> chains layers without writing a forward method
        — convenient for simple feed-forward networks like molecular property
        predictors.</p>

        <p>The <code>.parameters()</code> method yields all learnable tensors,
        which you pass to an <strong>optimizer</strong>. Call
        <code>model.train()</code> before training (enables dropout/batchnorm
        training behaviour) and <code>model.eval()</code> before inference.
        Save models with <code>torch.save(model.state_dict())</code> and
        reload with <code>model.load_state_dict()</code>.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">torch.nn</span> <span class="kw">as</span> <span class="nm">nn</span>

<span class="cm"># MLP for predicting molecular properties</span>
<span class="kw">class</span> <span class="fn">MolPropertyNet</span>(<span class="nm">nn</span>.<span class="nm">Module</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">n_features</span>, <span class="nm">n_hidden</span>=<span class="num">64</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="nm">self</span>.<span class="nm">net</span> = <span class="nm">nn</span>.<span class="fn">Sequential</span>(
            <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="nm">n_features</span>, <span class="nm">n_hidden</span>),
            <span class="nm">nn</span>.<span class="fn">ReLU</span>(),
            <span class="nm">nn</span>.<span class="fn">Dropout</span>(<span class="num">0.2</span>),
            <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="nm">n_hidden</span>, <span class="nm">n_hidden</span>),
            <span class="nm">nn</span>.<span class="fn">ReLU</span>(),
            <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="nm">n_hidden</span>, <span class="num">1</span>),  <span class="cm"># single output: ΔG‡</span>
        )

    <span class="kw">def</span> <span class="fn">forward</span>(<span class="nm">self</span>, <span class="nm">x</span>):
        <span class="kw">return</span> <span class="nm">self</span>.<span class="nm">net</span>(<span class="nm">x</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)

<span class="cm"># Instantiate and inspect</span>
<span class="nm">model</span> = <span class="fn">MolPropertyNet</span>(<span class="nm">n_features</span>=<span class="num">5</span>, <span class="nm">n_hidden</span>=<span class="num">64</span>)
<span class="fn">print</span>(<span class="nm">model</span>)

<span class="cm"># Count trainable parameters</span>
<span class="nm">n_params</span> = <span class="fn">sum</span>(<span class="nm">p</span>.<span class="fn">numel</span>() <span class="kw">for</span> <span class="nm">p</span> <span class="kw">in</span> <span class="nm">model</span>.<span class="fn">parameters</span>())
<span class="fn">print</span>(<span class="st">f"Trainable params: </span>{<span class="nm">n_params</span>:,}<span class="st">"</span>)

<span class="cm"># Forward pass with dummy molecular descriptors</span>
<span class="nm">X</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">8</span>, <span class="num">5</span>)  <span class="cm"># 8 molecules, 5 features</span>
<span class="nm">model</span>.<span class="fn">eval</span>()
<span class="kw">with</span> <span class="nm">torch</span>.<span class="fn">no_grad</span>():
    <span class="nm">preds</span> = <span class="nm">model</span>(<span class="nm">X</span>)
<span class="fn">print</span>(<span class="st">f"Predictions shape: </span>{<span class="nm">preds</span>.<span class="nm">shape</span>}<span class="st">"</span>)

<span class="cm"># Save and load model weights</span>
<span class="nm">torch</span>.<span class="fn">save</span>(<span class="nm">model</span>.<span class="fn">state_dict</span>(), <span class="st">'mol_net.pt'</span>)
<span class="nm">loaded</span> = <span class="fn">MolPropertyNet</span>(<span class="nm">n_features</span>=<span class="num">5</span>)
<span class="nm">loaded</span>.<span class="fn">load_state_dict</span>(<span class="nm">torch</span>.<span class="fn">load</span>(<span class="st">'mol_net.pt'</span>))`,

      cheatsheet: [
        { syn: 'class Net(nn.Module):', desc: 'Subclass nn.Module to define a network' },
        { syn: 'nn.Linear(in, out)', desc: 'Fully connected layer: y = xW^T + b' },
        { syn: 'nn.Sequential(layer1, layer2, ...)', desc: 'Chain layers into a pipeline' },
        { syn: 'nn.ReLU() / nn.Sigmoid()', desc: 'Activation function as a module' },
        { syn: 'nn.Dropout(p=0.2)', desc: 'Randomly zero 20% of neurons during training' },
        { syn: 'nn.BatchNorm1d(n)', desc: 'Batch normalisation — stabilises training' },
        { syn: 'model.parameters()', desc: 'Generator yielding all trainable parameters' },
        { syn: 'model.train() / model.eval()', desc: 'Switch between training and inference modes' },
        { syn: 'torch.save(model.state_dict(), path)', desc: 'Save model weights to disk' },
        { syn: 'model.load_state_dict(torch.load(path))', desc: 'Load saved weights into a model' },
        { syn: 'p.numel()', desc: 'Count elements in a parameter tensor' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why should you call model.eval() before making predictions on new molecules?',
          opts: [
            'It speeds up computation by disabling autograd',
            'It disables dropout and switches batchnorm to use running statistics',
            'It moves the model to GPU',
            'It resets the model weights to their initial values'
          ],
          answer: 1,
          feedback: 'model.eval() disables dropout (which randomly zeros neurons) and uses batchnorm running averages instead of batch statistics. Without it, predictions are noisy and non-deterministic.'
        },
        {
          type: 'fill',
          q: 'Complete the code to count the total trainable parameters:',
          pre: 'n_params = sum(p._____ for p in model.parameters())\nprint(f"Parameters: {n_params:,}")',
          answer: 'numel()',
          feedback: 'p.numel() returns the number of elements in each parameter tensor. Summing over all parameters gives the total trainable parameter count.'
        },
        {
          type: 'challenge',
          q: 'Define an nn.Module called EnergyPredictor with: Linear(10→128), ReLU, Dropout(0.3), Linear(128→64), ReLU, Linear(64→1). Print the model and its parameter count. Run a forward pass on 20 random samples.',
          hint: 'Use nn.Sequential in __init__ and call self.net(x).squeeze(-1) in forward().',
          answer: `import torch
import torch.nn as nn

class EnergyPredictor(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(10, 128), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(128, 64), nn.ReLU(),
            nn.Linear(64, 1))
    def forward(self, x):
        return self.net(x).squeeze(-1)

model = EnergyPredictor()
print(model)
print(f"Params: {sum(p.numel() for p in model.parameters()):,}")
X = torch.randn(20, 10)
model.eval()
with torch.no_grad():
    print(f"Output shape: {model(X).shape}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'PyTorch nn.Module Docs', url: 'https://pytorch.org/docs/stable/generated/torch.nn.Module.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'Build Model Tutorial', url: 'https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '📄', title: 'Save & Load Models', url: 'https://pytorch.org/tutorials/beginner/saving_loading_models.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  TRAINING-LOOP
    // ════════════════════════════════════════════════════════
    {
      id:   'training-loop',
      name: 'Training Loop',
      desc: 'Loss functions, optimizers, and the epoch loop for training neural networks on chemical data',

      explanation: `
        <p>Training a neural network follows a fixed pattern each epoch:
        <strong>(1)</strong> forward pass — compute predictions,
        <strong>(2)</strong> compute loss — compare predictions to DFT/experimental
        targets, <strong>(3)</strong> backward pass — compute gradients with
        <code>loss.backward()</code>, <strong>(4)</strong> optimizer step — update
        weights, <strong>(5)</strong> zero gradients for the next iteration.</p>

        <p><strong>Loss functions</strong> measure prediction error:
        <code>nn.MSELoss()</code> for regression (mean squared error in kcal/mol²),
        <code>nn.L1Loss()</code> for MAE (more robust to outliers),
        <code>nn.CrossEntropyLoss()</code> for classification. For molecular
        energy prediction, L1 or Huber loss is preferred because chemical datasets
        often have a few high-energy outliers that inflate MSE.</p>

        <p><strong>Optimizers</strong>: <code>Adam</code> (adaptive learning rates,
        default choice), <code>SGD</code> (simpler, needs tuning), and
        <code>AdamW</code> (Adam with decoupled weight decay, recommended for
        larger models). A <strong>learning rate scheduler</strong> like
        <code>ReduceLROnPlateau</code> decreases the learning rate when validation
        loss stops improving — essential for convergence on noisy chemical data.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">torch.nn</span> <span class="kw">as</span> <span class="nm">nn</span>
<span class="kw">from</span> <span class="nm">torch.utils.data</span> <span class="kw">import</span> <span class="fn">DataLoader</span>, <span class="fn">TensorDataset</span>

<span class="cm"># Synthetic reaction data (descriptors → ΔG‡)</span>
<span class="nm">X</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">200</span>, <span class="num">5</span>)
<span class="nm">y</span> = <span class="num">3.0</span> * <span class="nm">X</span>[:, <span class="num">0</span>] - <span class="num">1.5</span> * <span class="nm">X</span>[:, <span class="num">1</span>] + <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">200</span>) * <span class="num">0.5</span>
<span class="nm">loader</span> = <span class="fn">DataLoader</span>(<span class="fn">TensorDataset</span>(<span class="nm">X</span>, <span class="nm">y</span>), <span class="nm">batch_size</span>=<span class="num">32</span>, <span class="nm">shuffle</span>=<span class="kw">True</span>)

<span class="cm"># Model, loss, optimiser</span>
<span class="nm">model</span> = <span class="nm">nn</span>.<span class="fn">Sequential</span>(<span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">5</span>, <span class="num">32</span>), <span class="nm">nn</span>.<span class="fn">ReLU</span>(),
                      <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">32</span>, <span class="num">16</span>), <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">16</span>, <span class="num">1</span>))
<span class="nm">criterion</span> = <span class="nm">nn</span>.<span class="fn">L1Loss</span>()  <span class="cm"># MAE — robust to energy outliers</span>
<span class="nm">optimizer</span> = <span class="nm">torch</span>.<span class="nm">optim</span>.<span class="fn">Adam</span>(<span class="nm">model</span>.<span class="fn">parameters</span>(), <span class="nm">lr</span>=<span class="num">1e-3</span>)
<span class="nm">scheduler</span> = <span class="nm">torch</span>.<span class="nm">optim</span>.<span class="nm">lr_scheduler</span>.<span class="fn">ReduceLROnPlateau</span>(
    <span class="nm">optimizer</span>, <span class="nm">patience</span>=<span class="num">5</span>, <span class="nm">factor</span>=<span class="num">0.5</span>)

<span class="cm"># Training loop</span>
<span class="kw">for</span> <span class="nm">epoch</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    <span class="nm">model</span>.<span class="fn">train</span>()
    <span class="nm">epoch_loss</span> = <span class="num">0.0</span>
    <span class="kw">for</span> <span class="nm">X_batch</span>, <span class="nm">y_batch</span> <span class="kw">in</span> <span class="nm">loader</span>:
        <span class="nm">pred</span> = <span class="nm">model</span>(<span class="nm">X_batch</span>).<span class="fn">squeeze</span>()
        <span class="nm">loss</span> = <span class="nm">criterion</span>(<span class="nm">pred</span>, <span class="nm">y_batch</span>)
        <span class="nm">optimizer</span>.<span class="fn">zero_grad</span>()
        <span class="nm">loss</span>.<span class="fn">backward</span>()
        <span class="nm">optimizer</span>.<span class="fn">step</span>()
        <span class="nm">epoch_loss</span> += <span class="nm">loss</span>.<span class="fn">item</span>()
    <span class="nm">avg</span> = <span class="nm">epoch_loss</span> / <span class="fn">len</span>(<span class="nm">loader</span>)
    <span class="nm">scheduler</span>.<span class="fn">step</span>(<span class="nm">avg</span>)
    <span class="kw">if</span> <span class="nm">epoch</span> % <span class="num">10</span> == <span class="num">0</span>:
        <span class="fn">print</span>(<span class="st">f"Epoch </span>{<span class="nm">epoch</span>:<span class="num">3d</span>}<span class="st">: MAE=</span>{<span class="nm">avg</span><span class="st">:.4f} kcal/mol"</span>)`,

      cheatsheet: [
        { syn: 'nn.MSELoss()', desc: 'Mean squared error — standard for regression' },
        { syn: 'nn.L1Loss()', desc: 'Mean absolute error — robust to outliers' },
        { syn: 'nn.HuberLoss(delta=1.0)', desc: 'Smooth blend of L1 and L2 — best of both' },
        { syn: 'nn.CrossEntropyLoss()', desc: 'Classification loss — expects logits, not probabilities' },
        { syn: 'torch.optim.Adam(params, lr=1e-3)', desc: 'Adam optimizer — adaptive learning rates per parameter' },
        { syn: 'torch.optim.AdamW(params, lr=1e-3)', desc: 'Adam with weight decay — recommended for larger models' },
        { syn: 'optimizer.zero_grad()', desc: 'Reset gradients to zero before each backward pass' },
        { syn: 'loss.backward()', desc: 'Compute gradients for all parameters' },
        { syn: 'optimizer.step()', desc: 'Update parameters using computed gradients' },
        { syn: 'DataLoader(dataset, batch_size=32)', desc: 'Iterate over data in mini-batches' },
        { syn: 'ReduceLROnPlateau(opt, patience=5)', desc: 'Halve LR when validation loss plateaus' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What happens if you forget to call optimizer.zero_grad() before loss.backward()?',
          opts: [
            'The model weights are reset to zero',
            'Gradients accumulate across batches, causing incorrect weight updates',
            'The loss function changes to MSE',
            'Training runs faster but with lower accuracy'
          ],
          answer: 1,
          feedback: 'PyTorch accumulates gradients by default. Without zero_grad(), gradients from previous batches add to the current ones, leading to incorrect and noisy updates.'
        },
        {
          type: 'fill',
          q: 'Complete the training step in the correct order:',
          pre: 'pred = model(X_batch).squeeze()\nloss = criterion(pred, y_batch)\noptimizer.zero_grad()\nloss._____()\noptimizer.step()',
          answer: 'backward',
          feedback: 'The order is: forward → loss → zero_grad → backward → step. backward() computes gradients, then step() uses them to update weights.'
        },
        {
          type: 'challenge',
          q: 'Create a training loop that trains an nn.Sequential model (Linear(3,32), ReLU, Linear(32,1)) for 100 epochs on synthetic data (100 samples, 3 features). Use L1Loss and Adam (lr=0.01). Print loss every 25 epochs.',
          hint: 'Generate X = torch.randn(100, 3) and y = some function of X. Use a DataLoader with batch_size=16.',
          answer: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

X = torch.randn(100, 3)
y = 2.0 * X[:, 0] - X[:, 2] + torch.randn(100) * 0.3
loader = DataLoader(TensorDataset(X, y), batch_size=16, shuffle=True)
model = nn.Sequential(nn.Linear(3, 32), nn.ReLU(), nn.Linear(32, 1))
criterion = nn.L1Loss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
for epoch in range(100):
    for Xb, yb in loader:
        loss = criterion(model(Xb).squeeze(), yb)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    if epoch % 25 == 0:
        print(f"Epoch {epoch}: MAE={loss.item():.4f}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'PyTorch Training Tutorial', url: 'https://pytorch.org/tutorials/beginner/basics/optimization_tutorial.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'Training Loop Best Practices', url: 'https://pytorch.org/tutorials/beginner/introyt/trainingyt.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '📄', title: 'Learning Rate Schedulers', url: 'https://pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate', tag: 'docs', tagColor: 'blue' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  CNNS
    // ════════════════════════════════════════════════════════
    {
      id:   'cnns',
      name: 'Convolutional Neural Networks',
      desc: '1D and 2D convolutions for learning from spectra, molecular images, and spatial chemical data',

      explanation: `
        <p><strong>Convolutional Neural Networks (CNNs)</strong> learn local
        patterns through sliding filters. In chemistry, <strong>1D CNNs</strong>
        process sequential data like IR/UV-Vis spectra, XRD patterns, or SMILES
        strings — the convolution kernel detects local motifs (absorption peaks,
        functional group signatures). <strong>2D CNNs</strong> process images
        like electron density maps or molecular grid representations.</p>

        <p>A CNN layer applies <code>n_filters</code> learnable kernels of size
        <code>kernel_size</code> across the input, producing a feature map that
        highlights where each pattern occurs. <strong>Pooling</strong> layers
        (max or average) downsample these maps, making the network invariant to
        small shifts — a peak at 1720 cm⁻¹ vs 1725 cm⁻¹ should both trigger
        the "carbonyl" filter.</p>

        <p>Architecture pattern: <strong>Conv → ReLU → Pool</strong>, repeated
        2–4 times to build hierarchical features, followed by
        <strong>flatten → Linear</strong> layers for prediction. The number of
        channels grows (e.g., 1→16→32→64) while spatial dimensions shrink
        through pooling. For 1D spectral data, use <code>nn.Conv1d</code>;
        for 2D images, use <code>nn.Conv2d</code>.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">torch.nn</span> <span class="kw">as</span> <span class="nm">nn</span>

<span class="cm"># 1D CNN for IR spectrum classification</span>
<span class="kw">class</span> <span class="fn">SpectrumCNN</span>(<span class="nm">nn</span>.<span class="nm">Module</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">n_classes</span>=<span class="num">5</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="nm">self</span>.<span class="nm">features</span> = <span class="nm">nn</span>.<span class="fn">Sequential</span>(
            <span class="nm">nn</span>.<span class="fn">Conv1d</span>(<span class="num">1</span>, <span class="num">16</span>, <span class="nm">kernel_size</span>=<span class="num">7</span>, <span class="nm">padding</span>=<span class="num">3</span>),
            <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">MaxPool1d</span>(<span class="num">2</span>),
            <span class="nm">nn</span>.<span class="fn">Conv1d</span>(<span class="num">16</span>, <span class="num">32</span>, <span class="nm">kernel_size</span>=<span class="num">5</span>, <span class="nm">padding</span>=<span class="num">2</span>),
            <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">MaxPool1d</span>(<span class="num">2</span>),
            <span class="nm">nn</span>.<span class="fn">Conv1d</span>(<span class="num">32</span>, <span class="num">64</span>, <span class="nm">kernel_size</span>=<span class="num">3</span>, <span class="nm">padding</span>=<span class="num">1</span>),
            <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">AdaptiveAvgPool1d</span>(<span class="num">1</span>),
        )
        <span class="nm">self</span>.<span class="nm">classifier</span> = <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="nm">n_classes</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(<span class="nm">self</span>, <span class="nm">x</span>):
        <span class="nm">x</span> = <span class="nm">self</span>.<span class="nm">features</span>(<span class="nm">x</span>)
        <span class="nm">x</span> = <span class="nm">x</span>.<span class="fn">squeeze</span>(-<span class="num">1</span>)     <span class="cm"># (batch, 64, 1) → (batch, 64)</span>
        <span class="kw">return</span> <span class="nm">self</span>.<span class="nm">classifier</span>(<span class="nm">x</span>)

<span class="cm"># Test with simulated IR spectra (batch=4, channels=1, 1000 points)</span>
<span class="nm">model</span> = <span class="fn">SpectrumCNN</span>(<span class="nm">n_classes</span>=<span class="num">5</span>)
<span class="nm">spectra</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">4</span>, <span class="num">1</span>, <span class="num">1000</span>)  <span class="cm"># 4 IR spectra, 1000 wavenumber bins</span>
<span class="nm">logits</span> = <span class="nm">model</span>(<span class="nm">spectra</span>)
<span class="fn">print</span>(<span class="st">f"Output: </span>{<span class="nm">logits</span>.<span class="nm">shape</span>}<span class="st">"</span>)  <span class="cm"># (4, 5) — logits for 5 functional groups</span>

<span class="cm"># Predicted functional group class</span>
<span class="nm">preds</span> = <span class="nm">logits</span>.<span class="fn">argmax</span>(<span class="nm">dim</span>=<span class="num">1</span>)
<span class="nm">groups</span> = [<span class="st">'alcohol'</span>, <span class="st">'carbonyl'</span>, <span class="st">'amine'</span>, <span class="st">'aromatic'</span>, <span class="st">'alkene'</span>]
<span class="kw">for</span> <span class="nm">i</span>, <span class="nm">p</span> <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="nm">preds</span>):
    <span class="fn">print</span>(<span class="st">f"  Spectrum </span>{<span class="nm">i</span>}<span class="st">: </span>{<span class="nm">groups</span>[<span class="nm">p</span>]}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'nn.Conv1d(in_ch, out_ch, kernel_size)', desc: '1D convolution — for spectra, sequences, SMILES' },
        { syn: 'nn.Conv2d(in_ch, out_ch, kernel_size)', desc: '2D convolution — for images, density maps' },
        { syn: 'padding="same" or padding=k//2', desc: 'Keep output length equal to input length' },
        { syn: 'nn.MaxPool1d(2)', desc: 'Downsample by 2× — keep max value in each window' },
        { syn: 'nn.AdaptiveAvgPool1d(1)', desc: 'Pool to fixed size 1 — flexible input lengths' },
        { syn: 'nn.Flatten()', desc: 'Reshape (batch, C, H, W) → (batch, C*H*W) before linear layer' },
        { syn: 'stride=2', desc: 'Skip every other position — reduces output size' },
        { syn: 'logits.argmax(dim=1)', desc: 'Get predicted class index from logit scores' },
        { syn: 'nn.BatchNorm1d(n_channels)', desc: 'Normalise feature maps — stabilises CNN training' },
        { syn: 'nn.Conv1d(1, 16, 7, padding=3)', desc: 'Example: 1→16 channels, kernel=7, same padding' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why is AdaptiveAvgPool1d(1) useful before the classifier layer in a spectrum CNN?',
          opts: [
            'It increases the number of channels',
            'It reduces the sequence dimension to 1 regardless of input length',
            'It applies dropout to the feature maps',
            'It converts 1D features to 2D'
          ],
          answer: 1,
          feedback: 'AdaptiveAvgPool1d(1) averages each channel to a single value, producing a fixed-size output (batch, channels, 1) that works with nn.Linear regardless of input spectrum length.'
        },
        {
          type: 'fill',
          q: 'Complete the code to apply a 1D convolution with 16 output channels and kernel size 5:',
          pre: 'conv = nn._____(1, 16, kernel_size=5, padding=2)',
          answer: 'Conv1d',
          feedback: 'nn.Conv1d(in_channels, out_channels, kernel_size) applies 1D convolution. With padding=2 and kernel_size=5, the output length equals the input length.'
        },
        {
          type: 'challenge',
          q: 'Build a 1D CNN that takes a spectrum (1 channel, 500 points) and predicts 3 molecular classes. Use two Conv1d→ReLU→MaxPool1d blocks (1→16→32 channels), then AdaptiveAvgPool1d(1) and Linear(32,3). Print output shape for a batch of 8.',
          hint: 'Input shape: (8, 1, 500). After features block, squeeze the last dim before the linear layer.',
          answer: `import torch
import torch.nn as nn

class SpecNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv1d(1, 16, 5, padding=2), nn.ReLU(), nn.MaxPool1d(2),
            nn.Conv1d(16, 32, 5, padding=2), nn.ReLU(), nn.MaxPool1d(2),
            nn.AdaptiveAvgPool1d(1))
        self.classifier = nn.Linear(32, 3)
    def forward(self, x):
        return self.classifier(self.features(x).squeeze(-1))

model = SpecNet()
x = torch.randn(8, 1, 500)
print(f"Output: {model(x).shape}")  # (8, 3)`
        }
      ],

      resources: [
        { icon: '📘', title: 'PyTorch Conv1d Docs', url: 'https://pytorch.org/docs/stable/generated/torch.nn.Conv1d.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: '3Blue1Brown: CNNs', url: 'https://www.youtube.com/watch?v=KuXjwB4LzSA', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'CNNs for Molecular Spectra', url: 'https://pubs.acs.org/doi/10.1021/acs.analchem.1c01624', tag: 'paper', tagColor: 'purple' },
      ]
    },

  ],
};
