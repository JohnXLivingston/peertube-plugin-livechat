// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { AdminFirewallElement } from '../elements/admin-firewall'
import type { TemplateResult } from 'lit'
import type { DynamicFormHeader, DynamicFormSchema } from '../../../lib/elements/dynamic-table-form'
import { maxFirewallFiles, maxFirewallNameLength, maxFirewallFileSize } from 'shared/lib/admin-firewall'
import { ptTr } from '../../../lib/directives/translation'
import { html } from 'lit'

export function tplAdminFirewall (el: AdminFirewallElement): TemplateResult {
  const tableHeaderList: DynamicFormHeader = {
    enabled: {
      colName: ptTr(LOC_PROSODY_FIREWALL_FILE_ENABLED)
    },
    name: {
      colName: ptTr(LOC_PROSODY_FIREWALL_NAME),
      description: ptTr(LOC_PROSODY_FIREWALL_NAME_DESC),
      headerClassList: ['peertube-livechat-admin-firewall-col-name']
    },
    content: {
      colName: ptTr(LOC_PROSODY_FIREWALL_CONTENT),
      headerClassList: ['peertube-livechat-admin-firewall-col-content']
    }
  }
  const tableSchema: DynamicFormSchema = {
    enabled: {
      inputType: 'checkbox',
      default: true
    },
    name: {
      inputType: 'text',
      default: '',
      maxlength: maxFirewallNameLength
    },
    content: {
      inputType: 'textarea',
      default: '',
      maxlength: maxFirewallFileSize
    }
  }

  return html`
    <div class="margin-content peertube-plugin-livechat-admin-firewall">
      <h1>
        ${ptTr(LOC_PROSODY_FIREWALL_CONFIGURATION)}
      </h1>
      <p>
        ${ptTr(LOC_PROSODY_FIREWALL_CONFIGURATION_HELP, true)}
        <livechat-help-button .page=${'documentation/admin/mod_firewall'}>
        </livechat-help-button>
      </p>
      ${
        el.firewallConfiguration?.enabled
          ? ''
          : html`<p class="peertube-plugin-livechat-warning">${ptTr(LOC_PROSODY_FIREWALL_DISABLED_WARNING, true)}</p>`
      }

      <form role="form" @submit=${el.saveConfig} @change=${el.resetValidation}>
        <livechat-dynamic-table-form
          .header=${tableHeaderList}
          .schema=${tableSchema}
          .maxLines=${maxFirewallFiles}
          .validation=${el.validationError?.properties}
          .validationPrefix=${'files'}
          .rows=${el.firewallConfiguration?.files}
          @update=${(e: CustomEvent) => {
              el.resetValidation(e)
              if (el.firewallConfiguration) {
                el.firewallConfiguration.files = e.detail
                el.requestUpdate('firewallConfiguration')
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
