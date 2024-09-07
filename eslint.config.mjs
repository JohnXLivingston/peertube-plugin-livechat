// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import love from 'eslint-config-love'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import typescriptParser from '@typescript-eslint/parser'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      "node_modules/", "dist/", "webpack.config.js",
      "build/",
      "vendor/",
      "support/documentation", "support",
      "build-*js",

      "shared", "client", "conversejs"
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...love,
    files: ['**/*.ts']
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      "@stylistic/semi": ["error", "never"]
    }
  },
  {
    files: ['**/*.ts'],
    rules: {
      "@typescript-eslint/no-empty-function": ["error", {"allow": ["arrowFunctions"]}],
      "@typescript-eslint/no-unused-vars": [2, {"argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_"}],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/return-await": [2, "in-try-catch"], // FIXME: correct?
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-explicit-any": "off", // FIXME: should be "error", and we should use 'unknown' in the code.
      "init-declarations": "off",
      "@typescript-eslint/init-declarations": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/consistent-type-exports": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "max-params": "off",
      "@typescript-eslint/max-params": ["error", { "max": 8 }], // FIXME: this rules should use the default max value.
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "max-len": [
        "error",
        {
          "code": 120,
          "comments": 120
        }
      ],
      "no-unused-vars": "off"
    }
  },
  {
    files: ['.stylelintrc.js'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['server/**/*.js', 'server/**/*.ts'], // only ts?
    languageOptions: {
      ecmaVersion: 6,
      globals: {
        ...globals.node
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2018,
        project: './server/tsconfig.json'
      }
    }
  }
)
