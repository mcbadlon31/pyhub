/**
 * render/sidebar.js — Sidebar rendering and targeted DOM updates.
 * Full re-render only on track switch. All other updates are targeted.
 */

import { stagesForTrack, topicsForTrack } from '../data.js';
import { isDone, allProgress } from '../progress.js';
import { colorVar } from '../utils.js';
import { state } from '../state.js';

/** Full sidebar render — called only on track switch or boot. */
export function renderSidebar() {
  const container = document.getElementById('sidebar');
  const stages = stagesForTrack(state.track);
  const progress = allProgress();

  container.innerHTML = `<div class="sidebar-search">
    <input type="text" id="sidebar-search-input" placeholder="Search topics…"
           aria-label="Filter topics by name">
  </div>` + stages.map(stage => _stageHTML(stage, progress)).join('');

  _bindStageClicks(container);
  _bindSearch(container);
}

/** Targeted: update a single topic's checkmark and done state. */
export function updateTopicCheck(topicId, done) {
  const el = document.getElementById(`tc-${topicId}`);
  if (!el) return;
  el.className = `topic-check${done ? ' done' : ''}`;
  el.textContent = done ? '✓' : '';
  const item = document.getElementById(`ti-${topicId}`);
  if (item) item.classList.toggle('done', done);
}

/** Targeted: update a stage's progress bar and count label. */
export function updateStageProgress(stageId) {
  const stages = stagesForTrack(state.track);
  const stage  = stages.find(s => s.id === stageId);
  if (!stage) return;

  const done  = stage.topics.filter(t => isDone(t.id)).length;
  const total = stage.topics.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  const bar   = document.getElementById(`spf-${stageId}`);
  const label = document.getElementById(`sglabel-${stageId}`);
  if (bar)   bar.style.width = `${pct}%`;
  if (label) label.textContent = `${done}/${total} done`;
}

/**
 * Targeted: update the active topic highlight in sidebar.
 * Also ensures the correct stage group is open.
 */
export function updateSidebarActive(topicId, stageId) {
  // Remove all active states
  document.querySelectorAll('.topic-item').forEach(el => el.classList.remove('active'));
  // Set new active
  const el = document.getElementById(`ti-${topicId}`);
  if (el) el.classList.add('active');

  // Open correct stage group, close others
  document.querySelectorAll('.stage-group').forEach(el => el.classList.remove('open'));
  const sg = document.getElementById(`sg-${stageId}`);
  if (sg) sg.classList.add('open');
}

// ── Internal ─────────────────────────────────────────────

function _stageHTML(stage, progress) {
  const done  = stage.topics.filter(t => progress[t.id]).length;
  const total = stage.topics.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  const col   = colorVar(stage.color);
  const isOpen = stage.id === state.stageId;

  const topicsHTML = stage.topics.map(t => {
    const d      = !!progress[t.id];
    const active = t.id === state.topicId;
    return `<div class="topic-item${active ? ' active' : ''}"
               id="ti-${t.id}"
               role="button"
               tabindex="0"
               data-stage="${stage.id}"
               data-topic="${t.id}"
               aria-label="${t.name}${d ? ' (done)' : ''}">
      <div class="topic-check${d ? ' done' : ''}" id="tc-${t.id}">${d ? '✓' : ''}</div>
      <div class="topic-text-sb">
        <span class="topic-name-sb">${t.name}</span>
        <span class="topic-desc-sb">${t.desc}</span>
      </div>
    </div>`;
  }).join('');

  return `<div class="stage-group${isOpen ? ' open' : ''}" id="sg-${stage.id}">
    <div class="stage-group-header"
         role="button"
         tabindex="0"
         aria-expanded="${isOpen}"
         data-stage-toggle="${stage.id}"
         style="border-left: 3px solid ${col}">
      <div class="sg-info">
        <div class="sg-title">${stage.num}. ${stage.title}</div>
        <div class="sg-prog" id="sglabel-${stage.id}">${done}/${total} done</div>
      </div>
      <span class="sg-arrow" aria-hidden="true">▶</span>
    </div>
    <div class="sg-prog-bar">
      <div class="sg-prog-fill" id="spf-${stage.id}"
           style="width:${pct}%; background:${col}"></div>
    </div>
    <div class="topic-list" role="list">${topicsHTML}</div>
  </div>`;
}

/** Bind search input to filter topics in the sidebar. */
function _bindSearch(container) {
  const input = document.getElementById('sidebar-search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    container.querySelectorAll('.topic-item').forEach(el => {
      const name = el.querySelector('.topic-name-sb')?.textContent.toLowerCase() || '';
      const desc = el.querySelector('.topic-desc-sb')?.textContent.toLowerCase() || '';
      el.style.display = (!q || name.includes(q) || desc.includes(q)) ? '' : 'none';
    });
    // Open all stage groups when searching, restore when cleared
    container.querySelectorAll('.stage-group').forEach(sg => {
      if (q) {
        sg.classList.add('open');
      } else {
        const hasActive = sg.querySelector('.topic-item.active');
        sg.classList.toggle('open', !!hasActive);
      }
    });
  });
}

function _bindStageClicks(container) {
  // Stage header toggle
  container.querySelectorAll('[data-stage-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      const stageId = el.dataset.stageToggle;
      const sg = document.getElementById(`sg-${stageId}`);
      const wasOpen = sg.classList.contains('open');
      document.querySelectorAll('.stage-group').forEach(e => e.classList.remove('open'));
      if (!wasOpen) sg.classList.add('open');
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

  // Topic selection — import router lazily to avoid circular dependency
  container.querySelectorAll('[data-topic]').forEach(el => {
    const handler = async () => {
      const { selectTopic } = await import('../router.js');
      selectTopic(el.dataset.stage, el.dataset.topic);
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}
