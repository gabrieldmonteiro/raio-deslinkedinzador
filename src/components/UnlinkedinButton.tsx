/**
 * Primary CTA that kicks off summarization.
 * `busy` swaps label/aria-busy; parent disables when input is empty or mid-run.
 */

interface UnlinkedinButtonProps {
  onClick: () => void;
  disabled: boolean;
  busy: boolean;
}

export function UnlinkedinButton({
  onClick,
  disabled,
  busy,
}: UnlinkedinButtonProps) {
  return (
    <button
      type="button"
      className={`primary-button ${busy ? "is-busy" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy}
    >
      <span className="primary-button-bolt" aria-hidden="true">
        ⚡
      </span>
      <span>{busy ? "DesLinkedinzando..." : "DESLINKEDINZAR"}</span>
    </button>
  );
}
