// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function chatRoomOverrides (): Record<string, Function> {
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
    },
    initOccupants: function initOccupants (this: any) {
      const r = this.__super__.initOccupants()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      const originalComparatorFunction: Function = this.occupants.comparator
      this.occupants.comparator = function (this: any, occupant1: any, occupant2: any): number {
        // Overriding Occupants comparators, to display anonymous users at the end of the list.
        const nick1: string = occupant1.getDisplayName()
        const nick2: string = occupant2.getDisplayName()
        const b1 = nick1.startsWith('Anonymous ')
        const b2 = nick2.startsWith('Anonymous ')
        if (b1 === b2) {
          // Both startswith anonymous, or non of it: fallback to the standard comparator.
          return originalComparatorFunction.call(this, occupant1, occupant2)
        }
        // Else: Anonymous always last.
        return b1 ? 1 : -1
      }

      return r
    }
  }
}
