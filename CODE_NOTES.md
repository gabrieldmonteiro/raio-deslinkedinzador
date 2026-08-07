# CODE_NOTES — How, where, and why this codebase works

Maintenance map for **Raio DesLinkedinzador**. Read this before changing summarization, WebGPU checks, or deploy paths.

UI copy is Portuguese; identifiers and these notes are English.

---

## Big picture

| Concern | Decision | Why |
| --- | --- | --- |
| Runtime | Browser-only SPA | Privacy: posts never hit our servers |
| LLM | `@mlc-ai/web-llm` + WebGPU | No API keys; local inference |
| Hosting | GitHub Pages | Static assets only |
| Routing | React state in `App.tsx` | No router/server needed for Pages |
| Theme | `data-theme` + `localStorage` | Only preference stored; never post text |

```
main.tsx
  → applyTheme()
  → <App />
       → Navbar / page switch / Footer
       → HomePage → useUnlinkedin → llmService → WebLLM
                 → utils (summary, prompts, webgpu, errors)
```

---

## Entry & shell

### `src/main.tsx`

**What:** Bootstraps React, loads Syne/Manrope fonts and `index.css`, applies theme before render.

**Why:** Applying theme before `createRoot` reduces a flash of the wrong color scheme.

### `src/App.tsx`

**What:** Holds `page: AppPage` (`home` \| `about` \| `how-to-use`) and theme via `useTheme`. Renders Navbar + one page + Footer.

**Why:** Soft navigation keeps a single `index.html` deploy. Scroll resets on page change for a “new page” feel.

### `src/pages/HomePage.tsx`

**What:** Composes Header, TextInput, CTA, ErrorMessage, LoadingState, ResultCard. Wires `useUnlinkedin`.

**Why:** Keeps `App.tsx` thin (shell only). On WebGPU errors, passes `onOpenHowToUse` so users can open the guide. After success, focuses/scrolls `#result`.

---

## LLM pipeline (core product)

### `src/services/llm.ts` — `llmService` singleton

**What:** Owns `CreateMLCEngine`, load coalescing (`loadPromise`), chat completion, echo retry, optional `unload`.

**Flow:**

1. `ensureReady` → `getWebGPUBlockerMessage` (fail fast)
2. Dynamic `import("@mlc-ai/web-llm")` → `CreateMLCEngine(MODEL_ID)` with progress callback
3. `generate` → truncate → `buildMessages` → `chat.completions.create`
4. `extractText` + `cleanSummary`; if `looksLikeEcho`, call `generateStrictSummary`

**Why:**

- Single Responsibility: UI never talks to WebLLM APIs directly
- One engine per session (download once)
- Concurrent `ensureReady` shares one in-flight load
- Low temperature (~0.2) reduces invented fluff
- Echo detection + stricter retry fights “model pasted the post back”

### `src/utils/prompts.ts`

**What:** System prompt + one few-shot pair + user post message list.

**Why:** Small instruct models follow examples better than instructions alone. Portuguese prompts match the product language.

### `src/utils/summary.ts`

**What:** Pure helpers: `truncateInput`, `extractText`, `cleanSummary`, `looksLikeEcho`.

**Why:** Easy unit tests without GPU/WebLLM. Caps length (`MAX_INPUT_CHARS`) so huge pastes do not explode context/memory.

### `src/utils/constants.ts` — `MODEL_ID`

**What:** `Qwen2.5-0.5B-Instruct-q4f32_1-MLC` with `CONTEXT_WINDOW_SIZE = 1024`

**Why:** Favors reach on common notebooks (iGPU, 8–16 GB RAM) over summarization quality. Changing the id requires a model that WebLLM publishes and that fits typical client GPUs.

---

## WebGPU & errors

### `src/utils/webgpu.ts`

**What:** Sync API check + multi-strategy `requestAdapter` (high-performance → low-power → default → software fallback). Exports Portuguese blocker messages and troubleshooting steps.

**Why:** Many machines expose `navigator.gpu` but return `null` adapters (blocklist, iGPU, remote desktop). Trying several options surfaces usable hardware when possible; otherwise the UI can explain flags/`chrome://gpu`.

### `src/utils/errors.ts` — `mapAppError`

**What:** Turns thrown `Error.message` codes/strings into `{ kind, message }` for the UI.

**Why:** Components stay dumb about string matching; `ErrorMessage` can branch on `kind === "webgpu"` for steps + link.

---

## Hooks

### `src/hooks/useUnlinkedin.ts`

**What:** Home state machine: input, status, error, progress, copied; `unlinkedin`, `resetResult`, `copyResult`.

**Why:** Separates async/status logic from JSX. Pre-checks WebGPU before download. Maps progress/ready callbacks into `loading-model` vs `generating`.

### `src/hooks/useTheme.ts` + `src/utils/theme.ts`

**What:** Resolve stored or system theme; apply `data-theme` / `colorScheme`; persist under `raio-theme`. Follow OS only if no stored preference.

**Why:** Privacy-friendly persistence (theme only). CSS variables in `index.css` react to `[data-theme="dark"]`.

### `src/hooks/useLoadingMessages.ts`

**What:** Cycles `LOADING_MESSAGES` while loading is active.

**Why:** Long first downloads feel less stuck when copy rotates.

---

## UI components (`src/components/`)

| File | Role |
| --- | --- |
| `Navbar.tsx` | Soft routes + brand home + `ThemeToggle` |
| `Header.tsx` | Home brand + subtitle |
| `TextInput.tsx` | Controlled textarea + char count |
| `UnlinkedinButton.tsx` | Primary CTA / busy label |
| `LoadingState.tsx` | Status region + optional % bar |
| `ResultCard.tsx` | Summary + copy + reset (`#result` focus target) |
| `ErrorMessage.tsx` | Alert; GPU steps when `kind === "webgpu"` |
| `CopyButton.tsx` | Copy with short “Copied” feedback |
| `ThemeToggle.tsx` | Light/dark control |
| `About.tsx` | Product / privacy / limits (static) |
| `HowToUse.tsx` | Browser/GPU setup guide (static) |
| `Footer.tsx` | Social links from `SOCIAL_LINKS` |

**Why presentational components:** Easier tests and reuse; business rules stay in hooks/services/utils.

---

## Types

### `src/types/index.ts`

**What:** `AppStatus`, `ErrorKind`, `AppError`, `LoadProgress`, `GenerateOptions`.

**Why:** Shared contracts between hook, service, and UI without circular imports of React modules.

---

## Styles

### `src/index.css`

**What:** Design tokens (LinkedIn-inspired blues/ambers), light/dark themes, layout (navbar, shell, panels), component classes.

**Why:** No CSS-in-JS dependency; theme switch is one attribute on `<html>`. Atmosphere via gradients/grid, not flat fill alone.

---

## Tooling & deploy

### `vite.config.ts`

- `base: "/raio-deslinkedinzador/"` — required for GitHub Pages project sites
- `optimizeDeps.exclude: ["@mlc-ai/web-llm"]` — avoid broken prebundles of WASM/workers
- Vitest: jsdom + Testing Library setup

### `.github/workflows/deploy.yml`

**What:** On push to `main`/`master`: `lint` → `test` → `build` → upload `dist` → Pages deploy.

**Why:** Broken summaries helpers or UI regressions should not ship.

### `src/test/setup.ts`

**What:** Registers `@testing-library/jest-dom` matchers for Vitest.

### Tests under `src/**/*.test.ts(x)`

**What:** Unit tests for pure utils and light component behavior. They do **not** run real WebLLM (no GPU in CI).

**Why:** Catch regressions in echo detection, error mapping, theme, clipboard wrappers without downloading models.

---

## Privacy invariants (do not break)

1. Do **not** send user post text to third-party LLM HTTP APIs.
2. Do **not** persist post text in `localStorage` / IndexedDB (model cache by the browser/WebLLM is separate from app-owned storage).
3. Prefer keeping analytics/trackers absent.
4. Theme key `raio-theme` is the intended app storage exception.

---

## Common change recipes

| Goal | Touch |
| --- | --- |
| Better summaries | `prompts.ts`, temperature/`max_tokens` in `llm.ts`, maybe `MODEL_ID` |
| Stricter echo handling | `looksLikeEcho` in `summary.ts`, `generateStrictSummary` |
| New UI page | `AppPage` in `constants.ts`, Navbar item, branch in `App.tsx` |
| New error kind | `types`, `mapAppError`, `ErrorMessage` |
| Rename GitHub repo | `vite.config.ts` `base`, README URLs, Pages settings |
| Social links | `SOCIAL_LINKS` in `constants.ts` |

---

## Mental model for a new maintainer

1. User pastes text → `useUnlinkedin.unlinkedin`
2. WebGPU gate → `llmService.generate`
3. Model chat → cleaned paragraph → ResultCard
4. Failures → `mapAppError` → ErrorMessage (GPU path → Como usar)

If something “works in code but not on a user’s PC”, start at `webgpu.ts` and the Como usar content—not the React tree.
