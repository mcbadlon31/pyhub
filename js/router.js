/**
 * router.js — Routing logic for track, topic, and mode changes.
 * All navigation goes through these functions — never direct state mutation.
 */

import { state, setState } from './state.js';
import { stagesForTrack, topicsForTrack, getStage, getTopic } from './data.js';
import { renderSidebar, updateSidebarActive, updateStageProgress, updateTopicCheck } from './render/sidebar.js';
import { renderWelcome } from './render/welcome.js';
import { renderTopicHeader, renderContent } from './render/content.js';
import { updateOverallProgress, updateModeTab, updateTrackTab } from './render/header.js';
import { isDone, toggleDone as _toggleDone } from './progress.js';

/**
 * Switch to a different track. Resets topic selection.
 * @param {string} track - 'python' | 'cs' | 'ml'
 */
export function setTrack(track) {
  setState({ track, stageId: null, topicId: null });
  document.documentElement.setAttribute('data-track', track);
  updateTrackTab(track);
  renderSidebar();
  showWelcome();
  updateOverallProgress();
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

// ── Internal helpers ─────────────────────────────────────

function showWelcome() {
  document.getElementById('welcome').removeAttribute('hidden');
  document.getElementById('topic-content').setAttribute('hidden', '');
  renderWelcome();
}

function showTopicContent() {
  document.getElementById('welcome').setAttribute('hidden', '');
  document.getElementById('topic-content').removeAttribute('hidden');
}

function updateNavButtons() {
  const trackTopics = topicsForTrack(state.track);
  const idx = trackTopics.findIndex(t => t.id === state.topicId);
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) nextBtn.disabled = idx >= trackTopics.length - 1;
}
