// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { Video } from '@peertube/peertube-types'
import type { LiveChatSettings } from '../../lib/contexts/peertube'
import { html, PropertyValues, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from '../../lib/elements/livechat'
import { tplShareChatCopy, tplShareChatTips, tplShareChatTabs, tplShareChatOptions } from './templates/share-chat'
import { isAutoColorsAvailable } from 'shared/lib/autocolors'
import { getIframeUri, getXMPPAddr, UriOptions } from '../uri'

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
  public currentTab: 'peertube' | 'embed' | 'xmpp' = 'peertube'

  /**
   * Should we render the XMPP tab?
   */
  @property({ attribute: false })
  public xmppUriEnabled: boolean = false

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
    this.autocolorsAvailable = isAutoColorsAvailable(settings['converse-theme'])

    this._restorePreviousState()
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
    // TODO: restore previous state.

    // Some sanity checks, to not be in an impossible state.
    if (!this.xmppUriEnabled && this.currentTab === 'xmpp') {
      this.currentTab = 'peertube'
    }
  }

  public computeUrl (): ComputedUrl {
    switch (this.currentTab) {
      case 'peertube': return this._computeUrlPeertube()
      case 'embed': return this._computeUrlEmbed()
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
