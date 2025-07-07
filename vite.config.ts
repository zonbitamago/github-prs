import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages で公開する場合は base をリポジトリ名に合わせて設定
// 例: https://USERNAME.github.io/REPO_NAME/ → base: '/REPO_NAME/'
export default defineConfig({
  base: '/github-prs/', // 必要に応じてリポジトリ名に変更してください
  plugins: [react()],
})
