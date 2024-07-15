// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Plugin to add buttons (help, close, open in another window) in the muc menu,
 * when we are embedded in Peertube.
 */
export const livechatMiniMucHeadPlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse
    _converse.api.settings.extend({
      // tells the overloaded template to render differently.
      livechat_mini_muc_head: false
    })

    _converse.api.listen.on('getHeadingButtons', (view: any, buttons: any[]) => {
      if (view.model.get('type') !== _converse.constants.CHATROOMS_TYPE) {
        // only on MUC.
        return buttons
      }

      // removing the 'show/hide topic' buttons
      buttons = buttons.filter(b => b.name !== 'toggle-topic')
      return buttons
    })

    const restoreClonedButtons = (): void => {
      console.log('[peertube-plugin-livechat] Removing class peertube-plugin-livechat-buttons-cloned')
      document.querySelectorAll(
        '.peertube-plugin-livechat-buttons-cloned'
      ).forEach(el => el.classList.remove('peertube-plugin-livechat-buttons-cloned'))
    }

    // muc-head can hide buttons that are cloned, so we restore them on disconnection and chatbox closing.
    _converse.api.listen.on('disconnected', restoreClonedButtons)
    _converse.api.listen.on('chatBoxClosed', restoreClonedButtons)
  }
}
