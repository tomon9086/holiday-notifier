module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:import/errors",
    "plugin:import/warnings",
    "standard",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  ignorePatterns: [],
  rules: {
    'sort-imports': ['error', {
      ignoreCase: false,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: false
    }],
    'arrow-parens': ['error', 'always'],
    'require-await': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_'
    }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      },
      typescript: {},
      webpack: {}
    }
  }
}
