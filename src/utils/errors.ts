/**
 * Maps low-level Error.message values into typed AppError for the UI.
 * Keeps Portuguese copy and kind classification out of hooks/components.
 */

import type { AppError } from "../types";
import {
  WEBGPU_ADAPTER_ERROR_MESSAGE,
  WEBGPU_ERROR_MESSAGE,
} from "./webgpu";

export function mapAppError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : String(error);

  if (message === "empty") {
    return {
      kind: "empty",
      message: "Cole um textão antes de chamar o raio.",
    };
  }

  if (message === "clipboard-unavailable") {
    return {
      kind: "clipboard",
      message: "Não foi possível copiar. Selecione o texto e copie manualmente.",
    };
  }

  // Exact WebGPU messages from getWebGPUBlockerMessage / loadEngine.
  if (
    message === WEBGPU_ERROR_MESSAGE ||
    message === WEBGPU_ADAPTER_ERROR_MESSAGE
  ) {
    return { kind: "webgpu", message };
  }

  if (/carregar o modelo|falhou ao carregar/i.test(message)) {
    return {
      kind: "model-load",
      message:
        "O raio falhou ao carregar o modelo. Verifique a conexão e tente de novo.",
    };
  }

  if (/tropeçou|gerar|generation|empty-response/i.test(message)) {
    return {
      kind: "generation",
      message:
        "O raio tropeçou no meio do caminho. Tente de novo em instantes.",
    };
  }

  return {
    kind: "unknown",
    message: "Algo deu errado. Tente novamente.",
  };
}
