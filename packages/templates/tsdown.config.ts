import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'node22',
  sourcemap: true,
  copy: [{ from: 'src/financial', to: 'dist/financial' }],
  external: ['pdfkit', 'handlebars', 'yaml']
})