export const livechatSpecificsPlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse

    _converse.api.settings.extend({
      // if user is authenticated with an external account (to add a logout button)
      livechat_specific_external_authent: false
    })

    _converse.api.listen.on('getHeadingButtons', (view: any, buttons: any[]) => {
      if (view.model.get('type') !== _converse.CHATROOMS_TYPE) {
        // only on MUC.
        return
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
    })

    _converse.api.listen.on('chatRoomViewInitialized', function (this: any, _model: any): void {
      // Remove the spinner if present...
      document.getElementById('livechat-loading-spinner')?.remove()
    })

    // Adding a method on window.converse, so we can close the chat on navigation-end event
    // (when chatIncludeMode is peertube-*)
    window.converse.livechatDisconnect = function livechatDisconnect () {
      if (_converse.api.connection.connected()) {
        console.log('[livechatSpecificsPlugin] disconnecting converseJS...')
        _converse.api.user.logout()
      }
    }

    // To reconnect ConverseJS when joining another room (or the same one),
    // we store the relevant closure function:
    window.reconnectConverse = function reconnectConverse (params: any): void {
      console.log('[livechatSpecificsPlugin] reconnecting converseJS...')

      // The new room to join:
      _converse.api.settings.set('auto_join_rooms', params.auto_join_rooms)
      _converse.api.settings.set('notify_all_room_messages', params.notify_all_room_messages)

      // update connection parameters (in case the user logged in after the first chat)
      for (const k of [
        'bosh_service_url', 'websocket_url',
        'authentication', 'nickname', 'muc_nickname_from_jid', 'auto_login', 'jid', 'password', 'keepalive'
      ]) {
        _converse.api.settings.set(k, params[k])
      }

      // update other settings
      for (const k of [
        'hide_muc_participants',
        'livechat_enable_viewer_mode',
        'livechat_external_auth_oidc_buttons',
        'livechat_external_auth_reconnect_mode',
        'livechat_mini_muc_head',
        'livechat_specific_external_authent'
      ]) {
        _converse.api.settings.set(k, params[k])
      }

      // Then login.
      _converse.api.user.login()
    }

    if (window.location.protocol === 'http:') {
      // We are probably on a dev instance, so we will add _converse in window:
      (window as any)._livechatConverse = _converse
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
