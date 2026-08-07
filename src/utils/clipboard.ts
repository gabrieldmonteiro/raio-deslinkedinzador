/**
 * Thin Clipboard API wrapper.
 * Throws a stable "clipboard-unavailable" code that mapAppError understands.
 */

export async function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("clipboard-unavailable");
  }

  await navigator.clipboard.writeText(text);
}
