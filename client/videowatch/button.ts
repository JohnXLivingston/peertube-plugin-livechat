import type { SVGButton } from './buttons'
import { logger } from '../utils/logger'

interface displayButtonOptionsBase {
  buttonContainer: HTMLElement
  name: string
  label: string
  icon?: SVGButton
  additionalClasses?: string[]
}

interface displayButtonOptionsCallback extends displayButtonOptionsBase {
  callback: () => void | boolean
}

interface displayButtonOptionsHref extends displayButtonOptionsBase {
  href: string
  targetBlank?: boolean
}

type displayButtonOptions = displayButtonOptionsCallback | displayButtonOptionsHref

function displayButton (dbo: displayButtonOptions): void {
  const button = document.createElement('a')
  button.classList.add(
    'orange-button', 'peertube-button-link',
    'peertube-plugin-livechat-button',
    'peertube-plugin-livechat-button-' + dbo.name
  )
  if (dbo.additionalClasses) {
    for (let i = 0; i < dbo.additionalClasses.length; i++) {
      button.classList.add(dbo.additionalClasses[i])
    }
  }
  if ('callback' in dbo) {
    button.onclick = dbo.callback
  }
  if ('href' in dbo) {
    button.href = dbo.href
  }
  if (('targetBlank' in dbo) && dbo.targetBlank) {
    button.target = '_blank'
  }
  if (dbo.icon) {
    try {
      const svg = dbo.icon()
      const tmp = document.createElement('span')
      tmp.innerHTML = svg.trim()
      const svgDom = tmp.firstChild
      if (svgDom) {
        button.prepend(svgDom)
      }
    } catch (err) {
      logger.error('Failed to generate the ' + dbo.name + ' button: ' + (err as string))
    }

    button.setAttribute('title', dbo.label)
  } else {
    button.textContent = dbo.label
  }
  dbo.buttonContainer.append(button)
}

export type {
  displayButtonOptions
}
export {
  displayButton
}
