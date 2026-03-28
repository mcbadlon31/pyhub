/**
 * ai.js — Anthropic API integration with SSE streaming.
 * All AI calls go through this module.
 */

import { state } from './state.js';
import { getTopic } from './data.js';
import { esc } from './utils.js';

const API_URL    = 'https://api.anthropic.com/v1/messages';
const MODEL      = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1024;

const SYSTEM_PROMPT = `You are an expert in quantum chemistry, density functional theory (DFT),
computational chemistry, theoretical chemistry, and machine learning for molecules and materials.
The user is a scientist learning Python and ML for research.
All code examples must use chemistry, materials science, or computational chemistry context:
molecular data, ORCA/Gaussian output parsing, energetics, spectroscopy, ASE Atoms objects,
pymatgen Structures, MLIPs, or scientific datasets.
No generic examples with fruits, animals, or arbitrary numbers.
Keep responses concise and educational.`;

// ── Public API ────────────────────────────────────────────

/** Restore saved API key from localStorage on boot. */
export function restoreKey() {
  try {
    const k = localStorage.getItem('pyhub_apikey') || '';
    const el = document.getElementById('ai-key-input');
    if (el) el.value = k;
  } catch { /* silent */ }
}

/** Save API key to localStorage. */
export function saveKey(value) {
  try {
    const trimmed = value.trim();
    if (trimmed) localStorage.setItem('pyhub_apikey', trimmed);
    else          localStorage.removeItem('pyhub_apikey');
  } catch { /* silent */ }
}

/**
 * Send a quick-action prompt for the current topic.
 * @param {string} action - 'example' | 'explain' | 'quiz' | 'pitfalls'
 */
export async function quickAction(action) {
  const topic = state.topicId ? getTopic(state.topicId) : null;
  const name  = topic ? topic.name : 'Python';

  const prompts = {
    example:
      `Show me a clear, practical Python code example demonstrating "${name}". ` +
      `Use computational chemistry or materials science context throughout. ` +
      `Include inline comments explaining each key step.`,
    explain:
      `Explain the concept of "${name}" in Python. ` +
      `Cover: what it is, why a computational chemist needs it, and when to use it. ` +
      `Use concrete examples from QC/compchem/materials workflows.`,
    quiz:
      `Give me 3 multiple-choice questions about "${name}" in Python. ` +
      `For each: write the question, list 4 options (A–D), state the correct answer, ` +
      `and give a brief explanation. Use chemistry or materials context for the questions.`,
    pitfalls:
      `What are the 3 most common mistakes beginners make with "${name}" in Python? ` +
      `For each: show the wrong way and the correct way with code examples. ` +
      `Use chemistry-relevant variable names and context.`,
  };

  const prompt = prompts[action];
  if (!prompt) return;

  document.getElementById('ai-code-input').value = '';
  await _stream(prompt);
}

/** Explain pasted code from the AI code input textarea. */
export async function explainCode() {
  const code = document.getElementById('ai-code-input')?.value.trim();
  if (!code) {
    _showResponse('<em style="color:var(--muted)">Paste some code first, then click Explain.</em>');
    return;
  }
  const prompt =
    `Explain this Python code clearly and concisely for a computational chemist. ` +
    `Go line by line where helpful. Note what each section does in the context of ` +
    `chemistry or materials science:\n\n\`\`\`python\n${code}\n\`\`\``;
  await _stream(prompt);
}

// ── Streaming implementation ──────────────────────────────

async function _stream(userPrompt) {
  const btn  = document.getElementById('ai-explain-btn');
  const resp = document.getElementById('ai-response');

  if (btn) { btn.disabled = true; btn.textContent = '⟳ Thinking…'; }
  resp.className = 'show';
  resp.innerHTML = '<span class="ai-cursor"></span>';

  let fullText = '';

  try {
    const headers = { 'Content-Type': 'application/json' };
    const savedKey = _getKey();
    if (savedKey) {
      headers['x-api-key']        = savedKey;
      headers['anthropic-version'] = '2023-06-01';
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        stream:     true,
        system:     SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    // Parse SSE stream
    const reader  = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') break;
        try {
          const json = JSON.parse(data);
          const delta = json.delta?.text || '';
          if (delta) {
            fullText += delta;
            resp.innerHTML = _format(fullText) + '<span class="ai-cursor"></span>';
          }
        } catch { /* skip malformed chunks */ }
      }
    }

    // Final render without cursor
    resp.innerHTML = _format(fullText);

  } catch (err) {
    resp.innerHTML =
      `<span style="color:var(--red)">Error: ${esc(err.message)}.<br>` +
      `If using standalone, paste your Anthropic API key in the field below.</span>`;
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Explain This Code'; }
}

// ── Response formatting ───────────────────────────────────

function _format(raw) {
  // Escape HTML first, then apply lightweight markdown
  let text = esc(raw);

  // Fenced code blocks  ```...```
  text = text.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) =>
    `<pre>${code.trim()}</pre>`
  );

  // Inline code  `x`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold  **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Paragraphs
  text = text
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return text;
}

function _getKey() {
  try { return localStorage.getItem('pyhub_apikey') || ''; }
  catch { return ''; }
}

function _showResponse(html) {
  const el = document.getElementById('ai-response');
  if (!el) return;
  el.innerHTML  = html;
  el.className  = 'show';
}
