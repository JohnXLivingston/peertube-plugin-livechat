import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { StaticValue } from 'lit/static-html.js'
import { helpButtonSVG } from '../../../videowatch/buttons'

@customElement('plugin-configuration-row')
export class PLuginConfigurationRow extends LitElement {

  @property({ attribute: false })
  public title: string = `title`

  @property({ attribute: false })
  public description: string = `Here's a description`

  @property({ attribute: false })
  public helpLink: { url: URL, title: string } = { url : new URL('https://lmddgtfy.net/'), title: 'Online Help'}

  createRenderRoot = () => {
    return this
  }

  render() {
    return html`
    <div class="row mt-5">
    <div class="col-12 col-lg-4 col-xl-3">
      <h2>${this.title}</h2>
      <p>${this.description}</p>
        <a
          href="${this.helpLink.url.href}"
          target=_blank
          title="${this.helpLink.title}"
          class="orange-button peertube-button-link"
        >${unsafeSVG(helpButtonSVG())}</a>
      </div>
      <div class="col-12 col-lg-8 col-xl-9">
        <slot><p>Nothing in this row.</p></slot>
      </div>
    </div>`
  }
}
