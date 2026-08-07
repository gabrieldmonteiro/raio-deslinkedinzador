/**
 * Progress UI while the model downloads or generates.
 * Shows rotating jokes + optional percent bar from WebLLM initProgressCallback.
 */

import { useLoadingMessages } from "../hooks/useLoadingMessages";
import type { LoadProgress } from "../types";

interface LoadingStateProps {
  active: boolean;
  phase: "loading-model" | "generating";
  loadProgress: LoadProgress | null;
}

export function LoadingState({
  active,
  phase,
  loadProgress,
}: LoadingStateProps) {
  const funnyMessage = useLoadingMessages(active);

  if (!active) {
    return null;
  }

  const percent =
    phase === "loading-model" && loadProgress
      ? Math.round(loadProgress.progress * 100)
      : null;

  return (
    <div
      className="loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-bolt" aria-hidden="true">
        ⚡
      </div>
      <p className="loading-message">{funnyMessage}</p>
      {percent !== null && (
        <div className="loading-progress">
          <div
            className="loading-progress-bar"
            style={{ width: `${percent}%` }}
            aria-hidden="true"
          />
          <span className="loading-progress-label">{percent}%</span>
        </div>
      )}
      {loadProgress?.text && phase === "loading-model" && (
        <p className="loading-detail">{loadProgress.text}</p>
      )}
    </div>
  );
}
