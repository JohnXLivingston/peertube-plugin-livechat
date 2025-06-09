// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Do some customization on Message actions custom elements:
 * * override the copy text method to add meta data
 *
 * @param plugin The plugin object
 */
export function customizeMessageAction (plugin: any): void {
  const _converse = plugin._converse
  const MessageActions = _converse.api.elements.registry['converse-message-actions']
  if (MessageActions) {
    class MessageActionsOverloaded extends MessageActions {
      async onMessageCopyButtonClicked (ev?: Event): Promise<void> {
        ev?.preventDefault?.()
        let txt = ''
        try {
          txt += this.model.getDisplayName() as string
          txt += ' - '
          const date = new Date((this.model.get('edited') || this.model.get('time')) as string)
          txt += date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
          txt += '\n'
        } catch {}
        txt += this.model.getMessageText() as string
        await navigator.clipboard.writeText(txt)
      }
    }
    _converse.api.elements.define('converse-message-actions', MessageActionsOverloaded)
  }
}
