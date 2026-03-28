/**
 * state.js — Single source of truth for all app state.
 * No other module mutates state directly; they call the
 * exported setter functions or dispatch through router.js.
 */

export const state = {
  track:   'python',    // 'python' | 'cs' | 'ml'
  stageId: null,        // e.g. 'py-s1'  (format: {track}-s{n})
  topicId: null,        // e.g. 'variables' (globally unique)
  mode:    'reference', // 'reference' | 'study' | 'cheatsheet' | 'exercises'
  aiOpen:  false,
};

/** Update one or more state keys. */
export function setState(updates) {
  Object.assign(state, updates);
}
