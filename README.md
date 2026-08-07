# Raio DesLinkedinzador

⚡ Transforme textões do LinkedIn em textos que um ser humano realmente leria.

Single-page application that summarizes overly long LinkedIn posts using an LLM **directly in the browser** via [WebLLM](https://webllm.mlc.ai/). No backend, no API keys, and no sending user text to application servers.

## What it is

**Raio DesLinkedinzador** removes storytelling, corporate clichés, and motivational fluff while preserving facts: roles, companies, numbers, and results. The output is a short paragraph covering the whole post.

## Stack

- React + TypeScript + Vite
- [@mlc-ai/web-llm](https://www.npmjs.com/package/@mlc-ai/web-llm)
- Modern CSS
- GitHub Pages
- Vitest + Testing Library

## Privacy & security

- Processing happens **locally in the browser**
- User text is **not** sent to OpenAI / Gemini / Groq / similar APIs
- No analytics, trackers, or databases
- User posts are **not** stored in `localStorage` or on a server
- No API keys or secrets are required (see `.env.example` and `SECURITY.md`)
- WebLLM downloads public model artifacts for local inference only

## Browser requirements

WebLLM needs **WebGPU**. Recommended:

- Google Chrome (recent)
- Microsoft Edge (recent)

Open the app in a real browser window (not an embedded editor preview).

Check `chrome://gpu` / `edge://gpu` and ensure **WebGPU** is hardware accelerated. See the in-app **Como usar** page for flags and GPU troubleshooting.

## Model

Default: `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`

## Install

```bash
git clone https://github.com/gabrieldmonteiro/raio-deslinkedinzador.git
cd raio-deslinkedinzador
npm install
```

## Local development

```bash
npm run dev
```

Open `http://localhost:5173/raio-deslinkedinzador/`.

Other scripts:

```bash
npm run test           # unit tests
npm run test:coverage  # coverage report
npm run build          # production build
npm run preview        # preview production build
npm run lint           # oxlint
```

## Architecture notes

See **[CODE_NOTES.md](./CODE_NOTES.md)** for a full English map of how, where, and why each module works.

Quick pointers:

- `src/services/llm.ts` — WebLLM orchestration (SRP)
- `src/utils/summary.ts` — pure text helpers (testable)
- `src/utils/errors.ts` — UI error mapping
- `src/pages/HomePage.tsx` — home interaction flow
- `src/App.tsx` — shell / navigation only

## Deploy to GitHub Pages

Configured for:

`https://gabrieldmonteiro.github.io/raio-deslinkedinzador/`

1. Create the GitHub repository `raio-deslinkedinzador`
2. Push `main`
3. In **Settings → Pages**, set source to **GitHub Actions**
4. Workflow: `.github/workflows/deploy.yml`

If the repository name differs, update `base` in `vite.config.ts`.

## Known limitations

- Requires WebGPU-capable hardware/browser
- First model download can be slow and memory-heavy
- Small local models can miss nuance on ambiguous posts

## License

MIT — see `LICENSE`. Model weights follow their upstream licenses (MLC / model authors).
