import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative URLs so assets load correctly when hosted from a subfolder (e.g. on Plesk)
  base: './',
  plugins: [react()],
})
