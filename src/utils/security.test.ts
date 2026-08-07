import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { MODEL_ID, SOCIAL_LINKS } from "./constants";

function listSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (entry === "test") continue;
      files.push(...listSourceFiles(fullPath));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry) && !entry.includes(".test.")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("security invariants", () => {
  it("does not hardcode cloud LLM API keys or secret env patterns", () => {
    const root = join(process.cwd(), "src");
    const files = listSourceFiles(root);
    const banned =
      /(sk-[a-zA-Z0-9]{10,}|api[_-]?key\s*[:=]\s*['\"][^'\"]+|OPENAI_API_KEY|GEMINI_API_KEY|GROQ_API_KEY|Authorization:\s*Bearer\s+[A-Za-z0-9._-]+)/i;

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content, file).not.toMatch(banned);
    }
  });

  it("keeps social links public and non-secret", () => {
    expect(SOCIAL_LINKS.linkedin).toMatch(/^https:\/\/(www\.)?linkedin\.com\//);
    expect(SOCIAL_LINKS.github).toMatch(/^https:\/\/github\.com\//);
  });

  it("uses a public WebLLM model id (no private endpoint)", () => {
    expect(MODEL_ID).toMatch(/-MLC$/);
    expect(MODEL_ID.toLowerCase()).not.toContain("localhost");
  });
});
