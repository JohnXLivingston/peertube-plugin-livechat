import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from '../../lib/elements/livechat'

@customElement('livechat-configuration-row')
export class ConfigurationRowElement extends LivechatElement {

  @property({ attribute: false })
  public title: string = `title`

  @property({ attribute: false })
  public description: string = `Here's a description`

  @property({ attribute: false })
  public helpPage: string = 'documentation'

  render() {
    return html`
      <h2>${this.title}</h2>
      <p>${this.description}</p>
      <livechat-help-button .page=${this.helpPage}>
      </livechat-help-button>
      `
  }
}
