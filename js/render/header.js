/**
 * render/header.js — Header UI updates (progress bar, tab states).
 */

import { ALL_TOPICS } from '../data.js';
import { allProgress } from '../progress.js';

/** Update the overall progress bar and counter in the header. */
export function updateOverallProgress() {
  const total    = ALL_TOPICS.length;
  const progress = allProgress();
  const done     = ALL_TOPICS.filter(t => progress[t.id]).length;
  const pct      = total ? Math.round((done / total) * 100) : 0;

  const fill  = document.getElementById('overall-fill');
  const pctEl = document.getElementById('overall-pct');
  const count = document.getElementById('overall-count');
  const bar   = document.getElementById('overall-bar');

  if (fill)  fill.style.width     = `${pct}%`;
  if (pctEl) pctEl.textContent    = `${pct}%`;
  if (count) count.textContent    = `${done}/${total} done`;
  if (bar)   bar.setAttribute('aria-valuenow', String(pct));
}

/** Set active state on the track tab buttons. */
export function updateTrackTab(track) {
  document.querySelectorAll('.track-tab').forEach(btn => {
    const isActive = btn.dataset.track === track;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
}

/** Set active state on the mode tab buttons. */
export function updateModeTab(mode) {
  document.querySelectorAll('.mode-tab').forEach(btn => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
}
