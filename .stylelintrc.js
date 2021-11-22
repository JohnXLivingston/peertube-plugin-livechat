'use strict';

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
        message: 'Expected class selector to be kebab-case, or ConverseJS-style.',
      }
    ]
  }
}
