import type { SVGButton } from './buttons'
import { logger } from './logger'

interface displayButtonOptions {
  buttonContainer: HTMLElement
  name: string
  label: string
  callback: () => void | boolean
  icon?: SVGButton
  additionalClasses?: string[]
}

function displayButton ({
  name,
  label,
  callback,
  buttonContainer,
  additionalClasses,
  icon
}: displayButtonOptions): void {
  const button = document.createElement('a')
  button.classList.add(
    'orange-button', 'peertube-button-link',
    'peertube-plugin-livechat-button',
    'peertube-plugin-livechat-button-' + name
  )
  if (additionalClasses) {
    for (let i = 0; i < additionalClasses.length; i++) {
      button.classList.add(additionalClasses[i])
    }
  }
  button.onclick = callback
  if (icon) {
    try {
      const svg = icon()
      const tmp = document.createElement('span')
      tmp.innerHTML = svg.trim()
      const svgDom = tmp.firstChild
      if (svgDom) {
        button.prepend(svgDom)
      }
    } catch (err) {
      logger.error('Failed to generate the ' + name + ' button: ' + (err as string))
    }

    button.setAttribute('title', label)
  } else {
    button.textContent = label
  }
  buttonContainer.append(button)
}

export type {
  displayButtonOptions
}
export {
  displayButton
}
