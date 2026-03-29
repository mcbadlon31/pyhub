/**
 * data/ml/05-molecular-ml.js
 * Stage 05: Molecular ML
 * Topics: rdkit-basics,mol-representations,mol-gnns,mol-transformers,
 *         chem-ml-pipelines,save-deploy-models,uncertainty-qm
 *
 * All examples use RDKit, PyG, DeepChem, and reaction_benchmark.csv context.
 * Code line limits: ML 5-6 = 25–60 lines per topic.
 */

window.ML_S5 = {
  id: 'ml-s5', num: '05', title: 'Molecular ML',
  color: 'lime', meta: 'Stage 5', track: 'ml',
  topics: [

    // ════════════════════════════════════════════════════════
    //  RDKIT-BASICS
    // ════════════════════════════════════════════════════════
    {
      id:   'rdkit-basics',
      name: 'RDKit Basics',
      desc: 'Parsing SMILES, computing molecular descriptors, and substructure searching with RDKit',

      explanation: `
        <p><strong>RDKit</strong> is the standard open-source cheminformatics
        toolkit for Python. It converts between molecular representations
        (SMILES, InChI, MOL files), computes 2D/3D coordinates, and calculates
        hundreds of molecular descriptors. Every molecular ML pipeline starts
        with RDKit for data ingestion and featurisation.</p>

        <p><code>Chem.MolFromSmiles(smi)</code> parses a SMILES string into an
        RDKit <strong>Mol object</strong> — a graph with atoms as nodes and bonds
        as edges. From this you compute descriptors:
        <code>Descriptors.MolWt(mol)</code> for molecular weight,
        <code>Descriptors.MolLogP(mol)</code> for partition coefficient,
        <code>Descriptors.NumHDonors(mol)</code> for hydrogen bond donors.
        These serve as features for classical ML models.</p>

        <p><strong>Substructure searching</strong> with
        <code>mol.HasSubstructMatch(pattern)</code> identifies functional groups:
        find all molecules containing a carbonyl, an amide, or a specific
        catalyst scaffold. <strong>Fingerprints</strong> — binary or count vectors
        encoding molecular substructures — are the bridge between molecules and
        ML models. Morgan (circular) fingerprints are the default choice for
        property prediction.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">rdkit</span> <span class="kw">import</span> <span class="nm">Chem</span>
<span class="kw">from</span> <span class="nm">rdkit.Chem</span> <span class="kw">import</span> <span class="nm">Descriptors</span>, <span class="nm">Draw</span>, <span class="nm">AllChem</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Parse SMILES → Mol object</span>
<span class="nm">smi</span> = <span class="st">'CC(=O)Oc1ccccc1C(=O)O'</span>  <span class="cm"># aspirin</span>
<span class="nm">mol</span> = <span class="nm">Chem</span>.<span class="fn">MolFromSmiles</span>(<span class="nm">smi</span>)
<span class="fn">print</span>(<span class="st">f"Atoms: </span>{<span class="nm">mol</span>.<span class="fn">GetNumAtoms</span>()}<span class="st">, Bonds: </span>{<span class="nm">mol</span>.<span class="fn">GetNumBonds</span>()}<span class="st">"</span>)

<span class="cm"># Molecular descriptors for ML features</span>
<span class="nm">mw</span> = <span class="nm">Descriptors</span>.<span class="fn">MolWt</span>(<span class="nm">mol</span>)
<span class="nm">logp</span> = <span class="nm">Descriptors</span>.<span class="fn">MolLogP</span>(<span class="nm">mol</span>)
<span class="nm">hbd</span> = <span class="nm">Descriptors</span>.<span class="fn">NumHDonors</span>(<span class="nm">mol</span>)
<span class="nm">hba</span> = <span class="nm">Descriptors</span>.<span class="fn">NumHAcceptors</span>(<span class="nm">mol</span>)
<span class="nm">tpsa</span> = <span class="nm">Descriptors</span>.<span class="fn">TPSA</span>(<span class="nm">mol</span>)
<span class="fn">print</span>(<span class="st">f"MW=</span>{<span class="nm">mw</span><span class="st">:.1f}, LogP=</span>{<span class="nm">logp</span><span class="st">:.2f}, HBD=</span>{<span class="nm">hbd</span>}<span class="st">, HBA=</span>{<span class="nm">hba</span>}<span class="st">, TPSA=</span>{<span class="nm">tpsa</span><span class="st">:.1f}"</span>)

<span class="cm"># Substructure search: find carbonyl groups</span>
<span class="nm">carbonyl</span> = <span class="nm">Chem</span>.<span class="fn">MolFromSmarts</span>(<span class="st">'[CX3]=[OX1]'</span>)
<span class="nm">matches</span> = <span class="nm">mol</span>.<span class="fn">GetSubstructMatches</span>(<span class="nm">carbonyl</span>)
<span class="fn">print</span>(<span class="st">f"Carbonyl groups found: </span>{<span class="fn">len</span>(<span class="nm">matches</span>)}<span class="st">"</span>)

<span class="cm"># Morgan fingerprint (radius=2, 2048 bits)</span>
<span class="nm">fp</span> = <span class="nm">AllChem</span>.<span class="fn">GetMorganFingerprintAsBitVect</span>(<span class="nm">mol</span>, <span class="nm">radius</span>=<span class="num">2</span>, <span class="nm">nBits</span>=<span class="num">2048</span>)
<span class="nm">fp_arr</span> = <span class="nm">np</span>.<span class="fn">array</span>(<span class="nm">fp</span>)
<span class="fn">print</span>(<span class="st">f"Fingerprint: </span>{<span class="nm">fp_arr</span>.<span class="nm">shape</span>}<span class="st">, on-bits: </span>{<span class="nm">fp_arr</span>.<span class="fn">sum</span>()}<span class="st">"</span>)

<span class="cm"># Batch: compute descriptors for a set of catalysts</span>
<span class="nm">catalyst_smiles</span> = [<span class="st">'c1ccc(P(c2ccccc2)c2ccccc2)cc1'</span>,  <span class="cm"># PPh3</span>
                    <span class="st">'CC(C)(C)P(C(C)(C)C)C(C)(C)C'</span>,   <span class="cm"># PtBu3</span>
                    <span class="st">'c1ccc2c(c1)ccc1ccccc12'</span>]          <span class="cm"># naphthalene</span>
<span class="kw">for</span> <span class="nm">s</span> <span class="kw">in</span> <span class="nm">catalyst_smiles</span>:
    <span class="nm">m</span> = <span class="nm">Chem</span>.<span class="fn">MolFromSmiles</span>(<span class="nm">s</span>)
    <span class="fn">print</span>(<span class="st">f"  MW=</span>{<span class="nm">Descriptors</span>.<span class="fn">MolWt</span>(<span class="nm">m</span>)<span class="st">:.1f}, LogP=</span>{<span class="nm">Descriptors</span>.<span class="fn">MolLogP</span>(<span class="nm">m</span>)<span class="st">:.2f}"</span>)`,

      cheatsheet: [
        { syn: 'Chem.MolFromSmiles(smi)', desc: 'Parse SMILES string → Mol object (None if invalid)' },
        { syn: 'Chem.MolToSmiles(mol)', desc: 'Canonical SMILES from Mol — standardises representation' },
        { syn: 'Chem.MolFromSmarts(pattern)', desc: 'Parse SMARTS substructure query' },
        { syn: 'mol.GetSubstructMatches(pat)', desc: 'Find all matches of a substructure pattern' },
        { syn: 'Descriptors.MolWt(mol)', desc: 'Molecular weight (g/mol)' },
        { syn: 'Descriptors.MolLogP(mol)', desc: 'Wildman-Crippen LogP estimate' },
        { syn: 'Descriptors.TPSA(mol)', desc: 'Topological polar surface area (Å²)' },
        { syn: 'AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=2048)', desc: 'Morgan (ECFP4) circular fingerprint' },
        { syn: 'mol.GetNumAtoms()', desc: 'Number of heavy atoms in the molecule' },
        { syn: 'Chem.Draw.MolToImage(mol)', desc: 'Render 2D structure as PIL image' },
        { syn: 'AllChem.EmbedMolecule(mol)', desc: 'Generate 3D coordinates (ETKDG method)' },
        { syn: 'Chem.MolFromMolFile(path)', desc: 'Read molecule from .mol or .sdf file' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does Chem.MolFromSmiles() return if given an invalid SMILES string?',
          opts: [
            'An empty Mol object',
            'None',
            'It raises a ValueError',
            'A Mol object with zero atoms'
          ],
          answer: 1,
          feedback: 'MolFromSmiles returns None for invalid SMILES. Always check: mol = Chem.MolFromSmiles(smi); if mol is None: handle_error().'
        },
        {
          type: 'fill',
          q: 'Complete the code to compute a Morgan fingerprint with radius 2 and 1024 bits:',
          pre: 'fp = AllChem._____(mol, radius=2, nBits=1024)',
          answer: 'GetMorganFingerprintAsBitVect',
          feedback: 'GetMorganFingerprintAsBitVect returns a bit vector fingerprint. Radius=2 corresponds to ECFP4 (diameter 4).'
        },
        {
          type: 'challenge',
          q: 'Given a list of SMILES ["CCO", "CC(=O)O", "c1ccccc1", "CC(=O)Oc1ccccc1C(=O)O"], parse each with RDKit, compute MW, LogP, and number of H-bond acceptors. Print a table of results. Skip any invalid SMILES.',
          hint: 'Use Chem.MolFromSmiles and check for None. Use Descriptors.MolWt, MolLogP, NumHAcceptors.',
          answer: `from rdkit import Chem
from rdkit.Chem import Descriptors

smiles_list = ["CCO", "CC(=O)O", "c1ccccc1", "CC(=O)Oc1ccccc1C(=O)O"]
print(f"{'SMILES':<30} {'MW':>8} {'LogP':>6} {'HBA':>4}")
for smi in smiles_list:
    mol = Chem.MolFromSmiles(smi)
    if mol is None:
        print(f"{smi:<30} INVALID")
        continue
    mw = Descriptors.MolWt(mol)
    logp = Descriptors.MolLogP(mol)
    hba = Descriptors.NumHAcceptors(mol)
    print(f"{smi:<30} {mw:8.1f} {logp:6.2f} {hba:4d}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'RDKit Getting Started', url: 'https://www.rdkit.org/docs/GettingStartedInPython.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'RDKit Descriptor Tutorial', url: 'https://www.rdkit.org/docs/GettingStartedInPython.html#list-of-available-descriptors', tag: 'tutorial', tagColor: 'green' },
        { icon: '📄', title: 'Morgan Fingerprints Explained', url: 'https://www.rdkit.org/docs/GettingStartedInPython.html#morgan-fingerprints-circular-fingerprints', tag: 'docs', tagColor: 'blue' },
        { icon: '📓', title: 'SciComp for Chemists: Cheminformatics', url: 'https://weisscharlesj.github.io/SciCompforChemists/notebooks/introduction/intro.html', tag: 'textbook', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  MOL-REPRESENTATIONS
    // ════════════════════════════════════════════════════════
    {
      id:   'mol-representations',
      name: 'Molecular Representations',
      desc: 'SMILES, fingerprints, molecular graphs, and descriptor vectors for featurising molecules in ML',

      explanation: `
        <p>How you represent a molecule determines what your model can learn.
        <strong>SMILES strings</strong> encode molecular graphs as text — suitable
        for language models but losing 3D information. <strong>Fingerprints</strong>
        (Morgan/ECFP, MACCS, RDKit) encode substructure presence as fixed-length
        bit vectors — ideal for classical ML (random forests, SVMs) because they
        produce consistent feature dimensions.</p>

        <p><strong>Molecular graphs</strong> represent atoms as nodes and bonds as
        edges, with feature vectors on each. Node features typically include atomic
        number, degree, formal charge, aromaticity; edge features include bond
        type and stereochemistry. Graph neural networks operate directly on these
        graphs, learning representations without hand-crafted descriptors.</p>

        <p>For atomistic/materials ML, <strong>structural descriptors</strong>
        encode 3D geometry: the <strong>Coulomb matrix</strong> captures nuclear
        charges and distances, <strong>SOAP</strong> (Smooth Overlap of Atomic
        Positions) encodes local atomic environments via spherical harmonics,
        and <strong>many-body tensor representations</strong> extend to higher
        order correlations. These bridge the gap between molecular fingerprints
        (topology only) and full 3D graph representations.</p>

        <p>The choice matters: fingerprints work well for small datasets (&lt;10k)
        and are fast to compute. Graph representations shine with larger datasets
        where GNNs can learn task-specific features. <strong>Scaffold splits</strong>
        — splitting by molecular core — give realistic performance estimates
        because test molecules are structurally different from training. Random
        splits are optimistic and misleading for drug/catalyst discovery.</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">rdkit</span> <span class="kw">import</span> <span class="nm">Chem</span>
<span class="kw">from</span> <span class="nm">rdkit.Chem</span> <span class="kw">import</span> <span class="nm">AllChem</span>, <span class="nm">MACCSkeys</span>, <span class="nm">Descriptors</span>
<span class="kw">from</span> <span class="nm">rdkit.Chem</span> <span class="kw">import</span> <span class="nm">rdMolDescriptors</span>
<span class="kw">from</span> <span class="nm">rdkit.Chem.Scaffolds</span> <span class="kw">import</span> <span class="nm">MurckoScaffold</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="nm">mol</span> = <span class="nm">Chem</span>.<span class="fn">MolFromSmiles</span>(<span class="st">'CC(=O)Oc1ccccc1C(=O)O'</span>)  <span class="cm"># aspirin</span>

<span class="cm"># 1. Morgan (ECFP4) fingerprint — most popular for ML</span>
<span class="nm">morgan_fp</span> = <span class="nm">AllChem</span>.<span class="fn">GetMorganFingerprintAsBitVect</span>(<span class="nm">mol</span>, <span class="num">2</span>, <span class="nm">nBits</span>=<span class="num">2048</span>)
<span class="fn">print</span>(<span class="st">f"Morgan: </span>{<span class="nm">np</span>.<span class="fn">array</span>(<span class="nm">morgan_fp</span>).<span class="nm">shape</span>}<span class="st">, on-bits=</span>{<span class="nm">morgan_fp</span>.<span class="fn">GetNumOnBits</span>()}<span class="st">"</span>)

<span class="cm"># 2. MACCS keys — 166 predefined structural keys</span>
<span class="nm">maccs_fp</span> = <span class="nm">MACCSkeys</span>.<span class="fn">GenMACCSKeys</span>(<span class="nm">mol</span>)
<span class="fn">print</span>(<span class="st">f"MACCS: </span>{<span class="fn">len</span>(<span class="nm">maccs_fp</span>)}<span class="st"> bits, on=</span>{<span class="nm">maccs_fp</span>.<span class="fn">GetNumOnBits</span>()}<span class="st">"</span>)

<span class="cm"># 3. Physicochemical descriptor vector</span>
<span class="nm">desc_names</span> = [<span class="st">'MolWt'</span>, <span class="st">'MolLogP'</span>, <span class="st">'TPSA'</span>, <span class="st">'NumHDonors'</span>, <span class="st">'NumHAcceptors'</span>]
<span class="nm">desc_vec</span> = [<span class="fn">getattr</span>(<span class="nm">Descriptors</span>, <span class="nm">d</span>)(<span class="nm">mol</span>) <span class="kw">for</span> <span class="nm">d</span> <span class="kw">in</span> <span class="nm">desc_names</span>]
<span class="fn">print</span>(<span class="st">f"Descriptors: </span>{<span class="nm">desc_vec</span>}<span class="st">"</span>)

<span class="cm"># 4. Molecular graph features (for GNN input)</span>
<span class="nm">atom_features</span> = []
<span class="kw">for</span> <span class="nm">atom</span> <span class="kw">in</span> <span class="nm">mol</span>.<span class="fn">GetAtoms</span>():
    <span class="nm">atom_features</span>.<span class="fn">append</span>([
        <span class="nm">atom</span>.<span class="fn">GetAtomicNum</span>(), <span class="nm">atom</span>.<span class="fn">GetDegree</span>(),
        <span class="nm">atom</span>.<span class="fn">GetFormalCharge</span>(), <span class="bi">int</span>(<span class="nm">atom</span>.<span class="fn">GetIsAromatic</span>()),
    ])
<span class="fn">print</span>(<span class="st">f"Atom features: </span>{<span class="nm">np</span>.<span class="fn">array</span>(<span class="nm">atom_features</span>).<span class="nm">shape</span>}<span class="st">"</span>)

<span class="cm"># 5. Scaffold split: extract Murcko scaffold</span>
<span class="nm">scaffold</span> = <span class="nm">MurckoScaffold</span>.<span class="fn">MurckoScaffoldSmiles</span>(
    <span class="nm">mol</span>=<span class="nm">mol</span>, <span class="nm">includeChirality</span>=<span class="kw">False</span>)
<span class="fn">print</span>(<span class="st">f"Scaffold: </span>{<span class="nm">scaffold</span>}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=2048)', desc: 'ECFP4 fingerprint — radius 2, 2048 bits' },
        { syn: 'MACCSkeys.GenMACCSKeys(mol)', desc: '166-bit MACCS structural keys' },
        { syn: 'rdMolDescriptors.GetMorganFingerprint(mol, 2)', desc: 'Count-based Morgan — richer than bit vector' },
        { syn: 'Chem.RDKFingerprint(mol)', desc: 'RDKit topological fingerprint — path-based' },
        { syn: 'mol.GetAtoms()', desc: 'Iterate over atoms — extract features for GNN nodes' },
        { syn: 'atom.GetAtomicNum()', desc: 'Atomic number (C=6, N=7, O=8)' },
        { syn: 'atom.GetDegree()', desc: 'Number of bonded neighbours' },
        { syn: 'mol.GetBondBetweenAtoms(i, j)', desc: 'Get bond object between two atom indices' },
        { syn: 'MurckoScaffold.MurckoScaffoldSmiles(mol)', desc: 'Extract Murcko scaffold for scaffold splitting' },
        { syn: 'DataStructs.TanimotoSimilarity(fp1, fp2)', desc: 'Tanimoto similarity between two fingerprints' },
        { syn: 'SOAP(species, r_cut, n_max, l_max)', desc: 'DScribe SOAP descriptor — encodes local atomic environments' },
        { syn: 'CoulombMatrix(n_atoms_max)', desc: 'DScribe Coulomb matrix — nuclear charges × distances' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why are scaffold splits preferred over random splits for evaluating molecular ML models?',
          opts: [
            'Scaffold splits are faster to compute',
            'They ensure test molecules have different core structures, simulating real discovery scenarios',
            'Random splits cause data leakage from the test set',
            'Scaffold splits produce larger test sets'
          ],
          answer: 1,
          feedback: 'In real drug/catalyst discovery, you predict properties of novel scaffolds. Random splits allow structurally similar molecules in train and test, giving unrealistically high performance.'
        },
        {
          type: 'fill',
          q: 'Complete the code to extract the Murcko scaffold from a molecule:',
          pre: 'from rdkit.Chem.Scaffolds import MurckoScaffold\nscaffold = MurckoScaffold._____(mol=mol)',
          answer: 'MurckoScaffoldSmiles',
          feedback: 'MurckoScaffoldSmiles extracts the core ring system, removing side chains. This is used to group molecules by scaffold for splitting.'
        },
        {
          type: 'challenge',
          q: 'For a list of 5 drug SMILES, compute Morgan fingerprints (radius=2, 1024 bits) and build a Tanimoto similarity matrix. Print the pairwise similarities.',
          hint: 'Use DataStructs.TanimotoSimilarity(fp1, fp2) for each pair. Store fps in a list first.',
          answer: `from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit import DataStructs

smiles = ['CC(=O)Oc1ccccc1C(=O)O', 'CC(=O)Nc1ccc(O)cc1',
          'c1ccc2[nH]c(=O)c(=O)[nH]c2c1', 'CC12CCC3C(CCC4CC(=O)CCC43C)C1CCC2O',
          'CN1C=NC2=C1C(=O)N(C(=O)N2C)C']
fps = [AllChem.GetMorganFingerprintAsBitVect(Chem.MolFromSmiles(s), 2, nBits=1024) for s in smiles]
for i in range(len(fps)):
    for j in range(i+1, len(fps)):
        sim = DataStructs.TanimotoSimilarity(fps[i], fps[j])
        print(f"  {i}-{j}: {sim:.3f}")`
        },
        {
          type: 'challenge',
          q: 'Write a function mol_to_graph(smiles) that takes a SMILES string and returns a dict with "node_features" (N×4 array: atomic_num, degree, formal_charge, is_aromatic) and "edge_index" (2×E array of bond endpoints). Test on aspirin.',
          hint: 'Use mol.GetAtoms() for nodes and mol.GetBonds() for edges. Each bond has GetBeginAtomIdx() and GetEndAtomIdx().',
          answer: `from rdkit import Chem
import numpy as np

def mol_to_graph(smiles):
    mol = Chem.MolFromSmiles(smiles)
    nodes = [[a.GetAtomicNum(), a.GetDegree(),
              a.GetFormalCharge(), int(a.GetIsAromatic())]
             for a in mol.GetAtoms()]
    edges = []
    for b in mol.GetBonds():
        i, j = b.GetBeginAtomIdx(), b.GetEndAtomIdx()
        edges.extend([[i, j], [j, i]])
    return {'node_features': np.array(nodes),
            'edge_index': np.array(edges).T}

g = mol_to_graph('CC(=O)Oc1ccccc1C(=O)O')
print(f"Nodes: {g['node_features'].shape}, Edges: {g['edge_index'].shape}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'RDKit Fingerprint Docs', url: 'https://www.rdkit.org/docs/GettingStartedInPython.html#fingerprinting-and-molecular-similarity', tag: 'docs', tagColor: 'blue' },
        { icon: '📄', title: 'Molecular Representations for ML (Review)', url: 'https://pubs.acs.org/doi/10.1021/acs.chemrev.1c00107', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'DeepChem Featurizers', url: 'https://deepchem.readthedocs.io/en/latest/api_reference/featurizers.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🔬', title: 'DScribe: SOAP & Coulomb Matrix', url: 'https://singroup.github.io/dscribe/latest/', tag: 'library', tagColor: 'orange' },
        { icon: '📄', title: 'CompChem101 ML Representations Guide', url: 'https://github.com/gomesgroup/compchem101#essential-skills-for-machine-learning-bonus', tag: 'guide', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  MOL-GNNS
    // ════════════════════════════════════════════════════════
    {
      id:   'mol-gnns',
      name: 'Molecular GNNs',
      desc: 'Graph neural networks for learning molecular representations from atomic graphs',

      explanation: `
        <p><strong>Graph Neural Networks (GNNs)</strong> operate directly on
        molecular graphs — atoms are nodes, bonds are edges. Each layer performs
        <strong>message passing</strong>: every atom aggregates information from
        its neighbours, updates its feature vector, and passes the result to the
        next layer. After k layers, each atom's representation encodes its
        k-hop chemical environment.</p>

        <p>Popular architectures: <strong>GCN</strong> (Graph Convolutional
        Network — mean aggregation), <strong>GIN</strong> (Graph Isomorphism
        Network — sum aggregation, more expressive), <strong>GAT</strong>
        (Graph Attention Network — learns attention weights between neighbours).
        For molecular property prediction, 3–5 message-passing layers followed
        by a <strong>readout</strong> (global mean/sum pooling) and MLP head
        is standard.</p>

        <p>PyTorch Geometric (PyG) provides the infrastructure:
        <code>Data(x, edge_index)</code> stores a single graph,
        <code>DataLoader</code> batches graphs by concatenating and offsetting
        edge indices. The QM9 dataset (134k molecules with DFT properties) is
        the standard benchmark — GNNs routinely achieve chemical accuracy
        (&lt;1 kcal/mol MAE) on atomisation energies.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">torch.nn</span> <span class="kw">as</span> <span class="nm">nn</span>
<span class="kw">from</span> <span class="nm">torch_geometric.nn</span> <span class="kw">import</span> <span class="fn">GCNConv</span>, <span class="fn">global_mean_pool</span>
<span class="kw">from</span> <span class="nm">torch_geometric.data</span> <span class="kw">import</span> <span class="fn">Data</span>, <span class="fn">DataLoader</span>

<span class="cm"># Simple GCN for molecular property prediction</span>
<span class="kw">class</span> <span class="fn">MolGCN</span>(<span class="nm">nn</span>.<span class="nm">Module</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">n_atom_feats</span>=<span class="num">4</span>, <span class="nm">hidden</span>=<span class="num">64</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="nm">self</span>.<span class="nm">conv1</span> = <span class="fn">GCNConv</span>(<span class="nm">n_atom_feats</span>, <span class="nm">hidden</span>)
        <span class="nm">self</span>.<span class="nm">conv2</span> = <span class="fn">GCNConv</span>(<span class="nm">hidden</span>, <span class="nm">hidden</span>)
        <span class="nm">self</span>.<span class="nm">conv3</span> = <span class="fn">GCNConv</span>(<span class="nm">hidden</span>, <span class="nm">hidden</span>)
        <span class="nm">self</span>.<span class="nm">head</span> = <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="nm">hidden</span>, <span class="num">1</span>)

    <span class="kw">def</span> <span class="fn">forward</span>(<span class="nm">self</span>, <span class="nm">data</span>):
        <span class="nm">x</span>, <span class="nm">edge_index</span>, <span class="nm">batch</span> = <span class="nm">data</span>.<span class="nm">x</span>, <span class="nm">data</span>.<span class="nm">edge_index</span>, <span class="nm">data</span>.<span class="nm">batch</span>
        <span class="nm">x</span> = <span class="nm">self</span>.<span class="nm">conv1</span>(<span class="nm">x</span>, <span class="nm">edge_index</span>).<span class="fn">relu</span>()
        <span class="nm">x</span> = <span class="nm">self</span>.<span class="nm">conv2</span>(<span class="nm">x</span>, <span class="nm">edge_index</span>).<span class="fn">relu</span>()
        <span class="nm">x</span> = <span class="nm">self</span>.<span class="nm">conv3</span>(<span class="nm">x</span>, <span class="nm">edge_index</span>).<span class="fn">relu</span>()
        <span class="nm">x</span> = <span class="fn">global_mean_pool</span>(<span class="nm">x</span>, <span class="nm">batch</span>)  <span class="cm"># graph-level readout</span>
        <span class="kw">return</span> <span class="nm">self</span>.<span class="nm">head</span>(<span class="nm">x</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)

<span class="cm"># Create molecular graph data (e.g., water: O-H-H)</span>
<span class="nm">x</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([[<span class="num">8</span>,<span class="num">2</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>],[<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>]], <span class="nm">dtype</span>=<span class="nm">torch</span>.<span class="nm">float</span>)
<span class="nm">edge_index</span> = <span class="nm">torch</span>.<span class="fn">tensor</span>([[<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">2</span>],[<span class="num">1</span>,<span class="num">2</span>,<span class="num">0</span>,<span class="num">0</span>]], <span class="nm">dtype</span>=<span class="nm">torch</span>.<span class="nm">long</span>)
<span class="nm">water</span> = <span class="fn">Data</span>(<span class="nm">x</span>=<span class="nm">x</span>, <span class="nm">edge_index</span>=<span class="nm">edge_index</span>, <span class="nm">y</span>=<span class="nm">torch</span>.<span class="fn">tensor</span>([<span class="num">-76.026</span>]))

<span class="cm"># Batch and predict</span>
<span class="nm">loader</span> = <span class="fn">DataLoader</span>([<span class="nm">water</span>] * <span class="num">4</span>, <span class="nm">batch_size</span>=<span class="num">4</span>)
<span class="nm">model</span> = <span class="fn">MolGCN</span>()
<span class="nm">model</span>.<span class="fn">eval</span>()
<span class="kw">for</span> <span class="nm">batch</span> <span class="kw">in</span> <span class="nm">loader</span>:
    <span class="nm">pred</span> = <span class="nm">model</span>(<span class="nm">batch</span>)
    <span class="fn">print</span>(<span class="st">f"Predictions: </span>{<span class="nm">pred</span>.<span class="fn">tolist</span>()}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'GCNConv(in_ch, out_ch)', desc: 'Graph convolutional layer — mean neighbourhood aggregation' },
        { syn: 'GINConv(nn_module)', desc: 'Graph isomorphism layer — sum aggregation, more expressive' },
        { syn: 'GATConv(in_ch, out_ch, heads=4)', desc: 'Graph attention layer — learned attention weights' },
        { syn: 'global_mean_pool(x, batch)', desc: 'Average all node features per graph → graph embedding' },
        { syn: 'global_add_pool(x, batch)', desc: 'Sum node features — preserves size information' },
        { syn: 'Data(x=x, edge_index=ei, y=y)', desc: 'PyG graph object — x: node features, ei: edges' },
        { syn: 'DataLoader(dataset, batch_size=32)', desc: 'PyG loader — auto-batches graphs by offsetting edges' },
        { syn: 'data.batch', desc: 'Tensor mapping each node to its graph in the batch' },
        { syn: 'edge_index shape: (2, num_edges)', desc: 'COO format: row 0 = source, row 1 = target' },
        { syn: 'from torch_geometric.datasets import QM9', desc: 'Load QM9 benchmark (134k molecules, DFT props)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'In a 3-layer GCN on a molecular graph, what chemical information does each atom\'s final representation encode?',
          opts: [
            'Only its own atomic properties',
            'Properties of atoms within 3 bonds (its 3-hop neighbourhood)',
            'The entire molecular graph regardless of size',
            'Only its directly bonded neighbours'
          ],
          answer: 1,
          feedback: 'Each GCN layer aggregates 1-hop neighbour information. After 3 layers, atom representations encode their 3-hop chemical environment — roughly equivalent to an ECFP6 fingerprint radius.'
        },
        {
          type: 'fill',
          q: 'Complete the readout step to get a single vector per molecule from node features:',
          pre: 'x = self.conv3(x, edge_index).relu()\nx = _____(x, batch)  # graph-level embedding\nreturn self.head(x)',
          answer: 'global_mean_pool',
          feedback: 'global_mean_pool averages all node features in each graph, producing one vector per molecule for the prediction head.'
        },
        {
          type: 'challenge',
          q: 'Create PyG Data objects for methane (CH4: C bonded to 4 H) and ethane (C2H6: C-C with 3 H each). Node features: [atomic_num, degree]. Build a DataLoader with batch_size=2 and print batch.x.shape and batch.edge_index.shape.',
          hint: 'Methane: 5 atoms, 8 edges (4 bonds × 2 directions). Ethane: 8 atoms, 14 edges (7 bonds × 2).',
          answer: `import torch
from torch_geometric.data import Data, DataLoader

# Methane: C(0)-H(1), C(0)-H(2), C(0)-H(3), C(0)-H(4)
ch4_x = torch.tensor([[6,4],[1,1],[1,1],[1,1],[1,1]], dtype=torch.float)
ch4_ei = torch.tensor([[0,0,0,0,1,2,3,4],[1,2,3,4,0,0,0,0]], dtype=torch.long)
ch4 = Data(x=ch4_x, edge_index=ch4_ei, y=torch.tensor([-40.518]))

# Ethane: C(0)-C(1), C(0)-H(2,3,4), C(1)-H(5,6,7)
c2h6_x = torch.tensor([[6,4],[6,4],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]], dtype=torch.float)
c2h6_ei = torch.tensor([[0,1,0,0,0,1,1,1,2,3,4,5,6,7],
                         [1,0,2,3,4,5,6,7,0,0,0,1,1,1]], dtype=torch.long)
c2h6 = Data(x=c2h6_x, edge_index=c2h6_ei, y=torch.tensor([-79.651]))

loader = DataLoader([ch4, c2h6], batch_size=2)
for batch in loader:
    print(f"x: {batch.x.shape}, edge_index: {batch.edge_index.shape}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'PyG Introduction', url: 'https://pytorch-geometric.readthedocs.io/en/latest/get_started/introduction.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📄', title: 'GNNs for Molecular Property Prediction', url: 'https://arxiv.org/abs/2005.03457', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'Message Passing Tutorial', url: 'https://pytorch-geometric.readthedocs.io/en/latest/tutorial/create_gnn.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  MOL-TRANSFORMERS
    // ════════════════════════════════════════════════════════
    {
      id:   'mol-transformers',
      name: 'Molecular Transformers',
      desc: 'ChemBERTa and SMILES-based transformer models for molecular property prediction and generation',

      explanation: `
        <p><strong>Molecular transformers</strong> apply the same attention
        mechanism that powers large language models to chemistry. They treat
        SMILES strings as "sentences" and atoms/tokens as "words". Pre-trained
        models like <strong>ChemBERTa</strong> learn molecular grammar from
        millions of SMILES, then fine-tune on specific tasks (solubility,
        toxicity, reaction yield) with far less labelled data.</p>

        <p>The <strong>self-attention</strong> mechanism lets every token attend
        to every other token, capturing long-range dependencies that GNNs with
        limited layers might miss — for example, the relationship between a
        remote electron-withdrawing group and a reaction centre. Transformer
        models can also <strong>generate</strong> novel SMILES by sampling
        token-by-token, enabling molecular design.</p>

        <p>Practical use: <strong>Hugging Face</strong> hosts pre-trained
        chemical transformers. Load with
        <code>AutoModel.from_pretrained('seyonec/ChemBERTa-zinc-base-v1')</code>,
        tokenize SMILES, and extract embeddings or fine-tune a classification
        head. For small datasets (&lt;1k), fingerprint + random forest often
        beats transformers — pre-training helps most when fine-tuning data
        is moderate (1k–100k molecules).</p>
      `,

      code: `<span class="kw">from</span> <span class="nm">transformers</span> <span class="kw">import</span> <span class="fn">AutoTokenizer</span>, <span class="fn">AutoModel</span>
<span class="kw">import</span> <span class="nm">torch</span>

<span class="cm"># Load pre-trained ChemBERTa</span>
<span class="nm">model_name</span> = <span class="st">'seyonec/ChemBERTa-zinc-base-v1'</span>
<span class="nm">tokenizer</span> = <span class="fn">AutoTokenizer</span>.<span class="fn">from_pretrained</span>(<span class="nm">model_name</span>)
<span class="nm">model</span> = <span class="fn">AutoModel</span>.<span class="fn">from_pretrained</span>(<span class="nm">model_name</span>)

<span class="cm"># Tokenize catalyst SMILES</span>
<span class="nm">smiles_list</span> = [
    <span class="st">'c1ccc(P(c2ccccc2)c2ccccc2)cc1'</span>,  <span class="cm"># PPh3</span>
    <span class="st">'CC(C)(C)P(C(C)(C)C)C(C)(C)C'</span>,   <span class="cm"># PtBu3</span>
    <span class="st">'C1CCC(CC1)P(C1CCCCC1)C1CCCCC1'</span>, <span class="cm"># PCy3</span>
]
<span class="nm">tokens</span> = <span class="nm">tokenizer</span>(<span class="nm">smiles_list</span>, <span class="nm">padding</span>=<span class="kw">True</span>,
                   <span class="nm">truncation</span>=<span class="kw">True</span>, <span class="nm">return_tensors</span>=<span class="st">'pt'</span>)

<span class="cm"># Extract molecular embeddings</span>
<span class="nm">model</span>.<span class="fn">eval</span>()
<span class="kw">with</span> <span class="nm">torch</span>.<span class="fn">no_grad</span>():
    <span class="nm">outputs</span> = <span class="nm">model</span>(**<span class="nm">tokens</span>)
    <span class="cm"># CLS token embedding as molecular representation</span>
    <span class="nm">mol_embeddings</span> = <span class="nm">outputs</span>.<span class="nm">last_hidden_state</span>[:, <span class="num">0</span>, :]
<span class="fn">print</span>(<span class="st">f"Embeddings shape: </span>{<span class="nm">mol_embeddings</span>.<span class="nm">shape</span>}<span class="st">"</span>)

<span class="cm"># Use embeddings as features for downstream tasks</span>
<span class="kw">from</span> <span class="nm">sklearn.linear_model</span> <span class="kw">import</span> <span class="fn">Ridge</span>
<span class="nm">X_emb</span> = <span class="nm">mol_embeddings</span>.<span class="fn">numpy</span>()
<span class="nm">y_yield</span> = [<span class="num">72.5</span>, <span class="num">89.1</span>, <span class="num">65.3</span>]  <span class="cm"># reaction yields (%)</span>

<span class="cm"># Cosine similarity between catalyst embeddings</span>
<span class="kw">from</span> <span class="nm">torch.nn.functional</span> <span class="kw">import</span> <span class="fn">cosine_similarity</span>
<span class="nm">sim</span> = <span class="fn">cosine_similarity</span>(<span class="nm">mol_embeddings</span>[<span class="num">0</span>:<span class="num">1</span>], <span class="nm">mol_embeddings</span>[<span class="num">1</span>:])
<span class="fn">print</span>(<span class="st">f"PPh3 vs PtBu3: </span>{<span class="nm">sim</span>[<span class="num">0</span>]<span class="st">:.3f}, PPh3 vs PCy3: </span>{<span class="nm">sim</span>[<span class="num">1</span>]<span class="st">:.3f}"</span>)`,

      cheatsheet: [
        { syn: 'AutoTokenizer.from_pretrained(name)', desc: 'Load SMILES tokenizer for a pre-trained model' },
        { syn: 'AutoModel.from_pretrained(name)', desc: 'Load pre-trained transformer weights' },
        { syn: 'tokenizer(smiles, padding=True, return_tensors="pt")', desc: 'Tokenize batch of SMILES → input_ids + attention_mask' },
        { syn: 'outputs.last_hidden_state[:, 0, :]', desc: 'CLS token embedding — molecular-level representation' },
        { syn: 'outputs.last_hidden_state.mean(dim=1)', desc: 'Mean-pooled embedding — alternative to CLS token' },
        { syn: 'AutoModelForSequenceClassification', desc: 'Transformer with classification head for fine-tuning' },
        { syn: 'cosine_similarity(emb1, emb2)', desc: 'Similarity between molecular embeddings (−1 to +1)' },
        { syn: 'seyonec/ChemBERTa-zinc-base-v1', desc: 'ChemBERTa pre-trained on ZINC (77M SMILES)' },
        { syn: 'model.eval() + torch.no_grad()', desc: 'Inference mode — no gradients, deterministic output' },
        { syn: 'Trainer(model, args, train_dataset)', desc: 'Hugging Face Trainer for fine-tuning with logging' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'When is a fingerprint + random forest likely to outperform ChemBERTa for molecular property prediction?',
          opts: [
            'Always — fingerprints encode more information',
            'When the dataset is very small (<1k molecules) and no relevant pre-training exists',
            'When the molecules contain rare elements',
            'When predicting 3D-dependent properties'
          ],
          answer: 1,
          feedback: 'Pre-trained transformers need moderate fine-tuning data (1k–100k) to outperform classical methods. With <1k molecules, the model cannot adapt its millions of parameters effectively.'
        },
        {
          type: 'fill',
          q: 'Complete the code to extract the CLS token embedding from ChemBERTa output:',
          pre: 'outputs = model(**tokens)\nmol_emb = outputs._____[:, 0, :]',
          answer: 'last_hidden_state',
          feedback: 'last_hidden_state has shape (batch, seq_len, hidden_dim). Index [:, 0, :] selects the CLS token for each molecule.'
        },
        {
          type: 'challenge',
          q: 'Load ChemBERTa, tokenize ["CCO", "CC(=O)O", "c1ccccc1"], extract CLS embeddings, and compute pairwise cosine similarities. Print a 3×3 similarity matrix.',
          hint: 'Use torch.nn.functional.cosine_similarity with proper broadcasting, or loop over pairs.',
          answer: `from transformers import AutoTokenizer, AutoModel
import torch
from torch.nn.functional import cosine_similarity

model_name = 'seyonec/ChemBERTa-zinc-base-v1'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)
smiles = ["CCO", "CC(=O)O", "c1ccccc1"]
tokens = tokenizer(smiles, padding=True, truncation=True, return_tensors='pt')
model.eval()
with torch.no_grad():
    emb = model(**tokens).last_hidden_state[:, 0, :]
for i in range(3):
    sims = [cosine_similarity(emb[i:i+1], emb[j:j+1]).item() for j in range(3)]
    print(f"  {smiles[i]:>12}: {[f'{s:.3f}' for s in sims]}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'ChemBERTa on Hugging Face', url: 'https://huggingface.co/seyonec/ChemBERTa-zinc-base-v1', tag: 'model', tagColor: 'purple' },
        { icon: '📄', title: 'ChemBERTa Paper', url: 'https://arxiv.org/abs/2010.09885', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'Hugging Face Transformers Quick Start', url: 'https://huggingface.co/docs/transformers/quicktour', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  CHEM-ML-PIPELINES
    // ════════════════════════════════════════════════════════
    {
      id:   'chem-ml-pipelines',
      name: 'Chem-ML Pipelines',
      desc: 'End-to-end workflows from SMILES to predictions using DeepChem and scikit-learn',

      explanation: `
        <p>A <strong>chem-ML pipeline</strong> chains together data loading,
        featurisation, splitting, model training, and evaluation into a
        reproducible workflow. <strong>DeepChem</strong> provides high-level
        abstractions: <code>dc.molnet</code> loads benchmark datasets,
        <code>dc.feat</code> computes fingerprints and graph features, and
        <code>dc.models</code> wraps scikit-learn and PyTorch models with
        a unified API.</p>

        <p>A typical pipeline: (1) load SMILES + targets from CSV, (2) featurise
        with <code>CircularFingerprint</code> or <code>MolGraphConvFeaturizer</code>,
        (3) split using <code>ScaffoldSplitter</code> for realistic evaluation,
        (4) train a <code>GCNModel</code> or <code>SklearnModel</code>,
        (5) evaluate with <code>Metric(dc.metrics.mae_score)</code>.</p>

        <p>For production-quality models, add: <strong>hyperparameter tuning</strong>
        (grid/random search over learning rate, hidden size, dropout),
        <strong>early stopping</strong> on validation loss, and
        <strong>ensemble averaging</strong> across random seeds. Always report
        performance on the <strong>scaffold-split test set</strong> — this is
        the number that matters for real-world deployment in catalyst screening
        or drug discovery.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">deepchem</span> <span class="kw">as</span> <span class="nm">dc</span>
<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Load reaction benchmark with SMILES-like catalyst column</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)

<span class="cm"># DeepChem featuriser: circular fingerprints</span>
<span class="nm">featuriser</span> = <span class="nm">dc</span>.<span class="nm">feat</span>.<span class="fn">CircularFingerprint</span>(<span class="nm">size</span>=<span class="num">1024</span>, <span class="nm">radius</span>=<span class="num">2</span>)

<span class="cm"># Build dataset from SMILES + target</span>
<span class="nm">loader</span> = <span class="nm">dc</span>.<span class="nm">data</span>.<span class="fn">CSVLoader</span>(
    <span class="nm">tasks</span>=[<span class="st">'delta_G_act_kcal'</span>],
    <span class="nm">feature_field</span>=<span class="st">'catalyst'</span>,
    <span class="nm">featurizer</span>=<span class="nm">featuriser</span>)
<span class="nm">dataset</span> = <span class="nm">loader</span>.<span class="fn">create_dataset</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="fn">print</span>(<span class="st">f"Dataset: </span>{<span class="fn">len</span>(<span class="nm">dataset</span>)}<span class="st"> samples, X shape: </span>{<span class="nm">dataset</span>.<span class="nm">X</span>.<span class="nm">shape</span>}<span class="st">"</span>)

<span class="cm"># Scaffold split for realistic evaluation</span>
<span class="nm">splitter</span> = <span class="nm">dc</span>.<span class="nm">splits</span>.<span class="fn">ScaffoldSplitter</span>()
<span class="nm">train</span>, <span class="nm">valid</span>, <span class="nm">test</span> = <span class="nm">splitter</span>.<span class="fn">train_valid_test_split</span>(<span class="nm">dataset</span>)
<span class="fn">print</span>(<span class="st">f"Train: </span>{<span class="fn">len</span>(<span class="nm">train</span>)}<span class="st">, Valid: </span>{<span class="fn">len</span>(<span class="nm">valid</span>)}<span class="st">, Test: </span>{<span class="fn">len</span>(<span class="nm">test</span>)}<span class="st">"</span>)

<span class="cm"># Train a random forest via DeepChem</span>
<span class="kw">from</span> <span class="nm">sklearn.ensemble</span> <span class="kw">import</span> <span class="fn">RandomForestRegressor</span>
<span class="nm">sklearn_model</span> = <span class="nm">dc</span>.<span class="nm">models</span>.<span class="fn">SklearnModel</span>(
    <span class="fn">RandomForestRegressor</span>(<span class="nm">n_estimators</span>=<span class="num">100</span>, <span class="nm">random_state</span>=<span class="num">42</span>))
<span class="nm">sklearn_model</span>.<span class="fn">fit</span>(<span class="nm">train</span>)

<span class="cm"># Evaluate with MAE metric</span>
<span class="nm">mae_metric</span> = <span class="nm">dc</span>.<span class="nm">metrics</span>.<span class="fn">Metric</span>(<span class="nm">dc</span>.<span class="nm">metrics</span>.<span class="nm">mae_score</span>)
<span class="nm">train_score</span> = <span class="nm">sklearn_model</span>.<span class="fn">evaluate</span>(<span class="nm">train</span>, [<span class="nm">mae_metric</span>])
<span class="nm">test_score</span> = <span class="nm">sklearn_model</span>.<span class="fn">evaluate</span>(<span class="nm">test</span>, [<span class="nm">mae_metric</span>])
<span class="fn">print</span>(<span class="st">f"Train MAE: </span>{<span class="nm">train_score</span>[<span class="st">'mae_score'</span>]<span class="st">:.2f} kcal/mol"</span>)
<span class="fn">print</span>(<span class="st">f"Test MAE:  </span>{<span class="nm">test_score</span>[<span class="st">'mae_score'</span>]<span class="st">:.2f} kcal/mol"</span>)`,

      cheatsheet: [
        { syn: 'dc.feat.CircularFingerprint(size, radius)', desc: 'Morgan/ECFP featuriser for DeepChem datasets' },
        { syn: 'dc.feat.MolGraphConvFeaturizer()', desc: 'Graph featuriser for GNN models in DeepChem' },
        { syn: 'dc.data.CSVLoader(tasks, feature_field, featurizer)', desc: 'Load CSV with SMILES column → DeepChem dataset' },
        { syn: 'dc.splits.ScaffoldSplitter()', desc: 'Split by Murcko scaffold — realistic evaluation' },
        { syn: 'dc.splits.RandomSplitter()', desc: 'Random split — faster but optimistic' },
        { syn: 'dc.models.SklearnModel(sklearn_model)', desc: 'Wrap any sklearn model for DeepChem pipeline' },
        { syn: 'dc.models.GCNModel()', desc: 'Graph convolutional network in DeepChem' },
        { syn: 'dc.metrics.Metric(dc.metrics.mae_score)', desc: 'Create MAE metric for evaluation' },
        { syn: 'model.evaluate(dataset, metrics)', desc: 'Compute metrics on a dataset — returns dict' },
        { syn: 'dc.molnet.load_qm9()', desc: 'Load QM9 benchmark (134k mols, DFT properties)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why does DeepChem provide ScaffoldSplitter instead of just random splitting?',
          opts: [
            'Scaffold splits are faster to compute',
            'They prevent structurally similar molecules from leaking between train and test',
            'They ensure equal class balance in train and test',
            'They automatically remove duplicate molecules'
          ],
          answer: 1,
          feedback: 'ScaffoldSplitter groups molecules by their Murcko scaffold. Test scaffolds are unseen during training, simulating real discovery where you predict properties of novel structures.'
        },
        {
          type: 'fill',
          q: 'Complete the code to create a DeepChem dataset from a CSV with SMILES in the "catalyst" column:',
          pre: 'loader = dc.data.CSVLoader(\n    tasks=["yield_pct"],\n    feature_field="catalyst",\n    featurizer=featuriser)\ndataset = loader._____(\'reaction_benchmark.csv\')',
          answer: 'create_dataset',
          feedback: 'create_dataset() reads the CSV, applies the featuriser to the SMILES column, and returns a DeepChem DiskDataset with X (features) and y (targets).'
        },
        {
          type: 'challenge',
          q: 'Build a DeepChem pipeline: load reaction_benchmark.csv, featurise the catalyst column with CircularFingerprint (radius=2, size=1024), scaffold-split, train a SklearnModel with Ridge regression, and evaluate MAE on train and test.',
          hint: 'Use dc.data.CSVLoader, dc.splits.ScaffoldSplitter, dc.models.SklearnModel(Ridge()), and dc.metrics.Metric(dc.metrics.mae_score).',
          answer: `import deepchem as dc
from sklearn.linear_model import Ridge

featuriser = dc.feat.CircularFingerprint(size=1024, radius=2)
loader = dc.data.CSVLoader(
    tasks=['delta_G_act_kcal'], feature_field='catalyst',
    featurizer=featuriser)
dataset = loader.create_dataset('reaction_benchmark.csv')
splitter = dc.splits.ScaffoldSplitter()
train, valid, test = splitter.train_valid_test_split(dataset)
model = dc.models.SklearnModel(Ridge(alpha=1.0))
model.fit(train)
metric = dc.metrics.Metric(dc.metrics.mae_score)
print(f"Train MAE: {model.evaluate(train, [metric])['mae_score']:.2f}")
print(f"Test MAE:  {model.evaluate(test, [metric])['mae_score']:.2f}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'DeepChem Documentation', url: 'https://deepchem.readthedocs.io/en/latest/', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'DeepChem Tutorials', url: 'https://deepchem.readthedocs.io/en/latest/get_started/tutorials.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '📄', title: 'MoleculeNet Benchmark', url: 'https://moleculenet.org/', tag: 'benchmark', tagColor: 'orange' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  SAVE-DEPLOY-MODELS
    // ════════════════════════════════════════════════════════
    {
      id:   'save-deploy-models',
      name: 'Save & Deploy Models',
      desc: 'Serialising trained models and building inference APIs for molecular property prediction',

      explanation: `
        <p>After training, you need to <strong>save</strong> the model for
        later use and <strong>deploy</strong> it for batch screening or as an
        API. PyTorch models are saved with
        <code>torch.save(model.state_dict())</code> (weights only) or
        <code>torch.save(model)</code> (full model + architecture). Sklearn
        models use <code>joblib.dump(model, path)</code>.</p>

        <p>For deployment, <strong>ONNX</strong> provides a framework-agnostic
        format: export once, run in any runtime (Python, C++, JavaScript).
        <code>torch.onnx.export(model, dummy_input, path)</code> traces the
        computation graph. For simple REST APIs, <strong>FastAPI</strong> wraps
        your model in an endpoint that accepts SMILES and returns predictions.</p>

        <p>Best practices: always save the <strong>preprocessing pipeline</strong>
        (scaler, featuriser) alongside the model — a model without its scaler is
        useless. Version your models with metadata (training date, dataset hash,
        metrics). For molecular models, include the RDKit version and fingerprint
        parameters to ensure reproducibility.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">torch.nn</span> <span class="kw">as</span> <span class="nm">nn</span>
<span class="kw">import</span> <span class="nm">joblib</span>
<span class="kw">import</span> <span class="nm">json</span>
<span class="kw">from</span> <span class="nm">pathlib</span> <span class="kw">import</span> <span class="nm">Path</span>

<span class="cm"># Save PyTorch model + metadata</span>
<span class="nm">model</span> = <span class="nm">nn</span>.<span class="fn">Sequential</span>(<span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">1024</span>, <span class="num">64</span>), <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">1</span>))
<span class="nm">save_dir</span> = <span class="nm">Path</span>(<span class="st">'models/yield_predictor_v1'</span>)
<span class="nm">save_dir</span>.<span class="fn">mkdir</span>(<span class="nm">parents</span>=<span class="kw">True</span>, <span class="nm">exist_ok</span>=<span class="kw">True</span>)

<span class="cm"># Weights + training metadata</span>
<span class="nm">torch</span>.<span class="fn">save</span>(<span class="nm">model</span>.<span class="fn">state_dict</span>(), <span class="nm">save_dir</span> / <span class="st">'weights.pt'</span>)
<span class="nm">metadata</span> = {
    <span class="st">'architecture'</span>: <span class="st">'MLP(1024→64→1)'</span>,
    <span class="st">'fingerprint'</span>: <span class="st">'Morgan r=2 bits=1024'</span>,
    <span class="st">'test_mae_kcal'</span>: <span class="num">1.82</span>,
    <span class="st">'dataset'</span>: <span class="st">'reaction_benchmark.csv'</span>,
    <span class="st">'split'</span>: <span class="st">'scaffold'</span>,
}
<span class="kw">with</span> <span class="fn">open</span>(<span class="nm">save_dir</span> / <span class="st">'metadata.json'</span>, <span class="st">'w'</span>) <span class="kw">as</span> <span class="nm">f</span>:
    <span class="nm">json</span>.<span class="fn">dump</span>(<span class="nm">metadata</span>, <span class="nm">f</span>, <span class="nm">indent</span>=<span class="num">2</span>)

<span class="cm"># Save sklearn model + scaler together</span>
<span class="kw">from</span> <span class="nm">sklearn.preprocessing</span> <span class="kw">import</span> <span class="fn">StandardScaler</span>
<span class="nm">scaler</span> = <span class="fn">StandardScaler</span>()
<span class="nm">joblib</span>.<span class="fn">dump</span>({<span class="st">'scaler'</span>: <span class="nm">scaler</span>, <span class="st">'model_params'</span>: <span class="nm">metadata</span>},
           <span class="nm">save_dir</span> / <span class="st">'preprocessing.joblib'</span>)

<span class="cm"># Load and run inference</span>
<span class="nm">loaded_model</span> = <span class="nm">nn</span>.<span class="fn">Sequential</span>(<span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">1024</span>, <span class="num">64</span>), <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">1</span>))
<span class="nm">loaded_model</span>.<span class="fn">load_state_dict</span>(<span class="nm">torch</span>.<span class="fn">load</span>(<span class="nm">save_dir</span> / <span class="st">'weights.pt'</span>))
<span class="nm">loaded_model</span>.<span class="fn">eval</span>()

<span class="cm"># Batch prediction on new catalysts</span>
<span class="nm">X_new</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">10</span>, <span class="num">1024</span>)  <span class="cm"># 10 catalyst fingerprints</span>
<span class="kw">with</span> <span class="nm">torch</span>.<span class="fn">no_grad</span>():
    <span class="nm">preds</span> = <span class="nm">loaded_model</span>(<span class="nm">X_new</span>).<span class="fn">squeeze</span>()
<span class="fn">print</span>(<span class="st">f"Predicted yields: </span>{<span class="nm">preds</span>[:<span class="num">3</span>].<span class="fn">tolist</span>()}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'torch.save(model.state_dict(), path)', desc: 'Save model weights (recommended approach)' },
        { syn: 'model.load_state_dict(torch.load(path))', desc: 'Load weights into matching architecture' },
        { syn: 'torch.save(model, path)', desc: 'Save full model (architecture + weights) via pickle' },
        { syn: 'joblib.dump(obj, path)', desc: 'Serialize sklearn model/scaler to disk' },
        { syn: 'joblib.load(path)', desc: 'Load sklearn object from disk' },
        { syn: 'torch.onnx.export(model, dummy, path)', desc: 'Export to ONNX format for cross-platform inference' },
        { syn: 'json.dump(metadata, f, indent=2)', desc: 'Save training metadata alongside model' },
        { syn: 'Path(dir).mkdir(parents=True, exist_ok=True)', desc: 'Create model directory safely' },
        { syn: 'torch.jit.script(model)', desc: 'TorchScript compilation for optimised inference' },
        { syn: 'model.eval() + torch.no_grad()', desc: 'Always set inference mode before predictions' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why should you save the preprocessing pipeline (scaler, featuriser) alongside the model?',
          opts: [
            'It makes the file smaller',
            'Without the same preprocessing, new input data will be on a different scale and predictions will be wrong',
            'It is required by PyTorch',
            'It speeds up inference'
          ],
          answer: 1,
          feedback: 'If you trained with StandardScaler and predict without it, the model receives unscaled values and outputs nonsense. The scaler parameters (mean, std) are part of the trained pipeline.'
        },
        {
          type: 'fill',
          q: 'Complete the code to save a sklearn pipeline with joblib:',
          pre: 'import joblib\npipeline = {"scaler": scaler, "model": model}\njoblib._____(pipeline, "model_pipeline.joblib")',
          answer: 'dump',
          feedback: 'joblib.dump() serialises Python objects efficiently. It handles numpy arrays and sklearn estimators better than pickle.'
        },
        {
          type: 'challenge',
          q: 'Save a PyTorch model (Linear(10,32), ReLU, Linear(32,1)) with its metadata (architecture, test_mae=2.1, dataset="reaction_benchmark.csv") to a directory. Then load it back and verify by running inference on 5 random samples.',
          hint: 'Use torch.save for weights, json.dump for metadata, then torch.load + load_state_dict to restore.',
          answer: `import torch, torch.nn as nn, json
from pathlib import Path

model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 1))
save_dir = Path('models/test_model')
save_dir.mkdir(parents=True, exist_ok=True)
torch.save(model.state_dict(), save_dir / 'weights.pt')
with open(save_dir / 'meta.json', 'w') as f:
    json.dump({'architecture': 'MLP(10→32→1)', 'test_mae': 2.1,
               'dataset': 'reaction_benchmark.csv'}, f)
loaded = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 1))
loaded.load_state_dict(torch.load(save_dir / 'weights.pt'))
loaded.eval()
with torch.no_grad():
    print(loaded(torch.randn(5, 10)).squeeze().tolist())`
        }
      ],

      resources: [
        { icon: '📘', title: 'PyTorch Save/Load Guide', url: 'https://pytorch.org/tutorials/beginner/saving_loading_models.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📄', title: 'ONNX Export Tutorial', url: 'https://pytorch.org/tutorials/beginner/onnx/export_simple_model_to_onnx_tutorial.html', tag: 'tutorial', tagColor: 'green' },
        { icon: '🎓', title: 'FastAPI for ML Deployment', url: 'https://fastapi.tiangolo.com/tutorial/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  UNCERTAINTY-QM
    // ════════════════════════════════════════════════════════
    {
      id:   'uncertainty-qm',
      name: 'Uncertainty Quantification',
      desc: 'Ensemble methods, MC Dropout, and calibration for trustworthy molecular property predictions',

      explanation: `
        <p>A prediction without uncertainty is dangerous in chemistry — acting
        on an overconfident wrong prediction wastes expensive compute or lab time.
        <strong>Uncertainty quantification (UQ)</strong> assigns confidence
        intervals: "ΔG‡ = 15.2 ± 2.1 kcal/mol" tells you whether to trust the
        prediction enough to run the experiment.</p>

        <p><strong>Ensemble methods</strong> train N models with different random
        seeds or data subsets. The mean prediction serves as the estimate; the
        standard deviation across models is the uncertainty. High disagreement
        flags molecules far from the training distribution. <strong>MC Dropout</strong>
        approximates this cheaply: keep dropout active at inference time, run
        T forward passes, and compute mean/variance. No retraining needed.</p>

        <p><strong>Calibration</strong> checks whether predicted uncertainties
        match actual errors: if 95% of true values fall within 95% prediction
        intervals, the model is well-calibrated. Miscalibrated models can be
        adjusted post-hoc with temperature scaling or conformal prediction.
        In active learning, uncertainty guides which molecules to simulate
        next — compute the DFT energy for the molecule your model is most
        uncertain about.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">torch</span>
<span class="kw">import</span> <span class="nm">torch.nn</span> <span class="kw">as</span> <span class="nm">nn</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Model with dropout for MC Dropout uncertainty</span>
<span class="kw">class</span> <span class="fn">MolNetUQ</span>(<span class="nm">nn</span>.<span class="nm">Module</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">n_in</span>=<span class="num">1024</span>, <span class="nm">n_hidden</span>=<span class="num">128</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="nm">self</span>.<span class="nm">net</span> = <span class="nm">nn</span>.<span class="fn">Sequential</span>(
            <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="nm">n_in</span>, <span class="nm">n_hidden</span>), <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">Dropout</span>(<span class="num">0.2</span>),
            <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="nm">n_hidden</span>, <span class="nm">n_hidden</span>), <span class="nm">nn</span>.<span class="fn">ReLU</span>(), <span class="nm">nn</span>.<span class="fn">Dropout</span>(<span class="num">0.2</span>),
            <span class="nm">nn</span>.<span class="fn">Linear</span>(<span class="nm">n_hidden</span>, <span class="num">1</span>),
        )

    <span class="kw">def</span> <span class="fn">forward</span>(<span class="nm">self</span>, <span class="nm">x</span>):
        <span class="kw">return</span> <span class="nm">self</span>.<span class="nm">net</span>(<span class="nm">x</span>).<span class="fn">squeeze</span>(-<span class="num">1</span>)

<span class="cm"># MC Dropout: run T stochastic forward passes</span>
<span class="kw">def</span> <span class="fn">mc_dropout_predict</span>(<span class="nm">model</span>, <span class="nm">X</span>, <span class="nm">T</span>=<span class="num">50</span>):
    <span class="nm">model</span>.<span class="fn">train</span>()  <span class="cm"># keep dropout active!</span>
    <span class="nm">preds</span> = <span class="nm">torch</span>.<span class="fn">stack</span>([<span class="nm">model</span>(<span class="nm">X</span>) <span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">T</span>)])
    <span class="nm">mean</span> = <span class="nm">preds</span>.<span class="fn">mean</span>(<span class="nm">dim</span>=<span class="num">0</span>)
    <span class="nm">std</span> = <span class="nm">preds</span>.<span class="fn">std</span>(<span class="nm">dim</span>=<span class="num">0</span>)
    <span class="kw">return</span> <span class="nm">mean</span>.<span class="fn">detach</span>(), <span class="nm">std</span>.<span class="fn">detach</span>()

<span class="cm"># Predict with uncertainty</span>
<span class="nm">model</span> = <span class="fn">MolNetUQ</span>()
<span class="nm">X_test</span> = <span class="nm">torch</span>.<span class="fn">randn</span>(<span class="num">5</span>, <span class="num">1024</span>)  <span class="cm"># 5 catalyst fingerprints</span>
<span class="nm">means</span>, <span class="nm">stds</span> = <span class="fn">mc_dropout_predict</span>(<span class="nm">model</span>, <span class="nm">X_test</span>, <span class="nm">T</span>=<span class="num">50</span>)

<span class="fn">print</span>(<span class="st">"Predictions with uncertainty:"</span>)
<span class="kw">for</span> <span class="nm">i</span>, (<span class="nm">m</span>, <span class="nm">s</span>) <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="fn">zip</span>(<span class="nm">means</span>, <span class="nm">stds</span>)):
    <span class="fn">print</span>(<span class="st">f"  Mol </span>{<span class="nm">i</span>}<span class="st">: ΔG‡ = </span>{<span class="nm">m</span><span class="st">:.2f} ± </span>{<span class="nm">s</span><span class="st">:.2f} kcal/mol"</span>)

<span class="cm"># Flag high-uncertainty molecules for DFT calculation</span>
<span class="nm">threshold</span> = <span class="nm">stds</span>.<span class="fn">median</span>() * <span class="num">1.5</span>
<span class="nm">uncertain</span> = (<span class="nm">stds</span> > <span class="nm">threshold</span>).<span class="fn">nonzero</span>().<span class="fn">squeeze</span>()
<span class="fn">print</span>(<span class="st">f"High-uncertainty indices: </span>{<span class="nm">uncertain</span>.<span class="fn">tolist</span>()}<span class="st">"</span>)`,

      cheatsheet: [
        { syn: 'model.train()  # at inference time', desc: 'MC Dropout: keep dropout active for stochastic predictions' },
        { syn: 'torch.stack([model(X) for _ in range(T)])', desc: 'Run T forward passes, stack into (T, N) tensor' },
        { syn: 'preds.mean(dim=0), preds.std(dim=0)', desc: 'Mean = prediction, std = uncertainty estimate' },
        { syn: 'Ensemble: train N models', desc: 'Train with different seeds — most reliable UQ method' },
        { syn: 'ensemble_std = np.std(all_preds, axis=0)', desc: 'Standard deviation across ensemble members' },
        { syn: 'calibration: coverage at 95% CI', desc: 'Check if 95% of true values fall within predicted ±1.96σ' },
        { syn: 'temperature scaling', desc: 'Post-hoc calibration: adjust σ → σ/T to match coverage' },
        { syn: 'conformal prediction', desc: 'Distribution-free uncertainty with guaranteed coverage' },
        { syn: 'active learning: query = argmax(std)', desc: 'Select most uncertain molecule for next DFT calculation' },
        { syn: 'epistemic vs aleatoric', desc: 'Epistemic: model uncertainty (reducible). Aleatoric: data noise (irreducible)' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'In active learning for catalyst screening, which molecule should you compute DFT energy for next?',
          opts: [
            'The molecule with the lowest predicted ΔG‡',
            'A random molecule from the candidate pool',
            'The molecule with the highest prediction uncertainty',
            'The molecule most similar to the training set'
          ],
          answer: 2,
          feedback: 'Active learning queries the most uncertain prediction — adding its true value to the training set reduces model uncertainty the most, improving predictions for similar molecules.'
        },
        {
          type: 'fill',
          q: 'Complete the MC Dropout prediction to get uncertainty estimates:',
          pre: 'model.train()  # keep dropout active\npreds = torch.stack([model(X) for _ in range(50)])\nmean = preds.mean(dim=0)\nstd = preds._____(dim=0)',
          answer: 'std',
          feedback: 'preds.std(dim=0) computes the standard deviation across the 50 stochastic forward passes for each sample — this is the MC Dropout uncertainty estimate.'
        },
        {
          type: 'challenge',
          q: 'Implement MC Dropout uncertainty: create a model with Dropout(0.3), generate 5 random fingerprints (1024-d), run 100 stochastic forward passes, and print mean ± std for each molecule. Identify which molecule has the highest uncertainty.',
          hint: 'Use model.train() to keep dropout active. torch.stack the 100 predictions, then compute mean/std along dim=0.',
          answer: `import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(1024, 64), nn.ReLU(), nn.Dropout(0.3),
    nn.Linear(64, 32), nn.ReLU(), nn.Dropout(0.3),
    nn.Linear(32, 1))
X = torch.randn(5, 1024)
model.train()
preds = torch.stack([model(X).squeeze() for _ in range(100)])
mean, std = preds.mean(dim=0), preds.std(dim=0)
for i, (m, s) in enumerate(zip(mean, std)):
    print(f"Mol {i}: {m:.3f} ± {s:.3f} kcal/mol")
print(f"Most uncertain: Mol {std.argmax().item()}")`
        },
        {
          type: 'challenge',
          q: 'Build a 3-model ensemble: train 3 instances of a simple MLP (Linear(5,32), ReLU, Linear(32,1)) on the same synthetic data but with different random seeds. Predict on test data, compute ensemble mean and std, and print results.',
          hint: 'Use torch.manual_seed(seed) before creating each model. Collect predictions in a list, stack, then compute statistics.',
          answer: `import torch
import torch.nn as nn

X_train = torch.randn(100, 5)
y_train = 2 * X_train[:, 0] - X_train[:, 2] + torch.randn(100) * 0.5
X_test = torch.randn(10, 5)
all_preds = []
for seed in [0, 1, 2]:
    torch.manual_seed(seed)
    m = nn.Sequential(nn.Linear(5, 32), nn.ReLU(), nn.Linear(32, 1))
    opt = torch.optim.Adam(m.parameters(), lr=0.01)
    for _ in range(100):
        loss = nn.L1Loss()(m(X_train).squeeze(), y_train)
        opt.zero_grad(); loss.backward(); opt.step()
    m.eval()
    with torch.no_grad():
        all_preds.append(m(X_test).squeeze())
preds = torch.stack(all_preds)
for i in range(10):
    print(f"Mol {i}: {preds[:,i].mean():.2f} ± {preds[:,i].std():.2f}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'MC Dropout Paper (Gal & Ghahramani)', url: 'https://arxiv.org/abs/1506.02142', tag: 'paper', tagColor: 'purple' },
        { icon: '📄', title: 'Uncertainty in Molecular ML', url: 'https://pubs.acs.org/doi/10.1021/acs.jcim.9b00975', tag: 'paper', tagColor: 'purple' },
        { icon: '🎓', title: 'Active Learning for Chemistry', url: 'https://pubs.acs.org/doi/10.1021/acs.chemrev.1c00033', tag: 'review', tagColor: 'orange' },
      ]
    },

  ],
};
