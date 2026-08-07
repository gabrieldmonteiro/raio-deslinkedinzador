/**
 * WebLLM orchestration (Single Responsibility).
 * Owns engine lifecycle, load coalescing, and generation retries.
 * Pure text transforms live in utils/summary.ts; prompts in utils/prompts.ts.
 */

import type {
  InitProgressReport,
  MLCEngineInterface,
} from "@mlc-ai/web-llm";
import { MODEL_ID } from "../utils/constants";
import { buildMessages } from "../utils/prompts";
import {
  cleanSummary,
  extractText,
  looksLikeEcho,
  truncateInput,
} from "../utils/summary";
import {
  getWebGPUBlockerMessage,
  isWebGPUAvailabilityError,
  WEBGPU_ERROR_MESSAGE,
} from "../utils/webgpu";
import type { GenerateOptions, LoadProgress } from "../types";

type EngineState = "idle" | "loading" | "ready" | "error";

class LlmService {
  private engine: MLCEngineInterface | null = null;
  private state: EngineState = "idle";
  /** Shared in-flight load so concurrent ensureReady() calls wait on one CreateMLCEngine. */
  private loadPromise: Promise<void> | null = null;
  private lastError: string | null = null;

  getStatus(): EngineState {
    return this.state;
  }

  getLastError(): string | null {
    return this.lastError;
  }

  isReady(): boolean {
    return this.state === "ready" && this.engine !== null;
  }

  /**
   * Ensure the engine is loaded. Fail early if WebGPU is blocked.
   * Safe to call repeatedly; caches the ready engine for later runs.
   */
  async ensureReady(onProgress?: (report: LoadProgress) => void): Promise<void> {
    const blocker = await getWebGPUBlockerMessage();
    if (blocker) {
      this.state = "error";
      this.lastError = blocker;
      throw new Error(blocker);
    }

    if (this.isReady()) {
      return;
    }

    // Another caller already started loading — wait for that promise.
    if (this.loadPromise) {
      await this.loadPromise;
      if (!this.isReady()) {
        throw new Error(this.lastError ?? "Não foi possível carregar o modelo.");
      }
      return;
    }

    this.state = "loading";
    this.lastError = null;
    this.loadPromise = this.loadEngine(onProgress);

    try {
      await this.loadPromise;
    } finally {
      this.loadPromise = null;
    }
  }

  private async loadEngine(
    onProgress?: (report: LoadProgress) => void,
  ): Promise<void> {
    try {
      // Dynamic import keeps the initial SPA bundle smaller.
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");

      this.engine = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (report: InitProgressReport) => {
          onProgress?.({
            progress: report.progress,
            text: report.text,
          });
        },
      });
      this.state = "ready";
    } catch (error) {
      this.engine = null;
      this.state = "error";
      console.error("[Raio] Failed to load model:", error);

      this.lastError = isWebGPUAvailabilityError(error)
        ? WEBGPU_ERROR_MESSAGE
        : "O raio falhou ao carregar o modelo. Verifique a conexão e tente de novo.";

      throw new Error(this.lastError);
    }
  }

  /** Summarize LinkedIn text; may retry once if the first reply looks like an echo. */
  async generate(options: GenerateOptions): Promise<string> {
    const trimmed = options.text.trim();
    if (!trimmed) {
      throw new Error("empty");
    }

    await this.ensureReady(options.onProgress);
    options.onReady?.();

    if (!this.engine) {
      throw new Error(
        this.lastError ?? "O modelo não está pronto para processar o texto.",
      );
    }

    const input = truncateInput(trimmed);

    try {
      await this.engine.resetChat();

      const reply = await this.engine.chat.completions.create({
        messages: buildMessages(input),
        // Low temperature = more deterministic, less inventive fluff.
        temperature: 0.2,
        top_p: 0.9,
        repetition_penalty: 1.1,
        max_tokens: 400,
      });

      const cleaned = cleanSummary(
        extractText(reply.choices[0]?.message?.content),
      );

      if (!cleaned) {
        throw new Error("empty-response");
      }

      if (looksLikeEcho(input, cleaned)) {
        return this.generateStrictSummary(input);
      }

      return cleaned;
    } catch (error) {
      if (error instanceof Error && error.message === "empty") {
        throw error;
      }

      console.error("[Raio] Generation failed:", error);
      this.lastError =
        "O raio tropeçou no meio do caminho. Tente de novo em instantes.";
      throw new Error(this.lastError);
    }
  }

  /** Stricter second pass when the model copied too much of the source. */
  private async generateStrictSummary(input: string): Promise<string> {
    if (!this.engine) {
      throw new Error("empty-response");
    }

    await this.engine.resetChat();
    const retry = await this.engine.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Resuma o texto em um único parágrafo curto em português. Não copie o original. Só o parágrafo.",
        },
        {
          role: "user",
          content: `Texto:\n${input}\n\nParágrafo-resumo:`,
        },
      ],
      temperature: 0.1,
      max_tokens: 400,
    });

    const retryText = cleanSummary(
      extractText(retry.choices[0]?.message?.content),
    );

    if (!retryText) {
      throw new Error("empty-response");
    }

    return retryText;
  }

  /** Release GPU/memory resources (rarely needed in this SPA). */
  async unload(): Promise<void> {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
    }
    this.state = "idle";
  }
}

/** Module singleton — one engine shared across the app session. */
export const llmService = new LlmService();
