// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only
import { XMLNS_POLL } from '../constants.js'
import { tplPollForm } from '../templates/poll-form.js'
import { CustomElement } from 'shared/components/element.js'
import { converse, api, parsers } from '@converse/headless'
import { webForm2xForm } from '@converse/headless/utils/form'
import { __ } from 'i18n'
import '../styles/poll-form.scss'
const $iq = converse.env.$iq
const u = converse.env.utils
const sizzle = converse.env.sizzle
const Strophe = converse.env.Strophe

export default class MUCPollFormView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      modal: { type: Object, attribute: true },
      alert_message: { type: Object, attribute: false },
      title: { type: String, attribute: false },
      instructions: { type: String, attribute: false }
    }
  }

  _fieldTranslationMap = new Map()

  xform = undefined

  async initialize () {
    this.alert_message = undefined
    if (!this.model) {
      this.alert_message = __('Error')
      return
    }
    try {
      this._initFieldTranslations()
      const stanza = await this._fetchPollForm()
      const xform = parsers.parseXForm(stanza)
      if (!xform) {
        throw Error('Missing xform in stanza')
      }

      xform.fields?.map(f => this._translateField(f))
      this.xform = xform

      // eslint-disable-next-line no-undef
      this.title = __(LOC_poll_title) // xform.querySelector('title')?.textContent ?? ''
      // eslint-disable-next-line no-undef
      this.instructions = __(LOC_poll_instructions) // xform.querySelector('instructions')?.textContent ?? ''
    } catch (err) {
      console.error(err)
      this.alert_message = __('Error')
    }
  }

  render () {
    return tplPollForm(this)
  }

  _fetchPollForm () {
    return api.sendIQ(
      $iq({
        to: this.model.get('jid'),
        type: 'get'
      }).c('query', { xmlns: XMLNS_POLL })
    )
  }

  _initFieldTranslations () {
    // eslint-disable-next-line no-undef
    this._fieldTranslationMap.set('muc#roompoll_question', __(LOC_poll_question))
    // eslint-disable-next-line no-undef
    this._fieldTranslationMap.set('muc#roompoll_duration', __(LOC_poll_duration))
    // eslint-disable-next-line no-undef
    this._fieldTranslationMap.set('muc#roompoll_anonymous_results', __(LOC_poll_anonymous_results))
    for (let i = 1; i <= 10; i++) {
      this._fieldTranslationMap.set(
        'muc#roompoll_choice' + i.toString(),
        // eslint-disable-next-line no-undef
        __(LOC_poll_choice_n).replace('{{N}}', i.toString())
      )
    }
  }

  _translateField (field) {
    const v = field.var
    const label = this._fieldTranslationMap.get(v)
    if (label) {
      field.label = label
    }
  }

  async formSubmit (ev) {
    ev.preventDefault()
    try {
      this.alert_message = undefined
      const form = ev.target
      const inputs = sizzle(':input:not([type=button]):not([type=submit])', form)

      const iq = $iq({
        type: 'set',
        to: this.model.get('jid'),
        id: u.getUniqueId()
      }).c('query', { xmlns: XMLNS_POLL })

      iq.c('x', { xmlns: Strophe.NS.XFORM, type: 'submit' })

      const xmlNodes = inputs.map(i => webForm2xForm(i)).filter(n => n)
      xmlNodes.forEach(n => iq.cnode(n).up())

      await api.sendIQ(iq)

      if (this.modal) {
        this.modal.close()
      }
    } catch (err) {
      if (u.isErrorStanza(err)) {
        // Checking if there is a text error that we can show to the user.
        if (sizzle('error bad-request', err).length) {
          const text = sizzle('error text', err)
          if (text.length) {
            this.alert_message = __('Error') + ': ' + text[0].textContent
            return
          }
        }
      }
      console.error(err)
      this.alert_message = __('Error')
    }
  }
}

api.elements.define('livechat-converse-poll-form', MUCPollFormView)
