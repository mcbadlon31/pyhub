/**
 * main.js — Entry point.
 * Boots the app: runs migrations, validates schema, wires events, renders initial UI.
 */

import { migrate }               from './progress.js';
import { validateSchema }        from './data.js';
import { initRouter, setTrack, setMode,
         selectTopic, markDone,
         navTopic, goHome }      from './router.js';
import { renderSidebar }         from './render/sidebar.js';
import { updateOverallProgress } from './render/header.js';
import { restoreKey, saveKey,
         quickAction, explainCode } from './ai.js';

// ── Boot sequence ─────────────────────────────────────────

function boot() {
  // 1. Migrate localStorage from older schema versions
  migrate();

  // 2. Validate all loaded data files (warnings to console)
  validateSchema();

  // 3. Render initial UI — restore from hash or show welcome
  renderSidebar();
  updateOverallProgress();
  initRouter();

  // 4. Restore AI key
  restoreKey();

  // 5. Wire all event listeners
  _wireEvents();

  console.info('[PyHub] Boot complete');
}

// ── Event wiring ──────────────────────────────────────────

function _wireEvents() {
  // Logo → go home
  document.getElementById('logo')?.addEventListener('click', goHome);

  // Track tabs
  document.querySelectorAll('.track-tab').forEach(btn => {
    btn.addEventListener('click', () => setTrack(btn.dataset.track));
  });

  // Mode tabs
  document.querySelectorAll('.mode-tab').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  // Mark Done
  document.getElementById('mark-done-btn')
    ?.addEventListener('click', markDone);

  // Prev / Next
  document.getElementById('prev-btn')?.addEventListener('click', () => navTopic(-1));
  document.getElementById('next-btn')?.addEventListener('click', () => navTopic(1));

  // AI panel toggle
  const aiPanel  = document.getElementById('ai-panel');
  const aiToggle = document.getElementById('ai-toggle');
  const aiClose  = document.getElementById('ai-close');

  aiToggle?.addEventListener('click', () => _toggleAI(aiPanel));
  aiClose?.addEventListener('click',  () => _closeAI(aiPanel));

  // AI quick action buttons
  document.querySelectorAll('.ai-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => quickAction(btn.dataset.action));
  });

  // AI explain button
  document.getElementById('ai-explain-btn')
    ?.addEventListener('click', explainCode);

  // AI key input
  document.getElementById('ai-key-input')
    ?.addEventListener('input', e => saveKey(e.target.value));

  // Sidebar toggle (mobile)
  const sidebar  = document.getElementById('sidebar');
  const sbToggle = document.getElementById('sidebar-toggle');
  const sbDrop   = document.getElementById('sidebar-backdrop');

  sbToggle?.addEventListener('click', () => _toggleSidebar(sidebar, sbDrop));
  sbDrop?.addEventListener('click',   () => _closeSidebar(sidebar, sbDrop));

  // Close sidebar when a topic is selected on mobile
  sidebar?.addEventListener('click', e => {
    if (e.target.closest('.topic-item')) _closeSidebar(sidebar, sbDrop);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    // Don't capture when typing in inputs/textareas
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      if (aiPanel?.classList.contains('open')) _closeAI(aiPanel);
      if (sidebar?.classList.contains('open')) _closeSidebar(sidebar, sbDrop);
      return;
    }
    // Arrow left/right for prev/next topic
    if (e.key === 'ArrowLeft')  { navTopic(-1); return; }
    if (e.key === 'ArrowRight') { navTopic(1);  return; }
    // 1-4 for mode switching
    const modeKeys = { '1': 'reference', '2': 'study', '3': 'cheatsheet', '4': 'exercises' };
    if (modeKeys[e.key]) { setMode(modeKeys[e.key]); return; }
  });
}

function _toggleAI(panel) {
  const isOpen = panel.classList.toggle('open');
  panel.setAttribute('aria-hidden', String(!isOpen));
}

function _closeAI(panel) {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

function _toggleSidebar(sidebar, backdrop) {
  const isOpen = sidebar.classList.toggle('open');
  backdrop.classList.toggle('show', isOpen);
}

function _closeSidebar(sidebar, backdrop) {
  sidebar.classList.remove('open');
  backdrop.classList.remove('show');
}

// ── Run ───────────────────────────────────────────────────

// DOMContentLoaded is guaranteed since this script loads at end of body
// and type="module" scripts are deferred by default.
document.addEventListener('DOMContentLoaded', boot);
