// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelConfiguration } from 'shared/lib/types'
import { TemplateResult, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ptTr } from '../../lib/directives/translation'
import { Task } from '@lit/task'
import { ChannelDetailsService } from '../services/channel-details'
import { provide } from '@lit/context'
import { channelConfigurationContext, channelDetailsServiceContext } from '../contexts/channel'
import { registerClientOptionsContext } from '../../lib/contexts/peertube'
import { LivechatElement } from '../../lib/elements/livechat'
import { ValidationError, ValidationErrorType } from '../../lib/models/validation'
import { classMap } from 'lit/directives/class-map.js'

@customElement('livechat-channel-configuration')
export class ChannelConfigurationElement extends LivechatElement {
  @provide({ context: registerClientOptionsContext })
  @property({ attribute: false })
  public registerClientOptions?: RegisterClientOptions

  @property({ attribute: false })
  public channelId?: number

  @provide({ context: channelConfigurationContext })
  @state()
  public _channelConfiguration?: ChannelConfiguration

  @provide({ context: channelDetailsServiceContext })
  private _channelDetailsService?: ChannelDetailsService

  @state()
  public _validationError?: ValidationError

  private readonly _asyncTaskRender = new Task(this, {
    task: async ([registerClientOptions]) => {
      if (registerClientOptions) {
        this._channelDetailsService = new ChannelDetailsService(registerClientOptions)
        this._channelConfiguration = await this._channelDetailsService.fetchConfiguration(this.channelId ?? 0)
      }
    },
    args: () => [this.registerClientOptions]
  })

  private readonly _saveConfig = async (event?: Event): Promise<void> => {
    event?.preventDefault()
    if (this._channelDetailsService && this._channelConfiguration) {
      this._channelDetailsService.saveOptions(this._channelConfiguration.channel.id,
        this._channelConfiguration.configuration)
        .then(() => {
          this._validationError = undefined
          this.registerClientOptions?.peertubeHelpers.translate(LOC_SUCCESSFULLY_SAVED).then((msg) => {
            this.registerClientOptions
              ?.peertubeHelpers.notifier.info(msg)
          })
          this.requestUpdate('_validationError')
        })
        .catch(async (error: Error) => {
          this._validationError = undefined
          if (error instanceof ValidationError) {
            this._validationError = error
          }
          console.warn(`A validation error occurred in saving configuration. ${error.name}: ${error.message}`)
          this.registerClientOptions?.peertubeHelpers.notifier.error(
            error.message
              ? error.message
              : await this.registerClientOptions.peertubeHelpers.translate('error')
          )
          this.requestUpdate('_validationError')
        })
    }
  }

  private readonly _getInputValidationClass = (propertyName: string): { [key: string]: boolean } => {
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this._validationError?.properties[`${propertyName}`]
    return validationErrorTypes ? (validationErrorTypes.length ? { 'is-invalid': true } : { 'is-valid': true }) : {}
  }

  private readonly _renderFeedback = (feedbackId: string,
    propertyName: string): TemplateResult | typeof nothing => {
    const errorMessages: TemplateResult[] = []
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this._validationError?.properties[`${propertyName}`] ?? undefined

    if (validationErrorTypes && validationErrorTypes.length !== 0) {
      if (validationErrorTypes.includes(ValidationErrorType.WrongType)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_WRONG_TYPE)}`)
      }
      if (validationErrorTypes.includes(ValidationErrorType.WrongFormat)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_WRONG_FORMAT)}`)
      }
      if (validationErrorTypes.includes(ValidationErrorType.NotInRange)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_NOT_IN_RANGE)}`)
      }

      return html`<div id=${feedbackId} class="invalid-feedback">${errorMessages}</div>`
    } else {
      return nothing
    }
  }

  protected override render = (): unknown => {
    const tableHeaderList = {
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
    const tableSchema = {
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
          default: '',
          datalist: []
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

    return this._asyncTaskRender.render({
      complete: () => html`
        <div class="margin-content peertube-plugin-livechat-configuration
                    peertube-plugin-livechat-configuration-channel">
          <h1>
            ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TITLE)}:
            <span class="peertube-plugin-livechat-configuration-channel-info">
              <span>${this._channelConfiguration?.channel.displayName}</span>
              <span>${this._channelConfiguration?.channel.name}</span>
            </span>
            <livechat-help-button .page=${'documentation/user/streamers/channel'}>
            </livechat-help-button>
          </h1>
          <p>${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_DESC)}</p>
          <form livechat-configuration-channel-options role="form" @submit=${this._saveConfig}>
          <div class="row mt-3">
            <div class="row mt-5">
                <div class="col-12 col-lg-4 col-xl-3">
                <livechat-configuration-row
                  .title=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_LABEL)}
                  .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_DESC, true)}
                  .helpPage=${'documentation/user/streamers/slow_mode'}>
                </livechat-configuration-row>
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <div class="form-group">
                  <label>
                    <input
                      type="number"
                      name="slowmode_duration"
                      class="form-control ${classMap(this._getInputValidationClass('slowMode.duration'))}"
                      min="0"
                      max="1000"
                      id="peertube-livechat-slowmode-duration"
                      aria-describedby="peertube-livechat-slowmode-duration-feedback"
                      @input=${(event: InputEvent) => {
                          if (event?.target && this._channelConfiguration) {
                            this._channelConfiguration.configuration.slowMode.duration =
                              Number((event.target as HTMLInputElement).value)
                          }
                          this.requestUpdate('_channelConfiguration')
                        }
                      }
                      value="${this._channelConfiguration?.configuration.slowMode.duration}"
                    />
                  </label>
                  ${this._renderFeedback('peertube-livechat-slowmode-duration-feedback', 'slowMode.duration')}
                </div>
              </div>
            </div>
            <div class="row mt-5">
              <div class="col-12 col-lg-4 col-xl-3">
              <livechat-configuration-row
                .title=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_OPTIONS_TITLE)}
                .description=${''}
                .helpPage=${'documentation/user/streamers/channel'}>
              </livechat-configuration-row>
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <div class="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="bot"
                      id="peertube-livechat-bot"
                      @input=${(event: InputEvent) => {
                          if (event?.target && this._channelConfiguration) {
                            this._channelConfiguration.configuration.bot.enabled =
                              (event.target as HTMLInputElement).checked
                          }
                          this.requestUpdate('_channelConfiguration')
                        }
                      }
                      .value=${this._channelConfiguration?.configuration.bot.enabled}
                      ?checked=${this._channelConfiguration?.configuration.bot.enabled}
                    />
                    ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ENABLE_BOT_LABEL)}
                  </label>
                </div>
                ${this._channelConfiguration?.configuration.bot.enabled
                ? html`<div class="form-group">
                  <label for="peertube-livechat-bot-nickname">
                    ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_NICKNAME)}
                  </label>
                  <input
                    type="text"
                    name="bot_nickname"
                    class="form-control ${classMap(this._getInputValidationClass('bot.nickname'))}"
                    id="peertube-livechat-bot-nickname"
                    aria-describedby="peertube-livechat-bot-nickname-feedback"
                    @input=${(event: InputEvent) => {
                        if (event?.target && this._channelConfiguration) {
                          this._channelConfiguration.configuration.bot.nickname =
                          (event.target as HTMLInputElement).value
                        }
                        this.requestUpdate('_channelConfiguration')
                      }
                    }
                    value="${this._channelConfiguration?.configuration.bot.nickname}"
                  />
                  ${this._renderFeedback('peertube-livechat-bot-nickname-feedback', 'bot.nickname')}
                </div>`
                : ''
              }
              </div>
            </div>
            ${this._channelConfiguration?.configuration.bot.enabled
            ? html`<div class="row mt-5">
              <div class="col-12 col-lg-4 col-xl-3">
                <livechat-configuration-row
                  .title=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL)}
                  .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC)}
                  .helpPage=${'documentation/user/streamers/bot/forbidden_words'}>
                </livechat-configuration-row>
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <livechat-dynamic-table-form
                  .header=${tableHeaderList.forbiddenWords}
                  .schema=${tableSchema.forbiddenWords}
                  .validation=${this._validationError?.properties}
                  .validationPrefix=${'bot.forbiddenWords'}
                  .rows=${this._channelConfiguration?.configuration.bot.forbiddenWords}
                  @update=${(e: CustomEvent) => {
                      if (this._channelConfiguration) {
                        this._channelConfiguration.configuration.bot.forbiddenWords = e.detail
                        this.requestUpdate('_channelConfiguration')
                      }
                    }
                  }
                  .formName=${'forbidden-words'}>
                </livechat-dynamic-table-form>
              </div>
            </div>
            <div class="row mt-5">
              <div class="col-12 col-lg-4 col-xl-3">
                <livechat-configuration-row
                  .title=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_LABEL)}
                  .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DESC)}
                  .helpPage=${'documentation/user/streamers/bot/quotes'}>
                </livechat-configuration-row>
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <livechat-dynamic-table-form
                  .header=${tableHeaderList.quotes}
                  .schema=${tableSchema.quotes}
                  .validation=${this._validationError?.properties}
                  .validationPrefix=${'bot.quotes'}
                  .rows=${this._channelConfiguration?.configuration.bot.quotes}
                  @update=${(e: CustomEvent) => {
                      if (this._channelConfiguration) {
                        this._channelConfiguration.configuration.bot.quotes = e.detail
                        this.requestUpdate('_channelConfiguration')
                      }
                    }
                  }
                  .formName=${'quote'}>
                </livechat-dynamic-table-form>
              </div>
            </div>
            <div class="row mt-5">
              <div class="col-12 col-lg-4 col-xl-3">
                <livechat-configuration-row
                  .title=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_LABEL)}
                  .description=${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_DESC)}
                  .helpPage=${'documentation/user/streamers/bot/commands'}>
                </livechat-configuration-row>
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <livechat-dynamic-table-form
                  .header=${tableHeaderList.commands}
                  .schema=${tableSchema.commands}
                  .validation=${this._validationError?.properties}
                  .validationPrefix=${'bot.commands'}
                  .rows=${this._channelConfiguration?.configuration.bot.commands}
                  @update=${(e: CustomEvent) => {
                      if (this._channelConfiguration) {
                        this._channelConfiguration.configuration.bot.commands = e.detail
                        this.requestUpdate('_channelConfiguration')
                      }
                    }
                  }
                  .formName=${'command'}>
                </livechat-dynamic-table-form>
              </div>
            </div>`
              : ''
            }
            <div class="form-group mt-5">
              <input type="submit" class="peertube-button-link orange-button" value=${ptTr(LOC_SAVE)} />
            </div>
          </form>
        </div>`
    })
  }
}
