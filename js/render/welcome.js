/**
 * render/welcome.js — Welcome screen rendering.
 */

import { stagesForTrack, topicsForTrack } from '../data.js';
import { allProgress } from '../progress.js';
import { colorVar } from '../utils.js';

const TRACKS = [
  { key: 'python', icon: '🐍', title: 'Python',           suffix: 'foundations to advanced' },
  { key: 'cs',     icon: '🧮', title: 'CS Fundamentals',  suffix: 'data structures & algorithms' },
  { key: 'ml',     icon: '🤖', title: 'Machine Learning', suffix: 'classical ML to atomistic AI' },
];

/** Render the welcome screen with track cards. */
export function renderWelcome() {
  const container = document.getElementById('welcome');
  const progress  = allProgress();

  const cards = TRACKS.map(tr => {
    const stages = stagesForTrack(tr.key);
    const total  = stages.reduce((n, s) => n + s.topics.length, 0);
    const done   = stages.reduce((n, s) =>
      n + s.topics.filter(t => progress[t.id]).length, 0);
    const pct    = total ? Math.round((done / total) * 100) : 0;
    const accent = { python: 'var(--green)', cs: 'var(--teal)', ml: 'var(--pink)' }[tr.key];

    return `<div class="welcome-track-card" data-track-card="${tr.key}"
              role="button" tabindex="0"
              aria-label="Open ${tr.title} track">
      <div class="wtc-icon">${tr.icon}</div>
      <div class="wtc-title">${tr.title}</div>
      <div class="wtc-desc">${total} topics · ${tr.suffix} · ${pct}% done</div>
      <div class="wtc-bar" style="background:${accent};width:${pct || 4}px;min-width:4px"></div>
    </div>`;
  }).join('');

  container.innerHTML = `
    <h2>Python <span>Hub</span></h2>
    <p>An interactive learning environment built for computational chemists,<br>
    quantum chemists, and materials scientists.</p>
    <div class="welcome-tracks">${cards}</div>`;

  // Bind track card clicks — lazy import to avoid circular deps
  container.querySelectorAll('[data-track-card]').forEach(el => {
    const handler = async () => {
      const { setTrack } = await import('../router.js');
      setTrack(el.dataset.trackCard);
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}
