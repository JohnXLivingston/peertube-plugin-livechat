// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChannelEmojisElement } from '../channel-emojis'
import type { DynamicFormHeader, DynamicFormSchema } from '../../../lib/elements/dynamic-table-form'
import { maxEmojisPerChannel } from 'shared/lib/emojis'
import { ptTr } from '../../../lib/directives/translation'
import { html, TemplateResult } from 'lit'

export function tplChannelEmojis (el: ChannelEmojisElement): TemplateResult {
  const tableHeaderList: DynamicFormHeader = {
    sn: {
      colName: ptTr(LOC_LIVECHAT_EMOJIS_SHORTNAME),
      description: ptTr(LOC_LIVECHAT_EMOJIS_SHORTNAME_DESC),
      headerClassList: ['peertube-livechat-emojis-col-sn']
    },
    url: {
      colName: ptTr(LOC_LIVECHAT_EMOJIS_FILE),
      description: ptTr(LOC_LIVECHAT_EMOJIS_FILE_DESC),
      headerClassList: ['peertube-livechat-emojis-col-file']
    }
  }
  const tableSchema: DynamicFormSchema = {
    sn: {
      inputType: 'text',
      default: ''
    },
    url: {
      inputType: 'image-file',
      default: '',
      colClassList: ['peertube-livechat-emojis-col-file']
    }
  }
  return html`
    <div
      class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-channel"
    >
      <h1>
        <span class="peertube-plugin-livechat-configuration-channel-info">
          <span>${el.channelEmojisConfiguration?.channel.displayName}</span>
          <span>${el.channelEmojisConfiguration?.channel.name}</span>
        </span>
      </h1>

      <livechat-channel-tabs .active=${'emojis'} .channelId=${el.channelId}></livechat-channel-tabs>

      <p>
        ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_EMOJIS_DESC)}
        <livechat-help-button .page=${'documentation/user/streamers/emojis'}>
        </livechat-help-button>
      </p>

      
      <form role="form" @submit=${el.saveEmojis}>
        <div class="peertube-plugin-livechat-configuration-actions">
          ${
            el.channelEmojisConfiguration?.emojis?.customEmojis?.length
              ? html`
              <button
                type="button"
                @click=${el.exportEmojis}
                ?disabled=${el.actionDisabled}
              >
                ${ptTr(LOC_ACTION_EXPORT)}
              </button>`
              : ''
          }
          ${
            (el.channelEmojisConfiguration?.emojis?.customEmojis?.length ?? 0) < maxEmojisPerChannel
              ? html`
              <button
                type="button"
                @click=${el.importEmojis}
                ?disabled=${el.actionDisabled}
              >
                ${ptTr(LOC_ACTION_IMPORT)}
              </button>`
              : ''
          }
        </div>

        <livechat-dynamic-table-form
          .header=${tableHeaderList}
          .schema=${tableSchema}
          .maxLines=${maxEmojisPerChannel}
          .validation=${el.validationError?.properties}
          .validationPrefix=${'emojis'}
          .rows=${el.channelEmojisConfiguration?.emojis.customEmojis}
          @update=${(e: CustomEvent) => {
              if (el.channelEmojisConfiguration) {
                el.channelEmojisConfiguration.emojis.customEmojis = e.detail
                // Fixing missing ':' for shortnames:
                for (const desc of el.channelEmojisConfiguration.emojis.customEmojis) {
                  if (desc.sn === '') { continue }
                  if (!desc.sn.startsWith(':')) { desc.sn = ':' + desc.sn }
                  if (!desc.sn.endsWith(':')) { desc.sn += ':' }
                }
                el.requestUpdate('channelEmojisConfiguration')
              }
            }
          }
        ></livechat-dynamic-table-form>

        <div class="form-group mt-5">
          <button type="reset" @click=${el.reset} ?disabled=${el.actionDisabled}>
            ${ptTr(LOC_CANCEL)}
          </button>
          <button type="submit" ?disabled=${el.actionDisabled}>
            ${ptTr(LOC_SAVE)}
          </button>
        </div>
      </form>
    </div>`
}
