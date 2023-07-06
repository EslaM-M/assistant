// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'MyLib',
      // the proper extensions will be added
      fileName: 'my-lib',
    },
  },
})