// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * livechat announcements ConverseJS plugin:
 * with this plugin, moderators can send highlighted/announcements messages.
 *
 * Moderators will have a special select field in the chat toolbar, so that they can choose a messaging style.
 * These special messages will have a first line with a generated title (for XMPP compatibility).
 * They will also have a special attribute on the body tag.
 * This attribute will be used to apply some CSS with this plugin.
 */
export const livechatAnnouncementsPlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse
    const { __ } = _converse

    // This is a closure variable, to get the current form status when sending a message.
    let currentAnnouncementType: string | undefined

    // Overloading the MUCMessageForm to handle the announcement type field (if present).
    const MUCMessageForm = _converse.api.elements.registry['converse-muc-message-form']
    if (MUCMessageForm) {
      class MUCMessageFormloaded extends MUCMessageForm {
        async onFormSubmitted (ev?: Event): Promise<void> {
          const announcementSelect = this.querySelector('[name=livechat-announcements]')
          currentAnnouncementType = announcementSelect?.selectedOptions?.[0]?.value || undefined
          try {
            await super.onFormSubmitted(ev)
            if (announcementSelect) { announcementSelect.selectedIndex = 0 } // set back to default
          } catch (err) {
            console.log(err)
          }
          currentAnnouncementType = undefined
        }
      }
      _converse.api.elements.define('converse-muc-message-form', MUCMessageFormloaded)
    }

    // Toolbar: adding the announcement type field (if user has rights).
    _converse.api.listen.on('getToolbarButtons', getToolbarButtons.bind(this))

    // When current user affiliation changes, we must refresh the toolbar.
    _converse.api.listen.on('chatRoomInitialized', (muc: any) => {
      muc.occupants.on('change:affiliation', (occupant: any) => {
        if (occupant.get('jid') !== _converse.bare_jid) { // only for myself
          return
        }
        document.querySelectorAll('converse-chat-toolbar').forEach(e => (e as any).requestUpdate?.())
      })
    })

    _converse.api.listen.on('getOutgoingMessageAttributes', (chatbox: any, attrs: any) => {
      // For outgoing message, adding the announcement type if there is a current one.
      if (!currentAnnouncementType) { return attrs }

      attrs.livechat_announcement_type = currentAnnouncementType
      if (currentAnnouncementType === 'announcement') {
        attrs.body = '* ' + __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_ANNOUNCEMENT) + ' * \n' + attrs.body
      }
      return attrs
    })

    _converse.api.listen.on('createMessageStanza', async (chat: any, data: any) => {
      // Outgoing messages: adding an attribute on body for announcements.
      const { message, stanza } = data
      const announcementType = message.get('livechat_announcement_type')
      if (!announcementType) {
        return data
      }

      stanza.tree().querySelector('message body')?.setAttribute('x-livechat-announcement-type', announcementType)
      return data
    })

    _converse.api.listen.on('parseMUCMessage', (stanza: any, attrs: any) => {
      // Incoming messages: checking if there is an announcement attribute
      const { sizzle } = window.converse.env
      const body = sizzle('message body', stanza)?.[0]
      if (!body) { return attrs }

      const announcementType = body.getAttribute('x-livechat-announcement-type')
      if (!announcementType) { return attrs }

      // Note: we don't check the value here. Will be done in getExtraMessageClasses.
      // Moreover, the backend server will ensure that only admins/owners can send this attribute.
      attrs.livechat_announcement_type = announcementType
      return attrs
    })

    // Overloading the Message class to add CSS for announcements.
    const Message = _converse.api.elements.registry['converse-chat-message']
    if (Message) {
      class MessageOverloaded extends Message {
        getExtraMessageClasses (this: any): string {
          // Adding CSS class if the message is an announcement.
          let extraClasses = super.getExtraMessageClasses() ?? ''
          const announcementType = this.model.get('livechat_announcement_type')
          if (!announcementType) {
            return extraClasses
          }
          switch (announcementType) {
            case 'announcement':
              extraClasses += ' livechat-announcement'
              break
            case 'highlight':
              extraClasses += ' livechat-highlight'
              break
          }
          return extraClasses
        }
      }
      _converse.api.elements.define('converse-chat-message', MessageOverloaded)
    }
  }
}

function getToolbarButtons (this: any, toolbarEl: any, buttons: any[]): Parameters<typeof getToolbarButtons>[1] {
  const _converse = this._converse
  const mucModel = toolbarEl.model
  if (!toolbarEl.is_groupchat) {
    return buttons
  }
  const myself = mucModel.getOwnOccupant()
  if (!myself || !['admin', 'owner'].includes(myself.get('affiliation') as string)) {
    return buttons
  }

  const { __ } = _converse
  const { html } = window.converse.env

  const i18nStandard = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_STANDARD)
  const i18nAnnouncement = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_ANNOUNCEMENT)
  const i18nHighlight = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_HIGHLIGHT)

  const select = html`<select name="livechat-announcements">
    <option value="">${i18nStandard}</option>
    <option value="announcement">${i18nAnnouncement}</option>
    <option value="highlight">${i18nHighlight}</option>
  </select>`

  if (_converse.api.settings.get('visible_toolbar_buttons').emoji) {
    // Emojis should be the first entry, so adding select in second place.
    buttons = [
      buttons.shift(),
      select,
      ...buttons
    ]
  } else {
    // Adding the select in first place.
    buttons.unshift(select)
  }
  return buttons
}
