/**
 * Shared domain types for the SPA.
 * Kept in one place so UI, hooks, and the LLM service agree on shapes.
 */

/** UI workflow state for a single summarization run. */
export type AppStatus =
  | "idle"
  | "loading-model"
  | "generating"
  | "success"
  | "error";

/** Categorized failure kinds used by ErrorMessage and mapAppError. */
export type ErrorKind =
  | "empty"
  | "webgpu"
  | "model-load"
  | "generation"
  | "clipboard"
  | "unknown";

/** User-facing error payload (kind drives extra UI like GPU steps). */
export interface AppError {
  kind: ErrorKind;
  message: string;
}

/** Progress reports forwarded from WebLLM while downloading/initializing the model. */
export interface LoadProgress {
  progress: number;
  text: string;
}

/** Options for llmService.generate — text in, optional UI callbacks out. */
export interface GenerateOptions {
  text: string;
  onProgress?: (report: LoadProgress) => void;
  onReady?: () => void;
}
