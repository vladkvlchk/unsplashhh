import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

vi.stubGlobal("scrollTo", vi.fn());

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
}));
