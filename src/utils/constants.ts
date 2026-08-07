/**
 * App-wide constants.
 * Centralizing these avoids magic strings scattered across components.
 */

/** Soft client-side routes (no React Router — state in App.tsx). */
export type AppPage = "home" | "about" | "how-to-use";

/** Footer / about social destinations. */
export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/gabrieldmonteiro",
  github: "https://github.com/gabrieldmonteiro",
} as const;

/** Example LinkedIn fluff shown in the textarea placeholder. */
export const PLACEHOLDER_TEXT =
  "Hoje quero compartilhar com vocês uma reflexão sobre uma jornada que começou há alguns meses...";

/** Rotating copy during model load / generation (UX only). */
export const LOADING_MESSAGES = [
  "⚡ Carregando o raio...",
  "⚡ Removendo storytelling...",
  "⚡ Eliminando clichês...",
  "⚡ Cortando a jornada de aprendizado...",
  "⚡ Separando fato de enrolação...",
  "⚡ Quase terminando...",
] as const;

/**
 * WebLLM model id hosted by MLC.
 * Qwen2.5-1.5B balances Portuguese quality vs download size / VRAM.
 */
export const MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";

/** Interval for cycling LOADING_MESSAGES. */
export const MESSAGE_ROTATION_MS = 2800;
