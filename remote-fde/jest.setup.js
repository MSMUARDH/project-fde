import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Either in your test file or in jest.setup.js
beforeEach(() => {
  // Mock Vite environment variables
  globalThis.import_meta_env = {
    VITE_BASE_URL: 'http://localhost:5000'
  };
});