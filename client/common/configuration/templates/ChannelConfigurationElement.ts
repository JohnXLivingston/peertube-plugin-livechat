import { html, LitElement } from 'lit'
import { repeat } from 'lit-html/directives/repeat.js'
import { customElement, property } from 'lit/decorators.js'


@customElement('channel-configuration')
export class ChannelConfigurationElement extends LitElement {

  @property()
  public list: string[] = ["foo", "bar", "baz"]

  @property()
  public newEl: string = 'change_me'

  createRenderRoot = () => {
    return this
  }

  render() {
    return html`
    <ul>
      ${repeat(this.list, (el: string, index) => html`<li>${el}<button @click=${this._removeFromList(index)}>remove</button></li>`
    )}
      <li><input .value=${this.newEl}/><button @click=${this._addToList(this.newEl)}>add</button></li>
    </ul>
    `
  }

  private _addToList(newEl: string) {
    return () => {
      this.list.push(newEl)
      this.requestUpdate('list')
    }
  }

  private _removeFromList(index: number) {
    return () => {
      this.list.splice(index, 1)
      this.requestUpdate('list')
    }
  }
}
