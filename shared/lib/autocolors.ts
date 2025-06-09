// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

const validateColor = require('validate-color').default

type AutoColorValue = string

interface AutoColors {
  mainForeground: AutoColorValue
  mainBackground: AutoColorValue
  greyForeground: AutoColorValue
  greyBackground: AutoColorValue
  menuForeground: AutoColorValue
  menuBackground: AutoColorValue
  inputForeground: AutoColorValue
  inputBackground: AutoColorValue
  buttonForeground: AutoColorValue
  buttonBackground: AutoColorValue
  link: AutoColorValue
  linkHover: AutoColorValue
}

/**
 * @param theme value of the settings 'converse-theme'
 * @returns true if the theme can use autocolors
 */
function isAutoColorsAvailable (theme: string): boolean {
  return theme === 'peertube' // currently the only theme that can handle autocolors.
}

/**
 * @param autocolors
 * @returns true if ok. Else a string array with invalid values.
 */
function areAutoColorsValid (autocolors: AutoColors): true | string[] {
  const errors: string[] = []
  for (const k in autocolors) {
    const color = autocolors[k as keyof AutoColors]
    if (!validateColor(color)) {
      errors.push(color)
    }
  }
  if (errors.length) {
    return errors
  }
  return true
}

export type {
  AutoColors
}
export {
  isAutoColorsAvailable,
  areAutoColorsValid
}
