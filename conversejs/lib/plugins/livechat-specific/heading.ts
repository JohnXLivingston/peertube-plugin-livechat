// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { destroyMUC } from './utils'

/**
 * Do some customization on MUCHeading:
 * * adds a logout button for users that are authenticated with an external account
 * * change the destroyMUC handler
 *
 * @param plugin The plugin object
 */
export function customizeHeading (plugin: any): void {
  const _converse = plugin._converse
  _converse.api.listen.on('getHeadingButtons', getHeadingButtons.bind(plugin))
  overrideMUCHeadingElement(_converse)
}

function getHeadingButtons (this: any, view: any, buttons: any[]): any {
  const _converse = this._converse

  if (view.model.get('type') !== _converse.constants.CHATROOMS_TYPE) {
    // only on MUC.
    return buttons
  }

  if (_converse.api.settings.get('livechat_specific_external_authent')) {
    // Adding a logout button
    buttons.push({
      i18n_text: _converse.__('Log out'),
      handler: async (ev: Event) => {
        ev.preventDefault()
        ev.stopPropagation()

        const messages = [_converse.__('Are you sure you want to leave this groupchat?')]
        const result = await _converse.api.confirm(_converse.__('Confirm'), messages)
        if (!result) { return }

        // Deleting access token in sessionStorage.
        window.sessionStorage.removeItem('peertube-plugin-livechat-external-auth-oidc-token')

        const reconnectMode = _converse.api.settings.get('livechat_external_auth_reconnect_mode')
        if (reconnectMode === 'button-close-open') {
          const button = document.getElementsByClassName('peertube-plugin-livechat-button-close')[0]
          if ((button as HTMLAnchorElement).click) { (button as HTMLAnchorElement).click() }
          return
        }

        window.location.reload()
      },
      a_class: 'close-chatbox-button',
      icon_class: 'fa-sign-out-alt',
      name: 'signout'
    })
  }

  return buttons
}

/**
 * Override the MUCHeading custom element, to customize the destroyMUC function.
 */
function overrideMUCHeadingElement (_converse: any): void {
  const MUCHeading = _converse.api.elements.registry['converse-muc-heading']
  if (MUCHeading) {
    class MUCHeadingOverloaded extends MUCHeading {
      async destroy (ev: Event): Promise<void> {
        ev.preventDefault()
        await destroyMUC(_converse, this.model) // here we call a custom version of destroyMUC
      }
    }
    _converse.api.elements.define('converse-muc-heading', MUCHeadingOverloaded)
  }
}
