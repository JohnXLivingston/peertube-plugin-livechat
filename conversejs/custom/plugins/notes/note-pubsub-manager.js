// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { PubSubManager } from '../../shared/lib/pubsub-manager.js'

export class NotePubSubManager extends PubSubManager {
  _additionalModelToData (item, data) {
    super._additionalModelToData(item, data)

    data.about_jid = item.get('about_jid')
    data.about_occupant_id = item.get('about_occupant_id')
    data.about_nick = item.get('about_nick')
  }

  _additionalDataToItemNode (data, item) {
    super._additionalDataToItemNode(data, item)

    const aboutAttributes = {}
    if (data.about_jid !== undefined) {
      aboutAttributes.jid = data.about_jid
    }
    if (data.about_nick !== undefined) {
      aboutAttributes.nick = data.about_nick
    }
    const occupantId = data.about_occupant_id

    if (occupantId !== undefined || Object.values(aboutAttributes).length) {
      item.c('note-about', aboutAttributes)
      if (occupantId) {
        item.c('occupant-id', { xmlns: 'urn:xmpp:occupant-id:0', id: occupantId }).up()
      }
      item.up()
    }
  }

  _additionalParseItemNode (itemNode, type, data) {
    super._additionalParseItemNode(itemNode, type, data)

    const about = itemNode.querySelector('& > note-about')
    if (!about) { return }

    data.about_jid = about.getAttribute('jid')
    data.about_nick = about.getAttribute('nick')

    const occupantIdEl = about.querySelector('& > occupant-id')
    if (occupantIdEl) {
      data.about_occupant_id = occupantIdEl.getAttribute('id')
    }
  }
}
