// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { logger } from './logger'
import { AutoColors, areAutoColorsValid } from 'shared/lib/autocolors'

function computeAutoColors (): AutoColors | null {
  if (!window.getComputedStyle) {
    logger.warn('[AutoColors] getComputedStyle is not available, aborting.')
    return null
  }

  const styles = window.getComputedStyle(document.body)

  // Peertube has no CSS variable for the button color...
  // Computing by hand.
  // Searching for one of these button:
  const button = document.querySelector('.publish-button') ?? document.querySelector('.peertube-button-link')
  if (!button) {
    logger.warn('[AutoColors] Cant find a button, aborting.')
    return null
  }
  const buttonStyles = window.getComputedStyle(button)

  const autocolors: AutoColors = {
    mainForeground: styles.getPropertyValue('--fg').trim() ||
      styles.getPropertyValue('--mainForegroundColor').trim(),

    mainBackground: styles.getPropertyValue('--bg').trim() ||
      styles.getPropertyValue('--mainBackgroundColor').trim(),

    greyForeground: styles.getPropertyValue('--fg-300').trim() ||
      styles.getPropertyValue('--greyForegroundColor').trim(),

    greyBackground: styles.getPropertyValue('--bg-secondary-300').trim() ||
      styles.getPropertyValue('--greyBackgroundColor').trim(),

    menuForeground: styles.getPropertyValue('--fg').trim() ||
      styles.getPropertyValue('--menuForegroundColor').trim(),

    menuBackground: styles.getPropertyValue('--bg-secondary-400').trim() ||
      styles.getPropertyValue('--menuBackgroundColor').trim(),

    inputForeground: styles.getPropertyValue('--input-fg').trim() ||
      styles.getPropertyValue('--inputForegroundColor').trim(),

    inputBackground: styles.getPropertyValue('--input-bg').trim() ||
      styles.getPropertyValue('--inputBackgroundColor').trim(),

    buttonForeground: styles.getPropertyValue('--on-primary').trim() ||
      buttonStyles.color.trim(),

    buttonBackground: styles.getPropertyValue('--primary').trim() ||
      styles.getPropertyValue('--mainColor').trim(),

    link: styles.getPropertyValue('--fg').trim() ||
      styles.getPropertyValue('--mainForegroundColor').trim(),

    linkHover: styles.getPropertyValue('--fg-400').trim() ||
      styles.getPropertyValue('--mainForegroundColor').trim()
  }
  const autoColorsTest = areAutoColorsValid(autocolors)
  if (autoColorsTest !== true) {
    logger.warn('[AutoColors] Computed colors are not valid, dropping. Invalid values: ' + autoColorsTest.join(', '))
    return null
  }
  return autocolors
}

export {
  computeAutoColors
}
