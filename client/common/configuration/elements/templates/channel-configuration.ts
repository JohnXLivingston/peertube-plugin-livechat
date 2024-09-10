// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import type { ChannelConfigurationElement } from '../channel-configuration'
import type { DynamicFormHeader, DynamicFormSchema } from '../../../lib/elements/dynamic-table-form'
import { ptTr } from '../../../lib/directives/translation'
import { html, TemplateResult } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

export function tplChannelConfiguration (el: ChannelConfigurationElement): TemplateResult {
  const tableHeaderList: Record<string, DynamicFormHeader> = {
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
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_APPLYTOMODERATORS_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_APPLYTOMODERATORS_DESC)
      },
      label: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL_DESC)
      },
      reason: {
        colName: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_RETRACTATION_REASON_LABEL),
        description: ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_RETRACTATION_REASON_DESC)
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
  const tableSchema: Record<string, DynamicFormSchema> = {
    forbiddenWords: {
      entries: {
        inputType: 'tags',
        default: [],
        separator: '\n'
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
        inputType: 'textarea',
        default: [],
        separator: '\n'
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

      <form livechat-configuration-channel-options role="form" @submit=${el.saveConfig} @change=${el.resetValidation}>

        <livechat-configuration-section-header
          .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TERMS_LABEL)}
          .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TERMS_DESC, true)}
          .helpPage=${'documentation/user/streamers/terms'}>
        </livechat-configuration-section-header>
        <div class="form-group">
          <textarea
            .title=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TERMS_LABEL) as any}
            name="terms"
            id="peertube-livechat-terms"
            .value=${el.channelConfiguration?.configuration.terms ?? ''}
            maxlength=${el.termsMaxLength()}
            class=${classMap(
                Object.assign(
                  { 'form-control': true },
                  el.getInputValidationClass('terms')
                )
              )}
            @change=${(event: Event) => {
                if (event?.target && el.channelConfiguration) {
                  let value: string | undefined = (event.target as HTMLTextAreaElement).value
                  if (value === '') { value = undefined }
                  el.channelConfiguration.configuration.terms = value
                }
                el.requestUpdate('channelConfiguration')
              }
            }
          ></textarea>
          ${el.renderFeedback('peertube-livechat-terms-feedback', 'terms')}
        </div>

        <livechat-configuration-section-header
          .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_MUTE_ANONYMOUS_LABEL)}
          .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_MUTE_ANONYMOUS_DESC, true)}
          .helpPage=${'documentation/user/streamers/moderation'}>
        </livechat-configuration-section-header>
        <div class="form-group">
          <label>
            <input
              type="checkbox"
              name="mute_anonymous"
              id="peertube-livechat-mute-anonymous"
              @input=${(event: InputEvent) => {
                  if (event?.target && el.channelConfiguration) {
                    el.channelConfiguration.configuration.mute.anonymous =
                      (event.target as HTMLInputElement).checked
                  }
                  el.requestUpdate('channelConfiguration')
                }
              }
              value="1"
              ?checked=${el.channelConfiguration?.configuration.mute.anonymous}
            />
            ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_MUTE_ANONYMOUS_LABEL)}
          </label>
        </div>

        <livechat-configuration-section-header
          .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_LABEL)}
          .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_DESC, true)}
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
          .label=${ptTr(LOC_MODERATION_DELAY)}
          .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_MODERATION_DELAY_DESC, true)}
          .helpPage=${'documentation/user/streamers/moderation_delay'}>
        </livechat-configuration-section-header>
        <div class="form-group">
          <label>
            ${ptTr(LOC_MODERATION_DELAY)}
            <input
              type="number"
              name="moderation_delay"
              class=${classMap(
                Object.assign(
                  { 'form-control': true },
                  el.getInputValidationClass('moderation.delay')
                )
              )}
              min="0"
              max="60"
              id="peertube-livechat-moderation-delay"
              aria-describedby="peertube-livechat-moderation-delay-feedback"
              @input=${(event: InputEvent) => {
                  if (event?.target && el.channelConfiguration) {
                    el.channelConfiguration.configuration.moderation.delay =
                      Number((event.target as HTMLInputElement).value)
                  }
                  el.requestUpdate('channelConfiguration')
                }
              }
              value="${el.channelConfiguration?.configuration.moderation.delay ?? ''}"
            />
          </label>
          ${el.renderFeedback('peertube-livechat-moderation-delay-feedback', 'moderation.delay')}
        </div>

        <livechat-configuration-section-header
          .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ANONYMIZE_MODERATION_LABEL)}
          .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ANONYMIZE_MODERATION_DESC, true)}
          .helpPage=${'documentation/user/streamers/moderation'}>
        </livechat-configuration-section-header>
        <div class="form-group">
          <label>
            <input
              type="checkbox"
              name="anonymize-moderation"
              id="peertube-livechat-anonymize-moderation"
              @input=${(event: InputEvent) => {
                  if (event?.target && el.channelConfiguration) {
                    el.channelConfiguration.configuration.moderation.anonymize =
                      (event.target as HTMLInputElement).checked
                  }
                  el.requestUpdate('channelConfiguration')
                }
              }
              value="1"
              ?checked=${el.channelConfiguration?.configuration.moderation.anonymize}
            />
            ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ANONYMIZE_MODERATION_LABEL)}
          </label>
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
            .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SPECIAL_CHARS_LABEL)}
            .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SPECIAL_CHARS_DESC)}
            .helpPage=${'documentation/user/streamers/bot/special_chars'}>
          </livechat-configuration-section-header>
          <div class="form-group">
            <label>
              <input
                type="checkbox"
                name="forbid_special_chars"
                id="peertube-livechat-forbid-special-chars"
                @input=${(event: InputEvent) => {
                    if (event?.target && el.channelConfiguration) {
                      el.channelConfiguration.configuration.bot.forbidSpecialChars.enabled =
                        (event.target as HTMLInputElement).checked
                    }
                    el.requestUpdate('channelConfiguration')
                  }
                }
                value="1"
                ?checked=${el.channelConfiguration?.configuration.bot.forbidSpecialChars.enabled}
              />
              ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SPECIAL_CHARS_LABEL)}
            </label>
          </div>
          ${!el.channelConfiguration?.configuration.bot.forbidSpecialChars.enabled
            ? ''
            : html`
              <div class="form-group">
                <label>
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SPECIAL_CHARS_TOLERANCE_LABEL)}
                  <input
                    type="number"
                    name="special_chars_tolerance"
                    class=${classMap(
                      Object.assign(
                        { 'form-control': true },
                        el.getInputValidationClass('bot.forbidSpecialChars.tolerance')
                      )
                    )}
                    min="0"
                    max="10"
                    id="peertube-livechat-forbid-special-chars-tolerance"
                    aria-describedby="peertube-livechat-forbid-special-chars-tolerance-feedback"
                    @input=${(event: InputEvent) => {
                        if (event?.target && el.channelConfiguration) {
                          el.channelConfiguration.configuration.bot.forbidSpecialChars.tolerance =
                            Number((event.target as HTMLInputElement).value)
                        }
                        el.requestUpdate('channelConfiguration')
                      }
                    }
                    value="${el.channelConfiguration?.configuration.bot.forbidSpecialChars.tolerance ?? '0'}"
                  />
                </label>
                <small class="form-text text-muted">
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SPECIAL_CHARS_TOLERANCE_DESC)}
                </small>
                ${el.renderFeedback('peertube-livechat-forbid-special-chars-tolerance-feedback',
                  'bot.forbidSpecialChars.tolerance')
                }
              </div>
              <div class="form-group">
                <label>
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_RETRACTATION_REASON_LABEL)}
                  <input
                    type="text"
                    name="special_chars_reason"
                    class=${classMap(
                      Object.assign(
                        { 'form-control': true },
                        el.getInputValidationClass('bot.forbidSpecialChars.reason')
                      )
                    )}
                    id="peertube-livechat-forbid-special-chars-reason"
                    aria-describedby="peertube-livechat-forbid-special-chars-reason-feedback"
                    @input=${(event: InputEvent) => {
                        if (event?.target && el.channelConfiguration) {
                          el.channelConfiguration.configuration.bot.forbidSpecialChars.reason =
                            (event.target as HTMLInputElement).value
                        }
                        el.requestUpdate('channelConfiguration')
                      }
                    }
                    value="${el.channelConfiguration?.configuration.bot.forbidSpecialChars.reason ?? ''}"
                  />
                </label>
                <small class="form-text text-muted">
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_RETRACTATION_REASON_DESC)}
                </small>
                ${el.renderFeedback('peertube-livechat-forbid-special-chars-reason-feedback',
                  'bot.forbidSpecialChars.reason')
                }
              </div>
              <div class="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="forbid_special_chars_applyToModerators"
                    id="peertube-livechat-forbid-special-chars-applyToModerators"
                    @input=${(event: InputEvent) => {
                        if (event?.target && el.channelConfiguration) {
                          el.channelConfiguration.configuration.bot.forbidSpecialChars.applyToModerators =
                            (event.target as HTMLInputElement).checked
                        }
                        el.requestUpdate('channelConfiguration')
                      }
                    }
                    value="1"
                    ?checked=${el.channelConfiguration?.configuration.bot.forbidSpecialChars.applyToModerators}
                  />
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_APPLYTOMODERATORS_LABEL)}
                </label>
                <small class="form-text text-muted">
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_APPLYTOMODERATORS_DESC)}
                </small>
              </div>
              `
          }

          <livechat-configuration-section-header
            .label=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_NO_DUPLICATE_LABEL)}
            .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_NO_DUPLICATE_DESC)}
            .helpPage=${'documentation/user/streamers/bot/no_duplicate'}>
          </livechat-configuration-section-header>
          <div class="form-group">
            <label>
              <input
                type="checkbox"
                name="no_duplicate"
                id="peertube-livechat-no-duplicate"
                @input=${(event: InputEvent) => {
                    if (event?.target && el.channelConfiguration) {
                      el.channelConfiguration.configuration.bot.noDuplicate.enabled =
                        (event.target as HTMLInputElement).checked
                    }
                    el.requestUpdate('channelConfiguration')
                  }
                }
                value="1"
                ?checked=${el.channelConfiguration?.configuration.bot.noDuplicate.enabled}
              />
              ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_NO_DUPLICATE_LABEL)}
            </label>
          </div>
          ${!el.channelConfiguration?.configuration.bot.noDuplicate.enabled
            ? ''
            : html`
              <div class="form-group">
                <label>
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_NO_DUPLICATE_DELAY_LABEL)}
                  <input
                    type="number"
                    name="no_duplicate_delay"
                    class=${classMap(
                      Object.assign(
                        { 'form-control': true },
                        el.getInputValidationClass('bot.noDuplicate.delay')
                      )
                    )}
                    min="0"
                    max="10"
                    id="peertube-livechat-no-duplicate-delay"
                    aria-describedby="peertube-livechat-no-duplicate-delay-feedback"
                    @input=${(event: InputEvent) => {
                        if (event?.target && el.channelConfiguration) {
                          el.channelConfiguration.configuration.bot.noDuplicate.delay =
                            Number((event.target as HTMLInputElement).value)
                        }
                        el.requestUpdate('channelConfiguration')
                      }
                    }
                    value="${el.channelConfiguration?.configuration.bot.noDuplicate.delay ?? '0'}"
                  />
                </label>
                <small class="form-text text-muted">
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_NO_DUPLICATE_DELAY_DESC)}
                </small>
                ${el.renderFeedback('peertube-livechat-no-duplicate-delay-feedback',
                  'bot.noDuplicate.delay')
                }
              </div>
              <div class="form-group">
                <label>
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_RETRACTATION_REASON_LABEL)}
                  <input
                    type="text"
                    name="no_duplicate_reason"
                    class=${classMap(
                      Object.assign(
                        { 'form-control': true },
                        el.getInputValidationClass('bot.noDuplicate.reason')
                      )
                    )}
                    id="peertube-livechat-no-duplicate-reason"
                    aria-describedby="peertube-livechat-no-duplicate-reason-feedback"
                    @input=${(event: InputEvent) => {
                        if (event?.target && el.channelConfiguration) {
                          el.channelConfiguration.configuration.bot.noDuplicate.reason =
                            (event.target as HTMLInputElement).value
                        }
                        el.requestUpdate('channelConfiguration')
                      }
                    }
                    value="${el.channelConfiguration?.configuration.bot.noDuplicate.reason ?? ''}"
                  />
                </label>
                <small class="form-text text-muted">
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_RETRACTATION_REASON_DESC)}
                </small>
                ${el.renderFeedback('peertube-livechat-no-duplicate-reason-feedback',
                  'bot.noDuplicate.reason')
                }
              </div>
              <div class="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="no_duplicate_applyToModerators"
                    id="peertube-livechat-no-duplicate-applyToModerators"
                    @input=${(event: InputEvent) => {
                        if (event?.target && el.channelConfiguration) {
                          el.channelConfiguration.configuration.bot.noDuplicate.applyToModerators =
                            (event.target as HTMLInputElement).checked
                        }
                        el.requestUpdate('channelConfiguration')
                      }
                    }
                    value="1"
                    ?checked=${el.channelConfiguration?.configuration.bot.noDuplicate.applyToModerators}
                  />
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_APPLYTOMODERATORS_LABEL)}
                </label>
                <small class="form-text text-muted">
                  ${ptTr(LOC_LIVECHAT_CONFIGURATION_APPLYTOMODERATORS_DESC)}
                </small>
              </div>
              `
          }

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
                el.resetValidation(e)
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
                el.resetValidation(e)
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
                el.resetValidation(e)
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
