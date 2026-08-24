import { vi } from "vitest";

// Mock server-only to allow testing server-only modules
vi.mock("server-only", () => ({}));
