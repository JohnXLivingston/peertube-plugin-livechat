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
    mainForeground: styles.getPropertyValue('--mainForegroundColor').trim(),
    mainBackground: styles.getPropertyValue('--mainBackgroundColor').trim(),
    greyForeground: styles.getPropertyValue('--greyForegroundColor').trim(),
    greyBackground: styles.getPropertyValue('--greyBackgroundColor').trim(),
    menuForeground: styles.getPropertyValue('--menuForegroundColor').trim(),
    menuBackground: styles.getPropertyValue('--menuBackgroundColor').trim(),
    inputForeground: styles.getPropertyValue('--inputForegroundColor').trim(),
    inputBackground: styles.getPropertyValue('--inputBackgroundColor').trim(),
    buttonForeground: buttonStyles.color.trim(),
    buttonBackground: styles.getPropertyValue('--mainColor').trim(),
    link: styles.getPropertyValue('--mainForegroundColor').trim(),
    linkHover: styles.getPropertyValue('--mainForegroundColor').trim()
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
