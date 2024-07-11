// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '@converse/headless/index.js'
import { CustomElement } from 'shared/components/element.js'
import { tplExternalLoginModal } from 'templates/livechat-external-login-modal.js'
import { __ } from 'i18n'

export default class LivechatExternalLoginContentElement extends CustomElement {
  static get properties () {
    return {
      external_auth_oidc_alert_message: { type: String, attribute: false },
      remote_peertube_state: { type: String, attribute: false },
      remote_peertube_alert_message: { type: String, attribute: false },
      remote_peertube_try_anyway_url: { type: String, attribute: false },
      remote_peertube_open_failed_url: { type: String, attribute: false }
    }
  }

  constructor () {
    super()
    this.remote_peertube_state = 'init'
  }

  render () {
    return tplExternalLoginModal(this, {
      external_auth_oidc_alert_message: this.external_auth_oidc_alert_message,
      remote_peertube_state: this.remote_peertube_state,
      remote_peertube_alert_message: this.remote_peertube_alert_message,
      remote_peertube_try_anyway_url: this.remote_peertube_try_anyway_url,
      remote_peertube_open_failed_url: this.remote_peertube_open_failed_url
    })
  }

  onRemotePeertubeKeyUp (_ev) {
    if (this.remote_peertube_state !== 'init') {
      this.remote_peertube_state = 'init'
      this.remote_peertube_alert_message = ''
      this.clearAlert()
    }
  }

  async openRemotePeertube (ev) {
    ev.preventDefault()
    this.clearAlert()

    const remotePeertubeUrl = ev.target.peertube_url.value.trim()
    if (!remotePeertubeUrl) { return }

    this.remote_peertube_state = 'loading'

    try {
      // Calling Peertube API to check if livechat plugin is available.
      // In the meantime, this will also check that the URL exists, and is a Peertube instance
      // (or something with similar API result... as the user typed the url, we assume there is no security risk here).
      const configApiUrl = new URL('/api/v1/config', remotePeertubeUrl)
      const config = await (await fetch(configApiUrl.toString())).json()
      if (!config || typeof config !== 'object') {
        throw new Error('Invalid config API result')
      }
      if (!('plugin' in config) || !('registered' in config.plugin) || !Array.isArray(config.plugin.registered)) {
        throw new Error('No registered plugin in config API result')
      }
      if (!config.plugin.registered.find(p => p.npmName === 'peertube-plugin-livechat')) {
        console.error('Plugin livechat not available on remote instance')
        this.remote_peertube_state = 'error'
        // eslint-disable-next-line no-undef
        this.remote_peertube_alert_message = __(LOC_login_remote_peertube_no_livechat)
        return
      }
      // Note: we do not check if the livechat plugin disables federation (neither on current or remote instance).
      // We assume this is not a standard use case, and we don't want to add to much use cases.

      // Now we must search the current video on the remote instance, to be sure it federates, and to get the url.
      // Note: url search can be disabled on remote instance for non logged in users...
      // As we are not authenticated on remote here, there are chances that the search wont return anything.
      // As a fallback, we will launch another search with the video UUID.
      // And if no result neither, we will just propose to open using the lazy-load page.
      const videoUrl = api.settings.get('livechat_peertube_video_original_url')
      const videoUUID = api.settings.get('livechat_peertube_video_uuid')
      for (const search of [videoUrl, videoUUID]) {
        if (!search) { continue }
        // searching first on federation network, then on vidiverse (this could be disabled)
        for (const searchTarget of ['local', 'search-index']) {
          const searchAPIUrl = new URL('/api/v1/search/videos', remotePeertubeUrl)
          searchAPIUrl.searchParams.append('start', '0')
          searchAPIUrl.searchParams.append('count', 1)
          searchAPIUrl.searchParams.append('search', search)
          searchAPIUrl.searchParams.append('searchTarget', searchTarget)
          const videos = null // await (await fetch(searchAPIUrl.toString())).json()
          if (videos && Array.isArray(videos.data) && videos.data.length > 0 && videos.data[0].uuid) {
            console.log('Video found, opening on remote instance')
            this.remote_peertube_state = 'ok'
            const url = new URL(
              '/videos/watch/' + encodeURIComponent(videos.data[0].uuid), remotePeertubeUrl
            ).toString()
            this.openUrlTargetTop(url)
            return
          }
        }
      }

      console.error('Video not found on remote instance')
      this.remote_peertube_state = 'error'
      // eslint-disable-next-line no-undef
      this.remote_peertube_alert_message = __(LOC_login_remote_peertube_video_not_found)
      this.remote_peertube_try_anyway_url = new URL(
        '/search/lazy-load-video;url=' + encodeURIComponent(videoUrl),
        remotePeertubeUrl
      ).toString()
    } catch (err) {
      console.error(err)
      this.remote_peertube_state = 'error'
      // eslint-disable-next-line no-undef
      this.remote_peertube_alert_message = __(LOC_login_remote_peertube_url_invalid)
    }
  }

  openUrlTargetTop (url) {
    try {
      // window.open can fail when in an iframe that restricts some operations
      // (when embeding the chat in a website).
      // So, we must try/catch, and propose an alternative open method.
      window.open(url, '_top')
    } catch (e) {
      console.log(e)
      this.remote_peertube_state = 'error'
      // eslint-disable-next-line no-undef
      this.remote_peertube_alert_message = __(LOC_login_remote_peertube_video_open_failed)
      this.remote_peertube_open_failed_url = url

      this.remote_peertube_try_anyway_url = ''
    }
  }

  clearAlert () {
    this.external_auth_oidc_alert_message = ''
    this.remote_peertube_alert_message = ''
    this.remote_peertube_try_anyway_url = ''
    this.remote_peertube_open_failed_url = ''
  }
}

api.elements.define('converse-livechat-external-login-content', LivechatExternalLoginContentElement)
