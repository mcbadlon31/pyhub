/**
 * utils.js — Shared utility functions.
 * Import from here rather than duplicating across modules.
 */

/**
 * HTML-escape a string before inserting via innerHTML.
 * Always call this on AI responses and user input.
 * @param {string} str
 * @returns {string}
 */
export function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Map a color name (from data file 'color' field) to a CSS variable string.
 * @param {string} name - e.g. 'green', 'lime', 'cyan'
 * @returns {string} - e.g. 'var(--green)'
 */
export function colorVar(name) {
  const known = ['green','blue','purple','orange','red','teal','pink','cyan','lime','yellow'];
  return known.includes(name) ? `var(--${name})` : 'var(--muted)';
}

/**
 * Return the background + text color for a resource tag chip.
 * @param {string} tagColor
 * @returns {{ bg: string, fg: string }}
 */
export function tagColors(tagColor) {
  const map = {
    blue:   { bg: 'rgba(91,156,246,0.15)',  fg: 'var(--blue)'   },
    green:  { bg: 'rgba(62,255,160,0.12)',  fg: 'var(--green)'  },
    orange: { bg: 'rgba(255,159,67,0.12)',  fg: 'var(--orange)' },
    purple: { bg: 'rgba(183,148,244,0.12)', fg: 'var(--purple)' },
    teal:   { bg: 'rgba(45,212,191,0.12)',  fg: 'var(--teal)'   },
    cyan:   { bg: 'rgba(103,232,249,0.12)', fg: 'var(--cyan)'   },
    lime:   { bg: 'rgba(163,230,53,0.12)',  fg: 'var(--lime)'   },
  };
  return map[tagColor] || map.blue;
}

/**
 * Normalize a fill-in-blank answer for loose matching.
 * Case-insensitive, strips whitespace, dots, and ellipsis.
 * @param {string} s
 * @returns {string}
 */
export function normAnswer(s) {
  return String(s).toLowerCase().replace(/[\s.…]+/g, '');
}
