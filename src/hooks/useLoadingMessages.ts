/**
 * Rotates playful loading strings while a long WebLLM operation is active.
 */

import { useEffect, useState } from "react";
import { LOADING_MESSAGES, MESSAGE_ROTATION_MS } from "../utils/constants";

export function useLoadingMessages(active: boolean): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_ROTATION_MS);

    return () => window.clearInterval(id);
  }, [active]);

  return LOADING_MESSAGES[index] ?? LOADING_MESSAGES[0];
}
