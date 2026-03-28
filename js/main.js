/**
 * main.js — Entry point.
 * Boots the app: runs migrations, validates schema, wires events, renders initial UI.
 */

import { migrate }               from './progress.js';
import { validateSchema }        from './data.js';
import { setTrack, setMode,
         selectTopic, markDone,
         navTopic }              from './router.js';
import { renderSidebar }         from './render/sidebar.js';
import { renderWelcome }         from './render/welcome.js';
import { updateOverallProgress } from './render/header.js';
import { restoreKey, saveKey,
         quickAction, explainCode } from './ai.js';

// ── Boot sequence ─────────────────────────────────────────

function boot() {
  // 1. Migrate localStorage from older schema versions
  migrate();

  // 2. Validate all loaded data files (warnings to console)
  validateSchema();

  // 3. Render initial UI
  renderSidebar();
  renderWelcome();
  updateOverallProgress();

  // 4. Restore AI key
  restoreKey();

  // 5. Wire all event listeners
  _wireEvents();

  // 6. Open the first stage group in the sidebar by default
  const firstGroup = document.querySelector('.stage-group');
  if (firstGroup) firstGroup.classList.add('open');

  console.info('[PyHub] Boot complete');
}

// ── Event wiring ──────────────────────────────────────────

function _wireEvents() {
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

  // Keyboard: Escape closes AI panel
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && aiPanel?.classList.contains('open')) {
      _closeAI(aiPanel);
    }
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

// ── Run ───────────────────────────────────────────────────

// DOMContentLoaded is guaranteed since this script loads at end of body
// and type="module" scripts are deferred by default.
document.addEventListener('DOMContentLoaded', boot);
