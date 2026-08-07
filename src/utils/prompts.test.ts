import { describe, expect, it } from "vitest";
import { buildMessages } from "./prompts";

describe("buildMessages", () => {
  it("builds a few-shot chat payload ending with the user text", () => {
    const messages = buildMessages("Post de exemplo sobre promoção.");

    expect(messages).toHaveLength(4);
    expect(messages[0]?.role).toBe("system");
    expect(messages[1]?.role).toBe("user");
    expect(messages[2]?.role).toBe("assistant");
    expect(messages[3]?.role).toBe("user");
    expect(messages[3]?.content).toContain("Post de exemplo sobre promoção.");
    expect(messages[0]?.content.toLowerCase()).toContain("parágrafo");
  });

  it("does not invent API keys or remote provider instructions", () => {
    const serialized = JSON.stringify(buildMessages("texto"));
    expect(serialized.toLowerCase()).not.toMatch(/api[_-]?key|openai|gemini|groq/);
  });
});
