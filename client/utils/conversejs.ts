import type { InitConverseJSParams } from 'shared/lib/types'

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

async function loadConverseJS (converseJSParams: InitConverseJSParams): Promise<void> {
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
