/**
 * data/ml/02-data-prep.js
 * Stage 02: Data & Preprocessing
 * Topics: numpy-ml,pandas-ml,feature-scaling,encoding,train-test-split
 *
 * All examples use reaction_benchmark.csv and compchem context.
 * Code line limits: ML 1-4 = 20–50 lines per topic.
 */

window.ML_S2 = {
  id: 'ml-s2', num: '02', title: 'Data & Preprocessing',
  color: 'orange', meta: '~1 week', track: 'ml',
  topics: [

    // ════════════════════════════════════════════════════════
    //  NUMPY-ML
    // ════════════════════════════════════════════════════════
    {
      id:   'numpy-ml',
      name: 'NumPy for ML',
      desc: 'Array operations for feature matrices, vectorized math, and broadcasting in ML pipelines',

      explanation: `
        <p>In machine learning, data lives in <strong>feature matrices</strong>:
        2D arrays where each row is a sample (molecule) and each column is a
        feature (molecular weight, LogP, HOMO energy). NumPy's ndarray is the
        standard container. An (n_samples, n_features) array is your X matrix;
        the target values form a 1D y vector.</p>

        <p><strong>Vectorized operations</strong> replace explicit loops:
        <code>X * 627.509</code> converts an entire column of energies without
        a for loop. <strong>Broadcasting</strong> lets you subtract a per-feature
        mean from the entire matrix in one line:
        <code>X - X.mean(axis=0)</code>. These patterns are 10–100× faster than
        Python loops and are the foundation of efficient ML preprocessing.</p>

        <p><strong>Random number generation</strong> with <code>np.random</code>
        creates train/test splits, initializes model weights, and adds noise for
        data augmentation. Always set a <strong>random seed</strong>
        (<code>np.random.seed(42)</code>) for reproducibility — essential in
        scientific computing where results must be verifiable.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Feature matrix: 5 molecules × 3 features</span>
<span class="cm"># [mol_weight, logP, homo_energy_eV]</span>
<span class="nm">X</span> = <span class="nm">np</span>.<span class="fn">array</span>([
    [<span class="num">18.015</span>, <span class="num">-1.38</span>, <span class="num">-12.62</span>],  <span class="cm"># H2O</span>
    [<span class="num">16.043</span>, <span class="num">0.65</span>,  <span class="num">-13.60</span>],  <span class="cm"># CH4</span>
    [<span class="num">44.010</span>, <span class="num">0.83</span>,  <span class="num">-13.78</span>],  <span class="cm"># CO2</span>
    [<span class="num">17.031</span>, <span class="num">-1.38</span>, <span class="num">-10.82</span>],  <span class="cm"># NH3</span>
    [<span class="num">30.070</span>, <span class="num">1.81</span>,  <span class="num">-12.50</span>],  <span class="cm"># C2H6</span>
])
<span class="nm">y</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">-76.40</span>, <span class="num">-40.52</span>, <span class="num">-188.58</span>, <span class="num">-56.55</span>, <span class="num">-79.73</span>])  <span class="cm"># energies</span>

<span class="cm"># Vectorized: center features (zero mean per column)</span>
<span class="nm">X_centered</span> = <span class="nm">X</span> <span class="op">-</span> <span class="nm">X</span>.<span class="fn">mean</span>(<span class="nm">axis</span>=<span class="num">0</span>)  <span class="cm"># broadcasting: (5,3) - (3,)</span>

<span class="cm"># Scale to unit variance</span>
<span class="nm">X_scaled</span> = <span class="nm">X_centered</span> <span class="op">/</span> <span class="nm">X</span>.<span class="fn">std</span>(<span class="nm">axis</span>=<span class="num">0</span>)

<span class="cm"># Boolean masking: select molecules with logP > 0</span>
<span class="nm">mask</span> = <span class="nm">X</span>[:, <span class="num">1</span>] <span class="op">></span> <span class="num">0</span>  <span class="cm"># logP column</span>
<span class="nm">X_hydrophobic</span> = <span class="nm">X</span>[<span class="nm">mask</span>]

<span class="cm"># Random split: shuffle indices reproducibly</span>
<span class="nm">np</span>.<span class="nm">random</span>.<span class="fn">seed</span>(<span class="num">42</span>)
<span class="nm">indices</span> = <span class="nm">np</span>.<span class="nm">random</span>.<span class="fn">permutation</span>(<span class="fn">len</span>(<span class="nm">X</span>))
<span class="nm">split</span> = <span class="fn">int</span>(<span class="num">0.8</span> <span class="op">*</span> <span class="fn">len</span>(<span class="nm">X</span>))
<span class="nm">train_idx</span>, <span class="nm">test_idx</span> = <span class="nm">indices</span>[:<span class="nm">split</span>], <span class="nm">indices</span>[<span class="nm">split</span>:]

<span class="cm"># Correlation matrix: which features correlate?</span>
<span class="nm">corr</span> = <span class="nm">np</span>.<span class="fn">corrcoef</span>(<span class="nm">X</span>.<span class="nm">T</span>)  <span class="cm"># (3,3) correlation matrix</span>
<span class="fn">print</span>(<span class="st">f"Feature correlations:\\n<span class="nm">{corr.round(2)}</span>"</span>)`,

      cheatsheet: [
        { syn: 'X.shape → (n_samples, n_features)',   desc: 'Feature matrix dimensions' },
        { syn: 'X.mean(axis=0)',                       desc: 'Per-feature mean (column-wise)' },
        { syn: 'X - X.mean(axis=0)',                   desc: 'Center features via broadcasting' },
        { syn: 'X[:, i]',                              desc: 'Select column i (one feature for all samples)' },
        { syn: 'X[mask]',                              desc: 'Boolean indexing — filter rows' },
        { syn: 'np.random.seed(42)',                   desc: 'Set seed for reproducible randomness' },
        { syn: 'np.random.permutation(n)',             desc: 'Random shuffle of indices 0..n-1' },
        { syn: 'np.corrcoef(X.T)',                     desc: 'Correlation matrix between features' },
        { syn: 'np.concatenate([A, B], axis=1)',       desc: 'Stack features side by side' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'What does <code>X - X.mean(axis=0)</code> do when X has shape (100, 5)?',
          opts: [
            'Subtracts the global mean from every element',
            'Subtracts each column\'s mean from that column (centering features)',
            'Subtracts each row\'s mean from that row',
            'Returns a single number'
          ],
          answer: 1,
          feedback: '<code>axis=0</code> computes the mean down each column, producing a (5,) vector. Broadcasting subtracts each feature\'s mean from its column, centering the data.'
        },
        {
          type: 'fill',
          q: 'Set a random seed for reproducible data splitting:',
          pre: 'np.random.___(42)',
          answer: 'seed',
          feedback: 'Setting <code>np.random.seed(42)</code> ensures the same random split every run — essential for reproducible scientific results.'
        },
        {
          type: 'challenge',
          q: 'Load <code>reaction_benchmark.csv</code> with pandas, extract the numerical columns (delta_G_act_kcal, delta_G_rxn_kcal, temperature_K, yield_pct) as a NumPy feature matrix X. Center and scale each feature to zero mean and unit variance manually (no sklearn). Verify that each column has mean ≈ 0 and std ≈ 1.',
          hint: 'X_scaled = (X - X.mean(axis=0)) / X.std(axis=0). Check with X_scaled.mean(axis=0) and X_scaled.std(axis=0).',
          answer: `import pandas as pd
import numpy as np

df = pd.read_csv("datasets/reaction_benchmark.csv")
cols = ["delta_G_act_kcal", "delta_G_rxn_kcal", "temperature_K", "yield_pct"]
X = df[cols].values  # (100, 4) NumPy array

X_scaled = (X - X.mean(axis=0)) / X.std(axis=0)
print("Means:", X_scaled.mean(axis=0).round(10))  # ~0
print("Stds:", X_scaled.std(axis=0).round(10))     # ~1`
        }
      ],

      resources: [
        { icon: '📘', title: 'NumPy for ML — Quickstart', url: 'https://numpy.org/doc/stable/user/quickstart.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'CS231n NumPy Tutorial', url: 'https://cs231n.github.io/python-numpy-tutorial/', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  PANDAS-ML
    // ════════════════════════════════════════════════════════
    {
      id:   'pandas-ml',
      name: 'Pandas for ML',
      desc: 'Loading, exploring, and preparing reaction benchmark data for modeling',

      explanation: `
        <p>Pandas is the first tool you reach for when starting an ML project.
        <code>pd.read_csv()</code> loads your reaction benchmark data,
        <code>.describe()</code> gives summary statistics, <code>.info()</code>
        shows types and missing values, and <code>.corr()</code> reveals feature
        correlations — all before writing a single line of model code.</p>

        <p><strong>Exploratory data analysis</strong> (EDA) prevents garbage-in,
        garbage-out. Check for <strong>missing values</strong>
        (<code>df.isna().sum()</code>), <strong>duplicate rows</strong>
        (<code>df.duplicated()</code>), and <strong>outliers</strong> via
        percentiles or IQR. For reaction data, verify that energies are in
        expected ranges (ΔG‡ > 0, yields 0–100%) and that categorical columns
        (solvent, method) have consistent spellings.</p>

        <p>Prepare features for ML by separating <strong>X</strong> (features)
        and <strong>y</strong> (target). Use <code>.values</code> or
        <code>.to_numpy()</code> to convert to NumPy arrays that sklearn expects.
        Handle missing data with <code>.dropna()</code> or <code>.fillna()</code>
        — but always understand <em>why</em> data is missing before choosing a
        strategy.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="cm"># Load reaction benchmark dataset</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">"datasets/reaction_benchmark.csv"</span>)
<span class="fn">print</span>(<span class="nm">df</span>.<span class="fn">shape</span>)       <span class="cm"># (100, 10)</span>
<span class="fn">print</span>(<span class="nm">df</span>.<span class="fn">info</span>())      <span class="cm"># types, non-null counts</span>
<span class="fn">print</span>(<span class="nm">df</span>.<span class="fn">describe</span>())  <span class="cm"># summary stats for numerical cols</span>

<span class="cm"># Check for missing values</span>
<span class="fn">print</span>(<span class="nm">df</span>.<span class="fn">isna</span>().<span class="fn">sum</span>())

<span class="cm"># Explore target distribution</span>
<span class="fn">print</span>(<span class="st">f"Yield range: <span class="nm">{df['yield_pct'].min():.0f}</span>–<span class="nm">{df['yield_pct'].max():.0f}</span>%"</span>)

<span class="cm"># Feature correlations</span>
<span class="nm">num_cols</span> = [<span class="st">"delta_G_act_kcal"</span>, <span class="st">"delta_G_rxn_kcal"</span>, <span class="st">"temperature_K"</span>, <span class="st">"yield_pct"</span>]
<span class="fn">print</span>(<span class="nm">df</span>[<span class="nm">num_cols</span>].<span class="fn">corr</span>().<span class="fn">round</span>(<span class="num">2</span>))

<span class="cm"># Separate features (X) and target (y)</span>
<span class="nm">feature_cols</span> = [<span class="st">"delta_G_act_kcal"</span>, <span class="st">"delta_G_rxn_kcal"</span>, <span class="st">"temperature_K"</span>]
<span class="nm">X</span> = <span class="nm">df</span>[<span class="nm">feature_cols</span>].<span class="fn">values</span>    <span class="cm"># → NumPy (100, 3)</span>
<span class="nm">y</span> = <span class="nm">df</span>[<span class="st">"yield_pct"</span>].<span class="fn">values</span>      <span class="cm"># → NumPy (100,)</span>

<span class="cm"># Filter: only converged calculations</span>
<span class="nm">df_good</span> = <span class="nm">df</span>.<span class="fn">query</span>(<span class="st">"converged == True"</span>).<span class="fn">copy</span>()

<span class="cm"># Value counts for categorical columns</span>
<span class="fn">print</span>(<span class="nm">df</span>[<span class="st">"solvent"</span>].<span class="fn">value_counts</span>())
<span class="fn">print</span>(<span class="nm">df</span>[<span class="st">"metal"</span>].<span class="fn">value_counts</span>())`,

      cheatsheet: [
        { syn: 'df.shape',                       desc: '(n_rows, n_cols) — dataset dimensions' },
        { syn: 'df.info()',                       desc: 'Column types, non-null counts, memory usage' },
        { syn: 'df.describe()',                   desc: 'Summary statistics for numerical columns' },
        { syn: 'df.isna().sum()',                 desc: 'Count missing values per column' },
        { syn: 'df[cols].corr()',                 desc: 'Correlation matrix between features' },
        { syn: 'df[cols].values',                 desc: 'Convert DataFrame columns to NumPy array' },
        { syn: 'df["col"].value_counts()',        desc: 'Count unique values in a categorical column' },
        { syn: 'df.query("col > val")',           desc: 'Filter rows with a string expression' },
        { syn: 'df.dropna() / df.fillna(val)',    desc: 'Handle missing data — drop or fill' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Before building an ML model, why should you check <code>df.isna().sum()</code>?',
          opts: [
            'To count the total number of rows',
            'To verify the DataFrame has the right column types',
            'To identify missing values that could cause errors or biased models',
            'To check if the data is already normalized'
          ],
          answer: 2,
          feedback: 'Missing values (NaN) can cause sklearn models to crash or produce biased results. Identifying them first lets you choose the right handling strategy (drop, fill, or impute).'
        },
        {
          type: 'fill',
          q: 'Convert a DataFrame\'s feature columns to a NumPy array for sklearn:',
          pre: 'X = df[feature_cols].___',
          answer: 'values',
          feedback: '<code>.values</code> (or <code>.to_numpy()</code>) converts DataFrame columns to a NumPy ndarray that scikit-learn expects as input.'
        },
        {
          type: 'challenge',
          q: 'Load <code>reaction_benchmark.csv</code>. Perform EDA: (1) print shape and column types, (2) check for missing values, (3) compute the correlation between delta_G_act_kcal and yield_pct, (4) group by solvent and show the mean yield for each. Then prepare X (numerical features) and y (yield_pct) as NumPy arrays, filtering to only converged rows.',
          hint: 'Use df.info(), df.isna().sum(), df[cols].corr(), df.groupby("solvent")["yield_pct"].mean().',
          answer: `import pandas as pd

df = pd.read_csv("datasets/reaction_benchmark.csv")

# EDA
print(df.shape)
print(df.dtypes)
print("Missing:", df.isna().sum().sum())
print("Barrier-yield corr:", df["delta_G_act_kcal"].corr(df["yield_pct"]).round(3))
print(df.groupby("solvent")["yield_pct"].mean().round(1))

# Prepare ML data
df_conv = df.query("converged == True")
feature_cols = ["delta_G_act_kcal", "delta_G_rxn_kcal", "temperature_K"]
X = df_conv[feature_cols].values
y = df_conv["yield_pct"].values
print(f"X: {X.shape}, y: {y.shape}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Kaggle Pandas Course', url: 'https://www.kaggle.com/learn/pandas', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  FEATURE-SCALING
    // ════════════════════════════════════════════════════════
    {
      id:   'feature-scaling',
      name: 'Feature Scaling',
      desc: 'Standardization and normalization for consistent model training',

      explanation: `
        <p><strong>Feature scaling</strong> ensures all features have comparable
        magnitudes. Without it, a temperature column (200–500 K) would dominate
        a barrier column (5–25 kcal/mol) in distance-based models (KNN, SVM) and
        gradient descent would zigzag inefficiently. Most ML algorithms benefit
        from scaled features.</p>

        <p><strong>StandardScaler</strong> (z-score normalization) transforms each
        feature to zero mean and unit variance: z = (x − μ) / σ. This is the
        default choice for most models. <strong>MinMaxScaler</strong> maps features
        to [0, 1]: x' = (x − min) / (max − min). Use this when you need bounded
        values (e.g., neural network inputs).</p>

        <p>Critical rule: <strong>fit on training data only</strong>, then
        <code>transform</code> both train and test. If you fit the scaler on the
        entire dataset before splitting, test data statistics leak into training
        — this is <strong>data leakage</strong>, one of the most common ML
        mistakes. Scikit-learn's <code>Pipeline</code> prevents this by
        encapsulating preprocessing with the model.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">sklearn.preprocessing</span> <span class="kw">import</span> <span class="nm">StandardScaler</span>, <span class="nm">MinMaxScaler</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> <span class="fn">train_test_split</span>

<span class="cm"># Sample reaction data: [barrier_kcal, temperature_K, delta_G_rxn]</span>
<span class="nm">X</span> = <span class="nm">np</span>.<span class="fn">array</span>([
    [<span class="num">15.3</span>, <span class="num">298</span>, <span class="num">-5.2</span>], [<span class="num">8.7</span>, <span class="num">350</span>, <span class="num">-12.1</span>],
    [<span class="num">22.1</span>, <span class="num">250</span>, <span class="num">3.4</span>],  [<span class="num">12.5</span>, <span class="num">400</span>, <span class="num">-8.7</span>],
    [<span class="num">18.9</span>, <span class="num">300</span>, <span class="num">-1.5</span>], [<span class="num">10.2</span>, <span class="num">375</span>, <span class="num">-15.3</span>],
    [<span class="num">25.0</span>, <span class="num">275</span>, <span class="num">6.1</span>],  [<span class="num">7.8</span>, <span class="num">325</span>, <span class="num">-9.8</span>],
])
<span class="nm">y</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">45</span>, <span class="num">82</span>, <span class="num">23</span>, <span class="num">67</span>, <span class="num">38</span>, <span class="num">75</span>, <span class="num">15</span>, <span class="num">88</span>])

<span class="cm"># Split FIRST, then scale — prevents data leakage</span>
<span class="nm">X_train</span>, <span class="nm">X_test</span>, <span class="nm">y_train</span>, <span class="nm">y_test</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">test_size</span>=<span class="num">0.25</span>, <span class="nm">random_state</span>=<span class="num">42</span>)

<span class="cm"># StandardScaler: z = (x - μ) / σ</span>
<span class="nm">scaler</span> = <span class="fn">StandardScaler</span>()
<span class="nm">X_train_sc</span> = <span class="nm">scaler</span>.<span class="fn">fit_transform</span>(<span class="nm">X_train</span>)  <span class="cm"># fit on train</span>
<span class="nm">X_test_sc</span>  = <span class="nm">scaler</span>.<span class="fn">transform</span>(<span class="nm">X_test</span>)        <span class="cm"># transform test</span>

<span class="fn">print</span>(<span class="st">f"Train mean: <span class="nm">{X_train_sc.mean(axis=0).round(2)}</span>"</span>)  <span class="cm"># [0, 0, 0]</span>
<span class="fn">print</span>(<span class="st">f"Train std:  <span class="nm">{X_train_sc.std(axis=0).round(2)}</span>"</span>)   <span class="cm"># [1, 1, 1]</span>

<span class="cm"># MinMaxScaler: scale to [0, 1]</span>
<span class="nm">mm_scaler</span> = <span class="fn">MinMaxScaler</span>()
<span class="nm">X_train_mm</span> = <span class="nm">mm_scaler</span>.<span class="fn">fit_transform</span>(<span class="nm">X_train</span>)
<span class="fn">print</span>(<span class="st">f"Min: <span class="nm">{X_train_mm.min(axis=0)}</span>, Max: <span class="nm">{X_train_mm.max(axis=0)}</span>"</span>)`,

      cheatsheet: [
        { syn: 'StandardScaler()',                   desc: 'z-score: (x − μ) / σ → mean=0, std=1' },
        { syn: 'MinMaxScaler()',                     desc: 'Scale to [0, 1]: (x − min) / (max − min)' },
        { syn: 'scaler.fit_transform(X_train)',      desc: 'Compute stats + transform training data' },
        { syn: 'scaler.transform(X_test)',           desc: 'Apply same scaling to test data' },
        { syn: 'RobustScaler()',                     desc: 'Uses median/IQR — robust to outliers' },
        { syn: 'scaler.inverse_transform(X_sc)',     desc: 'Convert scaled values back to original units' },
        { syn: 'Fit on train only',                  desc: 'Prevents data leakage from test set' },
        { syn: 'Pipeline([scaler, model])',          desc: 'Encapsulate scaling + model in one object' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why must you fit the scaler on training data only?',
          opts: [
            'The scaler runs faster on smaller datasets',
            'Test data statistics would leak into training, giving overly optimistic results',
            'Scikit-learn requires separate scaler objects for train and test',
            'Scaling the test set is optional'
          ],
          answer: 1,
          feedback: 'If the scaler sees test data during fitting, the model indirectly uses test statistics during training — this is data leakage, leading to overestimated accuracy.'
        },
        {
          type: 'fill',
          q: 'Apply the trained scaler to the test set without refitting:',
          pre: 'X_test_scaled = scaler.___(X_test)',
          answer: 'transform',
          feedback: 'Use <code>.transform()</code> (not <code>fit_transform</code>) on test data so it uses the training set\'s mean and std.'
        },
        {
          type: 'challenge',
          q: 'Load <code>reaction_benchmark.csv</code>, split into 80/20 train/test (random_state=42), and apply StandardScaler to numerical features. Verify: (1) train features have mean ≈ 0 and std ≈ 1, (2) test features have non-zero mean (they use train stats). Print both.',
          hint: 'Split first, then fit_transform on train, transform on test. Check mean(axis=0) for both.',
          answer: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

df = pd.read_csv("datasets/reaction_benchmark.csv")
features = ["delta_G_act_kcal", "delta_G_rxn_kcal", "temperature_K"]
X = df[features].values
y = df["yield_pct"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc = scaler.transform(X_test)

print("Train mean:", X_train_sc.mean(axis=0).round(6))  # ~0
print("Test mean:", X_test_sc.mean(axis=0).round(3))     # non-zero`
        }
      ],

      resources: [
        { icon: '📘', title: 'sklearn Preprocessing', url: 'https://scikit-learn.org/stable/modules/preprocessing.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Feature Scaling Guide', url: 'https://scikit-learn.org/stable/auto_examples/preprocessing/plot_all_scaling.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  ENCODING
    // ════════════════════════════════════════════════════════
    {
      id:   'encoding',
      name: 'Encoding Categorical Features',
      desc: 'Converting solvents, metals, and ligand types to numerical features',

      explanation: `
        <p>ML models require numerical inputs, but chemical data has
        <strong>categorical features</strong>: solvent names, metal centers,
        ligand types, and DFT methods. <strong>Encoding</strong> converts these
        to numbers. The wrong encoding introduces artificial ordering that
        misleads the model.</p>

        <p><strong>One-hot encoding</strong> creates a binary column for each
        category: solvent "THF" becomes [1, 0, 0], "water" becomes [0, 1, 0].
        This is the default for <strong>nominal</strong> (unordered) categories.
        <strong>Label encoding</strong> assigns integers (THF=0, water=1,
        toluene=2) — only appropriate for <strong>ordinal</strong> categories
        where the order matters (e.g., basis set quality: STO-3G < def2-SVP <
        def2-TZVP).</p>

        <p>Watch for the <strong>dummy variable trap</strong>: with k categories,
        you need k-1 one-hot columns (use <code>drop='first'</code>). For
        <strong>high-cardinality</strong> features (many unique values), consider
        target encoding or embeddings instead of one-hot, which creates too many
        sparse features.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">from</span> <span class="nm">sklearn.preprocessing</span> <span class="kw">import</span> <span class="nm">OneHotEncoder</span>, <span class="nm">LabelEncoder</span>, <span class="nm">OrdinalEncoder</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>

<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">"datasets/reaction_benchmark.csv"</span>)

<span class="cm"># Pandas get_dummies: quick one-hot encoding</span>
<span class="nm">df_encoded</span> = <span class="nm">pd</span>.<span class="fn">get_dummies</span>(<span class="nm">df</span>, <span class="nm">columns</span>=[<span class="st">"solvent"</span>, <span class="st">"metal"</span>], <span class="nm">drop_first</span>=<span class="kw">True</span>)
<span class="fn">print</span>(<span class="nm">df_encoded</span>.<span class="nm">columns</span>.<span class="fn">tolist</span>())

<span class="cm"># sklearn OneHotEncoder: fit/transform pattern</span>
<span class="nm">ohe</span> = <span class="fn">OneHotEncoder</span>(<span class="nm">sparse_output</span>=<span class="kw">False</span>, <span class="nm">drop</span>=<span class="st">"first"</span>)
<span class="nm">solvent_encoded</span> = <span class="nm">ohe</span>.<span class="fn">fit_transform</span>(<span class="nm">df</span>[[<span class="st">"solvent"</span>]])
<span class="fn">print</span>(<span class="st">f"One-hot shape: <span class="nm">{solvent_encoded.shape}</span>"</span>)
<span class="fn">print</span>(<span class="st">f"Categories: <span class="nm">{ohe.categories_[0]}</span>"</span>)

<span class="cm"># Ordinal encoding: basis set quality has natural order</span>
<span class="nm">basis_sets</span> = [[<span class="st">"STO-3G"</span>], [<span class="st">"def2-SVP"</span>], [<span class="st">"def2-TZVP"</span>], [<span class="st">"def2-SVP"</span>]]
<span class="nm">oe</span> = <span class="fn">OrdinalEncoder</span>(<span class="nm">categories</span>=[[<span class="st">"STO-3G"</span>, <span class="st">"def2-SVP"</span>, <span class="st">"def2-TZVP"</span>]])
<span class="nm">basis_encoded</span> = <span class="nm">oe</span>.<span class="fn">fit_transform</span>(<span class="nm">basis_sets</span>)
<span class="fn">print</span>(<span class="nm">basis_encoded</span>.<span class="fn">ravel</span>())  <span class="cm"># [0, 1, 2, 1]</span>

<span class="cm"># Combine numerical + encoded features</span>
<span class="nm">num_features</span> = <span class="nm">df</span>[[<span class="st">"delta_G_act_kcal"</span>, <span class="st">"temperature_K"</span>]].<span class="fn">values</span>
<span class="nm">X_combined</span> = <span class="nm">np</span>.<span class="fn">hstack</span>([<span class="nm">num_features</span>, <span class="nm">solvent_encoded</span>])
<span class="fn">print</span>(<span class="st">f"Combined features: <span class="nm">{X_combined.shape}</span>"</span>)`,

      cheatsheet: [
        { syn: 'pd.get_dummies(df, columns=[...])',    desc: 'Quick one-hot encoding via pandas' },
        { syn: 'OneHotEncoder(drop="first")',          desc: 'sklearn one-hot — drop one to avoid collinearity' },
        { syn: 'OrdinalEncoder(categories=[[...]])',   desc: 'Encode with explicit ordering (basis set quality)' },
        { syn: 'LabelEncoder()',                       desc: 'Encode target labels as integers' },
        { syn: 'ohe.categories_',                      desc: 'Access learned category names' },
        { syn: 'sparse_output=False',                  desc: 'Return dense array instead of sparse matrix' },
        { syn: 'np.hstack([num, encoded])',            desc: 'Combine numerical and encoded features' },
        { syn: 'ohe.inverse_transform(X)',             desc: 'Convert encoded values back to categories' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'When should you use ordinal encoding instead of one-hot encoding?',
          opts: [
            'When there are too many categories to display',
            'When the categories have a natural order (e.g., basis set quality)',
            'When you want faster model training',
            'Ordinal encoding is always preferred'
          ],
          answer: 1,
          feedback: 'Ordinal encoding assigns increasing integers that imply order: STO-3G=0 < def2-SVP=1 < def2-TZVP=2. One-hot is better for unordered categories like solvent names.'
        },
        {
          type: 'fill',
          q: 'One-hot encode the "solvent" column, dropping one category to avoid collinearity:',
          pre: 'encoded = pd.get_dummies(df, columns=["solvent"], ___=True)',
          answer: 'drop_first',
          feedback: '<code>drop_first=True</code> removes the first category column. With k categories, k-1 columns are sufficient (the missing one is implied when all others are 0).'
        },
        {
          type: 'challenge',
          q: 'Load <code>reaction_benchmark.csv</code>. One-hot encode "solvent" and "ligand_type" using sklearn\'s OneHotEncoder. Combine with the numerical columns (delta_G_act_kcal, delta_G_rxn_kcal, temperature_K) into a single feature matrix. Print the final shape and first row.',
          hint: 'Use OneHotEncoder on categorical columns, then np.hstack with numerical columns.',
          answer: `import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder

df = pd.read_csv("datasets/reaction_benchmark.csv")

ohe = OneHotEncoder(sparse_output=False, drop="first")
cat_encoded = ohe.fit_transform(df[["solvent", "ligand_type"]])

num_cols = ["delta_G_act_kcal", "delta_G_rxn_kcal", "temperature_K"]
X_num = df[num_cols].values

X = np.hstack([X_num, cat_encoded])
print(f"Shape: {X.shape}")
print(f"First row: {X[0]}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'sklearn Encoding', url: 'https://scikit-learn.org/stable/modules/preprocessing.html#encoding-categorical-features', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'Kaggle Feature Engineering', url: 'https://www.kaggle.com/learn/feature-engineering', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  TRAIN-TEST-SPLIT
    // ════════════════════════════════════════════════════════
    {
      id:   'train-test-split',
      name: 'Train-Test Split',
      desc: 'Proper data partitioning to evaluate generalization on unseen molecules',

      explanation: `
        <p>Evaluating a model on the same data it trained on gives a
        <strong>misleadingly high accuracy</strong>. A <strong>train-test split</strong>
        reserves a portion (typically 20%) of data for evaluation. The model never
        sees test data during training, so test performance estimates how well it
        will generalize to new, unseen molecules.</p>

        <p>Use <code>train_test_split(X, y, test_size=0.2, random_state=42)</code>
        for a simple split. <strong>Stratification</strong>
        (<code>stratify=y_binned</code>) ensures each split has the same
        distribution of target values — critical when categories are imbalanced.
        For small datasets, use <strong>k-fold cross-validation</strong> instead
        of a single split to get a more robust estimate.</p>

        <p>In chemistry, <strong>random splits can be deceptive</strong>. If your
        training set includes conformers A, B, C of the same molecule, and the
        test set has conformer D, the model memorizes the molecule, not chemistry.
        <strong>Scaffold splits</strong> (group by molecular scaffold) and
        <strong>temporal splits</strong> (train on older data, test on newer)
        give more realistic estimates of how well your model generalizes to truly
        novel chemistry.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> (
    <span class="fn">train_test_split</span>, <span class="nm">KFold</span>, <span class="nm">StratifiedKFold</span>, <span class="nm">GroupKFold</span>
)

<span class="cm"># Basic 80/20 split</span>
<span class="nm">X</span> = <span class="nm">np</span>.<span class="nm">random</span>.<span class="fn">randn</span>(<span class="num">100</span>, <span class="num">5</span>)  <span class="cm"># 100 molecules, 5 features</span>
<span class="nm">y</span> = <span class="nm">np</span>.<span class="nm">random</span>.<span class="fn">randn</span>(<span class="num">100</span>)       <span class="cm"># target energies</span>

<span class="nm">X_train</span>, <span class="nm">X_test</span>, <span class="nm">y_train</span>, <span class="nm">y_test</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
<span class="fn">print</span>(<span class="st">f"Train: <span class="nm">{X_train.shape[0]}</span>, Test: <span class="nm">{X_test.shape[0]}</span>"</span>)

<span class="cm"># K-Fold cross-validation: more robust than single split</span>
<span class="nm">kf</span> = <span class="fn">KFold</span>(<span class="nm">n_splits</span>=<span class="num">5</span>, <span class="nm">shuffle</span>=<span class="kw">True</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
<span class="kw">for</span> <span class="nm">fold</span>, (<span class="nm">train_idx</span>, <span class="nm">val_idx</span>) <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="nm">kf</span>.<span class="fn">split</span>(<span class="nm">X</span>)):
    <span class="fn">print</span>(<span class="st">f"Fold <span class="nm">{fold}</span>: train=<span class="nm">{len(train_idx)}</span>, val=<span class="nm">{len(val_idx)}</span>"</span>)

<span class="cm"># GroupKFold: ensure same molecule's conformers stay together</span>
<span class="nm">groups</span> = <span class="nm">np</span>.<span class="fn">array</span>([<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">2</span>,<span class="num">2</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">3</span>] <span class="op">*</span> <span class="num">10</span>)  <span class="cm"># molecule ID</span>
<span class="nm">gkf</span> = <span class="fn">GroupKFold</span>(<span class="nm">n_splits</span>=<span class="num">4</span>)
<span class="kw">for</span> <span class="nm">train_idx</span>, <span class="nm">val_idx</span> <span class="kw">in</span> <span class="nm">gkf</span>.<span class="fn">split</span>(<span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">groups</span>=<span class="nm">groups</span>):
    <span class="nm">train_groups</span> = <span class="fn">set</span>(<span class="nm">groups</span>[<span class="nm">train_idx</span>])
    <span class="nm">val_groups</span>   = <span class="fn">set</span>(<span class="nm">groups</span>[<span class="nm">val_idx</span>])
    <span class="kw">assert</span> <span class="fn">len</span>(<span class="nm">train_groups</span> <span class="op">&</span> <span class="nm">val_groups</span>) <span class="op">==</span> <span class="num">0</span>  <span class="cm"># no overlap!</span>

<span class="cm"># Stratified split: preserve target distribution</span>
<span class="nm">y_class</span> = (<span class="nm">y</span> <span class="op">></span> <span class="nm">y</span>.<span class="fn">mean</span>()).<span class="fn">astype</span>(<span class="bi">int</span>)  <span class="cm"># binarize</span>
<span class="nm">X_tr</span>, <span class="nm">X_te</span>, <span class="nm">y_tr</span>, <span class="nm">y_te</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y_class</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">stratify</span>=<span class="nm">y_class</span>, <span class="nm">random_state</span>=<span class="num">42</span>)`,

      cheatsheet: [
        { syn: 'train_test_split(X, y, test_size=0.2)', desc: 'Random 80/20 split' },
        { syn: 'random_state=42',                       desc: 'Reproducible split — same result every run' },
        { syn: 'stratify=y',                             desc: 'Preserve class distribution in both splits' },
        { syn: 'KFold(n_splits=5)',                      desc: '5-fold cross-validation splitter' },
        { syn: 'GroupKFold()',                            desc: 'Groups (molecules) never split across folds' },
        { syn: 'StratifiedKFold()',                      desc: 'K-fold with balanced class proportions' },
        { syn: 'LeaveOneGroupOut()',                     desc: 'Leave one molecule out for validation' },
        { syn: 'Scaffold split',                         desc: 'Group by molecular scaffold — tests generalization' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why might a random train-test split overestimate model performance on molecular data?',
          opts: [
            'Random splits are always unreliable',
            'Conformers of the same molecule could appear in both sets, letting the model memorize rather than generalize',
            'Random splits don\'t shuffle the data enough',
            'Test sets are always too small'
          ],
          answer: 1,
          feedback: 'If conformers of molecule X are in both train and test, the model learns molecule X\'s identity rather than generalizable chemistry. GroupKFold or scaffold splits prevent this.'
        },
        {
          type: 'fill',
          q: 'Ensure that molecule groups don\'t leak across train and test:',
          pre: 'gkf = ___(n_splits=5)\nfor train_idx, val_idx in gkf.split(X, y, groups=mol_ids):',
          answer: 'GroupKFold',
          feedback: '<code>GroupKFold</code> ensures that all samples with the same group (molecule) are either all in train or all in validation — never split across.'
        },
        {
          type: 'challenge',
          q: 'Load <code>reaction_benchmark.csv</code>. Perform three types of splits: (1) random 80/20, (2) stratified by catalyst type, and (3) GroupKFold with 5 folds using "catalyst" as the group. For each, print the number of unique catalysts in train vs. test. Show that only GroupKFold guarantees no catalyst overlap.',
          hint: 'For stratified, use stratify=df["catalyst"]. For GroupKFold, pass groups=df["catalyst"].',
          answer: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GroupKFold

df = pd.read_csv("datasets/reaction_benchmark.csv")
X = df[["delta_G_act_kcal", "temperature_K"]].values
y = df["yield_pct"].values

# 1. Random split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
idx_tr, idx_te = df.index[:len(y_tr)], df.index[len(y_tr):]

# 2. GroupKFold — no catalyst overlap
gkf = GroupKFold(n_splits=5)
for fold, (tr, te) in enumerate(gkf.split(X, y, groups=df["catalyst"])):
    tr_cats = set(df["catalyst"].iloc[tr])
    te_cats = set(df["catalyst"].iloc[te])
    overlap = tr_cats & te_cats
    print(f"Fold {fold}: train={len(tr_cats)} cats, test={len(te_cats)} cats, overlap={len(overlap)}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'sklearn Cross-Validation', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', tag: 'docs', tagColor: 'blue' },
        { icon: '📗', title: 'ML Best Practices for Chemistry', url: 'https://pubs.acs.org/doi/10.1021/acs.jcim.2c01625', tag: 'paper', tagColor: 'purple' },
      ]
    },

  ],
};
