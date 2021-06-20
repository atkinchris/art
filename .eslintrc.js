module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  env: {
    browser: true,
    es2021: true,
  },
  rules: {
    'no-bitwise': 'off',
    'import/extensions': 'off',
  },
}
