// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { InitConverseJSParams, ChatPeertubeIncludeMode } from 'shared/lib/types'
import { computeAutoColors } from './colors'
import { getBaseRoute } from './uri'
import { logger } from './logger'

// FIXME: better declaration (see builtin.ts)
declare global {
  interface Window {
    converse?: any
    initConverse: Function
    initConversePlugins: Function
  }
}

let pollListenerInitiliazed = false

/**
 * load the ConverseJS CSS.
 * @param url CSS url
 */
async function loadCSS (url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const css = document.createElement('link')
    css.onerror = () => reject(new URIError(`CSS ${url} didn't load correctly.`))
    css.onload = () => resolve()
    css.setAttribute('type', 'text/css')
    css.setAttribute('rel', 'stylesheet')
    css.setAttribute('href', url)
    document.head.appendChild(css)
  })
}

/**
 * Loads a JS script.
 * @param url script url
 */
async function loadScript (url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onerror = () => reject(new URIError(`Script ${url} didn't load correctly.`))
    script.onload = () => resolve()
    script.async = true
    script.src = url
    document.head.appendChild(script)
  })
}

/**
 * Initialize needed CSS vars to apply the current Peertube theme to the livechat.
 */
function loadColors (): void {
  const colors = computeAutoColors()
  if (!colors) {
    return
  }
  const body = document.querySelector('body')
  if (!body) {
    return
  }
  body.style.setProperty('--peertube-main-foreground', colors.mainForeground)
  body.style.setProperty('--peertube-main-background', colors.mainBackground)
  body.style.setProperty('--peertube-grey-foreground', colors.greyForeground)
  body.style.setProperty('--peertube-grey-background', colors.greyBackground)
  body.style.setProperty('--peertube-menu-foreground', colors.menuForeground)
  body.style.setProperty('--peertube-menu-background', colors.menuBackground)
  body.style.setProperty('--peertube-input-foreground', colors.inputForeground)
  body.style.setProperty('--peertube-input-background', colors.inputBackground)
  body.style.setProperty('--peertube-button-foreground', colors.buttonForeground)
  body.style.setProperty('--peertube-button-background', colors.buttonBackground)
  body.style.setProperty('--peertube-link', colors.link)
  body.style.setProperty('--peertube-link-hover', colors.linkHover)
}

/**
 * Loads ConverseJS.
 * ConverseJS is loaded asyncrhonously for several reasons:
 * * to avoid loading big JS files each time you open Peertube
 * * we need ConverseJS in serveral different scopes
 *   ('common' for the full page and 'videowatch' when you view a video).
 *   So we don't want to bundle ConverseJS with scoped JS files.
 * * for now, we can't build ConverseJS without webpack
 *   (esbuild does not provide same alias as webpack, to customize ConverseJS).
 *
 * Once loadConverseJS has resolved, you can call window.initConverse.
 * @param converseJSParams Params to apply to ConverseJS
 */
async function loadConverseJS (converseJSParams: InitConverseJSParams): Promise<void> {
  // always loading colors, even if already done: so it will update if the current theme is changed.
  loadColors()

  if (!window.converse) {
    await Promise.all([
      loadCSS(converseJSParams.staticBaseUrl + 'conversejs/converse.min.css'),
      loadScript(converseJSParams.staticBaseUrl + 'conversejs/converse.min.js')
    ])
  }
  if (!window.initConverse) {
    await loadScript(converseJSParams.staticBaseUrl + 'static/builtin.js')
    window.initConversePlugins(true)
  }
}

/**
 * Loads the chat in the given container.
 * @param clientOptions Peertube client options
 * @param container the dom element where to insert the chat
 * @param roomKey the room to join
 * @param chatIncludeMode the include mode
 * @param forceType only usable for admins/moderators, to enter rooms that have not the current type (channel/video)
 */
async function displayConverseJS (
  clientOptions: RegisterClientOptions,
  container: HTMLElement,
  roomKey: string,
  chatIncludeMode: ChatPeertubeIncludeMode,
  forceType: boolean
): Promise<void> {
  const peertubeHelpers = clientOptions.peertubeHelpers

  const spinner = document.createElement('div')
  spinner.classList.add('livechat-spinner')
  spinner.setAttribute('id', 'livechat-loading-spinner')
  spinner.innerHTML = '<div></div>'
  container.append(spinner)
  // spinner will be removed by a converse plugin

  const converseRoot = document.createElement('converse-root')
  converseRoot.classList.add('theme-peertube')
  container.append(converseRoot)

  converseRoot.addEventListener('click', ev => {
    // For some reason, there are some buttons in ConverseJS that are not working properly.
    // When clicked, it does not prevent the default, so it try to open href="#".
    // We will catch such clicks in converse-root, and prevent default!
    if (!ev.target) { return }

    const a: HTMLAnchorElement | null = ('tagName' in ev.target) && (ev.target as HTMLAnchorElement).tagName === 'A'
      ? ev.target as HTMLAnchorElement
      : (ev.target as HTMLElement).closest('a')

    if (!a) { return }
    if (a.getAttribute('href') !== '#') { return }

    logger.log('Intercepting a click on href=# in converse root, canceling the event.')
    ev.preventDefault()
  })

  const authHeader = peertubeHelpers.getAuthHeader()

  const url = getBaseRoute(clientOptions) + '/api/configuration/room/' +
    encodeURIComponent(roomKey) +
    (forceType ? '?forcetype=1' : '')
  const response = await fetch(
    url,
    {
      method: 'GET',
      headers: authHeader
    }
  )
  if (!response.ok) {
    throw new Error('Can\'t get room configuration.')
  }
  const converseJSParams: InitConverseJSParams = await (response).json()

  if (!pollListenerInitiliazed) {
    // First time we got here, initialize this event:
    const i18nVoteOk = await clientOptions.peertubeHelpers.translate(LOC_POLL_VOTE_OK)
    pollListenerInitiliazed = true
    document.addEventListener('livechat-poll-vote', () => {
      clientOptions.peertubeHelpers.notifier.success(i18nVoteOk)
    })
  }

  await loadConverseJS(converseJSParams)
  await window.initConverse(converseJSParams, chatIncludeMode, authHeader ?? null)
}

export {
  displayConverseJS
}
