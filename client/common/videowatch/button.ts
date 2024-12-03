// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { SVGButton } from './buttons'
import { logger } from '../../utils/logger'

interface displayButtonOptionsBase {
  buttonContainer: HTMLElement
  name: string
  label: string
  icon?: SVGButton
  additionalClasses?: string[]
}

interface displayButtonOptionsCallback extends displayButtonOptionsBase {
  callback: () => void | boolean | Promise<void>
}

interface displayButtonOptionsHref extends displayButtonOptionsBase {
  href: string
  targetBlank?: boolean
}

type displayButtonOptions = displayButtonOptionsCallback | displayButtonOptionsHref

function displayButton (dbo: displayButtonOptions): void {
  const button = document.createElement('a')
  button.classList.add(
    'primary-button', 'orange-button', 'peertube-button-link',
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

  if (!button.href || button.href === '#') {
    // No href => it is not a link.
    button.role = 'button'
    button.tabIndex = 0

    // We must also ensure that the enter key is triggering the onclick
    if (button.onclick) {
      button.onkeydown = ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
          button.click()
        }
      }
    }
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
        if ('ariaHidden' in (svgDom as HTMLElement)) {
          // Icon must be hidden for screen readers.
          (svgDom as HTMLElement).ariaHidden = 'true'
        }
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
