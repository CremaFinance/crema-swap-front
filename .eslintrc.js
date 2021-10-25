module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    // 'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier', 'import'],
  // add your custom rules here
  rules: {
    // 'import/order': [
    //   'error',
    //   {
    //     groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin']
    //   }
    // ],
    'import/order': 0,
    'import/named': 0,
    'vue/script-setup-uses-vars': 0,
    camelcase: 0
  }
}
