// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { Video } from '@peertube/peertube-types'
import type { LiveChatSettings } from '../../lib/contexts/peertube'
import type { LivechatTokenListElement } from '../../lib/elements/token-list'
import { html, PropertyValues, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from '../../lib/elements/livechat'
import { tplShareChatCopy, tplShareChatTips, tplShareChatTabs, tplShareChatOptions } from './templates/share-chat'
import { isAutoColorsAvailable } from 'shared/lib/autocolors'
import { getIframeUri, getXMPPAddr, UriOptions } from '../uri'
import { isAnonymousUser } from '../../../utils/user'

// First is default tab.
const validTabNames = ['embed', 'dock', 'peertube', 'xmpp'] as const

type ValidTabNames = typeof validTabNames[number]

/**
 * Results of the ShareChatElement.computeUrl method.
 */
interface ComputedUrl {
  /**
   * The string to share.
   */
  shareString: string

  /**
   * The url to open in a browser window, if relevant (http:// or xmpp://).
   * Undefined when not a standard uri (for iframes for exemple).
   * This will be the url used by the "open" button.
   */
  openUrl: string | undefined
}

@customElement('livechat-share-chat')
export class ShareChatElement extends LivechatElement {
  /**
   * The associated video.
   * Must be given when calling this custom element.
   */
  @property({ attribute: false })
  protected _video!: Video

  /**
   * The settings.
   * Must be given when calling this custom element.
   */
  @property({ attribute: false })
  protected _settings!: LiveChatSettings

  /**
   * The current tab.
   */
  @property({ attribute: false })
  public currentTab: ValidTabNames = validTabNames[0]

  /**
   * Should we render the XMPP tab?
   */
  @property({ attribute: false })
  public xmppUriEnabled: boolean = false

  /**
   * Should we render the Dock tab?
   */
  @property({ attribute: false })
  public dockEnabled: boolean = false

  /**
   * Can we use autocolors?
   */
  @property({ attribute: false })
  public autocolorsAvailable: boolean = false

  /**
   * In the Embed tab, should we generated an iframe link.
   */
  @property({ attribute: false })
  public embedIFrame: boolean = false

  /**
   * In the Embed tab, should we generated a read-only chat link.
   */
  @property({ attribute: false })
  public embedReadOnly: boolean = false

  /**
   * Read-only, with scrollbar?
   */
  @property({ attribute: false })
  public embedReadOnlyScrollbar: boolean = false

  /**
   * Read-only, transparent background?
   */
  @property({ attribute: false })
  public embedReadOnlyTransparentBackground: boolean = false

  /**
   * In the Embed tab, should we use current theme color?
   */
  @property({ attribute: false })
  public embedAutocolors: boolean = false

  protected override firstUpdated (changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties)
    const settings = this._settings
    this.xmppUriEnabled = !!settings['prosody-room-allow-s2s']
    // Note: for dockEnabled, we check:
    // * that the user is logged in
    // * that the video is local (for remote video, tests case are too complicated, and it's not the main use case, so…)
    // * settings is not disabled
    this.dockEnabled = (
      !isAnonymousUser(this.ptContext.ptOptions) &&
      this._video.isLocal &&
      !settings['livechat-token-disabled']
    )
    this.autocolorsAvailable = isAutoColorsAvailable(settings['converse-theme'])

    this._restorePreviousState()
  }

  protected override updated (changedProperties: PropertyValues): void {
    super.updated(changedProperties)
    this.logger.log('Updated was triggered, saving current state.')
    this._saveCurrentState()
  }

  protected override render = (): TemplateResult => {
    return html`
      ${tplShareChatTabs(this)}
      ${tplShareChatCopy(this)}
      <div class="livechat-shareurl-block">
        ${tplShareChatTips(this)}
        ${tplShareChatOptions(this)}
      </div>
    `
  }

  protected _restorePreviousState (): void {
    if (!window.localStorage) {
      this.logger.warn('No localStorage, can\'t restore state.')
      return
    }
    const s = window.localStorage.getItem('peertube-plugin-livechat-shareurl')
    if (!s) {
      return
    }
    try {
      const v = JSON.parse(s)
      if (!v || (typeof v !== 'object') || v.version !== 2) {
        this.logger.warn('Stored information are invalid, dropping')
        return
      }
      this.logger.log('Restoring previous state')
      if (validTabNames.includes(v.currentTab)) {
        this.currentTab = v.currentTab
      }
      this.embedIFrame = !!v.embedIFrame
      this.embedReadOnly = !!v.embedReadOnly
      this.embedReadOnlyScrollbar = !!v.embedReadOnlyScrollbar
      this.embedReadOnlyTransparentBackground = !!v.embedReadOnlyTransparentBackground
      this.embedAutocolors = !!v.embedAutocolors
    } catch (err) {
      this.logger.error(err as string)
    }

    // Some sanity checks, to not be in an impossible state.
    if (!this.xmppUriEnabled && this.currentTab === 'xmpp') {
      this.currentTab = validTabNames[0]
    }
    if (!this.dockEnabled && this.currentTab === 'dock') {
      this.currentTab = validTabNames[0]
    }
  }

  protected _saveCurrentState (): void {
    if (!window.localStorage) {
      this.logger.warn('No localStorage, can\'t save state.')
      return
    }
    const v = {
      version: 2, // in case we add incompatible values in a near feature
      currentTab: this.currentTab,
      embedIFrame: this.embedIFrame,
      embedReadOnly: this.embedReadOnly,
      embedReadOnlyScrollbar: this.embedReadOnlyScrollbar,
      embedReadOnlyTransparentBackground: this.embedReadOnlyTransparentBackground,
      embedAutocolors: this.embedAutocolors
    }
    window.localStorage.setItem('peertube-plugin-livechat-shareurl', JSON.stringify(v))
  }

  public computeUrl (): ComputedUrl {
    switch (this.currentTab) {
      case 'embed': return this._computeUrlEmbed()
      case 'dock': return this._computeUrlDock()
      case 'peertube': return this._computeUrlPeertube()
      case 'xmpp': return this._computeUrlXMPP()
      default:
        return {
          shareString: '',
          openUrl: undefined
        }
    }
  }

  protected _computeUrlPeertube (): ComputedUrl {
    const url = window.location.protocol +
      '//' +
      window.location.host +
      '/p/livechat/room?room=' +
      encodeURIComponent(this._video.uuid)
    return {
      shareString: url,
      openUrl: url
    }
  }

  protected _computeUrlXMPP (): ComputedUrl {
    const addr = getXMPPAddr(this.ptContext.ptOptions, this._settings, this._video)
    return {
      shareString: addr?.jid ?? '',
      openUrl: addr?.uri
    }
  }

  protected _computeUrlDock (): ComputedUrl {
    const tokenList: LivechatTokenListElement | null = this.querySelector('livechat-token-list')
    const token = tokenList?.currentSelectedToken
    if (!token) {
      return {
        shareString: '',
        openUrl: undefined
      }
    }
    const uriOptions: UriOptions = {
      ignoreAutoColors: true,
      permanent: true
    }

    let url = getIframeUri(this.ptContext.ptOptions, this._settings, this._video, uriOptions)
    if (!url) {
      return {
        shareString: '',
        openUrl: undefined
      }
    }

    url += '#?p=' + encodeURIComponent(token.password)
    url += '&j=' + encodeURIComponent(token.jid)
    if (token.nickname) {
      url += '&n=' + encodeURIComponent(token.nickname)
    }

    return {
      shareString: url,
      openUrl: url
    }
  }

  protected _computeUrlEmbed (): ComputedUrl {
    const uriOptions: UriOptions = {
      ignoreAutoColors: this.autocolorsAvailable ? !this.embedAutocolors : true,
      permanent: true
    }

    if (this.embedReadOnly) {
      uriOptions.readonly = this.embedReadOnlyScrollbar ? true : 'noscroll'
      if (this.embedReadOnlyTransparentBackground) {
        uriOptions.transparent = true
      }
    }

    // Note: for the "embed" case, the url is always the same as the iframe.
    // So we use getIframeUri to compte, and just change the finale result if we really want the iframe.
    const url = getIframeUri(this.ptContext.ptOptions, this._settings, this._video, uriOptions)
    if (!url) {
      return {
        shareString: '',
        openUrl: undefined
      }
    }

    if (!this.embedIFrame) {
      return {
        shareString: url,
        openUrl: url
      }
    }

    // Actually building the iframe:
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', url)
    iframe.setAttribute('title', this._video.name)
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
    iframe.setAttribute('width', '560')
    iframe.setAttribute('height', '315')
    iframe.setAttribute('frameborder', '0')
    const iframeHTML = iframe.outerHTML
    iframe.remove()
    return {
      shareString: iframeHTML,
      openUrl: undefined
    }
  }

  /**
   * Copy the current url in the clipboard.
   */
  public async copyUrl (): Promise<void> {
    await navigator.clipboard.writeText(this.computeUrl().shareString)
    this.ptNotifier.success(await this.ptTranslate(LOC_COPIED))
  }

  /**
   * Opens the url.
   */
  public openUrl (): void {
    const url = this.computeUrl().openUrl
    if (!url) {
      return
    }
    window.open(url)
  }

  public switchTab (tab: ShareChatElement['currentTab']): void {
    this.currentTab = tab
  }
}
