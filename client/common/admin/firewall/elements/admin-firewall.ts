// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { AdminFirewallConfiguration } from 'shared/lib/types'
import { AdminFirewallService } from '../services/admin-firewall'
import { LivechatElement } from '../../../lib/elements/livechat'
import { ValidationError, ValidationErrorType } from '../../../lib/models/validation'
import { tplAdminFirewall } from '../templates/admin-firewall'
import { TemplateResult, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { Task } from '@lit/task'

@customElement('livechat-admin-firewall')
export class AdminFirewallElement extends LivechatElement {
  private _adminFirewallService?: AdminFirewallService

  @state()
  public firewallConfiguration?: AdminFirewallConfiguration

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
        this._adminFirewallService = new AdminFirewallService(this.ptOptions)
        this.firewallConfiguration = await this._adminFirewallService.fetchConfiguration()
        this.actionDisabled = false // in case of reset
      },
      args: () => []
    })
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
   * Saves the configuration.
   * @param event event
   */
  public readonly saveConfig = async (event?: Event): Promise<void> => {
    event?.preventDefault()
    if (!this.firewallConfiguration || !this._adminFirewallService) {
      return
    }
    this.actionDisabled = true
    this._adminFirewallService.saveConfiguration(this.firewallConfiguration)
      .then((result: AdminFirewallConfiguration) => {
        this.validationError = undefined
        this.ptTranslate(LOC_SUCCESSFULLY_SAVED).then((msg) => {
          this.ptNotifier.info(msg)
        }, () => {})
        this.firewallConfiguration = result
        this.requestUpdate('firewallConfiguration')
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

  public readonly getInputValidationClass = (propertyName: string): Record<string, boolean> => {
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this.validationError?.properties[propertyName]
    return validationErrorTypes ? (validationErrorTypes.length ? { 'is-invalid': true } : { 'is-valid': true }) : {}
  }

  public readonly renderFeedback = (feedbackId: string,
    propertyName: string): TemplateResult | typeof nothing => {
    const errorMessages: TemplateResult[] = []
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this.validationError?.properties[propertyName] ?? undefined

    // FIXME: this code is duplicated in dymamic table form
    if (validationErrorTypes && validationErrorTypes.length !== 0) {
      return html`<div id=${feedbackId} class="invalid-feedback">${errorMessages}</div>`
    } else {
      return nothing
    }
  }

  protected override render = (): unknown => {
    return this._asyncTaskRender.render({
      pending: () => html`<livechat-spinner></livechat-spinner>`,
      error: () => html`<livechat-error></livechat-error>`,
      complete: () => tplAdminFirewall(this)
    })
  }
}
