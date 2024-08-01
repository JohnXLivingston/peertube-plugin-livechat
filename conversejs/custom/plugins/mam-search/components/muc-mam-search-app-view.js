// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '@converse/headless'
import { Collection } from '@converse/skeletor'
import { parseMUCMessage } from '@converse/headless/plugins/muc/parsers.js'
import { MUCApp } from '../../../shared/components/muc-app/index.js'
import { tplMamSearchApp } from '../templates/muc-mam-search-app.js'

/**
 * Custom Element to display the Mam Search Application.
 */
export default class MUCMamSearchApp extends MUCApp {
  restoreSettingName = undefined
  sessionStorageRestoreKey = undefined

  static get properties () {
    return {
      model: { type: Object, attribute: true }, // the muc model
      occupant: { type: Object, attribute: true }, // the occupant to search (can be undefined if no current search)
      results: { type: Object, attribute: true } // a Collection with the results.
    }
  }

  render () {
    return tplMamSearchApp(this, this.model, this.occupant)
  }

  searchFrom (occupant) {
    this.results = undefined
    this.occupant = occupant
    const p = api.livechat_mam_search.query({
      room: this.model.get('jid'),
      // FIXME: shouldn't we escape the nick? cant see any code that escapes it in Converse.
      from: occupant.get('from') || this.model.get('jid') + '/' + (occupant.get('nick') ?? ''),
      occupant_id: occupant.get('occupant_id')
    })

    // don't wait the result to show something! (there will be a spinner)
    p.then(async (results) => {
      this.occupant = occupant // in case user did simultaneous requests

      const messages = await Promise.all(results.messages.map(s => parseMUCMessage(s, this.model)))
      const col = new Collection()
      for (const message of messages) {
        // FIXME: this does not work for now, the collection is not properly initiated (no storage engine)
        col.create(message)
      }
      this.results = col
    })
  }
}

api.elements.define('livechat-converse-muc-mam-search-app', MUCMamSearchApp)
