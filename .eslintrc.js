module.exports = {
  // ... outras configurações
  extends: [
    'plugin:prettier/recommended', // Deve ser a última extensão
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        singleQuote: true,
        trailingComma: 'none',
        printWidth: 80,
        parameterWidth: 1,
      },
    ],
    // Desative regras que conflitam
    indent: 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
  },
}
