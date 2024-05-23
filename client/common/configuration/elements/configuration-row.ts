import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('livechat-configuration-row')
export class ConfigurationRowElement extends LitElement {

  @property({ attribute: false })
  public title: string = `title`

  @property({ attribute: false })
  public description: string = `Here's a description`

  @property({ attribute: false })
  public helpPage: string = 'documentation'

  protected createRenderRoot = (): HTMLElement | DocumentFragment => {
    return this
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <p>${this.description}</p>
      <livechat-help-button .page=${this.helpPage}>
      </livechat-help-button>
      `
  }
}
