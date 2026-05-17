import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev:back',
      url: 'http://127.0.0.1:3000/api/public/settings',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev:front',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});
