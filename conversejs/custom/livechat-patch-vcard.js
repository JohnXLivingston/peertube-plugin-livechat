// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// Here we are patching the vCard plugin, to add some specific optimizations.

import { _converse, api } from '@converse/headless/index.js'
import {
  onOccupantAvatarChanged,
  setVCardOnModel,
  setVCardOnOccupant
} from '@converse/headless/plugins/vcard/utils.js'

const pluginDefinition = _converse.pluggable.plugins['converse-vcard']
const originalInitialize = pluginDefinition.initialize

pluginDefinition.initialize = function initialize () {
  const previousListeners = _converse._events.chatRoomInitialized ?? []
  originalInitialize.apply(this)

  _converse.api.settings.extend({
    livechat_load_all_vcards: false
  })

  // Now we must detect the new chatRoomInitialized listener, and remove it:
  const listenersToRemove = []
  for (const def of _converse._events.chatRoomInitialized ?? []) {
    if (def.callback && !previousListeners.includes(def.callback)) {
      listenersToRemove.push(def.callback)
    }
  }
  for (const callback of listenersToRemove) {
    console.debug('Livechat patching vcard: we must remove this listener', callback)
    api.listen.not('chatRoomInitialized', callback)
  }

  // Adding the new listener:
  api.listen.on('chatRoomInitialized', (m) => {
    console.debug('Patched version of the vcard chatRoomInitialized event.')
    setVCardOnModel(m)

    // loadAll: when in readonly mode (ie: OBS integration), always load all avatars.
    const loadAll = api.settings.get('livechat_load_all_vcards') === true
    let hiddenOccupants = m.get('hidden_occupants')
    if (hiddenOccupants !== true || loadAll) {
      m.occupants.forEach(setVCardOnOccupant)
    }
    m.listenTo(m.occupants, 'add', (occupant) => {
      if (hiddenOccupants !== true || loadAll) {
        setVCardOnOccupant(occupant)
      }
    })
    m.on('change:hidden_occupants', () => {
      hiddenOccupants = m.get('hidden_occupants')
      if (hiddenOccupants !== true || loadAll) {
        m.occupants.forEach(setVCardOnOccupant)
      }
    })
    m.listenTo(m.occupants, 'change:image_hash', o => onOccupantAvatarChanged(o))
  })
}
