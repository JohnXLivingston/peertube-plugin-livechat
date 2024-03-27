export const livechatSpecificsPlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse
    _converse.api.listen.on('chatRoomViewInitialized', function (this: any, _model: any): void {
      // Remove the spinner if present...
      document.getElementById('livechat-loading-spinner')?.remove()
    })

    // Adding a methode on window.converse, so we can close the chat on navigation-end event
    // (when chatIncludeMode is peertube-*)
    window.converse.livechatDisconnect = function livechatDisconnect () {
      console.log('[livechatSpecificsPlugin] disconnecting converseJS...')
      _converse.api.user.logout()
      window.converse.livechatDisconnect = undefined // will be set again on next initialize.
    }
  },
  overrides: {
    ChatRoom: {
      getActionInfoMessage: function (this: any, code: string, nick: string, actor: any): any {
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
      }
    },
    ChatRoomMessage: {
      /* By default, ConverseJS groups messages from the same users for a 10 minutes period.
       * This make no sense in a livechat room. So we override isFollowup to ignore. */
      isFollowup: function isFollowup () { return false }
    },
    ChatRoomOccupants: {
      comparator: function (this: any, occupant1: any, occupant2: any): Number {
        // Overriding Occupants comparators, to display anonymous users at the end of the list.
        const nick1: string = occupant1.getDisplayName()
        const nick2: string = occupant2.getDisplayName()
        const b1 = nick1.startsWith('Anonymous ')
        const b2 = nick2.startsWith('Anonymous ')
        if (b1 === b2) {
          // Both startswith anonymous, or non of it: fallback to the standard comparator.
          return this.__super__.comparator(occupant1, occupant2)
        }
        // Else: Anonymous always last.
        return b1 ? 1 : -1
      }
    }
  }
}
