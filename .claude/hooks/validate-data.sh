#!/bin/bash
# Hook: auto-validate data file schema after Edit/Write
# Fires on PostToolUse for Edit|Write
# Reads tool_input JSON from stdin, checks if edited file is a data/*.js file,
# and runs Node-based schema validation if so.

INPUT=$(cat)

# Extract file_path from JSON without jq (portable)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//;s/"$//')

# Only validate data/ JS files
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi
case "$FILE_PATH" in
  *data/*.js) ;;  # match — continue
  *) exit 0 ;;    # not a data file — skip
esac

# Check file exists
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Run schema validation via Node
RESULT=$(node -e "
const fs = require('fs');
const window = {};
try {
  eval(fs.readFileSync('$FILE_PATH', 'utf8'));
} catch(e) {
  console.error('SYNTAX ERROR: ' + e.message);
  process.exit(1);
}
const varName = Object.keys(window).find(k => /^(PY|CS|ML)_S\d+$/.test(k));
if (!varName) { process.exit(0); }
const stage = window[varName];
if (!stage || !Array.isArray(stage.topics) || stage.topics.length === 0) { process.exit(0); }
const required = ['id','name','desc','explanation','code','cheatsheet','exercises','resources'];
let errors = 0;
for (const t of stage.topics) {
  for (const f of required) {
    if (t[f] === undefined || t[f] === null) { console.error('MISSING: ' + t.id + ' -> ' + f); errors++; }
  }
  if (!Array.isArray(t.exercises)) { console.error(t.id + ': exercises is not an array'); errors++; continue; }
  const types = t.exercises.map(e => e.type);
  if (types.filter(x => x === 'mcq').length < 1) { console.error(t.id + ': needs >= 1 mcq'); errors++; }
  if (types.filter(x => x === 'fill').length < 1) { console.error(t.id + ': needs >= 1 fill'); errors++; }
  if (types.filter(x => x === 'challenge').length < 1) { console.error(t.id + ': needs >= 1 challenge'); errors++; }
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
