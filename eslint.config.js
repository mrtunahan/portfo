import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // dist derleme çıktısı; animations/ devralınan demo kodu, kendi kurallarıyla yazıldı
  globalIgnores(['dist', 'src/animations']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // shadcn deseninde varyant tanımları ve bağlam kancaları bileşenle aynı
    // dosyada durur; bu kural yalnızca geliştirme sırasındaki hızlı yenilemeyi
    // ilgilendirdiği için bu dosyalarda kapatıldı.
    files: ['src/components/ui/**/*.tsx', 'src/components/theme-provider.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
]);
