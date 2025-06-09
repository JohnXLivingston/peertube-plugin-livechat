// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api, converse } from '../../../src/headless/index.js'
import { XMLNS_MAM_SEARCH } from './constants.js'

const env = converse.env
const {
  $iq,
  Strophe,
  sizzle,
  log,
  TimeoutError,
  __,
  u
} = env
const NS = Strophe.NS

async function query (options) {
  if (!api.connection.connected()) {
    throw new Error('Can\'t call `api.livechat_mam_search.query` before having established an XMPP session')
  }

  if (!options?.room) {
    throw new Error('api.livechat_mam_search.query: Missing room parameter.')
  }

  const attrs = {
    type: 'set',
    to: options.room
  }

  const jid = attrs.to
  const supported = await api.disco.supports(XMLNS_MAM_SEARCH, jid)
  if (!supported) {
    log.warn(`Did not search MAM archive for ${jid} because it doesn't support ${XMLNS_MAM_SEARCH}`)
    return { messages: [] }
  }

  const queryid = u.getUniqueId()
  const stanza = $iq(attrs).c('query', { xmlns: XMLNS_MAM_SEARCH, queryid: queryid })

  stanza.c('x', { xmlns: NS.XFORM, type: 'submit' })
    .c('field', { var: 'FORM_TYPE', type: 'hidden' })
    .c('value').t(XMLNS_MAM_SEARCH).up().up()

  if (options.from) {
    stanza.c('field', { var: 'from' }).c('value')
      .t(options.from).up().up()
  }
  if (options.occupant_id) {
    stanza.c('field', { var: 'occupant_id' }).c('value')
      .t(options.occupant_id).up().up()
  }
  stanza.up()

  // TODO: handle RSM (pagination.)

  const connection = api.connection.get()

  const messages = []
  const messageHandler = connection.addHandler((stanza) => {
    const result = sizzle(`message > result[xmlns="${NS.MAM}"]`, stanza).pop()
    if (result === undefined || result.getAttribute('queryid') !== queryid) {
      return true
    }
    const from = stanza.getAttribute('from')
    if (from !== attrs.to) {
      log.warn(`Ignoring alleged groupchat MAM message from ${from}`)
      return true
    }
    messages.push(stanza)
    return true
  }, NS.MAM)

  let error
  const timeout = api.settings.get('message_archiving_timeout')
  const iqResult = await api.sendIQ(stanza, timeout, false)

  if (iqResult === null) {
    const errMsg = __('Timeout while trying to fetch archived messages.')
    log.error(errMsg)
    error = new TimeoutError(errMsg)
    return { messages, error }
  } else if (u.isErrorStanza(iqResult)) {
    const errMsg = __('An error occurred while querying for archived messages.')
    log.error(errMsg)
    log.error(iqResult)
    error = new Error(errMsg)
    return { messages, error }
  }
  connection.deleteHandler(messageHandler)

  return { messages }
}

async function showMessagesFrom (occupant) {
  const appElement = document.querySelector('livechat-converse-muc-mam-search-app')
  if (!appElement) {
    throw new Error('Cant find Search App Element')
  }
  appElement.searchFrom(occupant)
  await appElement.showApp()
  await appElement.updateComplete // waiting for the app to be open
  return appElement
}

export default {
  query,
  showMessagesFrom
}
