import { describe, expect, it } from "vitest";
import {
  cleanSummary,
  extractText,
  looksLikeEcho,
  truncateInput,
} from "../utils/summary";

describe("truncateInput", () => {
  it("returns the original text when under the limit", () => {
    expect(truncateInput("short", 10)).toBe("short");
  });

  it("truncates long text and appends a marker", () => {
    const result = truncateInput("abcdefghij", 5);
    expect(result.startsWith("abcde")).toBe(true);
    expect(result).toContain("[texto truncado]");
  });
});

describe("extractText", () => {
  it("extracts plain string content", () => {
    expect(extractText("  hello  ")).toBe("hello");
  });

  it("extracts text parts from multimodal arrays", () => {
    expect(
      extractText([
        { type: "text", text: "Hello " },
        { type: "text", text: "world" },
      ]),
    ).toBe("Hello world");
  });

  it("returns an empty string for unsupported shapes", () => {
    expect(extractText(null)).toBe("");
    expect(extractText(42)).toBe("");
  });
});

describe("cleanSummary", () => {
  it("strips quotes and summary prefixes", () => {
    expect(cleanSummary('"Resumo: Começou na Aurora."')).toBe(
      "Começou na Aurora.",
    );
  });

  it("collapses whitespace", () => {
    expect(cleanSummary("a\n\nb   c")).toBe("a b c");
  });
});

describe("looksLikeEcho", () => {
  it("detects when output mostly copies the input", () => {
    const input =
      "Hoje quero compartilhar com vocês uma reflexão longa sobre uma jornada profissional.";
    expect(looksLikeEcho(input, input)).toBe(true);
  });

  it("accepts a short distinct summary", () => {
    const input =
      "Hoje quero compartilhar com vocês uma reflexão longa sobre uma jornada profissional na Aurora.";
    expect(looksLikeEcho(input, "Começou na Aurora como engenheira.")).toBe(
      false,
    );
  });
});
