/**
 * router.js — Routing logic for track, topic, and mode changes.
 * All navigation goes through these functions — never direct state mutation.
 * Hash-based URL routing: #track/topicId/mode (e.g. #python/variables/study)
 */

import { state, setState } from './state.js';
import { stagesForTrack, topicsForTrack, getStage, getTopic } from './data.js';
import { renderSidebar, updateSidebarActive, updateStageProgress, updateTopicCheck } from './render/sidebar.js';
import { renderWelcome } from './render/welcome.js';
import { renderTopicHeader, renderContent } from './render/content.js';
import { updateOverallProgress, updateModeTab, updateTrackTab } from './render/header.js';
import { isDone, toggleDone as _toggleDone,
         setLastViewed, getLastViewed, pushRecent } from './progress.js';

/** Flag to prevent re-entrance when we push a hash ourselves. */
let _suppressHash = false;

// ── Public API ───────────────────────────────────────────

/**
 * Initialize routing. Called once in boot().
 * Restores state from hash or shows welcome.
 */
export function initRouter() {
  window.addEventListener('hashchange', _onHashChange);
  if (!_restoreFromHash()) {
    _showWelcome();
  }
}

/**
 * Switch to a different track. Navigates to last-viewed topic or first topic.
 * @param {string} track - 'python' | 'cs' | 'ml'
 */
export function setTrack(track) {
  setState({ track, stageId: null, topicId: null });
  document.documentElement.setAttribute('data-track', track);
  updateTrackTab(track);
  renderSidebar();
  updateOverallProgress();

  // Smart switching: go to last-viewed topic or first topic
  const lastId = getLastViewed(track);
  const lastTopic = lastId ? getTopic(lastId) : null;
  if (lastTopic && lastTopic.track === track) {
    selectTopic(lastTopic.stageId, lastTopic.id);
  } else {
    const topics = topicsForTrack(track);
    if (topics.length > 0) {
      selectTopic(topics[0].stageId, topics[0].id);
    }
  }
}

/**
 * Show the welcome/home page. Hides sidebar and topic content.
 */
export function goHome() {
  setState({ stageId: null, topicId: null });
  _showWelcome();
  _pushHash();
}

/**
 * Navigate to a specific topic.
 * @param {string} stageId - e.g. 'py-s1'
 * @param {string} topicId - e.g. 'variables'
 */
export function selectTopic(stageId, topicId) {
  const stage = getStage(stageId);
  const topic = getTopic(topicId);
  if (!stage || !topic) return;

  setState({ stageId, topicId });
  showTopicContent();
  renderTopicHeader(stage, topic);
  renderContent(topic, state.mode);
  updateSidebarActive(topicId, stageId);
  updateNavButtons();
  document.getElementById('main').scrollTop = 0;

  // Persist last-viewed and recent
  setLastViewed(state.track, topicId);
  pushRecent(topicId);
  _pushHash();
}

/**
 * Switch view mode.
 * @param {string} mode - 'reference' | 'study' | 'cheatsheet' | 'exercises'
 */
export function setMode(mode) {
  setState({ mode });
  updateModeTab(mode);
  if (state.topicId) {
    const topic = getTopic(state.topicId);
    if (topic) renderContent(topic, mode);
  }
  _pushHash();
}

/**
 * Toggle the current topic's done state.
 * Updates sidebar checkmark, stage bar, and overall progress.
 */
export function markDone() {
  if (!state.topicId) return;
  const newValue = _toggleDone(state.topicId);

  // Update Mark Done button
  const btn = document.getElementById('mark-done-btn');
  if (btn) {
    btn.textContent  = newValue ? '✓ Done' : 'Mark Done';
    btn.className    = newValue ? 'done' : 'undone';
    btn.setAttribute('aria-pressed', String(newValue));
  }

  // Targeted sidebar updates (no full re-render)
  updateTopicCheck(state.topicId, newValue);
  updateStageProgress(state.stageId);
  updateOverallProgress();
}

/**
 * Navigate to previous or next topic within the current track.
 * @param {number} dir - -1 for previous, +1 for next
 */
export function navTopic(dir) {
  if (!state.topicId) return;
  const trackTopics = topicsForTrack(state.track);
  const idx = trackTopics.findIndex(t => t.id === state.topicId);
  const next = trackTopics[idx + dir];
  if (next) selectTopic(next.stageId, next.id);
}

// ── Hash routing ─────────────────────────────────────────

/**
 * Push current state to location.hash.
 * Format: #track/topicId/mode or # for home.
 */
function _pushHash() {
  _suppressHash = true;
  if (state.topicId) {
    location.hash = `${state.track}/${state.topicId}/${state.mode}`;
  } else {
    location.hash = '';
  }
  // Allow hashchange to fire and be ignored, then re-enable
  requestAnimationFrame(() => { _suppressHash = false; });
}

/** Handle browser back/forward via hashchange. */
function _onHashChange() {
  if (_suppressHash) return;
  _restoreFromHash();
}

/**
 * Parse the current hash and navigate to the encoded state.
 * @returns {boolean} true if hash contained a valid route
 */
function _restoreFromHash() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (!hash) return false;

  const parts = hash.split('/');
  const [track, topicId, mode] = parts;

  // Validate track
  if (!['python', 'cs', 'ml'].includes(track)) return false;

  // If no topic, just switch track
  if (!topicId) {
    setTrack(track);
    return true;
  }

  // Validate topic exists in the specified track
  const topic = getTopic(topicId);
  if (!topic || topic.track !== track) return false;

  // Apply track if different
  if (state.track !== track) {
    setState({ track });
    document.documentElement.setAttribute('data-track', track);
    updateTrackTab(track);
    renderSidebar();
    updateOverallProgress();
  }

  // Apply mode if valid
  const validModes = ['reference', 'study', 'cheatsheet', 'exercises'];
  if (mode && validModes.includes(mode) && state.mode !== mode) {
    setState({ mode });
    updateModeTab(mode);
  }

  // Navigate to topic (without pushing hash again)
  const stage = getStage(topic.stageId);
  if (!stage) return false;

  setState({ stageId: topic.stageId, topicId });
  showTopicContent();
  renderTopicHeader(stage, topic);
  renderContent(topic, state.mode);
  updateSidebarActive(topicId, topic.stageId);
  updateNavButtons();
  document.getElementById('main').scrollTop = 0;

  setLastViewed(track, topicId);
  pushRecent(topicId);
  return true;
}

// ── Internal helpers ─────────────────────────────────────

function _showWelcome() {
  document.getElementById('welcome').removeAttribute('hidden');
  document.getElementById('topic-content').setAttribute('hidden', '');
  document.getElementById('sidebar').classList.add('hidden-home');
  renderWelcome();
}

function showTopicContent() {
  document.getElementById('welcome').setAttribute('hidden', '');
  document.getElementById('topic-content').removeAttribute('hidden');
  document.getElementById('sidebar').classList.remove('hidden-home');
}

function updateNavButtons() {
  const trackTopics = topicsForTrack(state.track);
  const idx = trackTopics.findIndex(t => t.id === state.topicId);
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) nextBtn.disabled = idx >= trackTopics.length - 1;
}
