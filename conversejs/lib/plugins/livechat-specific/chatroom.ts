// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

export function chatRoomOverrides (): {[key: string]: Function} {
  return {
    getActionInfoMessage: function getActionInfoMessage (this: any, code: string, nick: string, actor: any): any {
      if (code === '303') {
        // When there is numerous anonymous users joining at the same time,
        // they can all change their nicknames at the same time, generating a log of action messages.
        // To mitigate this, will don't display nickname changes if the previous nick is something like
        // 'Anonymous 12345'.
        if (/^Anonymous \d+$/.test(nick)) {
          // To avoid displaying the message, we just have to return an empty one
          // (createInfoMessage will ignore if !data.message).
          return null
        }
      }
      return this.__super__.getActionInfoMessage(code, nick, actor)
    },
    canPostMessages: function canPostMessages (this: any) {
      // ConverseJS does not handle properly the visitor role in unmoderated rooms.
      // See https://github.com/conversejs/converse.js/issues/3428 for more info.
      // FIXME: if #3428 is fixed, remove this override.
      return this.isEntered() && this.getOwnRole() !== 'visitor'
    }
  }
}
