/**
 * WebGPU capability checks and Portuguese troubleshooting copy.
 * WebLLM requires a real GPU adapter; API presence alone is not enough.
 */

export const WEBGPU_ERROR_MESSAGE =
  "Seu navegador não consegue conjurar o raio. Abra o app em uma janela do Chrome ou Edge (evite o preview embutido do editor) e confira em chrome://gpu se WebGPU está ativo.";

export const WEBGPU_ADAPTER_ERROR_MESSAGE =
  "O Chrome reconhece WebGPU, mas não liberou nenhum adaptador de GPU. Aceleração de hardware ligada não basta se a GPU estiver em blocklist ou sem suporte WebGPU.";

/** Steps shown under WebGPU errors and on the Como usar page. */
export const WEBGPU_ADAPTER_STEPS = [
  "Abra chrome://gpu e procure a linha WebGPU (precisa ser Hardware accelerated).",
  "Se aparecer blocklist/disabled: ative chrome://flags/#enable-unsafe-webgpu e chrome://flags/#ignore-gpu-blocklist, depois Relaunch.",
  "Ative também chrome://flags/#force-high-performance-gpu se o notebook tiver GPU dedicada.",
  "Windows → Sistema → Tela → Gráficos → adicione chrome.exe → Alto desempenho.",
  "Atualize o driver da GPU e reinicie o PC.",
  "Confirme chrome://version (Chrome 113+ no Windows).",
] as const;

/** Fast sync check — is navigator.gpu present? */
export function hasWebGPUApi(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/**
 * Try several requestAdapter strategies (high-perf → low-power → default → software).
 * Some machines only succeed with a specific preference or fallback adapter.
 */
async function requestBestAdapter(): Promise<GPUAdapter | null> {
  const gpu = navigator.gpu;
  if (!gpu) {
    return null;
  }

  const attempts: Array<{ label: string; options: GPURequestAdapterOptions }> =
    [
      { label: "high-performance", options: { powerPreference: "high-performance" } },
      { label: "low-power", options: { powerPreference: "low-power" } },
      { label: "default", options: {} },
      {
        label: "fallback-software",
        options: { forceFallbackAdapter: true },
      },
    ];

  for (const attempt of attempts) {
    try {
      const adapter = await gpu.requestAdapter(attempt.options);
      if (adapter) {
        console.info(`[Raio] Adaptador WebGPU obtido via "${attempt.label}"`, {
          info: adapter.info,
          fallback: adapter.info.isFallbackAdapter,
        });
        return adapter;
      }
      console.warn(`[Raio] requestAdapter("${attempt.label}") → null`);
    } catch (error) {
      console.warn(`[Raio] requestAdapter("${attempt.label}") falhou:`, error);
    }
  }

  return null;
}

/**
 * Returns a user-facing blocker message, or null when WebGPU looks usable.
 * Called before model load so the UI can fail fast with actionable help.
 */
export async function getWebGPUBlockerMessage(): Promise<string | null> {
  if (!hasWebGPUApi()) {
    return WEBGPU_ERROR_MESSAGE;
  }

  try {
    const adapter = await requestBestAdapter();
    if (!adapter) {
      console.warn(
        "[Raio] navigator.gpu existe, mas nenhum adaptador (nem software) foi encontrado.",
      );
      return WEBGPU_ADAPTER_ERROR_MESSAGE;
    }

    return null;
  } catch (error) {
    console.error("[Raio] Erro ao verificar WebGPU:", error);
    return WEBGPU_ERROR_MESSAGE;
  }
}

/** Detect WebLLM / browser errors that should surface as WebGPU UX. */
export function isWebGPUAvailabilityError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const name = error.name;
  if (
    name === "WebGPUNotAvailableError" ||
    name === "WebGPUNotFoundError" ||
    name === "ShaderF16SupportError" ||
    name === "FeatureSupportError"
  ) {
    return true;
  }

  const message = error.message;
  if (
    message === WEBGPU_ERROR_MESSAGE ||
    message === WEBGPU_ADAPTER_ERROR_MESSAGE
  ) {
    return true;
  }

  return (
    /WebGPU is not supported/i.test(message) ||
    /WebGPU is not available/i.test(message) ||
    /Cannot find WebGPU/i.test(message) ||
    /shader-f16/i.test(message)
  );
}
