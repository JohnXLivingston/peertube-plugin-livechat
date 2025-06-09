// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Override the MUCBottomPanel custom element
 */
export function customizeMUCBottomPanel (plugin: any): void {
  const _converse = plugin._converse
  const MUCBottomPanel = _converse.api.elements.registry['converse-muc-bottom-panel']
  if (MUCBottomPanel) {
    class MUCBottomPanelOverloaded extends MUCBottomPanel {
      async initialize (): Promise<any> {
        await super.initialize()
        // We must refresh the bottom panel when these features changes (to display the infobox)
        // FIXME: the custom muc-bottom-panel template should be used here, in an overloaded render method, instead
        //    of using webpack to overload the original file.
        this.listenTo(this.model.features, 'change:x_peertubelivechat_emoji_only_mode', () => this.requestUpdate())
      }
    }
    _converse.api.elements.define('converse-muc-bottom-panel', MUCBottomPanelOverloaded)
  }
}
