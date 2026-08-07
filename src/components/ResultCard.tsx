/**
 * Success panel: summary text, copy action, and "run again" reset.
 * Focusable (#result) so HomePage can move focus after generation.
 */

import { CopyButton } from "./CopyButton";

interface ResultCardProps {
  result: string;
  copied: boolean;
  onCopy: () => void;
  onAgain: () => void;
}

export function ResultCard({
  result,
  copied,
  onCopy,
  onAgain,
}: ResultCardProps) {
  return (
    <section
      className="result-card"
      aria-labelledby="result-heading"
      tabIndex={-1}
      id="result"
    >
      <h2 id="result-heading" className="result-title">
        Resultado
      </h2>
      <p className="result-text">{result}</p>
      <div className="result-actions">
        <CopyButton onClick={onCopy} copied={copied} />
        <button type="button" className="ghost-button" onClick={onAgain}>
          DesLinkedinzar novamente
        </button>
      </div>
    </section>
  );
}
