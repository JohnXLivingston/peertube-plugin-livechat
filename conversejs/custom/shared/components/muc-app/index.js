// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { api, _converse } from '@converse/headless'
import './styles/muc-app.scss'

/**
 * Base class for MUC App custom elements (task app, notes app, ...).
 * This is an abstract class, should not be called directly.
 */
export class MUCApp extends CustomElement {
  enableSettingName = undefined // must be overloaded
  sessionStorangeShowKey = undefined // must be overloaded

  static get properties () {
    return {
      model: { type: Object, attribute: true }, // mucModel
      show: { type: Boolean, attribute: false }
    }
  }

  async initialize () {
    this.classList.add('livechat-converse-muc-app')
    this.show = this.enableSettingName &&
      api.settings.get(this.enableSettingName) &&
      this.sessionStorangeShowKey &&
      (window.sessionStorage?.getItem?.(this.sessionStorangeShowKey) === '1')

    // we listen for livechatSizeChanged event,
    // and close all apps except the first if small or medium width.
    // Note: this will also be triggered when we first open the page
    this.listenTo(_converse, 'livechatSizeChanged', () => {
      if (!this.show || !api.livechat_size?.width_is(['small', 'medium'])) {
        return
      }
      // are we the first opened app?
      for (const el of document.querySelectorAll('.livechat-converse-muc-app')) {
        if (el === this) { break }
        if (!el.show) { continue }
        console.debug('The livechat size is small or medium, there is already an opened app, so closing myself', this)
        // ok, there is already an opened app.
        this.toggleApp() // we know we are open
        break
      }
    })
  }

  render () { // must be overloaded.
    return ''
  }

  updated () {
    if (this.innerText.trim() === '') {
      this.classList.add('hidden') // we must do this, otherwise will have CSS side effects
    } else {
      this.classList.remove('hidden')
    }

    super.updated()
  }

  toggleApp () {
    this.show = !this.show
    if (this.sessionStorangeShowKey) {
      window.sessionStorage?.setItem?.(this.sessionStorangeShowKey, this.show ? '1' : '')
    }

    if (
      this.show &&
      api.livechat_size?.width_is(['small', 'medium'])
    ) {
      // When showing an App, if the screen width is small or medium, we hide the others.
      this._closeOtherApps()
    }
  }

  _closeOtherApps () {
    document.querySelectorAll('.livechat-converse-muc-app').forEach((el) => {
      if (el !== this && el.show) {
        console.debug('Closing another app, because livechat width is small or medium', el)
        el.toggleApp()
      }
    })
  }
}
