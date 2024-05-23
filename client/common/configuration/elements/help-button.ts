import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { helpButtonSVG } from '../../../videowatch/buttons'
import { consume } from '@lit/context'
import { registerClientOptionsContext } from '../contexts/channel'
import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { Task } from '@lit/task'
import { localizedHelpUrl } from '../../../utils/help'
import { ptTr } from '../directives/translation'
import { DirectiveResult } from 'lit/directive'
import { getGlobalStyleSheets } from '../../global-styles'

@customElement('help-button')
export class HelpButtonElement extends LitElement {

  @consume({context: registerClientOptionsContext})
  public registerClientOptions: RegisterClientOptions | undefined

  @property({ attribute: false })
  public buttonTitle: string | DirectiveResult = ptTr(LOC_ONLINE_HELP)

  @property({ attribute: false })
  public page: string = ''

  @state()
  public url: URL = new URL('https://lmddgtfy.net/')

  static styles = [
    ...getGlobalStyleSheets()
  ];

  private _asyncTaskRender = new Task(this, {
    task: async ([registerClientOptions], {signal}) => {
      this.url = new URL(registerClientOptions ? await localizedHelpUrl(registerClientOptions, { page: this.page }) : '')
    },
    args: () => [this.registerClientOptions]
  });

  render() {
    return this._asyncTaskRender.render({
      complete: () => html`<a
        href="${this.url.href}"
        target=_blank
        title="${this.buttonTitle}"
        class="orange-button peertube-button-link"
      >${unsafeHTML(helpButtonSVG())}</a>`
    })
  }
}
