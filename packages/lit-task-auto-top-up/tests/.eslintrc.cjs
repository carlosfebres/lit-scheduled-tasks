// This file must exist in every package, due to complexity in eslint's internal package.json resolution

module.exports = {
  extends: ['../.eslintrc.cjs'],
  env: { mocha: true },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        'chai-friendly/no-unused-expressions': 'error',
      },
    },
  ],
};
