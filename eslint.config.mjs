// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginAccessibility from 'eslint-plugin-jsx-a11y';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 全域設定
  {
    ignores: ['dist', 'node_modules'],
  },

  // Eslint 推薦規則
  pluginJs.configs.recommended,

  // React 相關規則
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginAccessibility,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginAccessibility.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要
      'react/prop-types': 'off', // 使用 TS
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier 設定，必須放在最後
  eslintConfigPrettier,
];