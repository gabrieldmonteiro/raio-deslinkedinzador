import { afterEach, describe, expect, it, vi } from "vitest";
import {
  hasWebGPUApi,
  isWebGPUAvailabilityError,
  getWebGPUBlockerMessage,
} from "./webgpu";

describe("hasWebGPUApi", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when navigator.gpu is missing", () => {
    vi.stubGlobal("navigator", {});
    expect(hasWebGPUApi()).toBe(false);
  });

  it("returns true when navigator.gpu exists", () => {
    vi.stubGlobal("navigator", { gpu: {} });
    expect(hasWebGPUApi()).toBe(true);
  });
});

describe("getWebGPUBlockerMessage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a blocker when WebGPU API is absent", async () => {
    vi.stubGlobal("navigator", {});
    const message = await getWebGPUBlockerMessage();
    expect(message).toBeTruthy();
  });

  it("returns null when an adapter is available", async () => {
    vi.stubGlobal("navigator", {
      gpu: {
        requestAdapter: vi.fn().mockResolvedValue({
          info: { isFallbackAdapter: false },
        }),
      },
    });

    await expect(getWebGPUBlockerMessage()).resolves.toBeNull();
  });

  it("returns an adapter error when every requestAdapter call yields null", async () => {
    vi.stubGlobal("navigator", {
      gpu: {
        requestAdapter: vi.fn().mockResolvedValue(null),
      },
    });

    const message = await getWebGPUBlockerMessage();
    expect(message).toMatch(/adaptador/i);
  });
});

describe("isWebGPUAvailabilityError", () => {
  it("detects WebLLM WebGPU error names", () => {
    const error = new Error("boom");
    error.name = "WebGPUNotAvailableError";
    expect(isWebGPUAvailabilityError(error)).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isWebGPUAvailabilityError(new Error("network down"))).toBe(false);
  });
});
