import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './HelpButtonElement'
import { getGlobalStyleSheets } from '../../global-styles'

@customElement('plugin-configuration-row')
export class PluginConfigurationRow extends LitElement {

  @property({ attribute: false })
  public title: string = `title`

  @property({ attribute: false })
  public description: string = `Here's a description`

  @property({ attribute: false })
  public helpPage: string = 'documentation'

  static styles = [
    ...getGlobalStyleSheets()
  ];

  render() {
    return html`
    <div class="row mt-5">
      <div class="col-12 col-lg-4 col-xl-3">
        <h2>${this.title}</h2>
        <p>${this.description}</p>
        <help-button .page=${this.helpPage}>
        </help-button>
      </div>
      <div class="col-12 col-lg-8 col-xl-9">
        <slot><p>Nothing in this row.</p></slot>
      </div>
    </div>`
  }
}
