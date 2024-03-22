module.exports = {
  root: true,
  env: { node: true },
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['import', 'chai-friendly'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      extends: [
        'eslint:recommended',
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:chai-friendly/recommended',
      ],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
        // "import/internal-regex": "^@lit-protocol/",
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
      rules: {
        'import/no-relative-packages': ['error'],
        'import/no-duplicates': ['error'],
        'import/no-unresolved': ['error'],
        'import/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            'newlines-between': 'always',
            groups: ['builtin', 'external', 'internal', ['sibling', 'parent', 'index'], 'object', 'type'],
          },
        ],
      },
    },
  ],
};
