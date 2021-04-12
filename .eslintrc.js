const orderingRule = require('@typescript-eslint/eslint-plugin/dist/rules/member-ordering');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',

    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/indent': 'off',
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
