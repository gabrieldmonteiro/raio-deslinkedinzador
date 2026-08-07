/**
 * Home interaction surface: input, submit, loading, result, errors.
 * Orchestration lives in useUnlinkedin; this file only composes UI.
 */

import { useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { TextInput } from "../components/TextInput";
import { UnlinkedinButton } from "../components/UnlinkedinButton";
import { LoadingState } from "../components/LoadingState";
import { ResultCard } from "../components/ResultCard";
import { ErrorMessage } from "../components/ErrorMessage";
import { useUnlinkedin } from "../hooks/useUnlinkedin";

interface HomePageProps {
  /** Jump to the WebGPU howto when a GPU error is shown. */
  onOpenHowToUse: () => void;
}

export function HomePage({ onOpenHowToUse }: HomePageProps) {
  const {
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
  } = useUnlinkedin();

  const resultRef = useRef<HTMLDivElement>(null);
  const showLoading = status === "loading-model" || status === "generating";

  // After success, focus/scroll the result for keyboard and long-page UX.
  useEffect(() => {
    if (status === "success" && result) {
      resultRef.current?.querySelector<HTMLElement>("#result")?.focus();
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status, result]);

  return (
    <>
      <Header />

      <section className="panel input-panel" aria-label="Entrada de texto">
        <TextInput value={input} onChange={setInput} disabled={isBusy} />

        <UnlinkedinButton
          onClick={() => void unlinkedin()}
          disabled={!canSubmit}
          busy={isBusy}
        />

        <ErrorMessage
          error={error}
          onOpenHowToUse={
            error?.kind === "webgpu" ? onOpenHowToUse : undefined
          }
        />
      </section>

      <LoadingState
        active={showLoading}
        phase={status === "loading-model" ? "loading-model" : "generating"}
        loadProgress={loadProgress}
      />

      {result && status === "success" && (
        <div ref={resultRef} className="result-wrap">
          <ResultCard
            result={result}
            copied={copied}
            onCopy={() => void copyResult()}
            onAgain={resetResult}
          />
        </div>
      )}
    </>
  );
}
