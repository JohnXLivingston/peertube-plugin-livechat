// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { converseLocalizedHelpUrl } from '../../../shared/lib/help'
import { html } from 'lit'
import { __ } from 'i18n'
import { converse } from '@converse/headless'

const u = converse.env.utils

export function tplPollForm (el) {
  const i18nOk = __('Ok')
  // eslint-disable-next-line no-undef
  const i18nHelp = __(LOC_online_help)
  const helpUrl = converseLocalizedHelpUrl({
    page: 'documentation/user/streamers/polls'
  })

  let formFieldTemplates
  if (el.xform) {
    const fields = el.xform.fields
    formFieldTemplates = fields.map(field => {
      return u.xFormField2TemplateResult(field)
    })
  }

  return html`
    ${el.alert_message ? html`<div class="error">${el.alert_message}</div>` : ''}
    ${
      formFieldTemplates
        ? html`
          <form class="converse-form" @submit=${ev => el.formSubmit(ev)}>
            <p class="title">
              ${el.title}
              <a href="${helpUrl}" target="_blank"><converse-icon
                  class="fa fa-circle-question"
                  size="1em"
                  title="${i18nHelp}"
              ></converse-icon></a>
            </p>
            <p class="form-help instructions">${el.instructions}</p>
            <div class="form-errors hidden"></div>

            ${formFieldTemplates}

            <fieldset class="buttons form-group">
              <input type="submit" class="btn btn-primary" value="${i18nOk}" />
            </fieldset>
          </form>`
        : ''
    }`
}
