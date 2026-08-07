import { describe, expect, it } from "vitest";
import { mapAppError } from "./errors";
import {
  WEBGPU_ADAPTER_ERROR_MESSAGE,
  WEBGPU_ERROR_MESSAGE,
} from "./webgpu";

describe("mapAppError", () => {
  it("maps empty input errors", () => {
    expect(mapAppError(new Error("empty")).kind).toBe("empty");
  });

  it("maps clipboard errors", () => {
    expect(mapAppError(new Error("clipboard-unavailable")).kind).toBe(
      "clipboard",
    );
  });

  it("maps WebGPU messages", () => {
    expect(mapAppError(new Error(WEBGPU_ERROR_MESSAGE)).kind).toBe("webgpu");
    expect(mapAppError(new Error(WEBGPU_ADAPTER_ERROR_MESSAGE)).kind).toBe(
      "webgpu",
    );
  });

  it("maps model load failures", () => {
    expect(
      mapAppError(new Error("O raio falhou ao carregar o modelo.")).kind,
    ).toBe("model-load");
  });

  it("maps generation failures", () => {
    expect(mapAppError(new Error("empty-response")).kind).toBe("generation");
  });

  it("falls back to unknown", () => {
    expect(mapAppError(new Error("weird")).kind).toBe("unknown");
  });
});
