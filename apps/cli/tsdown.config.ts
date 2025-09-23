import path from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'node22',
  shims: true,
  sourcemap: true,
  copy: [{ from: '../../packages/templates/dist/financial', to: 'dist/financial' }],
})