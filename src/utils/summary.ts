/**
 * Pure text helpers for summarization.
 * No React / WebLLM imports — easy to unit-test and reuse from llm.ts.
 */

/** Soft cap so very long posts fit the reduced context window. */
export const MAX_INPUT_CHARS = 2800;

/** Truncate oversized input and mark the cut for the model. */
export function truncateInput(text: string, maxChars = MAX_INPUT_CHARS): string {
  if (text.length <= maxChars) {
    return text;
  }
  return `${text.slice(0, maxChars)}\n\n[texto truncado]`;
}

/**
 * Normalize WebLLM completion content (string or multimodal-ish parts array)
 * into a single trimmed string.
 */
export function extractText(content: unknown): string {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text;
        }
        return "";
      })
      .join("")
      .trim();
  }

  return "";
}

/** Strip quotes, "Resumo:" prefixes, and collapse whitespace into one paragraph. */
export function cleanSummary(text: string): string {
  return text
    .replace(/^["'“”]|["'“”]$/g, "")
    .replace(/^(resumo|summary|parágrafo-resumo)\s*:\s*/i, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Detect when the model mostly echoed the input instead of summarizing.
 * Used by LlmService to trigger a stricter retry prompt.
 */
export function looksLikeEcho(input: string, output: string): boolean {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const normalizedInput = normalize(input);
  const normalizedOutput = normalize(output);

  // Tiny outputs are unlikely to be full echoes of a long post.
  if (normalizedOutput.length < 40) {
    return false;
  }

  // Output nearly as long as input → probably not a summary.
  if (normalizedOutput.length >= normalizedInput.length * 0.7) {
    return true;
  }

  // Opening chunk of the input appears inside the output → copy-paste behavior.
  const sample = normalizedInput.slice(
    0,
    Math.min(120, normalizedInput.length),
  );
  return sample.length > 40 && normalizedOutput.includes(sample);
}
