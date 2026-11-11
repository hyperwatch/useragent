import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
  js.configs.recommended,
  nodePlugin.configs['flat/recommended'],
  importX.flatConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2018,
      globals: {
        ...globals.node,
        ...globals.es2017,
      },
    },
    rules: {
      // -------------------
      // Relaxing some rules
      // -------------------

      'no-console': 'off',
      'n/no-process-exit': 'off',

      // ----------------------------------
      // Adding more eslint rules as errors
      // ----------------------------------

      // Disallow Unused Variables
      // https://eslint.org/docs/rules/no-unused-vars
      'no-unused-vars': ['error', { vars: 'all', caughtErrors: 'none' }],
      // require using arrow functions as callbacks
      // https://eslint.org/docs/rules/prefer-arrow-callback
      'prefer-arrow-callback': 'error',
      // require using template literals instead of string concatenation
      // http://eslint.org/docs/rules/prefer-template
      'prefer-template': 'error',
      // require using of const declaration for variables that are never modified after declared
      // https://eslint.org/docs/rules/prefer-const
      'prefer-const': 'error',
      // disallow modifying variables that are declared using const
      // https://eslint.org/docs/rules/no-const-assign
      'no-const-assign': 'error',
      // require let or const instead of var
      // https://eslint.org/docs/rules/no-var
      'no-var': 'error',

      // ------------------------------------
      // Adding more eslint rules as warnings
      // ------------------------------------

      // require at least one whitespace after comments( // and /*)
      // https://eslint.org/docs/rules/spaced-comment
      'spaced-comment': ['warn', 'always'],
      // Require Following Curly Brace Conventions
      // https://eslint.org/docs/rules/curly
      curly: ['warn', 'all'],
      // Require empty lines after class members
      // https://eslint.org/docs/rules/lines-between-class-members
      'lines-between-class-members': [
        'warn',
        'always',
        { exceptAfterSingleLine: true },
      ],

      'import-x/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  // The sources and the type test, in TypeScript: typescript-eslint's
  // recommended rules, type-checked, on top of the above
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['src/**/*.ts', 'test/types/**/*.ts'],
  })),
  {
    files: ['src/**/*.ts', 'test/types/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver': { node: { extensions: ['.ts', '.js'] } },
    },
    rules: {
      // TypeScript checks these
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', caughtErrors: 'none' },
      ],
      // TypeScript syntax Node can't run itself: the sources are compiled
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },
  // Test files: add mocha globals
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  // Husky installer: an ES module with top-level await
  {
    files: ['.husky/install.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // A dev dependency, only run from a checkout
      'n/no-unpublished-import': 'off',
    },
  },
  // Scripts: allow experimental Node.js features (e.g. fetch)
  {
    files: ['scripts/**/*.js'],
    rules: {
      'n/no-unsupported-features/node-builtins': [
        'error',
        { allowExperimental: true },
      ],
    },
  },
];
