// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { AdminFirewallConfiguration } from 'shared/lib/types'
import {
  maxFirewallFileSize, maxFirewallNameLength, maxFirewallFiles, firewallNameRegexp
} from 'shared/lib/admin-firewall'
import { ValidationError, ValidationErrorType } from '../../../lib/models/validation'
import { getBaseRoute } from '../../../../utils/uri'

export class AdminFirewallService {
  public _registerClientOptions: RegisterClientOptions

  private readonly _headers: any = {}

  constructor (registerClientOptions: RegisterClientOptions) {
    this._registerClientOptions = registerClientOptions

    this._headers = this._registerClientOptions.peertubeHelpers.getAuthHeader() ?? {}
    this._headers['content-type'] = 'application/json;charset=UTF-8'
  }

  async validateConfiguration (adminFirewallConfiguration: AdminFirewallConfiguration): Promise<boolean> {
    const propertiesError: ValidationError['properties'] = {}

    if (adminFirewallConfiguration.files.length > maxFirewallFiles) {
      const validationError = new ValidationError(
        'AdminFirewallConfigurationValidationError',
        await this._registerClientOptions.peertubeHelpers.translate(LOC_TOO_MANY_ENTRIES),
        propertiesError
      )
      throw validationError
    }

    const seen = new Map<string, true>()
    for (const [i, e] of adminFirewallConfiguration.files.entries()) {
      propertiesError[`files.${i}.name`] = []
      if (e.name === '') {
        propertiesError[`files.${i}.name`].push(ValidationErrorType.Missing)
      } else if (e.name.length > maxFirewallNameLength) {
        propertiesError[`files.${i}.name`].push(ValidationErrorType.TooLong)
      } else if (!firewallNameRegexp.test(e.name)) {
        propertiesError[`files.${i}.name`].push(ValidationErrorType.WrongFormat)
      } else if (seen.has(e.name)) {
        propertiesError[`files.${i}.name`].push(ValidationErrorType.Duplicate)
      } else {
        seen.set(e.name, true)
      }

      propertiesError[`files.${i}.content`] = []
      if (e.content.length > maxFirewallFileSize) {
        propertiesError[`files.${i}.content`].push(ValidationErrorType.TooLong)
      }
    }

    if (Object.values(propertiesError).find(e => e.length > 0)) {
      const validationError = new ValidationError(
        'AdminFirewallConfigurationValidationError',
        await this._registerClientOptions.peertubeHelpers.translate(LOC_VALIDATION_ERROR),
        propertiesError
      )
      throw validationError
    }

    return true
  }

  async saveConfiguration (
    adminFirewallConfiguration: AdminFirewallConfiguration
  ): Promise<AdminFirewallConfiguration> {
    if (!await this.validateConfiguration(adminFirewallConfiguration)) {
      throw new Error('Invalid form data')
    }

    const response = await fetch(
      getBaseRoute(this._registerClientOptions) + '/api/admin/firewall/',
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(adminFirewallConfiguration)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to save configuration.')
    }

    return response.json()
  }

  async fetchConfiguration (): Promise<AdminFirewallConfiguration> {
    const response = await fetch(
      getBaseRoute(this._registerClientOptions) + '/api/admin/firewall/',
      {
        method: 'GET',
        headers: this._headers
      }
    )

    if (!response.ok) {
      throw new Error('Can\'t get firewall configuration.')
    }

    return response.json()
  }
}
