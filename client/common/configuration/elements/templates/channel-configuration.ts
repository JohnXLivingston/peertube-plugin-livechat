// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChannelConfigurationElement } from '../channel-configuration'
import type { DynamicFormHeader, DynamicFormSchema } from '../../../lib/elements/dynamic-table-form'
import { ptTr } from '../../../lib/directives/translation'
import { html, TemplateResult } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

export function tplChannelConfiguration (el: ChannelConfigurationElement): TemplateResult {
  const tableHeaderList: {[key: string]: DynamicFormHeader} = {
    forbiddenWords: {
      entries: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC2)
      },
      regexp: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_DESC)
      },
      applyToModerators: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_DESC)
      },
      label: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL_DESC)
      },
      reason: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_DESC)
      },
      comments: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_COMMENTS_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_COMMENTS_DESC)
      }
    },
    quotes: {
      messages: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_LABEL2),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DESC2)
      },
      delay: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DELAY_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DELAY_DESC)
      }
    },
    commands: {
      command: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_CMD_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_CMD_DESC)
      },
      message: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_MESSAGE_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_MESSAGE_DESC)
      }
    }
  }
  const tableSchema: {[key: string]: DynamicFormSchema} = {
    forbiddenWords: {
      entries: {
        inputType: 'tags',
        default: [],
        separators: ['\n', '\t', ';']
      },
      regexp: {
        inputType: 'checkbox',
        default: false
      },
      applyToModerators: {
        inputType: 'checkbox',
        default: false
      },
      label: {
        inputType: 'text',
        default: ''
      },
      reason: {
        inputType: 'text',
        default: ''
      },
      comments: {
        inputType: 'textarea',
        default: ''
      }
    },
    quotes: {
      messages: {
        inputType: 'tags',
        default: [],
        separators: ['\n', '\t', ';']
      },
      delay: {
        inputType: 'number',
        default: 10
      }
    },
    commands: {
      command: {
        inputType: 'text',
        default: ''
      },
      message: {
        inputType: 'text',
        default: ''
      }
    }
  }

  return html`
    <div class="margin-content peertube-plugin-livechat-configuration
                peertube-plugin-livechat-configuration-channel">
      <h1>
        <span class="peertube-plugin-livechat-configuration-channel-info">
          <span>${el.channelConfiguration?.channel.displayName}</span>
          <span>${el.channelConfiguration?.channel.name}</span>
        </span>
      </h1>

      <livechat-channel-tabs .active=${'configuration'} .channelId=${el.channelId}></livechat-channel-tabs>

      <p>
        ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_DESC)}
        <livechat-help-button .page=${'documentation/user/streamers/channel'}>
        </livechat-help-button>
      </p>

      <form livechat-configuration-channel-options role="form" @submit=${el.saveConfig}>
        <livechat-configuration-section-header
          .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_LABEL)}
          .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_DESC)}
          .helpPage=${'documentation/user/streamers/slow_mode'}>
        </livechat-configuration-section-header>
        <div class="form-group">
          <label>
            ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_LABEL)}
            <input
              type="number"
              name="slowmode_duration"
              class=${classMap(
                Object.assign(
                  { 'form-control': true },
                  el.getInputValidationClass('slowMode.duration')
                )
              )}
              min="0"
              max="1000"
              id="peertube-livechat-slowmode-duration"
              aria-describedby="peertube-livechat-slowmode-duration-feedback"
              @input=${(event: InputEvent) => {
                  if (event?.target && el.channelConfiguration) {
                    el.channelConfiguration.configuration.slowMode.duration =
                      Number((event.target as HTMLInputElement).value)
                  }
                  el.requestUpdate('channelConfiguration')
                }
              }
              value="${el.channelConfiguration?.configuration.slowMode.duration ?? ''}"
            />
          </label>
          ${el.renderFeedback('peertube-livechat-slowmode-duration-feedback', 'slowMode.duration')}
        </div>

        <livechat-configuration-section-header
          .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_OPTIONS_TITLE)}
          .description=${''}
          .helpPage=${'documentation/user/streamers/channel'}>
        </livechat-configuration-section-header>
        <div class="form-group">
          <label>
            <input
              type="checkbox"
              name="bot"
              id="peertube-livechat-bot"
              @input=${(event: InputEvent) => {
                  if (event?.target && el.channelConfiguration) {
                    el.channelConfiguration.configuration.bot.enabled =
                      (event.target as HTMLInputElement).checked
                  }
                  el.requestUpdate('channelConfiguration')
                }
              }
              value="1"
              ?checked=${el.channelConfiguration?.configuration.bot.enabled}
            />
            ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ENABLE_BOT_LABEL)}
          </label>
        </div>

        ${!el.channelConfiguration?.configuration.bot.enabled
          ? ''
          : html`<div class="form-group">
            <label for="peertube-livechat-bot-nickname">
              ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_NICKNAME)}
            </label>
            <input
              type="text"
              name="bot_nickname"
              class=${classMap(
                Object.assign(
                  { 'form-control': true },
                   el.getInputValidationClass('bot.nickname')
                )
              )}
              id="peertube-livechat-bot-nickname"
              aria-describedby="peertube-livechat-bot-nickname-feedback"
              @input=${(event: InputEvent) => {
                  if (event?.target && el.channelConfiguration) {
                    el.channelConfiguration.configuration.bot.nickname =
                    (event.target as HTMLInputElement).value
                  }
                  el.requestUpdate('channelConfiguration')
                }
              }
              value="${el.channelConfiguration?.configuration.bot.nickname ?? ''}"
            />
            ${el.renderFeedback('peertube-livechat-bot-nickname-feedback', 'bot.nickname')}
          </div>

          <livechat-configuration-section-header
            .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL)}
            .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC)}
            .helpPage=${'documentation/user/streamers/bot/forbidden_words'}>
          </livechat-configuration-section-header>
          <livechat-dynamic-table-form
            .header=${tableHeaderList.forbiddenWords}
            .schema=${tableSchema.forbiddenWords}
            .validation=${el.validationError?.properties}
            .validationPrefix=${'bot.forbiddenWords'}
            .rows=${el.channelConfiguration?.configuration.bot.forbiddenWords}
            @update=${(e: CustomEvent) => {
                if (el.channelConfiguration) {
                  el.channelConfiguration.configuration.bot.forbiddenWords = e.detail
                  el.requestUpdate('channelConfiguration')
                }
              }
            }
            .formName=${'forbidden-words'}
          ></livechat-dynamic-table-form>

          <livechat-configuration-section-header
            .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_LABEL)}
            .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DESC)}
            .helpPage=${'documentation/user/streamers/bot/quotes'}>
          </livechat-configuration-section-header>
          <livechat-dynamic-table-form
            .header=${tableHeaderList.quotes}
            .schema=${tableSchema.quotes}
            .validation=${el.validationError?.properties}
            .validationPrefix=${'bot.quotes'}
            .rows=${el.channelConfiguration?.configuration.bot.quotes}
            @update=${(e: CustomEvent) => {
                if (el.channelConfiguration) {
                  el.channelConfiguration.configuration.bot.quotes = e.detail
                  el.requestUpdate('channelConfiguration')
                }
              }
            }
            .formName=${'quote'}
          ></livechat-dynamic-table-form>

          <livechat-configuration-section-header
            .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_LABEL)}
            .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_DESC)}
            .helpPage=${'documentation/user/streamers/bot/commands'}>
          </livechat-configuration-section-header>
          <livechat-dynamic-table-form
            .header=${tableHeaderList.commands}
            .schema=${tableSchema.commands}
            .validation=${el.validationError?.properties}
            .validationPrefix=${'bot.commands'}
            .rows=${el.channelConfiguration?.configuration.bot.commands}
            @update=${(e: CustomEvent) => {
                if (el.channelConfiguration) {
                  el.channelConfiguration.configuration.bot.commands = e.detail
                  el.requestUpdate('channelConfiguration')
                }
              }
            }
            .formName=${'command'}
          ></livechat-dynamic-table-form>
        `}

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
