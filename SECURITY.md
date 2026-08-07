# Security Policy

## Reporting a vulnerability

If you find a security issue in this project, please open a private report via GitHub Security Advisories or contact the maintainer.

## Project security posture

This app is designed to run **entirely in the browser**:

- No backend
- No API keys
- No paid LLM providers
- User text is **not** sent to application servers
- User text is **not** stored in `localStorage` / databases

The only third-party downloads are public WebLLM model artifacts (weights/wasm) required for local inference.

## Secrets checklist for contributors

- Never commit `.env`, credentials, private keys, or tokens
- Never hardcode API keys, passwords, or access tokens in source
- Prefer GitHub Actions OIDC / built-in `GITHUB_TOKEN` for deploy workflows
- Review PRs for accidental secret leaks before merge
