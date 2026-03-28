/**
 * progress.js — localStorage progress persistence.
 * Schema version 2: removed old Stage 5 topic IDs from v1.
 */

const STORAGE_KEY   = 'pyhub_progress';
const SCHEMA_KEY    = 'pyhub_schema_v';
const SCHEMA_VERSION = 2;

// Topic IDs removed in v2 (old ML Stage 5 topics)
const V1_REMOVED_IDS = ['nlp-basics', 'ml-pipelines', 'save-models', 'mlops'];

/** Run on boot — migrates old progress data if schema version changed. */
export function migrate() {
  try {
    const stored = parseInt(localStorage.getItem(SCHEMA_KEY) || '0', 10);
    if (stored === SCHEMA_VERSION) return;

    if (stored < 2) {
      // Remove deleted v1 topic IDs from progress
      const progress = _load();
      V1_REMOVED_IDS.forEach(id => delete progress[id]);
      _save(progress);
    }

    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  } catch { /* localStorage unavailable (private browsing) — silent fail */ }
}

/** Returns true if the given topic ID is marked done. */
export function isDone(topicId) {
  try { return !!_load()[topicId]; } catch { return false; }
}

/**
 * Set a topic's done state atomically.
 * @param {string} topicId
 * @param {boolean} value
 */
export function setDone(topicId, value) {
  try {
    const progress = _load();
    if (value) {
      progress[topicId] = true;
    } else {
      delete progress[topicId];
    }
    _save(progress);
  } catch { /* silent */ }
}

/** Toggle a topic's done state. Returns the new value. */
export function toggleDone(topicId) {
  const next = !isDone(topicId);
  setDone(topicId, next);
  return next;
}

/** Returns the full progress map { topicId: true }. */
export function allProgress() {
  try { return _load(); } catch { return {}; }
}

/** Clear all progress (with no confirmation — caller must confirm). */
export function reset() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  } catch { /* silent */ }
}

/** Export progress as JSON string. */
export function exportJSON() {
  return JSON.stringify({ schema: SCHEMA_VERSION, progress: allProgress() }, null, 2);
}

/** Import progress from a JSON string exported by exportJSON(). */
export function importJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.progress && typeof parsed.progress === 'object') {
      _save(parsed.progress);
      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
      return true;
    }
    return false;
  } catch { return false; }
}

// ── Internal helpers ──────────────────────────────────────

function _load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function _save(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
