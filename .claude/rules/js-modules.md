---
paths:
  - "js/**/*.js"
---

# JS Module Rules

When editing JavaScript application files under `js/`:

## ES6 modules only
- Use `export`/`import` everywhere
- Never use `window.X = ...` (data files are the only exception — they use window globals)

## Pure rendering
- Render functions take data as args and return HTML strings
- Never read state directly inside render functions

## DOM updates
- Use targeted DOM updates (getElementById, querySelector)
- Never innerHTML the entire sidebar on a state change

## Security
- Always HTML-escape user/AI content via `esc()` from `js/utils.js`
- try/catch on every `fetch()` and `localStorage` call

## Naming
- camelCase for functions and variables
- UPPER_SNAKE for constants
- kebab-case for file names and element IDs

## Documentation
- JSDoc comment on all functions over 10 lines
