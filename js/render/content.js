/**
 * render/content.js — Renders topic content in 4 view modes.
 * All functions are pure: they receive data and return HTML strings.
 * They do NOT read from state directly.
 */

import { esc, tagColors, normAnswer } from '../utils.js';
import { isDone } from '../progress.js';

/** Render the topic title, breadcrumb, and Mark Done button. */
export function renderTopicHeader(stage, topic) {
  document.getElementById('breadcrumb').textContent = `${stage.title} › ${topic.name}`;
  document.getElementById('topic-title').textContent = topic.name;
  _updateDoneBtn(topic.id);
}

/** Update the Mark Done button state (called by router after toggleDone). */
export function updateDoneBtn(topicId) {
  _updateDoneBtn(topicId);
}

/**
 * Render the content area based on the current view mode.
 * @param {object} topic - full topic object from data file
 * @param {string} mode  - 'reference' | 'study' | 'cheatsheet' | 'exercises'
 */
export function renderContent(topic, mode) {
  const area = document.getElementById('content-area');
  switch (mode) {
    case 'reference':  area.innerHTML = _reference(topic);  break;
    case 'study':      area.innerHTML = _study(topic);      break;
    case 'cheatsheet': area.innerHTML = _cheatsheet(topic); break;
    case 'exercises':  area.innerHTML = _exercises(topic);  break;
    default:           area.innerHTML = _reference(topic);
  }
  _bindExerciseHandlers(topic);
}

// ── View: Reference ──────────────────────────────────────

function _reference(t) {
  return `
    <div class="section">
      <div class="section-label">Overview</div>
      <p style="font-size:0.88rem;color:#b0b2c8;line-height:1.75">${esc(t.desc)}</p>
    </div>
    <div class="section">
      <div class="section-label">Code Example</div>
      <div class="code-block">${t.code || '<span class="cm"># Coming soon</span>'}</div>
    </div>
    <div class="section">
      <div class="section-label">Resources</div>
      ${_resourceList(t.resources)}
    </div>`;
}

// ── View: Study Guide ────────────────────────────────────

function _study(t) {
  const preview = (t.cheatsheet || []).slice(0, 6).map(_cheatCard).join('');
  return `
    <div class="section">
      <div class="section-label">Explanation</div>
      <div class="explanation">${t.explanation || '<p>Coming soon.</p>'}</div>
    </div>
    <div class="section">
      <div class="section-label">Code Walkthrough</div>
      <div class="code-block">${t.code || '<span class="cm"># Coming soon</span>'}</div>
    </div>
    <div class="section">
      <div class="section-label">Key Syntax</div>
      <div class="cheat-grid">${preview || '<p style="color:var(--muted);font-size:0.8rem">Coming soon.</p>'}</div>
    </div>
    <div class="section">
      <div class="section-label">Resources</div>
      ${_resourceList(t.resources)}
    </div>`;
}

// ── View: Cheatsheet ─────────────────────────────────────

function _cheatsheet(t) {
  const cards = (t.cheatsheet || []).map(_cheatCard).join('');
  return `
    <div class="section">
      <div class="section-label">Quick Reference — ${esc(t.name)}</div>
      <div class="cheat-grid">${cards || '<p style="color:var(--muted);font-size:0.8rem">Coming soon.</p>'}</div>
    </div>
    <div class="section">
      <div class="section-label">Code Example</div>
      <div class="code-block">${t.code || '<span class="cm"># Coming soon</span>'}</div>
    </div>`;
}

function _cheatCard(c) {
  return `<div class="cheat-card">
    <div class="cheat-syn">${esc(c.syn)}</div>
    <div class="cheat-desc">${esc(c.desc)}</div>
  </div>`;
}

// ── View: Exercises ──────────────────────────────────────

function _exercises(t) {
  if (!t.exercises || t.exercises.length === 0) {
    return `<p style="color:var(--muted);font-family:var(--mono);font-size:0.8rem;line-height:1.8">
      No exercises yet for this topic.<br>
      Use <strong style="color:var(--yellow)">✦ AI Explainer → Give me a quiz</strong>
      to generate practice questions instantly.
    </p>`;
  }
  return `<div class="section">
    <div class="section-label">Practice Exercises</div>
    ${t.exercises.map((ex, i) => _exerciseCard(ex, i)).join('')}
  </div>`;
}

function _exerciseCard(ex, idx) {
  const labels = { mcq: 'Multiple Choice', fill: 'Fill in the Blank', challenge: 'Coding Challenge' };
  const colors = { mcq: 'var(--blue)', fill: 'var(--purple)', challenge: 'var(--orange)' };
  const label  = labels[ex.type] || ex.type;
  const color  = colors[ex.type] || 'var(--muted)';

  if (ex.type === 'mcq') {
    const opts = ex.opts.map((o, i) =>
      `<button class="mcq-opt" data-ex="${idx}" data-opt="${i}" data-correct="${ex.answer}">
        <div class="opt-letter">${'ABCD'[i]}</div>
        <span>${esc(o)}</span>
      </button>`
    ).join('');
    return `<div class="exercise-card">
      <div class="ex-type" style="color:${color}">${label}</div>
      <div class="ex-q">${ex.q}</div>
      <div class="mcq-options" id="mcq-${idx}">${opts}</div>
      <div class="ex-feedback" id="fb-${idx}"></div>
    </div>`;
  }

  if (ex.type === 'fill') {
    return `<div class="exercise-card">
      <div class="ex-type" style="color:${color}">${label}</div>
      <div class="ex-q">${ex.q}</div>
      <div class="fill-pre">${esc(ex.pre)}</div>
      <div class="fill-area">
        <input type="text" class="fill-input" id="fill-${idx}"
               placeholder="Type your answer…"
               data-ex="${idx}"
               data-answer="${esc(ex.answer)}"
               data-feedback="${esc(ex.feedback)}"
               aria-label="Fill in the blank answer">
        <button class="ex-btn" data-check-fill="${idx}">Check</button>
      </div>
      <div class="ex-feedback" id="fb-${idx}"></div>
    </div>`;
  }

  if (ex.type === 'challenge') {
    return `<div class="exercise-card">
      <div class="ex-type" style="color:${color}">${label}</div>
      <div class="ex-q">${ex.q}</div>
      <div class="challenge-area">
        ${ex.hint ? `<div class="challenge-hint">💡 ${esc(ex.hint)}</div>` : ''}
        <textarea class="challenge-textarea"
          placeholder="# Write your solution here…"
          spellcheck="false"
          aria-label="Coding challenge input"></textarea>
      </div>
      <button class="show-answer-btn" data-toggle-answer="${idx}">Show Solution</button>
      <div class="answer-reveal" id="ans-${idx}">
        <pre>${esc(ex.answer)}</pre>
      </div>
    </div>`;
  }

  return '';
}

// ── Resources ────────────────────────────────────────────

function _resourceList(resources) {
  if (!resources || resources.length === 0) {
    return '<p style="color:var(--muted);font-size:0.8rem;font-family:var(--mono)">No resources listed yet.</p>';
  }
  return `<div class="resource-list">${resources.map(r => {
    const { bg, fg } = tagColors(r.tagColor);
    return `<a class="resource-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
      <span class="res-icon" aria-hidden="true">${r.icon}</span>
      <div class="res-info">
        <div class="res-title">${esc(r.title)}</div>
        <div class="res-url">${esc(r.url)}</div>
      </div>
      <span class="res-tag" style="background:${bg};color:${fg}">${esc(r.tag)}</span>
    </a>`;
  }).join('')}</div>`;
}

// ── Exercise event handlers ───────────────────────────────

function _bindExerciseHandlers(topic) {
  const area = document.getElementById('content-area');
  if (!area) return;

  // MCQ options
  area.querySelectorAll('.mcq-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx   = parseInt(btn.dataset.ex, 10);
      const optIdx  = parseInt(btn.dataset.opt, 10);
      const correct = parseInt(btn.dataset.correct, 10);
      const opts    = document.querySelectorAll(`#mcq-${exIdx} .mcq-opt`);
      const fb      = document.getElementById(`fb-${exIdx}`);
      const ex      = topic.exercises?.[exIdx];
      if (!ex || !opts.length || !fb) return;

      opts.forEach(o => o.classList.add('disabled'));
      opts[optIdx]?.classList.add(optIdx === correct ? 'correct' : 'wrong');
      if (optIdx !== correct && opts[correct]) opts[correct].classList.add('correct');

      const ok  = optIdx === correct;
      fb.textContent = ok ? `✓ ${ex.feedback}` : `✗ Incorrect. ${ex.feedback}`;
      fb.className   = `ex-feedback show ${ok ? 'correct' : 'wrong'}`;
    });
  });

  // Fill check buttons
  area.querySelectorAll('[data-check-fill]').forEach(btn => {
    btn.addEventListener('click', () => _checkFill(parseInt(btn.dataset.checkFill, 10)));
  });
  area.querySelectorAll('.fill-input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') _checkFill(parseInt(input.dataset.ex, 10));
    });
  });

  // Show/hide answer
  area.querySelectorAll('[data-toggle-answer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.toggleAnswer;
      const el  = document.getElementById(`ans-${idx}`);
      if (el) el.classList.toggle('show');
    });
  });
}

function _checkFill(exIdx) {
  const input = document.getElementById(`fill-${exIdx}`);
  const fb    = document.getElementById(`fb-${exIdx}`);
  if (!input || !fb) return;

  const userAns = normAnswer(input.value);
  const correct = normAnswer(input.dataset.answer);
  const ok = userAns === correct;

  input.classList.add(ok ? 'correct' : 'wrong');
  fb.textContent = ok ? `✓ ${input.dataset.feedback}` : `✗ Expected: ${input.dataset.answer}`;
  fb.className   = `ex-feedback show ${ok ? 'correct' : 'wrong'}`;
}

// ── Internal helpers ──────────────────────────────────────

function _updateDoneBtn(topicId) {
  const done = isDone(topicId);
  const btn  = document.getElementById('mark-done-btn');
  if (!btn) return;
  btn.textContent = done ? '✓ Done' : 'Mark Done';
  btn.className   = done ? 'done' : 'undone';
  btn.setAttribute('aria-pressed', String(done));
}
