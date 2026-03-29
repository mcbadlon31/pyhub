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
  const cheatPreview = (t.cheatsheet || []).slice(0, 4).map(_cheatCard).join('');
  const exCount = (t.exercises || []).length;
  return `
    <div class="topic-intro">
      <p class="topic-desc">${esc(t.desc)}</p>
    </div>
    <div class="section">
      <div class="section-label">Explanation</div>
      <div class="explanation">${t.explanation || '<p>Coming soon.</p>'}</div>
    </div>
    <div class="section">
      <div class="section-label">Code Example</div>
      ${_codeBlock(t.code)}
    </div>
    ${cheatPreview ? `<div class="section">
      <div class="section-label">Key Syntax</div>
      <div class="cheat-grid">${cheatPreview}</div>
      <p class="view-more-hint">Switch to <strong>Cheatsheet</strong> for the full reference →</p>
    </div>` : ''}
    ${exCount > 0 ? `<div class="section">
      <div class="section-label">Practice</div>
      <div class="practice-prompt">
        <span class="practice-count">${exCount}</span> exercise${exCount > 1 ? 's' : ''} available
        <span class="practice-hint">— switch to <strong>Exercises</strong> to test your understanding</span>
      </div>
    </div>` : ''}
    <div class="section">
      <div class="section-label">Resources</div>
      ${_resourceList(t.resources)}
    </div>`;
}

// ── View: Study Guide ────────────────────────────────────

function _study(t) {
  const allCheat = (t.cheatsheet || []).map(_cheatCard).join('');
  return `
    <div class="topic-intro">
      <div class="study-goal">
        <span class="study-goal-label">Learning Goal</span>
        <p>${esc(t.desc)}</p>
      </div>
    </div>
    <div class="section">
      <div class="section-label">1 · Understand</div>
      <div class="explanation">${t.explanation || '<p>Coming soon.</p>'}</div>
    </div>
    <div class="section">
      <div class="section-label">2 · Read the Code</div>
      <p class="section-hint">Study each line — comments explain what happens and why.</p>
      ${_codeBlock(t.code)}
    </div>
    <div class="section">
      <div class="section-label">3 · Memorize Syntax</div>
      <p class="section-hint">Key patterns you'll use repeatedly.</p>
      <div class="cheat-grid">${allCheat || '<p style="color:var(--muted);font-size:0.85rem">Coming soon.</p>'}</div>
    </div>
    <div class="section">
      <div class="section-label">4 · Go Deeper</div>
      ${_resourceList(t.resources)}
    </div>`;
}

// ── View: Cheatsheet ─────────────────────────────────────

function _cheatsheet(t) {
  const cards = (t.cheatsheet || []).map(_cheatCard).join('');
  return `
    <div class="section">
      <div class="section-label">Quick Reference — ${esc(t.name)}</div>
      <div class="cheat-grid">${cards || '<p style="color:var(--muted);font-size:0.85rem">Coming soon.</p>'}</div>
    </div>
    <div class="section">
      <div class="section-label">Full Code Example</div>
      ${_codeBlock(t.code)}
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
    return `<div class="empty-exercises">
      <div class="empty-icon">✦</div>
      <p>No exercises yet for this topic.</p>
      <p class="empty-hint">Use <strong>AI Explainer → Give me a quiz</strong> to generate practice questions instantly.</p>
    </div>`;
  }
  const mcqs = t.exercises.filter(e => e.type === 'mcq').length;
  const fills = t.exercises.filter(e => e.type === 'fill').length;
  const challenges = t.exercises.filter(e => e.type === 'challenge').length;

  const summary = [
    mcqs > 0 ? `${mcqs} multiple choice` : '',
    fills > 0 ? `${fills} fill-in` : '',
    challenges > 0 ? `${challenges} coding challenge${challenges > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(' · ');

  return `
    <div class="exercise-summary">
      <span class="exercise-summary-count">${t.exercises.length} exercises</span>
      <span class="exercise-summary-types">${summary}</span>
    </div>
    ${t.exercises.map((ex, i) => _exerciseCard(ex, i, t.exercises.length)).join('')}`;
}

function _exerciseCard(ex, idx, total) {
  const labels = { mcq: 'Multiple Choice', fill: 'Fill in the Blank', challenge: 'Coding Challenge' };
  const colors = { mcq: 'var(--blue)', fill: 'var(--purple)', challenge: 'var(--orange)' };
  const icons  = { mcq: '○', fill: '▸', challenge: '⟨/⟩' };
  const label  = labels[ex.type] || ex.type;
  const color  = colors[ex.type] || 'var(--muted)';
  const icon   = icons[ex.type] || '•';
  const num    = `${idx + 1}/${total}`;

  if (ex.type === 'mcq') {
    const opts = ex.opts.map((o, i) =>
      `<button class="mcq-opt" data-ex="${idx}" data-opt="${i}" data-correct="${ex.answer}">
        <div class="opt-letter">${'ABCD'[i]}</div>
        <span>${esc(o)}</span>
      </button>`
    ).join('');
    return `<div class="exercise-card">
      <div class="ex-type" style="color:${color}"><span class="ex-icon">${icon}</span> ${num} · ${label}</div>
      <div class="ex-q">${ex.q}</div>
      <div class="mcq-options" id="mcq-${idx}">${opts}</div>
      <div class="ex-feedback" id="fb-${idx}"></div>
    </div>`;
  }

  if (ex.type === 'fill') {
    return `<div class="exercise-card">
      <div class="ex-type" style="color:${color}"><span class="ex-icon">${icon}</span> ${num} · ${label}</div>
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
    return `<div class="exercise-card challenge">
      <div class="ex-type" style="color:${color}"><span class="ex-icon">${icon}</span> ${num} · ${label}</div>
      <div class="ex-q">${ex.q}</div>
      <div class="challenge-area">
        ${ex.hint ? `<div class="challenge-hint">Hint: ${esc(ex.hint)}</div>` : ''}
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
    return '<p style="color:var(--muted);font-size:0.85rem;font-family:var(--mono)">No resources listed yet.</p>';
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

  // Copy buttons
  area.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeEl = btn.closest('.code-block-wrap')?.querySelector('.code-block');
      if (!codeEl) return;
      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      });
    });
  });

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
      fb.textContent = ok ? `Correct — ${ex.feedback}` : `Incorrect — ${ex.feedback}`;
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
      if (!el) return;
      const showing = el.classList.toggle('show');
      btn.textContent = showing ? 'Hide Solution' : 'Show Solution';
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

  input.classList.remove('correct', 'wrong');
  input.classList.add(ok ? 'correct' : 'wrong');
  fb.textContent = ok ? `Correct — ${input.dataset.feedback}` : `Expected: ${input.dataset.answer}`;
  fb.className   = `ex-feedback show ${ok ? 'correct' : 'wrong'}`;
}

// ── Code block with copy button ──────────────────────────

function _codeBlock(code) {
  const content = code || '<span class="cm"># Coming soon</span>';
  return `<div class="code-block-wrap">
    <button class="code-copy-btn" aria-label="Copy code">Copy</button>
    <div class="code-block">${content}</div>
  </div>`;
}

// ── Internal helpers ──────────────────────────────────────

function _updateDoneBtn(topicId) {
  const done = isDone(topicId);
  const btn  = document.getElementById('mark-done-btn');
  if (!btn) return;
  btn.textContent = done ? 'Done' : 'Mark Done';
  btn.className   = done ? 'done' : 'undone';
  btn.setAttribute('aria-pressed', String(done));
}
