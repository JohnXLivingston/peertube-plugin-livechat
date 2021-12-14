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
    mainForeground: styles.getPropertyValue('--mainForegroundColor'),
    mainBackground: styles.getPropertyValue('--mainBackgroundColor'),
    greyForeground: styles.getPropertyValue('--greyForegroundColor'),
    greyBackground: styles.getPropertyValue('--greyBackgroundColor'),
    menuForeground: styles.getPropertyValue('--menuForegroundColor'),
    menuBackground: styles.getPropertyValue('--menuBackgroundColor'),
    inputForeground: styles.getPropertyValue('--inputForegroundColor'),
    inputBackground: styles.getPropertyValue('--inputBackgroundColor'),
    buttonForeground: buttonStyles.color,
    buttonBackground: styles.getPropertyValue('--mainColor'),
    link: styles.getPropertyValue('--mainForegroundColor'),
    linkHover: styles.getPropertyValue('--mainForegroundColor')
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
