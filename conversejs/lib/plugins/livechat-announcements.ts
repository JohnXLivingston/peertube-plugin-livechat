// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

interface Current {
  announcementType: string | undefined
}

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

    // This is a closure variable, to get the current form status when sending a message.
    const current: Current = {
      announcementType: undefined
    }

    overrideMUCMessageForm(_converse, current)

    _converse.api.listen.on('getToolbarButtons', getToolbarButtons.bind(this))

    _converse.api.listen.on('chatRoomInitialized', (muc: any) => onAffiliationChange(_converse, muc))

    _converse.api.listen.on('getOutgoingMessageAttributes', (chatbox: any, attrs: any) => {
      return onGetOutgoingMessageAttributes(current, _converse, chatbox, attrs)
    })

    _converse.api.listen.on('createMessageStanza', createMessageStanza)

    _converse.api.listen.on('parseMUCMessage', parseMUCMessage)

    overrideMessage(_converse)
  }
}

/**
 * Overloads the MUCMessageForm to handle the announcement type field (if present) when sending a message.
 */
function overrideMUCMessageForm (_converse: any, current: Current): void {
  const MUCMessageForm = _converse.api.elements.registry['converse-muc-message-form']
  if (MUCMessageForm) {
    class MUCMessageFormloaded extends MUCMessageForm {
      async onFormSubmitted (ev?: Event): Promise<void> {
        const announcementSelect = this.querySelector('[name=livechat-announcements]')
        current.announcementType = announcementSelect?.selectedOptions?.[0]?.value || undefined
        try {
          await super.onFormSubmitted(ev)
          if (announcementSelect) { announcementSelect.selectedIndex = 0 } // set back to default
        } catch (err) {
          console.log(err)
        }
        current.announcementType = undefined
      }
    }
    _converse.api.elements.define('converse-muc-message-form', MUCMessageFormloaded)
  }
}

/**
 * Adds the announcement selector in the toolbar for owner/admin.
 * @param this the plugin
 * @param toolbarEl the toolbar element
 * @param buttons the button list
 * @returns the updated "button" list
 */
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

  const i18n = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE)
  const i18nStandard = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_STANDARD)
  const i18nAnnouncement = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_ANNOUNCEMENT)
  const i18nHighlight = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_HIGHLIGHT)
  const i18nWarning = __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_WARNING)

  const select = html`<span class="livechat-announcements-form form-inline">
    <label for="livechat-announcements-select">${i18n}</label>
    <select
      name="livechat-announcements"
      id="livechat-announcements-select"
      class="form-control form-control-sm"
      title=${i18n}
    >
      <option value="">${i18nStandard}</option>
      <option value="highlight">${i18nHighlight}</option>
      <option value="announcement">${i18nAnnouncement}</option>
      <option value="warning">${i18nWarning}</option>
    </select>
  </span>`

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

/**
 * Refreshed the toolbar when current user affiliation changes.
 * @param _converse _converse object
 * @param muc the current muc
 */
function onAffiliationChange (_converse: any, muc: any): void {
  muc.occupants.on('change:affiliation', (occupant: any) => {
    if (occupant.get('jid') !== _converse.bare_jid) { // only for myself
      return
    }
    document.querySelectorAll('converse-chat-toolbar').forEach(e => (e as any).requestUpdate?.())
  })
}

/**
 * For outgoing message, adding the announcement type if there is a current one.
 * @param current current object
 * @param _converse _converse object
 * @param chatbox the chatbox
 * @param attrs message attributes
 * @returns
 */
function onGetOutgoingMessageAttributes (
  current: Current,
  _converse: any,
  chatbox: any,
  attrs: any
): Parameters<typeof onGetOutgoingMessageAttributes>[3] {
  if (!current.announcementType) { return attrs }

  const { __ } = _converse
  attrs.livechat_announcement_type = current.announcementType
  if (current.announcementType === 'announcement') {
    attrs.body = '* ' + __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_ANNOUNCEMENT) + ' * \n' + attrs.body
  } else if (current.announcementType === 'warning') {
    attrs.body = '* ' + __(LOC_ANNOUNCEMENTS_MESSAGE_TYPE_WARNING) + ' *\n' + attrs.body
  }
  return attrs
}

/**
 * Outgoing messages: adding an attribute on body for announcements.
 * @param chat
 * @param data
 */
async function createMessageStanza (
  chat: any,
  data: any
): Promise<Parameters<typeof createMessageStanza>[1]> {
  const { message, stanza } = data
  const announcementType = message.get('livechat_announcement_type')
  if (!announcementType) {
    return data
  }

  stanza.tree().querySelector('message body')?.setAttribute('x-livechat-announcement-type', announcementType)
  return data
}

/**
 * Incoming messages: checking if there is an announcement attribute, and adding it in computed attributes.
 * @param stanza
 * @param attrs
 */
function parseMUCMessage (stanza: any, attrs: any): Parameters<typeof parseMUCMessage>[1] {
  const { sizzle } = window.converse.env
  const body = sizzle('message body', stanza)?.[0]
  if (!body) { return attrs }

  const announcementType = body.getAttribute('x-livechat-announcement-type')
  if (!announcementType) { return attrs }

  // Note: we don't check the value here. Will be done in getExtraMessageClasses.
  // Moreover, the backend server will ensure that only admins/owners can send this attribute.
  attrs.livechat_announcement_type = announcementType
  return attrs
}

/**
 * Overloading the Message class to add CSS for announcements.
 * @param _converse
 */
function overrideMessage (_converse: any): void {
  const Message = _converse.api.elements.registry['converse-chat-message']
  if (Message) {
    class MessageOverloaded extends Message {
      getExtraMessageClasses (this: any): string {
        // Adding CSS class if the message is an announcement.
        let extraClasses = super.getExtraMessageClasses() ?? ''
        const announcementType: string | undefined = this.model.get('livechat_announcement_type')
        if (!announcementType) {
          return extraClasses
        }
        if (['announcement', 'highlight', 'warning'].includes(announcementType)) {
          extraClasses += ' livechat-' + announcementType
        }
        return extraClasses
      }
    }
    _converse.api.elements.define('converse-chat-message', MessageOverloaded)
  }
}
