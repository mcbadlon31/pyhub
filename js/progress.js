/**
 * progress.js — localStorage persistence for all user data.
 * Schema version 3: adds exercises, notes, bookmarks, streaks,
 * preferences, recent history, and last-viewed tracking.
 *
 * Each data type uses its own localStorage key to prevent
 * corruption cascades — a parse error in one key doesn't break others.
 */

const KEYS = {
  progress:    'pyhub_progress',
  exercises:   'pyhub_exercises',
  notes:       'pyhub_notes',
  bookmarks:   'pyhub_bookmarks',
  lastViewed:  'pyhub_lastViewed',
  streak:      'pyhub_streak',
  preferences: 'pyhub_preferences',
  recent:      'pyhub_recent',
};
const SCHEMA_KEY     = 'pyhub_schema_v';
const SCHEMA_VERSION = 3;

// Topic IDs removed in v2 (old ML Stage 5 topics)
const V1_REMOVED_IDS = ['nlp-basics', 'ml-pipelines', 'save-models', 'mlops'];

// ── Migration ────────────────────────────────────────────

/** Run on boot — migrates old data if schema version changed. */
export function migrate() {
  try {
    const stored = parseInt(localStorage.getItem(SCHEMA_KEY) || '0', 10);
    if (stored === SCHEMA_VERSION) return;

    if (stored < 2) {
      const progress = _loadKey(KEYS.progress);
      V1_REMOVED_IDS.forEach(id => delete progress[id]);
      _saveKey(KEYS.progress, progress);
    }
    // v2 → v3: no destructive changes — new keys simply start empty
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  } catch { /* localStorage unavailable — silent fail */ }
}

// ── Progress (topic done state) ──────────────────────────

/** Returns true if the given topic ID is marked done. */
export function isDone(topicId) {
  try { return !!_loadKey(KEYS.progress)[topicId]; } catch { return false; }
}

/**
 * Set a topic's done state atomically.
 * @param {string} topicId
 * @param {boolean} value
 */
export function setDone(topicId, value) {
  try {
    const progress = _loadKey(KEYS.progress);
    if (value) { progress[topicId] = true; } else { delete progress[topicId]; }
    _saveKey(KEYS.progress, progress);
  } catch { /* silent */ }
}

/** Toggle a topic's done state. Returns the new value. */
export function toggleDone(topicId) {
  const next = !isDone(topicId);
  setDone(topicId, next);
  if (next) updateStreak();
  return next;
}

/** Returns the full progress map { topicId: true }. */
export function allProgress() {
  try { return _loadKey(KEYS.progress); } catch { return {}; }
}

/** Clear all progress (caller must confirm first). */
export function reset() {
  try {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  } catch { /* silent */ }
}

// ── Exercise Tracking ────────────────────────────────────

/**
 * Record an exercise attempt for a topic.
 * @param {string} topicId
 * @param {number} exIdx - exercise index within the topic
 * @param {boolean} correct - whether the attempt was correct
 */
export function recordExerciseAttempt(topicId, exIdx, correct) {
  try {
    const all = _loadKey(KEYS.exercises);
    if (!all[topicId]) all[topicId] = {};
    const entry = all[topicId][exIdx] || { attempts: 0, bestResult: false, lastAttempt: null };
    entry.attempts++;
    if (correct) entry.bestResult = true;
    entry.lastAttempt = Date.now();
    all[topicId][exIdx] = entry;
    _saveKey(KEYS.exercises, all);
  } catch { /* silent */ }
}

/**
 * Get exercise history for a topic.
 * @param {string} topicId
 * @returns {object} map of exIdx → { attempts, bestResult, lastAttempt }
 */
export function getExerciseHistory(topicId) {
  try { return _loadKey(KEYS.exercises)[topicId] || {}; } catch { return {}; }
}

/** Get all exercise data across all topics. */
export function allExerciseHistory() {
  try { return _loadKey(KEYS.exercises); } catch { return {}; }
}

// ── Notes ────────────────────────────────────────────────

/** Get the note text for a topic. */
export function getNote(topicId) {
  try { return (_loadKey(KEYS.notes)[topicId]) || ''; } catch { return ''; }
}

/** Save a note for a topic. Empty string removes the note. */
export function setNote(topicId, text) {
  try {
    const notes = _loadKey(KEYS.notes);
    if (text) { notes[topicId] = text; } else { delete notes[topicId]; }
    _saveKey(KEYS.notes, notes);
  } catch { /* silent */ }
}

// ── Bookmarks ────────────────────────────────────────────

/** Toggle a bookmark. Returns the new bookmarked state. */
export function toggleBookmark(topicId) {
  try {
    const bm = _loadKey(KEYS.bookmarks);
    const arr = Array.isArray(bm) ? bm : [];
    const idx = arr.indexOf(topicId);
    if (idx >= 0) { arr.splice(idx, 1); } else { arr.push(topicId); }
    _saveKey(KEYS.bookmarks, arr);
    return idx < 0;
  } catch { return false; }
}

/** Check if a topic is bookmarked. */
export function isBookmarked(topicId) {
  try {
    const arr = _loadKey(KEYS.bookmarks);
    return Array.isArray(arr) && arr.includes(topicId);
  } catch { return false; }
}

/** Get all bookmarked topic IDs. */
export function getBookmarks() {
  try {
    const arr = _loadKey(KEYS.bookmarks);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

// ── Last Viewed (per track) ──────────────────────────────

/** Get the last-viewed topicId for a track. */
export function getLastViewed(track) {
  try { return _loadKey(KEYS.lastViewed)[track] || null; } catch { return null; }
}

/** Set the last-viewed topicId for a track. */
export function setLastViewed(track, topicId) {
  try {
    const lv = _loadKey(KEYS.lastViewed);
    lv[track] = topicId;
    _saveKey(KEYS.lastViewed, lv);
  } catch { /* silent */ }
}

// ── Recent History ───────────────────────────────────────

const MAX_RECENT = 10;

/** Push a topic to the recent history (most recent first, max 10). */
export function pushRecent(topicId) {
  try {
    let recent = _loadKey(KEYS.recent);
    if (!Array.isArray(recent)) recent = [];
    // Remove existing entry for this topic
    recent = recent.filter(r => r.topicId !== topicId);
    recent.unshift({ topicId, timestamp: Date.now() });
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    _saveKey(KEYS.recent, recent);
  } catch { /* silent */ }
}

/** Get the recent history array (most recent first). */
export function getRecent() {
  try {
    const r = _loadKey(KEYS.recent);
    return Array.isArray(r) ? r : [];
  } catch { return []; }
}

// ── Streaks ──────────────────────────────────────────────

/**
 * Update the learning streak. Call on markDone().
 * Compares lastDate to today — extends or resets streak.
 */
export function updateStreak() {
  try {
    const streak = _loadKey(KEYS.streak);
    const today = _todayStr();
    if (streak.lastDate === today) return streak;

    const yesterday = _dateStr(new Date(Date.now() - 86400000));
    if (streak.lastDate === yesterday) {
      streak.currentStreak = (streak.currentStreak || 0) + 1;
    } else if (!streak.lastDate) {
      streak.currentStreak = 1;
    } else {
      streak.currentStreak = 1; // streak broken
    }
    streak.lastDate = today;
    if ((streak.currentStreak || 0) > (streak.longestStreak || 0)) {
      streak.longestStreak = streak.currentStreak;
    }
    _saveKey(KEYS.streak, streak);
    return streak;
  } catch { return { currentStreak: 0, longestStreak: 0, lastDate: null }; }
}

/** Get the current streak data. */
export function getStreak() {
  try {
    const streak = _loadKey(KEYS.streak);
    // Check if streak is still alive (today or yesterday)
    const today = _todayStr();
    const yesterday = _dateStr(new Date(Date.now() - 86400000));
    if (streak.lastDate !== today && streak.lastDate !== yesterday) {
      streak.currentStreak = 0;
    }
    return {
      currentStreak: streak.currentStreak || 0,
      longestStreak: streak.longestStreak || 0,
      lastDate: streak.lastDate || null,
    };
  } catch { return { currentStreak: 0, longestStreak: 0, lastDate: null }; }
}

// ── Preferences ──────────────────────────────────────────

/** Get a preference value. */
export function getPreference(key) {
  try { return _loadKey(KEYS.preferences)[key] ?? null; } catch { return null; }
}

/** Set a preference value. */
export function setPreference(key, value) {
  try {
    const prefs = _loadKey(KEYS.preferences);
    prefs[key] = value;
    _saveKey(KEYS.preferences, prefs);
  } catch { /* silent */ }
}

// ── Single-Topic Reset ──────────────────────────────────

/** Reset all data for a single topic (progress, exercises, notes, bookmark). */
export function resetTopic(topicId) {
  try {
    // Progress
    const progress = _loadKey(KEYS.progress);
    delete progress[topicId];
    _saveKey(KEYS.progress, progress);

    // Exercises
    const exercises = _loadKey(KEYS.exercises);
    delete exercises[topicId];
    _saveKey(KEYS.exercises, exercises);

    // Notes
    const notes = _loadKey(KEYS.notes);
    delete notes[topicId];
    _saveKey(KEYS.notes, notes);

    // Bookmark
    const bm = _loadKey(KEYS.bookmarks);
    if (Array.isArray(bm)) {
      const idx = bm.indexOf(topicId);
      if (idx >= 0) bm.splice(idx, 1);
      _saveKey(KEYS.bookmarks, bm);
    }
  } catch { /* silent */ }
}

// ── Export / Import ──────────────────────────────────────

/** Export all user data as JSON string. */
export function exportJSON() {
  try {
    const data = { schema: SCHEMA_VERSION };
    for (const [name, key] of Object.entries(KEYS)) {
      data[name] = _loadKey(key);
    }
    return JSON.stringify(data, null, 2);
  } catch { return '{}'; }
}

/**
 * Import user data from a JSON string exported by exportJSON().
 * @returns {boolean} true on success
 */
export function importJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    // Support v2 format (just progress)
    if (parsed.progress && !parsed.schema) {
      _saveKey(KEYS.progress, parsed.progress);
      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
      return true;
    }
    // v3 format
    for (const [name, key] of Object.entries(KEYS)) {
      if (parsed[name] !== undefined) {
        _saveKey(key, parsed[name]);
      }
    }
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
    return true;
  } catch { return false; }
}

// ── Internal helpers ─────────────────────────────────────

function _loadKey(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); }
  catch { return {}; }
}

function _saveKey(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function _todayStr() { return _dateStr(new Date()); }

function _dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
