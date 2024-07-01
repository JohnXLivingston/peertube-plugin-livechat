// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

function _tplPollEnd (el, currentPoll) {
  if (!currentPoll.endDate) {
    return html``
  }

  // eslint-disable-next-line no-undef
  const i18nPollEnd = __(LOC_poll_end)
  return html`<p class="livechat-poll-end">
      ${i18nPollEnd}
      ${currentPoll.endDate.toLocaleString()}
    </p>`
}

function _tplChoice (el, currentPoll, choice) {
  // eslint-disable-next-line no-undef
  const i18nChoiceN = __(LOC_poll_choice_n).replace('{{N}}', choice.choice)

  const votes = choice.votes
  const totalVotes = currentPoll.votes
  const percent = totalVotes ? (100 * votes / totalVotes).toFixed(2) : '0.00'
  return html`
    <tr>
      <td>
        ${
          currentPoll.over
            ? html`${i18nChoiceN}`
            : html`
              <button type="button" class="btn btn-primary btn-sm"
                @click=${ev => {
                  ev.preventDefault()
                  if (currentPoll.over) { return }
                  // TODO
                  console.info('User has voted for choice: ', choice)
                }}
              >
                ${i18nChoiceN}
              </button>`
        }
      </td>
      <td class="livechat-poll-choice-label">
        ${choice.label}
      </td>
      <td>
        <div class="livechat-progress-bar">
          <div
            role="progressbar"
            style="width: ${percent}%;"
            aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"
          ></div>
          <p>
            ${votes}/${totalVotes}
            (${percent}%)
          </p>
        </div>
      </td>
    </tr>`
}

export function tplPoll (el, currentPoll) {
  if (!currentPoll) {
    return html``
  }

  return html`<div>
    <p class="livechat-poll-question">${currentPoll.question}</p>
    <table><tbody>
      ${repeat(currentPoll.choices ?? [], (c) => c.choice, (c) => _tplChoice(el, currentPoll, c))}
    </tbody></table>
    ${_tplPollEnd(el, currentPoll)}
  </div>`
}
