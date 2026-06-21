import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: troque 'NOME_DO_REPOSITORIO' pelo nome exato do seu repositório no GitHub.
// Exemplo: se seu repo é github.com/alinesoares/dashboard-seguros,
// o base deve ser '/dashboard-seguros/'
export default defineConfig({
  plugins: [react()],
  base: '/dashboard-seguros-claude/',
})
