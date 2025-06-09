// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

'use strict'

module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-standard-scss'
  ],
  rules: {
    'selector-class-pattern': [
      // extending the kebab-case to accept ConverseJS class names.
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*((__|--)[a-z]+(-[a-z0-9]+)*)?$',
      {
        message: 'Expected class selector to be kebab-case, or ConverseJS-style.'
      }
    ]
  }
}
