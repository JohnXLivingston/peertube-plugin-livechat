// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

function _tplPollInstructions (el, currentPoll) {
  if (currentPoll.over) {
    return html``
  }

  // eslint-disable-next-line no-undef
  const i18nPollInstructions = __(LOC_poll_vote_instructions)
  return html`<p class="livechat-poll-instructions">
      ${i18nPollInstructions}
    </p>`
}

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
                  el.voteFor(choice)
                }}
                ?disabled=${el.buttonDisabled}
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

  return html`<div class="${currentPoll.over ? 'livechat-poll-over' : ''}">
    <p class="livechat-poll-question">
      ${currentPoll.over
        ? html`<button class="livechat-poll-close" @click=${el.closePoll} title="${__('Close')}">
            <converse-icon class="fa fa-times" size="1em"></converse-icon>
          </button>`
        : ''
      }
      ${el.collapsed
        ? html`
          <button @click=${el.toggle} class="livechat-poll-toggle">
            <converse-icon
              color="var(--muc-toolbar-btn-color)"
              class="fa fa-angle-right"
              size="1em"></converse-icon>
          </button>`
        : html`
          <button @click=${el.toggle} class="livechat-poll-toggle">
            <converse-icon
              color="var(--muc-toolbar-btn-color)"
              class="fa fa-angle-down"
              size="1em"></converse-icon>
          </button>`
      }
      ${currentPoll.question}
    </p>
    ${
      el.collapsed
        ? ''
        : html`
          <table><tbody>
            ${repeat(currentPoll.choices ?? [], (c) => c.choice, (c) => _tplChoice(el, currentPoll, c))}
          </tbody></table>
          ${_tplPollInstructions(el, currentPoll)}
          ${_tplPollEnd(el, currentPoll)}
        `
    }
  </div>`
}
