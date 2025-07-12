// eslint.config.mjs (最終整合版本)
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginAccessibility from 'eslint-plugin-jsx-a11y';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // 1. 全域設定
  {
    ignores: ['dist', 'node_modules', 'api/'], // 忽略建置目錄、依賴和後端 API 路由
  },

  // 2. 針對 TS/TSX 檔案的核心設定
  {
    files: ['src/**/*.{ts,tsx}'], // 只針對 src 資料夾中的 TS/TSX 檔案
    languageOptions: {
      parser: tseslint.parser, // **指定使用 TypeScript 解析器**
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginAccessibility,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      // 啟用所有推薦規則
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginAccessibility.configs.recommended.rules,

      // 自訂規則
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // 3. Prettier 設定 (必須是最後一項！)
  eslintConfigPrettier
);