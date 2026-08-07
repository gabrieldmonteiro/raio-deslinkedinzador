/**
 * Alert region for AppError.
 * WebGPU errors also list recovery steps and an optional link to Como usar.
 */

import type { AppError } from "../types";
import { WEBGPU_ADAPTER_STEPS } from "../utils/webgpu";

interface ErrorMessageProps {
  error: AppError | null;
  onOpenHowToUse?: () => void;
}

export function ErrorMessage({ error, onOpenHowToUse }: ErrorMessageProps) {
  if (!error) {
    return null;
  }

  const showGpuSteps = error.kind === "webgpu";

  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <span className="error-icon" aria-hidden="true">
        ⚡
      </span>
      <div className="error-body">
        <p>{error.message}</p>
        {showGpuSteps && (
          <>
            <ol className="error-steps">
              {WEBGPU_ADAPTER_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {onOpenHowToUse && (
              <button
                type="button"
                className="error-link-button"
                onClick={onOpenHowToUse}
              >
                Ver guia completo em Como usar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
