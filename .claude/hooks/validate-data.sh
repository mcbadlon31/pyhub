#!/bin/bash
# Hook: auto-validate data file schema after Edit/Write
# Fires on PostToolUse for Edit|Write — checks if the edited file is a data file
# and runs schema validation if so.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only validate data/ JS files
if [[ "$FILE_PATH" != *"data/"* ]] || [[ "$FILE_PATH" != *".js" ]]; then
  exit 0
fi

# Extract the global variable name from the file (e.g., PY_S1, ML_S6)
VAR_NAME=$(grep -oP 'window\.\K[A-Z_]+\d' "$FILE_PATH" 2>/dev/null | head -1)
if [[ -z "$VAR_NAME" ]]; then
  exit 0
fi

# Run schema validation
RESULT=$(node -e "
const fs = require('fs');
const window = {};
try {
  eval(fs.readFileSync('$FILE_PATH', 'utf8'));
} catch(e) {
  console.error('SYNTAX ERROR: ' + e.message);
  process.exit(1);
}
const stage = window.$VAR_NAME;
if (!stage || !stage.topics) { console.log('No topics found'); process.exit(0); }
const required = ['id','name','desc','explanation','code','cheatsheet','exercises','resources'];
let errors = 0;
for (const t of stage.topics) {
  for (const f of required) {
    if (!t[f]) { console.error('MISSING: ' + t.id + ' → ' + f); errors++; }
  }
  const types = t.exercises.map(e => e.type);
  if (types.filter(x => x === 'mcq').length < 1) { console.error(t.id + ': needs ≥1 mcq'); errors++; }
  if (types.filter(x => x === 'fill').length < 1) { console.error(t.id + ': needs ≥1 fill'); errors++; }
  if (types.filter(x => x === 'challenge').length < 1) { console.error(t.id + ': needs ≥1 challenge'); errors++; }
}
if (errors === 0) console.log('Schema valid: ' + stage.topics.length + ' topics in ' + stage.id);
else { console.error(errors + ' schema error(s)'); process.exit(1); }
" 2>&1)

EXIT_CODE=$?
if [[ $EXIT_CODE -ne 0 ]]; then
  echo "Schema validation FAILED for $FILE_PATH:" >&2
  echo "$RESULT" >&2
  exit 2
fi

echo "$RESULT"
exit 0
