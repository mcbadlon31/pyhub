/**
 * data/ml/03-classical-ml.js
 * Stage 03: Classical ML
 * Topics: linear-regression,logistic-regression,decision-trees,random-forests,svm,kmeans,model-evaluation
 *
 * All examples use reaction_benchmark.csv and compchem context.
 * Code line limits: ML 1-4 = 20–50 lines per topic.
 */

window.ML_S3 = {
  id: 'ml-s3', num: '03', title: 'Classical ML',
  color: 'red', meta: '~3 weeks', track: 'ml',
  topics: [

    // ════════════════════════════════════════════════════════
    //  LINEAR-REGRESSION
    // ════════════════════════════════════════════════════════
    {
      id:   'linear-regression',
      name: 'Linear Regression',
      desc: 'Predict continuous targets like activation energies and reaction yields with OLS and Ridge regression',

      explanation: `
        <p><strong>Linear regression</strong> models the relationship between
        features X and a continuous target y as <code>y = Xw + b</code>, where
        w are learned weights and b is the intercept. In computational chemistry,
        this maps molecular descriptors (HOMO–LUMO gap, temperature, metal
        electronegativity) to quantities like ΔG‡ or reaction yield.</p>

        <p><strong>Ordinary Least Squares (OLS)</strong> minimises the sum of
        squared residuals. When features are correlated — common in chemical
        descriptor sets — <strong>Ridge regression</strong> adds an L2 penalty
        <code>α‖w‖²</code> that shrinks coefficients and reduces overfitting.
        <strong>Lasso</strong> uses an L1 penalty that drives some weights to
        zero, performing automatic feature selection.</p>

        <p>Key metrics for regression: <strong>R²</strong> (fraction of variance
        explained, 1.0 = perfect), <strong>MAE</strong> (mean absolute error in
        physical units like kcal/mol), and <strong>RMSE</strong> (penalises large
        errors more). Always evaluate on a <strong>held-out test set</strong> —
        a model that memorises training energies but fails on new molecules is
        useless for screening.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">sklearn.linear_model</span> <span class="kw">import</span> <span class="fn">LinearRegression</span>, <span class="fn">Ridge</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> <span class="fn">train_test_split</span>
<span class="kw">from</span> <span class="nm">sklearn.metrics</span> <span class="kw">import</span> <span class="fn">mean_absolute_error</span>, <span class="fn">r2_score</span>

<span class="cm"># Load reaction benchmark data</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="nm">features</span> = [<span class="st">'delta_G_rxn_kcal'</span>, <span class="st">'temperature_K'</span>]
<span class="nm">X</span> = <span class="nm">df</span>[<span class="nm">features</span>].<span class="nm">values</span>
<span class="nm">y</span> = <span class="nm">df</span>[<span class="st">'delta_G_act_kcal'</span>].<span class="nm">values</span>

<span class="cm"># Train / test split (80/20)</span>
<span class="nm">X_train</span>, <span class="nm">X_test</span>, <span class="nm">y_train</span>, <span class="nm">y_test</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">random_state</span>=<span class="num">42</span>)

<span class="cm"># OLS regression</span>
<span class="nm">ols</span> = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(<span class="nm">X_train</span>, <span class="nm">y_train</span>)
<span class="nm">y_pred</span> = <span class="nm">ols</span>.<span class="fn">predict</span>(<span class="nm">X_test</span>)
<span class="fn">print</span>(<span class="st">f"OLS  R²=</span>{<span class="fn">r2_score</span>(<span class="nm">y_test</span>, <span class="nm">y_pred</span>)<span class="st">:.3f}"</span>)
<span class="fn">print</span>(<span class="st">f"OLS MAE=</span>{<span class="fn">mean_absolute_error</span>(<span class="nm">y_test</span>, <span class="nm">y_pred</span>)<span class="st">:.2f} kcal/mol"</span>)

<span class="cm"># Ridge regression (L2 regularisation)</span>
<span class="nm">ridge</span> = <span class="fn">Ridge</span>(<span class="nm">alpha</span>=<span class="num">1.0</span>).<span class="fn">fit</span>(<span class="nm">X_train</span>, <span class="nm">y_train</span>)
<span class="nm">y_ridge</span> = <span class="nm">ridge</span>.<span class="fn">predict</span>(<span class="nm">X_test</span>)
<span class="fn">print</span>(<span class="st">f"Ridge R²=</span>{<span class="fn">r2_score</span>(<span class="nm">y_test</span>, <span class="nm">y_ridge</span>)<span class="st">:.3f}"</span>)

<span class="cm"># Inspect learned coefficients</span>
<span class="kw">for</span> <span class="nm">name</span>, <span class="nm">coef</span> <span class="kw">in</span> <span class="fn">zip</span>(<span class="nm">features</span>, <span class="nm">ols</span>.<span class="nm">coef_</span>):
    <span class="fn">print</span>(<span class="st">f"  </span>{<span class="nm">name</span>}<span class="st">: </span>{<span class="nm">coef</span><span class="st">:.4f}"</span>)`,

      cheatsheet: [
        { syn: 'LinearRegression()', desc: 'Create OLS regressor — minimises sum of squared residuals' },
        { syn: 'Ridge(alpha=1.0)', desc: 'L2-regularised regression — alpha controls penalty strength' },
        { syn: 'Lasso(alpha=0.1)', desc: 'L1-regularised regression — drives some coefficients to zero' },
        { syn: 'model.fit(X_train, y_train)', desc: 'Train model on feature matrix X and target vector y' },
        { syn: 'model.predict(X_test)', desc: 'Generate predictions for new samples' },
        { syn: 'model.coef_', desc: 'Array of learned feature weights after fitting' },
        { syn: 'model.intercept_', desc: 'Learned bias term (y-intercept)' },
        { syn: 'r2_score(y_true, y_pred)', desc: 'Coefficient of determination — 1.0 is perfect' },
        { syn: 'mean_absolute_error()', desc: 'Average absolute difference in original units (kcal/mol)' },
        { syn: 'mean_squared_error()', desc: 'Average squared error — penalises outliers more' },
        { syn: 'np.sqrt(MSE)', desc: 'RMSE — root mean squared error in original units' },
        { syn: 'cross_val_score(model, X, y, cv=5)', desc: 'K-fold cross-validation scores' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'A linear model predicting ΔG‡ (kcal/mol) gives R²=0.92 on training data but R²=0.41 on test data. What is the most likely problem?',
          opts: [
            'The model is underfitting — too few features',
            'The model is overfitting — memorising training data',
            'The target variable needs log-transformation',
            'The test set is too large'
          ],
          answer: 1,
          feedback: 'A large gap between train and test R² is the hallmark of overfitting. Ridge/Lasso regularisation or reducing features can help.'
        },
        {
          type: 'fill',
          q: 'Complete the code to create a Ridge regression model with regularisation strength 0.5:',
          pre: 'from sklearn.linear_model import Ridge\nmodel = _____(alpha=0.5)',
          answer: 'Ridge',
          feedback: 'Ridge(alpha=0.5) creates an L2-regularised linear model. Higher alpha means stronger regularisation.'
        },
        {
          type: 'challenge',
          q: 'Load reaction_benchmark.csv, use delta_G_rxn_kcal and temperature_K as features to predict yield_pct. Compare OLS vs Ridge (alpha=1.0) using MAE on a 20% test set. Print both MAE values.',
          hint: 'Use train_test_split with random_state=42, then fit both LinearRegression() and Ridge(alpha=1.0).',
          answer: `import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

df = pd.read_csv('reaction_benchmark.csv')
X = df[['delta_G_rxn_kcal', 'temperature_K']].values
y = df['yield_pct'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

ols = LinearRegression().fit(X_train, y_train)
ridge = Ridge(alpha=1.0).fit(X_train, y_train)
print(f"OLS MAE:   {mean_absolute_error(y_test, ols.predict(X_test)):.2f}%")
print(f"Ridge MAE: {mean_absolute_error(y_test, ridge.predict(X_test)):.2f}%")`
        }
      ],

      resources: [
        { icon: '📘', title: 'scikit-learn Linear Models Guide', url: 'https://scikit-learn.org/stable/modules/linear_model.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'StatQuest: Linear Regression', url: 'https://www.youtube.com/watch?v=PaFPbb66DxQ', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'Ridge vs Lasso Explained', url: 'https://scikit-learn.org/stable/auto_examples/linear_model/plot_ridge_path.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  LOGISTIC-REGRESSION
    // ════════════════════════════════════════════════════════
    {
      id:   'logistic-regression',
      name: 'Logistic Regression',
      desc: 'Binary and multi-class classification for reaction convergence, selectivity, and catalyst success',

      explanation: `
        <p><strong>Logistic regression</strong> predicts the probability that a
        sample belongs to a class. Despite the name, it is a <strong>classification</strong>
        algorithm: it applies a sigmoid function to a linear combination of features,
        squashing the output to [0, 1]. In compchem, typical targets include
        "did this DFT calculation converge?" or "is the yield above 80%?".</p>

        <p>The model is trained by maximising <strong>log-likelihood</strong>
        (equivalently, minimising cross-entropy loss). The <code>C</code> parameter
        controls regularisation — smaller C means stronger regularisation. For
        multi-class problems (e.g., predicting solvent category), scikit-learn
        automatically uses the <strong>one-vs-rest</strong> or <strong>multinomial</strong>
        strategy.</p>

        <p>Classification metrics differ from regression: <strong>accuracy</strong>
        (fraction correct), <strong>precision</strong> (of predicted positives, how
        many are truly positive), <strong>recall</strong> (of actual positives, how
        many were found), and <strong>F1</strong> (harmonic mean of precision and
        recall). For imbalanced classes — common when most reactions converge —
        accuracy alone is misleading; use F1 or the confusion matrix.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">from</span> <span class="nm">sklearn.linear_model</span> <span class="kw">import</span> <span class="fn">LogisticRegression</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> <span class="fn">train_test_split</span>
<span class="kw">from</span> <span class="nm">sklearn.metrics</span> <span class="kw">import</span> <span class="fn">accuracy_score</span>, <span class="fn">classification_report</span>
<span class="kw">from</span> <span class="nm">sklearn.preprocessing</span> <span class="kw">import</span> <span class="fn">StandardScaler</span>

<span class="cm"># Load and prepare binary target: did the reaction converge?</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="nm">X</span> = <span class="nm">df</span>[[<span class="st">'delta_G_act_kcal'</span>, <span class="st">'delta_G_rxn_kcal'</span>, <span class="st">'temperature_K'</span>]].<span class="nm">values</span>
<span class="nm">y</span> = <span class="nm">df</span>[<span class="st">'converged'</span>].<span class="fn">astype</span>(<span class="bi">int</span>).<span class="nm">values</span>

<span class="cm"># Scale features — logistic regression is sensitive to magnitude</span>
<span class="nm">scaler</span> = <span class="fn">StandardScaler</span>()
<span class="nm">X_train</span>, <span class="nm">X_test</span>, <span class="nm">y_train</span>, <span class="nm">y_test</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
<span class="nm">X_train</span> = <span class="nm">scaler</span>.<span class="fn">fit_transform</span>(<span class="nm">X_train</span>)
<span class="nm">X_test</span> = <span class="nm">scaler</span>.<span class="fn">transform</span>(<span class="nm">X_test</span>)

<span class="cm"># Train classifier</span>
<span class="nm">clf</span> = <span class="fn">LogisticRegression</span>(<span class="nm">C</span>=<span class="num">1.0</span>, <span class="nm">max_iter</span>=<span class="num">200</span>)
<span class="nm">clf</span>.<span class="fn">fit</span>(<span class="nm">X_train</span>, <span class="nm">y_train</span>)
<span class="nm">y_pred</span> = <span class="nm">clf</span>.<span class="fn">predict</span>(<span class="nm">X_test</span>)

<span class="cm"># Evaluate</span>
<span class="fn">print</span>(<span class="st">f"Accuracy: </span>{<span class="fn">accuracy_score</span>(<span class="nm">y_test</span>, <span class="nm">y_pred</span>)<span class="st">:.2%}"</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(<span class="nm">y_test</span>, <span class="nm">y_pred</span>,
      <span class="nm">target_names</span>=[<span class="st">'not converged'</span>, <span class="st">'converged'</span>]))

<span class="cm"># Predicted probability for first test molecule</span>
<span class="nm">prob</span> = <span class="nm">clf</span>.<span class="fn">predict_proba</span>(<span class="nm">X_test</span>[:<span class="num">1</span>])
<span class="fn">print</span>(<span class="st">f"P(converge)=</span>{<span class="nm">prob</span>[<span class="num">0</span>, <span class="num">1</span>]<span class="st">:.3f}"</span>)`,

      cheatsheet: [
        { syn: 'LogisticRegression(C=1.0)', desc: 'Create classifier — C controls inverse regularisation strength' },
        { syn: 'clf.fit(X_train, y_train)', desc: 'Train on labelled data (binary or multi-class)' },
        { syn: 'clf.predict(X_test)', desc: 'Return predicted class labels (0 or 1)' },
        { syn: 'clf.predict_proba(X_test)', desc: 'Return class probabilities — shape (n, n_classes)' },
        { syn: 'clf.coef_', desc: 'Feature weights — positive = pushes toward class 1' },
        { syn: 'accuracy_score(y_true, y_pred)', desc: 'Fraction of correct predictions' },
        { syn: 'classification_report()', desc: 'Precision, recall, F1 per class in a formatted table' },
        { syn: 'confusion_matrix(y_true, y_pred)', desc: '2×2 matrix of TP, FP, FN, TN counts' },
        { syn: 'f1_score(y_true, y_pred)', desc: 'Harmonic mean of precision and recall' },
        { syn: 'roc_auc_score(y_true, y_prob)', desc: 'Area under ROC curve — 1.0 is perfect ranking' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'A model classifying DFT convergence gives 95% accuracy on an imbalanced dataset where 93% of reactions converge. What is the best next metric to check?',
          opts: [
            'R² score',
            'Mean absolute error',
            'F1 score for the "not converged" class',
            'Training loss'
          ],
          answer: 2,
          feedback: 'With 93% converged, a naive "always predict converged" model gets 93% accuracy. F1 for the minority class reveals whether the model actually learned to identify failures.'
        },
        {
          type: 'fill',
          q: 'Complete the code to get the predicted probability of convergence for a molecule:',
          pre: 'probs = clf._____(X_new)\nprint(f"P(converge) = {probs[0, 1]:.3f}")',
          answer: 'predict_proba',
          feedback: 'predict_proba() returns an (n_samples, n_classes) array. Column 1 is the probability of the positive class.'
        },
        {
          type: 'challenge',
          q: 'Build a logistic regression classifier to predict whether a reaction converges using delta_G_act_kcal, delta_G_rxn_kcal, and temperature_K from reaction_benchmark.csv. Scale features with StandardScaler. Print the classification report with target_names.',
          hint: 'Remember to fit the scaler on training data only, then transform both train and test sets.',
          answer: `import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

df = pd.read_csv('reaction_benchmark.csv')
X = df[['delta_G_act_kcal', 'delta_G_rxn_kcal', 'temperature_K']].values
y = df['converged'].astype(int).values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
clf = LogisticRegression(C=1.0, max_iter=200).fit(X_train, y_train)
print(classification_report(y_test, clf.predict(X_test),
      target_names=['not converged', 'converged']))`
        }
      ],

      resources: [
        { icon: '📘', title: 'scikit-learn Logistic Regression', url: 'https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'StatQuest: Logistic Regression', url: 'https://www.youtube.com/watch?v=yIYKR4sgzI8', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'Classification Metrics Explained', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  DECISION-TREES
    // ════════════════════════════════════════════════════════
    {
      id:   'decision-trees',
      name: 'Decision Trees',
      desc: 'Interpretable tree-based models for predicting reaction outcomes and understanding feature importance',

      explanation: `
        <p>A <strong>decision tree</strong> recursively splits data on feature
        thresholds to create a flowchart of if/else decisions. For example:
        "If ΔG‡ &lt; 15 kcal/mol AND temperature &gt; 350 K → predict high yield."
        Trees are popular in chemistry because they are <strong>inherently
        interpretable</strong> — you can trace exactly why a prediction was made.</p>

        <p>At each node the tree picks the split that maximises information gain
        (classification) or minimises variance (regression). Without constraints,
        trees grow until every leaf is pure — <strong>overfitting</strong> badly.
        Key hyperparameters to control this: <code>max_depth</code> (tree height),
        <code>min_samples_leaf</code> (minimum molecules per leaf), and
        <code>min_samples_split</code> (minimum to attempt a split).</p>

        <p><strong>Feature importance</strong> from
        <code>tree.feature_importances_</code> tells you which descriptors drive
        predictions. In a reaction yield model, you might discover that
        temperature_K dominates while solvent has minimal effect — valuable
        chemical insight from a simple model.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">from</span> <span class="nm">sklearn.tree</span> <span class="kw">import</span> <span class="fn">DecisionTreeRegressor</span>, <span class="fn">export_text</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> <span class="fn">train_test_split</span>
<span class="kw">from</span> <span class="nm">sklearn.metrics</span> <span class="kw">import</span> <span class="fn">mean_absolute_error</span>

<span class="cm"># Predict activation energy from reaction features</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="nm">features</span> = [<span class="st">'delta_G_rxn_kcal'</span>, <span class="st">'temperature_K'</span>, <span class="st">'yield_pct'</span>]
<span class="nm">X</span> = <span class="nm">df</span>[<span class="nm">features</span>].<span class="nm">values</span>
<span class="nm">y</span> = <span class="nm">df</span>[<span class="st">'delta_G_act_kcal'</span>].<span class="nm">values</span>

<span class="nm">X_train</span>, <span class="nm">X_test</span>, <span class="nm">y_train</span>, <span class="nm">y_test</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">random_state</span>=<span class="num">42</span>)

<span class="cm"># Constrained tree to prevent overfitting</span>
<span class="nm">tree</span> = <span class="fn">DecisionTreeRegressor</span>(
    <span class="nm">max_depth</span>=<span class="num">4</span>, <span class="nm">min_samples_leaf</span>=<span class="num">5</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
<span class="nm">tree</span>.<span class="fn">fit</span>(<span class="nm">X_train</span>, <span class="nm">y_train</span>)

<span class="cm"># Evaluate</span>
<span class="nm">y_pred</span> = <span class="nm">tree</span>.<span class="fn">predict</span>(<span class="nm">X_test</span>)
<span class="fn">print</span>(<span class="st">f"MAE: </span>{<span class="fn">mean_absolute_error</span>(<span class="nm">y_test</span>, <span class="nm">y_pred</span>)<span class="st">:.2f} kcal/mol"</span>)

<span class="cm"># Feature importance — which descriptors matter most?</span>
<span class="kw">for</span> <span class="nm">name</span>, <span class="nm">imp</span> <span class="kw">in</span> <span class="fn">zip</span>(<span class="nm">features</span>, <span class="nm">tree</span>.<span class="nm">feature_importances_</span>):
    <span class="fn">print</span>(<span class="st">f"  </span>{<span class="nm">name</span>:<span class="num">20</span>}<span class="st">: </span>{<span class="nm">imp</span><span class="st">:.3f}"</span>)

<span class="cm"># Print human-readable tree rules</span>
<span class="fn">print</span>(<span class="fn">export_text</span>(<span class="nm">tree</span>, <span class="nm">feature_names</span>=<span class="nm">features</span>, <span class="nm">max_depth</span>=<span class="num">2</span>))`,

      cheatsheet: [
        { syn: 'DecisionTreeClassifier()', desc: 'Tree for classification — splits on Gini or entropy' },
        { syn: 'DecisionTreeRegressor()', desc: 'Tree for regression — splits to minimise MSE' },
        { syn: 'max_depth=4', desc: 'Limit tree height to prevent overfitting' },
        { syn: 'min_samples_leaf=5', desc: 'Each leaf must have ≥ 5 samples' },
        { syn: 'min_samples_split=10', desc: 'Need ≥ 10 samples to attempt a split' },
        { syn: 'tree.feature_importances_', desc: 'Array of feature importance scores (sum to 1.0)' },
        { syn: 'export_text(tree, feature_names)', desc: 'Print human-readable decision rules' },
        { syn: 'plot_tree(tree, feature_names)', desc: 'Visualise tree structure with matplotlib' },
        { syn: 'tree.get_depth()', desc: 'Return actual depth of the fitted tree' },
        { syn: 'tree.get_n_leaves()', desc: 'Return number of leaf nodes' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'A decision tree with max_depth=None trained on 100 reactions gives MAE=0.01 kcal/mol on training data but MAE=5.2 kcal/mol on test data. What should you do?',
          opts: [
            'Add more features',
            'Reduce max_depth and increase min_samples_leaf',
            'Remove the test set and train on all data',
            'Switch to a linear model'
          ],
          answer: 1,
          feedback: 'The huge train/test gap indicates severe overfitting. Constraining tree depth and leaf size forces the tree to generalise rather than memorise each training molecule.'
        },
        {
          type: 'fill',
          q: 'Complete the code to extract feature importance from a fitted tree:',
          pre: 'importances = tree._____\nfor name, imp in zip(features, importances):\n    print(f"{name}: {imp:.3f}")',
          answer: 'feature_importances_',
          feedback: 'feature_importances_ is a NumPy array with one value per feature, summing to 1.0.'
        },
        {
          type: 'challenge',
          q: 'Train a DecisionTreeRegressor (max_depth=3) to predict yield_pct from delta_G_act_kcal, delta_G_rxn_kcal, and temperature_K. Print the MAE and the top feature by importance.',
          hint: 'Use np.argmax(tree.feature_importances_) to find the index of the most important feature.',
          answer: `import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

df = pd.read_csv('reaction_benchmark.csv')
features = ['delta_G_act_kcal', 'delta_G_rxn_kcal', 'temperature_K']
X = df[features].values
y = df['yield_pct'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
tree = DecisionTreeRegressor(max_depth=3, random_state=42).fit(X_train, y_train)
print(f"MAE: {mean_absolute_error(y_test, tree.predict(X_test)):.2f}%")
top = features[np.argmax(tree.feature_importances_)]
print(f"Top feature: {top}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'scikit-learn Decision Trees', url: 'https://scikit-learn.org/stable/modules/tree.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'StatQuest: Decision Trees', url: 'https://www.youtube.com/watch?v=7VeUPuFGJHk', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'Tree Visualisation Tutorial', url: 'https://scikit-learn.org/stable/auto_examples/tree/plot_unveil_tree_structure.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  RANDOM-FORESTS
    // ════════════════════════════════════════════════════════
    {
      id:   'random-forests',
      name: 'Random Forests',
      desc: 'Ensemble of decision trees for robust predictions of reaction energies and molecular properties',

      explanation: `
        <p>A <strong>random forest</strong> trains many decision trees on random
        subsets of the data (bagging) and random subsets of features, then
        averages their predictions (regression) or takes a majority vote
        (classification). This <strong>ensemble</strong> approach dramatically
        reduces overfitting compared to a single tree while keeping the
        ability to capture non-linear relationships.</p>

        <p>Key hyperparameters: <code>n_estimators</code> (number of trees —
        more is better but slower), <code>max_features</code> (features
        considered per split — <code>'sqrt'</code> for classification,
        <code>1.0</code> or <code>'sqrt'</code> for regression), and the same
        tree constraints (<code>max_depth</code>, <code>min_samples_leaf</code>).
        Random forests are a <strong>strong baseline</strong> in cheminformatics
        for predicting reaction yields, binding affinities, and material properties.</p>

        <p><strong>Out-of-bag (OOB) score</strong> provides a free validation
        estimate: each tree is evaluated on the ~37% of samples it never saw
        during training. Set <code>oob_score=True</code> to get this without a
        separate validation set — especially useful when data is scarce, as
        with expensive DFT calculations.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">sklearn.ensemble</span> <span class="kw">import</span> <span class="fn">RandomForestRegressor</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> <span class="fn">train_test_split</span>
<span class="kw">from</span> <span class="nm">sklearn.metrics</span> <span class="kw">import</span> <span class="fn">mean_absolute_error</span>, <span class="fn">r2_score</span>

<span class="cm"># Predict activation energy with an ensemble</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="nm">features</span> = [<span class="st">'delta_G_rxn_kcal'</span>, <span class="st">'temperature_K'</span>, <span class="st">'yield_pct'</span>]
<span class="nm">X</span> = <span class="nm">df</span>[<span class="nm">features</span>].<span class="nm">values</span>
<span class="nm">y</span> = <span class="nm">df</span>[<span class="st">'delta_G_act_kcal'</span>].<span class="nm">values</span>

<span class="nm">X_train</span>, <span class="nm">X_test</span>, <span class="nm">y_train</span>, <span class="nm">y_test</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">random_state</span>=<span class="num">42</span>)

<span class="cm"># Train random forest with OOB scoring</span>
<span class="nm">rf</span> = <span class="fn">RandomForestRegressor</span>(
    <span class="nm">n_estimators</span>=<span class="num">200</span>, <span class="nm">max_depth</span>=<span class="num">8</span>,
    <span class="nm">min_samples_leaf</span>=<span class="num">3</span>, <span class="nm">oob_score</span>=<span class="kw">True</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
<span class="nm">rf</span>.<span class="fn">fit</span>(<span class="nm">X_train</span>, <span class="nm">y_train</span>)

<span class="cm"># Evaluate on test set</span>
<span class="nm">y_pred</span> = <span class="nm">rf</span>.<span class="fn">predict</span>(<span class="nm">X_test</span>)
<span class="fn">print</span>(<span class="st">f"Test MAE : </span>{<span class="fn">mean_absolute_error</span>(<span class="nm">y_test</span>, <span class="nm">y_pred</span>)<span class="st">:.2f} kcal/mol"</span>)
<span class="fn">print</span>(<span class="st">f"Test R²  : </span>{<span class="fn">r2_score</span>(<span class="nm">y_test</span>, <span class="nm">y_pred</span>)<span class="st">:.3f}"</span>)
<span class="fn">print</span>(<span class="st">f"OOB R²   : </span>{<span class="nm">rf</span>.<span class="nm">oob_score_</span><span class="st">:.3f}"</span>)

<span class="cm"># Feature importance ranking</span>
<span class="nm">order</span> = <span class="nm">np</span>.<span class="fn">argsort</span>(<span class="nm">rf</span>.<span class="nm">feature_importances_</span>)[::-<span class="num">1</span>]
<span class="kw">for</span> <span class="nm">i</span> <span class="kw">in</span> <span class="nm">order</span>:
    <span class="fn">print</span>(<span class="st">f"  </span>{<span class="nm">features</span>[<span class="nm">i</span>]:<span class="num">20</span>}<span class="st">: </span>{<span class="nm">rf</span>.<span class="nm">feature_importances_</span>[<span class="nm">i</span>]<span class="st">:.3f}"</span>)`,

      cheatsheet: [
        { syn: 'RandomForestRegressor()', desc: 'Ensemble of trees for regression — averages predictions' },
        { syn: 'RandomForestClassifier()', desc: 'Ensemble of trees for classification — majority vote' },
        { syn: 'n_estimators=200', desc: 'Number of trees — more gives smoother predictions' },
        { syn: 'max_features="sqrt"', desc: 'Features per split — sqrt(n) for diversity between trees' },
        { syn: 'oob_score=True', desc: 'Enable out-of-bag validation estimate (free, no holdout needed)' },
        { syn: 'rf.oob_score_', desc: 'OOB R² score after fitting — estimates generalisation' },
        { syn: 'rf.feature_importances_', desc: 'Mean decrease in impurity per feature (sums to 1.0)' },
        { syn: 'rf.estimators_', desc: 'List of individual fitted trees in the forest' },
        { syn: 'GradientBoostingRegressor()', desc: 'Boosted trees — sequential, often more accurate' },
        { syn: 'cross_val_score(rf, X, y, cv=5)', desc: '5-fold CV to assess stability across splits' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why does a random forest typically outperform a single decision tree on predicting ΔG‡?',
          opts: [
            'It uses a different loss function',
            'Averaging many diverse trees reduces variance and overfitting',
            'It can handle categorical features natively',
            'It does not require feature scaling'
          ],
          answer: 1,
          feedback: 'Bagging + feature randomisation creates diverse trees. Averaging their predictions cancels out individual errors, yielding lower variance without increasing bias much.'
        },
        {
          type: 'fill',
          q: 'Complete the code to access the out-of-bag validation score:',
          pre: 'rf = RandomForestRegressor(n_estimators=100, oob_score=True)\nrf.fit(X_train, y_train)\nprint(f"OOB R²: {rf._____:.3f}")',
          answer: 'oob_score_',
          feedback: 'oob_score_ gives the R² computed on out-of-bag samples — a free validation estimate without needing a separate holdout set.'
        },
        {
          type: 'challenge',
          q: 'Build a RandomForestRegressor (100 trees, max_depth=6, oob_score=True) to predict yield_pct from delta_G_act_kcal, delta_G_rxn_kcal, temperature_K. Print test MAE and OOB R².',
          hint: 'Remember to set random_state=42 for reproducibility.',
          answer: `import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

df = pd.read_csv('reaction_benchmark.csv')
features = ['delta_G_act_kcal', 'delta_G_rxn_kcal', 'temperature_K']
X = df[features].values
y = df['yield_pct'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
rf = RandomForestRegressor(n_estimators=100, max_depth=6, oob_score=True, random_state=42)
rf.fit(X_train, y_train)
print(f"Test MAE: {mean_absolute_error(y_test, rf.predict(X_test)):.2f}%")
print(f"OOB R²:  {rf.oob_score_:.3f}")`
        }
      ],

      resources: [
        { icon: '📘', title: 'scikit-learn Ensemble Methods', url: 'https://scikit-learn.org/stable/modules/ensemble.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'StatQuest: Random Forests', url: 'https://www.youtube.com/watch?v=J4Wdy0Wc_xQ', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'Random Forest in Cheminformatics', url: 'https://jcheminf.biomedcentral.com/articles/10.1186/s13321-018-0321-8', tag: 'paper', tagColor: 'purple' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  SVM
    // ════════════════════════════════════════════════════════
    {
      id:   'svm',
      name: 'Support Vector Machines',
      desc: 'Kernel-based models for classification and regression of molecular properties in high-dimensional spaces',

      explanation: `
        <p><strong>Support Vector Machines (SVMs)</strong> find the hyperplane
        that maximises the margin between classes. In chemistry, SVMs excel when
        you have high-dimensional fingerprint vectors (1024+ bits) with relatively
        few molecules — common in early-stage drug discovery or catalyst screening.
        The key insight: only the "support vectors" (molecules near the boundary)
        define the decision surface.</p>

        <p>The <strong>kernel trick</strong> maps features into a higher-dimensional
        space without explicitly computing the transformation. The <code>RBF</code>
        (radial basis function) kernel handles non-linear boundaries and is the
        default choice. The <code>C</code> parameter controls the trade-off between
        margin width and misclassification — high C fits training data tightly,
        low C allows more slack for better generalisation.</p>

        <p><strong>SVR</strong> (Support Vector Regression) adapts the same idea
        for continuous targets: it finds a tube of width ε around the predictions
        and only penalises points outside it. Feature scaling is
        <strong>critical</strong> for SVMs — always use <code>StandardScaler</code>
        because the kernel measures distances between feature vectors.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">from</span> <span class="nm">sklearn.svm</span> <span class="kw">import</span> <span class="fn">SVC</span>, <span class="fn">SVR</span>
<span class="kw">from</span> <span class="nm">sklearn.preprocessing</span> <span class="kw">import</span> <span class="fn">StandardScaler</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> <span class="fn">train_test_split</span>
<span class="kw">from</span> <span class="nm">sklearn.metrics</span> <span class="kw">import</span> <span class="fn">accuracy_score</span>, <span class="fn">mean_absolute_error</span>
<span class="kw">from</span> <span class="nm">sklearn.pipeline</span> <span class="kw">import</span> <span class="fn">make_pipeline</span>

<span class="cm"># Classify reaction convergence with SVM</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="nm">X</span> = <span class="nm">df</span>[[<span class="st">'delta_G_act_kcal'</span>, <span class="st">'delta_G_rxn_kcal'</span>, <span class="st">'temperature_K'</span>]].<span class="nm">values</span>
<span class="nm">y_cls</span> = <span class="nm">df</span>[<span class="st">'converged'</span>].<span class="fn">astype</span>(<span class="bi">int</span>).<span class="nm">values</span>

<span class="nm">X_train</span>, <span class="nm">X_test</span>, <span class="nm">y_train</span>, <span class="nm">y_test</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y_cls</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">random_state</span>=<span class="num">42</span>)

<span class="cm"># Pipeline: scale → SVM (always scale for kernel methods!)</span>
<span class="nm">svm_clf</span> = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">SVC</span>(<span class="nm">kernel</span>=<span class="st">'rbf'</span>, <span class="nm">C</span>=<span class="num">1.0</span>))
<span class="nm">svm_clf</span>.<span class="fn">fit</span>(<span class="nm">X_train</span>, <span class="nm">y_train</span>)
<span class="fn">print</span>(<span class="st">f"SVC accuracy: </span>{<span class="fn">accuracy_score</span>(<span class="nm">y_test</span>, <span class="nm">svm_clf</span>.<span class="fn">predict</span>(<span class="nm">X_test</span>))<span class="st">:.2%}"</span>)

<span class="cm"># SVR for continuous target (activation energy)</span>
<span class="nm">y_reg</span> = <span class="nm">df</span>[<span class="st">'delta_G_act_kcal'</span>].<span class="nm">values</span>
<span class="nm">X_tr</span>, <span class="nm">X_te</span>, <span class="nm">y_tr</span>, <span class="nm">y_te</span> = <span class="fn">train_test_split</span>(
    <span class="nm">X</span>, <span class="nm">y_reg</span>, <span class="nm">test_size</span>=<span class="num">0.2</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
<span class="nm">svr</span> = <span class="fn">make_pipeline</span>(<span class="fn">StandardScaler</span>(), <span class="fn">SVR</span>(<span class="nm">kernel</span>=<span class="st">'rbf'</span>, <span class="nm">C</span>=<span class="num">10.0</span>))
<span class="nm">svr</span>.<span class="fn">fit</span>(<span class="nm">X_tr</span>, <span class="nm">y_tr</span>)
<span class="fn">print</span>(<span class="st">f"SVR MAE: </span>{<span class="fn">mean_absolute_error</span>(<span class="nm">y_te</span>, <span class="nm">svr</span>.<span class="fn">predict</span>(<span class="nm">X_te</span>))<span class="st">:.2f} kcal/mol"</span>)`,

      cheatsheet: [
        { syn: 'SVC(kernel="rbf", C=1.0)', desc: 'Support vector classifier — RBF kernel is default' },
        { syn: 'SVR(kernel="rbf", C=10.0)', desc: 'Support vector regression — epsilon-tube around predictions' },
        { syn: 'kernel="linear"', desc: 'Linear kernel — equivalent to linear model, fast for sparse data' },
        { syn: 'kernel="poly", degree=3', desc: 'Polynomial kernel — captures interaction terms' },
        { syn: 'C=1.0', desc: 'Regularisation — higher C = tighter fit, lower C = wider margin' },
        { syn: 'gamma="scale"', desc: 'RBF width — "scale" uses 1/(n_features × var), "auto" uses 1/n_features' },
        { syn: 'make_pipeline(StandardScaler(), SVC())', desc: 'Always scale before SVM — kernels are distance-based' },
        { syn: 'svc.support_vectors_', desc: 'Array of samples that define the decision boundary' },
        { syn: 'SVC(probability=True)', desc: 'Enable predict_proba() — slower, uses Platt scaling' },
        { syn: 'svc.decision_function(X)', desc: 'Signed distance to hyperplane — positive = class 1' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'Why is feature scaling especially important for SVMs but not for random forests?',
          opts: [
            'SVMs use gradient descent which requires normalized inputs',
            'SVMs compute distances between samples — unscaled features with large ranges dominate',
            'Random forests cannot handle continuous features',
            'SVMs are linear models and need standardized coefficients'
          ],
          answer: 1,
          feedback: 'The RBF kernel computes exp(-γ‖x_i - x_j‖²). If temperature_K ranges 300–500 while logP ranges 0–5, temperature dominates the distance. Scaling puts all features on equal footing.'
        },
        {
          type: 'fill',
          q: 'Complete the pipeline to ensure features are scaled before the SVM:',
          pre: 'from sklearn.pipeline import make_pipeline\nclf = make_pipeline(_____, SVC(kernel="rbf"))',
          answer: 'StandardScaler()',
          feedback: 'make_pipeline(StandardScaler(), SVC()) applies scaling automatically during fit and predict, preventing data leakage.'
        },
        {
          type: 'challenge',
          q: 'Build an SVR pipeline (StandardScaler + SVR with RBF kernel, C=10) to predict delta_G_act_kcal from delta_G_rxn_kcal, temperature_K, and yield_pct. Print the MAE on a 20% test set.',
          hint: 'Use make_pipeline to chain StandardScaler and SVR together.',
          answer: `import pandas as pd
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

df = pd.read_csv('reaction_benchmark.csv')
X = df[['delta_G_rxn_kcal', 'temperature_K', 'yield_pct']].values
y = df['delta_G_act_kcal'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
svr = make_pipeline(StandardScaler(), SVR(kernel='rbf', C=10.0))
svr.fit(X_train, y_train)
print(f"MAE: {mean_absolute_error(y_test, svr.predict(X_test)):.2f} kcal/mol")`
        }
      ],

      resources: [
        { icon: '📘', title: 'scikit-learn SVM Guide', url: 'https://scikit-learn.org/stable/modules/svm.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'StatQuest: SVM Clearly Explained', url: 'https://www.youtube.com/watch?v=efR1C6CvhmE', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'SVM Kernel Comparison', url: 'https://scikit-learn.org/stable/auto_examples/svm/plot_iris_svc.html', tag: 'tutorial', tagColor: 'green' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  KMEANS
    // ════════════════════════════════════════════════════════
    {
      id:   'kmeans',
      name: 'K-Means Clustering',
      desc: 'Unsupervised grouping of molecules by property similarity for chemical space exploration',

      explanation: `
        <p><strong>K-Means</strong> is an unsupervised algorithm that partitions
        data into k clusters by iteratively assigning samples to the nearest
        <strong>centroid</strong> and then updating centroids to the cluster mean.
        In chemistry, clustering groups molecules by descriptor similarity —
        identifying families of catalysts with similar reactivity profiles or
        grouping solvents by physical properties.</p>

        <p>You must choose <strong>k</strong> (number of clusters) in advance.
        The <strong>elbow method</strong> plots inertia (within-cluster sum of
        squared distances) vs. k — the "elbow" where improvement slows suggests
        a good k. The <strong>silhouette score</strong> (−1 to +1) measures how
        well-separated clusters are; values above 0.5 indicate good structure.</p>

        <p>Feature scaling is essential — K-Means uses Euclidean distance, so
        unscaled features dominate. After clustering, inspect centroids to
        interpret each cluster chemically: "Cluster 0 = high-barrier, low-yield
        reactions at low temperature" gives actionable insight for catalyst
        design. K-Means is also used to <strong>stratify</strong> datasets before
        splitting into train/test sets.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">sklearn.cluster</span> <span class="kw">import</span> <span class="fn">KMeans</span>
<span class="kw">from</span> <span class="nm">sklearn.preprocessing</span> <span class="kw">import</span> <span class="fn">StandardScaler</span>
<span class="kw">from</span> <span class="nm">sklearn.metrics</span> <span class="kw">import</span> <span class="fn">silhouette_score</span>

<span class="cm"># Cluster reactions by thermodynamic profile</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="nm">features</span> = [<span class="st">'delta_G_act_kcal'</span>, <span class="st">'delta_G_rxn_kcal'</span>, <span class="st">'temperature_K'</span>]
<span class="nm">X</span> = <span class="nm">df</span>[<span class="nm">features</span>].<span class="nm">values</span>
<span class="nm">X_scaled</span> = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(<span class="nm">X</span>)

<span class="cm"># Elbow method: try k = 2..8</span>
<span class="nm">inertias</span> = []
<span class="kw">for</span> <span class="nm">k</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2</span>, <span class="num">9</span>):
    <span class="nm">km</span> = <span class="fn">KMeans</span>(<span class="nm">n_clusters</span>=<span class="nm">k</span>, <span class="nm">n_init</span>=<span class="num">10</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
    <span class="nm">km</span>.<span class="fn">fit</span>(<span class="nm">X_scaled</span>)
    <span class="nm">inertias</span>.<span class="fn">append</span>(<span class="nm">km</span>.<span class="nm">inertia_</span>)
    <span class="nm">sil</span> = <span class="fn">silhouette_score</span>(<span class="nm">X_scaled</span>, <span class="nm">km</span>.<span class="nm">labels_</span>)
    <span class="fn">print</span>(<span class="st">f"k=</span>{<span class="nm">k</span>}<span class="st">: inertia=</span>{<span class="nm">km</span>.<span class="nm">inertia_</span><span class="st">:.1f}, silhouette=</span>{<span class="nm">sil</span><span class="st">:.3f}"</span>)

<span class="cm"># Fit final model with chosen k</span>
<span class="nm">km</span> = <span class="fn">KMeans</span>(<span class="nm">n_clusters</span>=<span class="num">3</span>, <span class="nm">n_init</span>=<span class="num">10</span>, <span class="nm">random_state</span>=<span class="num">42</span>).<span class="fn">fit</span>(<span class="nm">X_scaled</span>)
<span class="nm">df</span>[<span class="st">'cluster'</span>] = <span class="nm">km</span>.<span class="nm">labels_</span>

<span class="cm"># Interpret clusters by their mean properties</span>
<span class="fn">print</span>(<span class="st">"\\nCluster centroids (original scale):"</span>)
<span class="kw">for</span> <span class="nm">c</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    <span class="nm">mask</span> = <span class="nm">df</span>[<span class="st">'cluster'</span>] == <span class="nm">c</span>
    <span class="nm">means</span> = <span class="nm">df</span>.<span class="fn">loc</span>[<span class="nm">mask</span>, <span class="nm">features</span>].<span class="fn">mean</span>()
    <span class="fn">print</span>(<span class="st">f"  Cluster </span>{<span class="nm">c</span>}<span class="st">: ΔG‡=</span>{<span class="nm">means</span>.<span class="fn">iloc</span>[<span class="num">0</span>]<span class="st">:.1f}, ΔG=</span>{<span class="nm">means</span>.<span class="fn">iloc</span>[<span class="num">1</span>]<span class="st">:.1f}, T=</span>{<span class="nm">means</span>.<span class="fn">iloc</span>[<span class="num">2</span>]<span class="st">:.0f} K"</span>)`,

      cheatsheet: [
        { syn: 'KMeans(n_clusters=3)', desc: 'Create K-Means with k=3 clusters' },
        { syn: 'n_init=10', desc: 'Run 10 times with different seeds, keep best inertia' },
        { syn: 'km.fit(X)', desc: 'Fit clusters on feature matrix (unsupervised — no y)' },
        { syn: 'km.predict(X_new)', desc: 'Assign new samples to nearest cluster' },
        { syn: 'km.labels_', desc: 'Cluster assignment for each training sample (0 to k-1)' },
        { syn: 'km.cluster_centers_', desc: 'Centroid coordinates — shape (k, n_features)' },
        { syn: 'km.inertia_', desc: 'Within-cluster sum of squared distances (lower = tighter)' },
        { syn: 'silhouette_score(X, labels)', desc: 'Cluster quality: −1 (bad) to +1 (well-separated)' },
        { syn: 'MiniBatchKMeans()', desc: 'Faster variant for large datasets (>10k molecules)' },
        { syn: 'DBSCAN(eps, min_samples)', desc: 'Density-based clustering — auto-detects k' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'When clustering catalysts by thermodynamic descriptors, the silhouette score is 0.15. What does this indicate?',
          opts: [
            'The clusters are well-separated and compact',
            'The clustering is poor — many samples are near cluster boundaries',
            'There are exactly 15% outliers in the data',
            'The algorithm did not converge'
          ],
          answer: 1,
          feedback: 'Silhouette scores near 0 mean samples sit between clusters. Values above 0.5 indicate good separation. Try a different k, or use a different clustering algorithm like DBSCAN.'
        },
        {
          type: 'fill',
          q: 'Complete the code to calculate the silhouette score for a K-Means result:',
          pre: 'from sklearn.metrics import silhouette_score\nscore = _____(X_scaled, km.labels_)',
          answer: 'silhouette_score',
          feedback: 'silhouette_score(X, labels) takes the feature matrix and cluster assignments and returns a score from −1 to +1.'
        },
        {
          type: 'challenge',
          q: 'Cluster the reaction_benchmark.csv data into 4 groups using delta_G_act_kcal, delta_G_rxn_kcal, and temperature_K (scaled). Print the silhouette score and the mean yield_pct per cluster.',
          hint: 'Scale features first, fit KMeans, then use df.groupby on the cluster labels to get mean yield.',
          answer: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

df = pd.read_csv('reaction_benchmark.csv')
features = ['delta_G_act_kcal', 'delta_G_rxn_kcal', 'temperature_K']
X_scaled = StandardScaler().fit_transform(df[features].values)
km = KMeans(n_clusters=4, n_init=10, random_state=42).fit(X_scaled)
print(f"Silhouette: {silhouette_score(X_scaled, km.labels_):.3f}")
df['cluster'] = km.labels_
for c, grp in df.groupby('cluster'):
    print(f"Cluster {c}: mean yield = {grp['yield_pct'].mean():.1f}%")`
        }
      ],

      resources: [
        { icon: '📘', title: 'scikit-learn Clustering Guide', url: 'https://scikit-learn.org/stable/modules/clustering.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'StatQuest: K-Means Clustering', url: 'https://www.youtube.com/watch?v=4b5d3muPQmA', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'Chemical Space Clustering', url: 'https://jcheminf.biomedcentral.com/articles/10.1186/s13321-020-00445-4', tag: 'paper', tagColor: 'purple' },
      ]
    },

    // ════════════════════════════════════════════════════════
    //  MODEL-EVALUATION
    // ════════════════════════════════════════════════════════
    {
      id:   'model-evaluation',
      name: 'Model Evaluation',
      desc: 'Cross-validation, hyperparameter tuning, and diagnostic plots for rigorous model assessment',

      explanation: `
        <p>A model is only as good as its <strong>evaluation</strong>. Reporting
        training metrics alone is meaningless — you need to measure performance
        on unseen data. <strong>K-fold cross-validation</strong> splits data into
        k folds, trains on k−1, and tests on the held-out fold. Repeating this
        for all folds gives k scores whose mean and standard deviation reveal
        both performance and stability.</p>

        <p><strong>Hyperparameter tuning</strong> searches for the best model
        settings (e.g., max_depth, C, n_estimators). <code>GridSearchCV</code>
        tries all combinations; <code>RandomizedSearchCV</code> samples randomly
        and is more efficient for large search spaces. Both use cross-validation
        internally, preventing you from overfitting the test set.</p>

        <p>For chemistry models, always report metrics in <strong>physical
        units</strong>: "MAE = 1.8 kcal/mol" is meaningful; "MSE = 3.24" is
        not. Plot <strong>predicted vs. actual</strong> (parity plot) to spot
        systematic errors, and <strong>learning curves</strong> to diagnose
        whether you need more data or a more complex model. A model with high
        bias (underfitting) won't improve with more data; a model with high
        variance (overfitting) will.</p>
      `,

      code: `<span class="kw">import</span> <span class="nm">pandas</span> <span class="kw">as</span> <span class="nm">pd</span>
<span class="kw">import</span> <span class="nm">numpy</span> <span class="kw">as</span> <span class="nm">np</span>
<span class="kw">from</span> <span class="nm">sklearn.ensemble</span> <span class="kw">import</span> <span class="fn">RandomForestRegressor</span>
<span class="kw">from</span> <span class="nm">sklearn.model_selection</span> <span class="kw">import</span> (
    <span class="fn">cross_val_score</span>, <span class="fn">GridSearchCV</span>, <span class="fn">learning_curve</span>)
<span class="kw">from</span> <span class="nm">sklearn.metrics</span> <span class="kw">import</span> <span class="fn">make_scorer</span>, <span class="fn">mean_absolute_error</span>

<span class="cm"># Load reaction data</span>
<span class="nm">df</span> = <span class="nm">pd</span>.<span class="fn">read_csv</span>(<span class="st">'reaction_benchmark.csv'</span>)
<span class="nm">X</span> = <span class="nm">df</span>[[<span class="st">'delta_G_rxn_kcal'</span>, <span class="st">'temperature_K'</span>, <span class="st">'yield_pct'</span>]].<span class="nm">values</span>
<span class="nm">y</span> = <span class="nm">df</span>[<span class="st">'delta_G_act_kcal'</span>].<span class="nm">values</span>

<span class="cm"># 5-fold cross-validation with MAE</span>
<span class="nm">rf</span> = <span class="fn">RandomForestRegressor</span>(<span class="nm">n_estimators</span>=<span class="num">100</span>, <span class="nm">random_state</span>=<span class="num">42</span>)
<span class="nm">mae_scorer</span> = <span class="fn">make_scorer</span>(<span class="fn">mean_absolute_error</span>, <span class="nm">greater_is_better</span>=<span class="kw">False</span>)
<span class="nm">scores</span> = <span class="fn">cross_val_score</span>(<span class="nm">rf</span>, <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">cv</span>=<span class="num">5</span>, <span class="nm">scoring</span>=<span class="nm">mae_scorer</span>)
<span class="fn">print</span>(<span class="st">f"CV MAE: </span>{-<span class="nm">scores</span>.<span class="fn">mean</span>()<span class="st">:.2f} ± </span>{<span class="nm">scores</span>.<span class="fn">std</span>()<span class="st">:.2f} kcal/mol"</span>)

<span class="cm"># Grid search over hyperparameters</span>
<span class="nm">param_grid</span> = {
    <span class="st">'n_estimators'</span>: [<span class="num">50</span>, <span class="num">100</span>, <span class="num">200</span>],
    <span class="st">'max_depth'</span>: [<span class="num">4</span>, <span class="num">6</span>, <span class="num">8</span>],
    <span class="st">'min_samples_leaf'</span>: [<span class="num">2</span>, <span class="num">5</span>],
}
<span class="nm">grid</span> = <span class="fn">GridSearchCV</span>(<span class="nm">rf</span>, <span class="nm">param_grid</span>, <span class="nm">cv</span>=<span class="num">3</span>,
    <span class="nm">scoring</span>=<span class="nm">mae_scorer</span>, <span class="nm">n_jobs</span>=-<span class="num">1</span>)
<span class="nm">grid</span>.<span class="fn">fit</span>(<span class="nm">X</span>, <span class="nm">y</span>)
<span class="fn">print</span>(<span class="st">f"Best MAE: </span>{-<span class="nm">grid</span>.<span class="nm">best_score_</span><span class="st">:.2f} kcal/mol"</span>)
<span class="fn">print</span>(<span class="st">f"Best params: </span>{<span class="nm">grid</span>.<span class="nm">best_params_</span>}<span class="st">"</span>)

<span class="cm"># Learning curve: does more data help?</span>
<span class="nm">train_sizes</span>, <span class="nm">train_scores</span>, <span class="nm">val_scores</span> = <span class="fn">learning_curve</span>(
    <span class="nm">grid</span>.<span class="nm">best_estimator_</span>, <span class="nm">X</span>, <span class="nm">y</span>, <span class="nm">cv</span>=<span class="num">3</span>,
    <span class="nm">train_sizes</span>=<span class="nm">np</span>.<span class="fn">linspace</span>(<span class="num">0.2</span>, <span class="num">1.0</span>, <span class="num">5</span>), <span class="nm">scoring</span>=<span class="nm">mae_scorer</span>)
<span class="fn">print</span>(<span class="st">"\\nLearning curve (validation MAE):"</span>)
<span class="kw">for</span> <span class="nm">n</span>, <span class="nm">s</span> <span class="kw">in</span> <span class="fn">zip</span>(<span class="nm">train_sizes</span>, -<span class="nm">val_scores</span>.<span class="fn">mean</span>(<span class="nm">axis</span>=<span class="num">1</span>)):
    <span class="fn">print</span>(<span class="st">f"  n=</span>{<span class="nm">n</span>:<span class="num">3d</span>}<span class="st">: MAE=</span>{<span class="nm">s</span><span class="st">:.2f} kcal/mol"</span>)`,

      cheatsheet: [
        { syn: 'cross_val_score(model, X, y, cv=5)', desc: 'K-fold CV — returns array of k scores' },
        { syn: 'make_scorer(metric, greater_is_better)', desc: 'Wrap a metric function for use in CV/grid search' },
        { syn: 'GridSearchCV(model, param_grid, cv=3)', desc: 'Exhaustive search over all hyperparameter combinations' },
        { syn: 'RandomizedSearchCV(model, param_dist)', desc: 'Random sampling from hyperparameter distributions' },
        { syn: 'grid.best_params_', desc: 'Best hyperparameter combination found by search' },
        { syn: 'grid.best_score_', desc: 'Mean CV score for the best parameter set' },
        { syn: 'grid.best_estimator_', desc: 'Fitted model with best parameters — ready for prediction' },
        { syn: 'learning_curve(model, X, y, cv=3)', desc: 'Train/val scores at increasing training set sizes' },
        { syn: 'scoring="neg_mean_absolute_error"', desc: 'Built-in MAE scorer (negative convention)' },
        { syn: 'cv=GroupKFold(n_splits=5)', desc: 'Groups never split across folds — use for catalyst families' },
        { syn: 'grid.cv_results_', desc: 'Dict with mean/std scores for every parameter combination' },
      ],

      exercises: [
        {
          type: 'mcq',
          q: 'A learning curve shows training MAE = 0.5 kcal/mol and validation MAE = 4.8 kcal/mol at all training set sizes. What does this indicate?',
          opts: [
            'The model needs more data — high variance (overfitting)',
            'The model is underfitting — too simple for the data',
            'The model is overfitting — too complex for the data size',
            'The features are irrelevant to the target'
          ],
          answer: 2,
          feedback: 'A persistent gap between training and validation curves that does not close with more data indicates overfitting. Try reducing model complexity (lower max_depth, more regularisation) or adding regularisation.'
        },
        {
          type: 'fill',
          q: 'Complete the code to extract the best hyperparameters from a grid search:',
          pre: 'grid = GridSearchCV(rf, param_grid, cv=5)\ngrid.fit(X, y)\nprint(grid._____)',
          answer: 'best_params_',
          feedback: 'best_params_ is a dictionary of the hyperparameter combination that achieved the highest CV score.'
        },
        {
          type: 'challenge',
          q: 'Run a GridSearchCV with a RandomForestRegressor on reaction_benchmark.csv: search n_estimators=[50,100] and max_depth=[4,6,8], using 5-fold CV with neg_mean_absolute_error scoring. Print the best MAE and parameters.',
          hint: 'Use scoring="neg_mean_absolute_error" and negate best_score_ to get positive MAE.',
          answer: `import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV

df = pd.read_csv('reaction_benchmark.csv')
X = df[['delta_G_rxn_kcal', 'temperature_K', 'yield_pct']].values
y = df['delta_G_act_kcal'].values
param_grid = {'n_estimators': [50, 100], 'max_depth': [4, 6, 8]}
grid = GridSearchCV(RandomForestRegressor(random_state=42),
    param_grid, cv=5, scoring='neg_mean_absolute_error')
grid.fit(X, y)
print(f"Best MAE: {-grid.best_score_:.2f} kcal/mol")
print(f"Best params: {grid.best_params_}")`
        },
        {
          type: 'challenge',
          q: 'Compute 5-fold cross-validation scores for Ridge regression (alpha=1.0) on reaction_benchmark.csv predicting delta_G_act_kcal. Print the mean and standard deviation of MAE across folds.',
          hint: 'Use cross_val_score with scoring="neg_mean_absolute_error", then negate the result.',
          answer: `import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score

df = pd.read_csv('reaction_benchmark.csv')
X = df[['delta_G_rxn_kcal', 'temperature_K', 'yield_pct']].values
y = df['delta_G_act_kcal'].values
scores = cross_val_score(Ridge(alpha=1.0), X, y, cv=5,
    scoring='neg_mean_absolute_error')
mae = -scores
print(f"CV MAE: {mae.mean():.2f} ± {mae.std():.2f} kcal/mol")`
        }
      ],

      resources: [
        { icon: '📘', title: 'scikit-learn Model Selection', url: 'https://scikit-learn.org/stable/modules/grid_search.html', tag: 'docs', tagColor: 'blue' },
        { icon: '🎓', title: 'StatQuest: Cross-Validation', url: 'https://www.youtube.com/watch?v=fSytzGwwBVw', tag: 'video', tagColor: 'red' },
        { icon: '📄', title: 'Hyperparameter Tuning Guide', url: 'https://scikit-learn.org/stable/modules/grid_search.html#tips-for-parameter-search', tag: 'tutorial', tagColor: 'green' },
      ]
    },

  ],
};
