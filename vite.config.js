import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' && process.env.DEPLOY_TARGET === 'ghpages' 
    ? '/Priya-B-day/' 
    : '/',
  plugins: [react(), tailwindcss()],
}))