// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { __ } from 'i18n'

export function tplPollForm (el) {
  const i18nOk = __('Ok')

  return html`
    ${el.alert_message ? html`<div class="error">${el.alert_message}</div>` : ''}
    ${
      el.form_fields
        ? html`
          <form class="converse-form" @submit=${ev => el.formSubmit(ev)}>
            <p class="title">${el.title}</p>
            <p class="form-help instructions">${el.instructions}</p>
            <div class="form-errors hidden"></div>

            ${el.form_fields}

            ${
              el.modal
                ? html`` // no need for submit button, the modal will have one in the footer
                : html`<fieldset class="buttons form-group">
                    <input type="submit" class="btn btn-primary" value="${i18nOk}" />
                  </fieldset>`
            }
          </form>`
        : ''
    }`
}
