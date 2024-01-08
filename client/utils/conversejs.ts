import type { InitConverseJSParams } from 'shared/lib/types'
import { computeAutoColors } from './colors'

// declare global {
//   interface Window {
//     converse?: {
//       initialize: (args: any) => void
//       plugins: {
//         add: (name: string, plugin: any) => void
//       }
//     }
//   }
// }

declare global {
  interface Window {
    converse?: any
    initConverse: Function
  }
}

/**
 * load the ConverseJS CSS.
 * TODO: always load them using plugin's package.json?
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
  }
}

export {
  loadConverseJS
}
