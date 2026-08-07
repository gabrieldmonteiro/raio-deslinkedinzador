/**
 * Home-page state machine for paste → summarize → copy.
 * Bridges UI events to llmService and maps failures via mapAppError.
 */

import { useCallback, useState } from "react";
import { llmService } from "../services/llm";
import { copyToClipboard } from "../utils/clipboard";
import { mapAppError } from "../utils/errors";
import { getWebGPUBlockerMessage } from "../utils/webgpu";
import type { AppError, AppStatus, LoadProgress } from "../types";

export function useUnlinkedin() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [error, setError] = useState<AppError | null>(null);
  const [loadProgress, setLoadProgress] = useState<LoadProgress | null>(null);
  const [copied, setCopied] = useState(false);

  const isBusy = status === "loading-model" || status === "generating";
  const canSubmit = input.trim().length > 0 && !isBusy;

  const unlinkedin = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError(mapAppError(new Error("empty")));
      setStatus("error");
      return;
    }

    setError(null);
    setCopied(false);
    setLoadProgress(null);
    setStatus("loading-model");

    // Fail fast with GPU help before kicking off a heavy model download.
    const blocker = await getWebGPUBlockerMessage();
    if (blocker) {
      setError({ kind: "webgpu", message: blocker });
      setStatus("error");
      return;
    }

    try {
      setStatus(llmService.isReady() ? "generating" : "loading-model");

      const summary = await llmService.generate({
        text: trimmed,
        onProgress: (report) => {
          setStatus("loading-model");
          setLoadProgress(report);
        },
        onReady: () => {
          setStatus("generating");
          setLoadProgress(null);
        },
      });

      setResult(summary);
      setStatus("success");
      setLoadProgress(null);
    } catch (err) {
      setResult(null);
      setError(mapAppError(err));
      setStatus("error");
      setLoadProgress(null);
    }
  }, [input]);

  const resetResult = useCallback(() => {
    setResult(null);
    setStatus("idle");
    setError(null);
    setCopied(false);
  }, []);

  const copyResult = useCallback(async () => {
    if (!result) {
      return;
    }

    try {
      await copyToClipboard(result);
      setCopied(true);
      // Brief "Copied" feedback, then restore the button label.
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(mapAppError(err));
    }
  }, [result]);

  return {
    input,
    setInput,
    result,
    status,
    error,
    loadProgress,
    copied,
    isBusy,
    canSubmit,
    unlinkedin,
    resetResult,
    copyResult,
  };
}
