/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/*.{test,spec}.{js,ts,jsx,tsx}',
        '**/*.stories.{js,ts,jsx,tsx}',
        '**/*.config.{js,ts,jsx,tsx}',
        '**/index.{js,ts,jsx,tsx}',
        '**/main.{js,ts,jsx,tsx}',
        '**/App.{js,ts,jsx,tsx}',
        '**/vite-env.d.ts'
      ]
    },
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './test-results/index.html'
    }
  },
  server: {
    port: 3000
  }
})
