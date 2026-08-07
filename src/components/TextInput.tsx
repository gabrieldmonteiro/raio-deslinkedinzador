/**
 * Controlled LinkedIn-post textarea with character count.
 * Disabled while the model is loading or generating.
 */

import { PLACEHOLDER_TEXT } from "../utils/constants";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled = false }: TextInputProps) {
  const count = value.length;

  return (
    <div className="text-input">
      <label className="text-input-label" htmlFor="linkedin-input">
        Texto do LinkedIn
      </label>
      <textarea
        id="linkedin-input"
        className="text-input-field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={PLACEHOLDER_TEXT}
        rows={10}
        spellCheck
        aria-describedby="char-count helper-hint"
      />
      <div className="text-input-meta">
        <p id="helper-hint" className="helper-hint">
          Cole aquele post de 47 parágrafos. O raio resolve.
        </p>
        <p id="char-count" className="char-count" aria-live="polite">
          {count.toLocaleString("pt-BR")} caracteres
        </p>
      </div>
    </div>
  );
}
