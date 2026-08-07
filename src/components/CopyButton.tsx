/** Secondary action to copy the summary; shows brief "Copied" confirmation. */

interface CopyButtonProps {
  onClick: () => void;
  copied: boolean;
}

export function CopyButton({ onClick, copied }: CopyButtonProps) {
  return (
    <button
      type="button"
      className={`secondary-button ${copied ? "is-copied" : ""}`}
      onClick={onClick}
      aria-label={copied ? "Texto copiado" : "Copiar resultado"}
    >
      {copied ? "✓ Copiado" : "Copiar"}
    </button>
  );
}
