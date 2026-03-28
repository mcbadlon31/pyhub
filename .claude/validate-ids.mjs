/**
 * validate-ids.mjs — Cross-file topic ID collision detector.
 * Run: node .claude/validate-ids.mjs
 * Scans all data/*.js files, checks for duplicate IDs across the entire project.
 */

import fs from 'fs';
import path from 'path';

const DATA_DIRS = ['data/python', 'data/cs', 'data/ml'];
const allIds = [];
const stageInfo = [];
let errors = 0;

for (const dir of DATA_DIRS) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
  for (const file of files) {
    const filePath = path.join(dir, file);
    const code = fs.readFileSync(filePath, 'utf8');

    // Execute in a fake window context
    const window = {};
    try {
      new Function('window', code)(window);
    } catch (e) {
      console.error(`SYNTAX ERROR in ${filePath}: ${e.message}`);
      errors++;
      continue;
    }

    const varName = Object.keys(window).find(k => /^(PY|CS|ML)_S\d+$/.test(k));
    if (!varName) continue;

    const stage = window[varName];
    if (!stage || !Array.isArray(stage.topics)) continue;

    const topicCount = stage.topics.length;
    stageInfo.push({ id: stage.id, file: filePath, topics: topicCount });

    for (const t of stage.topics) {
      allIds.push({ id: t.id, file: filePath, stage: stage.id });
    }
  }
}

// Check for duplicates
const seen = new Map();
for (const entry of allIds) {
  if (seen.has(entry.id)) {
    const prev = seen.get(entry.id);
    console.error(`DUPLICATE ID: "${entry.id}" in ${prev.file} (${prev.stage}) AND ${entry.file} (${entry.stage})`);
    errors++;
  } else {
    seen.set(entry.id, entry);
  }
}

// Print summary table
console.log('\nStage    | Topics | File');
console.log('---------|--------|-----------------------------');
for (const s of stageInfo) {
  const status = s.topics === 0 ? 'stub' : `${s.topics} topics`;
  console.log(`${s.id.padEnd(9)}| ${String(status).padEnd(7)}| ${s.file}`);
}

console.log(`\nTotal: ${allIds.length} topics across ${stageInfo.length} stages`);
if (errors === 0) {
  console.log('No duplicate IDs found.');
} else {
  console.error(`\n${errors} error(s) found!`);
  process.exit(1);
}
