import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

const DELAY_MS = 50;

describe("useDebounce", () => {
  it("calls the callback once with the latest args after rapid calls", async () => {
    const callback = vi.fn().mockReturnValue("result");
    const { result } = renderHook(() => useDebounce(callback, DELAY_MS));

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1), {
      timeout: 1000,
    });
    expect(callback).toHaveBeenCalledWith("c");
  });

  it("resolves the returned promise with the callback's return value", async () => {
    const callback = vi.fn().mockReturnValue("result");
    const { result } = renderHook(() => useDebounce(callback, DELAY_MS));

    const promise = act(() => result.current("term"));

    await expect(promise).resolves.toBe("result");
  });

  it("resolves with the awaited value when the callback returns a promise", async () => {
    const callback = vi.fn().mockResolvedValue("async-result");
    const { result } = renderHook(() => useDebounce(callback, DELAY_MS));

    const promise = act(() => result.current("term"));

    await expect(promise).resolves.toBe("async-result");
  });
});
