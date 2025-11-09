import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**', 'drizzle/migrations/**'],
  },
  js.configs.recommended,
  ...tseslint.config({
    extends: ['plugin:@typescript-eslint/recommended-type-checked'],
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  }),
  nextPlugin.configs['core-web-vitals'],
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
);
