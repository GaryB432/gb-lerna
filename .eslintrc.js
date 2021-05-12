const orderingRule = require('@typescript-eslint/eslint-plugin/dist/rules/member-ordering');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/explicit-member-accessibility': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: {
          memberTypes: orderingRule.defaultOrder,
          order: 'alphabetically',
        },
      },
    ],
  },
};
