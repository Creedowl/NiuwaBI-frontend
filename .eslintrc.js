module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'vue/multi-word-component-names': ['error', {
      ignores: ['Header']
    }]
  }
}
