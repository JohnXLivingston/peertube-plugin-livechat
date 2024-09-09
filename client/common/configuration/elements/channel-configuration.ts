// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChannelConfiguration } from 'shared/lib/types'
import { ChannelDetailsService } from '../services/channel-details'
import { channelConfigurationContext, channelDetailsServiceContext } from '../contexts/channel'
import { LivechatElement } from '../../lib/elements/livechat'
import { ValidationError, ValidationErrorType } from '../../lib/models/validation'
import { tplChannelConfiguration } from './templates/channel-configuration'
import { TemplateResult, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ptTr } from '../../lib/directives/translation'
import { Task } from '@lit/task'
import { provide } from '@lit/context'
import { channelTermsMaxLength } from 'shared/lib/constants'

@customElement('livechat-channel-configuration')
export class ChannelConfigurationElement extends LivechatElement {
  @property({ attribute: false })
  public channelId?: number

  @provide({ context: channelConfigurationContext })
  @state()
  public channelConfiguration?: ChannelConfiguration

  @provide({ context: channelDetailsServiceContext })
  private _channelDetailsService?: ChannelDetailsService

  @state()
  public validationError?: ValidationError

  @state()
  public actionDisabled = false

  private _asyncTaskRender: Task

  constructor () {
    super()
    this._asyncTaskRender = this._initTask()
  }

  protected _initTask (): Task {
    return new Task(this, {
      task: async () => {
        this._channelDetailsService = new ChannelDetailsService(this.ptOptions)
        this.channelConfiguration = await this._channelDetailsService.fetchConfiguration(this.channelId ?? 0)
        this.actionDisabled = false // in case of reset
      },
      args: () => []
    })
  }

  public termsMaxLength (): number {
    return channelTermsMaxLength
  }

  /**
   * Resets the form by reloading data from backend.
   */
  public async reset (event?: Event): Promise<void> {
    event?.preventDefault()
    this.actionDisabled = true
    this._asyncTaskRender = this._initTask()
    this.requestUpdate()
  }

  /**
   * Resets the validation errors.
   * @param ev the vent
   */
  public resetValidation (_ev?: Event): void {
    if (this.validationError) {
      this.validationError = undefined
      this.requestUpdate('_validationError')
    }
  }

  /**
   * Saves the channel configuration.
   * @param event event
   */
  public readonly saveConfig = async (event?: Event): Promise<void> => {
    event?.preventDefault()
    if (this._channelDetailsService && this.channelConfiguration) {
      this.actionDisabled = true
      this._channelDetailsService.saveOptions(this.channelConfiguration.channel.id,
        this.channelConfiguration.configuration)
        .then(() => {
          this.validationError = undefined
          this.ptTranslate(LOC_SUCCESSFULLY_SAVED).then((msg) => {
            this.ptNotifier.info(msg)
          }, () => {})
          this.requestUpdate('_validationError')
        })
        .catch(async (error: Error) => {
          this.validationError = undefined
          if (error instanceof ValidationError) {
            this.validationError = error
          }
          this.logger.warn(`A validation error occurred in saving configuration. ${error.name}: ${error.message}`)
          this.ptNotifier.error(
            error.message
              ? error.message
              : await this.ptTranslate(LOC_ERROR)
          )
          this.requestUpdate('_validationError')
        })
        .finally(() => {
          this.actionDisabled = false
        })
    }
  }

  public readonly getInputValidationClass = (propertyName: string): Record<string, boolean> => {
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this.validationError?.properties[`${propertyName}`]
    return validationErrorTypes ? (validationErrorTypes.length ? { 'is-invalid': true } : { 'is-valid': true }) : {}
  }

  public readonly renderFeedback = (feedbackId: string,
    propertyName: string): TemplateResult | typeof nothing => {
    const errorMessages: TemplateResult[] = []
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this.validationError?.properties[`${propertyName}`] ?? undefined

    // FIXME: this code is duplicated in dymamic table form
    if (validationErrorTypes && validationErrorTypes.length !== 0) {
      if (validationErrorTypes.includes(ValidationErrorType.Missing)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_MISSING)}`)
      }
      if (validationErrorTypes.includes(ValidationErrorType.WrongType)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_WRONG_TYPE)}`)
      }
      if (validationErrorTypes.includes(ValidationErrorType.WrongFormat)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_WRONG_FORMAT)}`)
      }
      if (validationErrorTypes.includes(ValidationErrorType.NotInRange)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_NOT_IN_RANGE)}`)
      }
      if (validationErrorTypes.includes(ValidationErrorType.TooLong)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_TOO_LONG)}`)
      }

      return html`<div id=${feedbackId} class="invalid-feedback">${errorMessages}</div>`
    } else {
      return nothing
    }
  }

  protected override render = (): unknown => {
    return this._asyncTaskRender.render({
      pending: () => html`<livechat-spinner></livechat-spinner>`,
      error: () => html`<livechat-error></livechat-error>`,
      complete: () => tplChannelConfiguration(this)
    })
  }
}
