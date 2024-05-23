import { LitElement } from 'lit'

/**
 * Base class for all Custom Elements.
 */
export class LivechatElement extends LitElement {
  protected createRenderRoot = (): HTMLElement | DocumentFragment => {
    return this
  }
}
