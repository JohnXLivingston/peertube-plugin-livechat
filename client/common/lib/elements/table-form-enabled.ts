// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { html, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { CellDataSchema, DynamicTableAcceptedTypes, DynamicTableFormElement } from './dynamic-table-form'

@customElement('livechat-table-form-enable')
export class TableFormEnableElement extends DynamicTableFormElement {
  public override maxLines?: number = 0

  protected override render = (): unknown => {
    const inputId = `peertube-livechat-${this.formName.replace(/_/g, '-')}-table`

    if (this.columnOrder.length !== Object.keys(this.header).length) {
      this.columnOrder = this.columnOrder.filter((key) => Object.keys(this.header).includes(key))
      this.columnOrder.push(...Object.keys(this.header).filter((key) => !this.columnOrder.includes(key)))
    }

    return html`
      <div class="table-responsive">
        <table class="table" id=${inputId}>
          ${this._renderHeader()}
          <tbody>
            ${map(this.rows, this._renderRow)}
          </tbody>
        </table>
      </div>
    `
  }

  protected _renderRow = (row: Record<string, DynamicTableAcceptedTypes>, index: number): TemplateResult => {
    const inputId = `peertube-livechat-${this.formName.replace(/_/g, '-')}-row-${index}`
    return html`
      <tr id=${inputId}>
        ${Object.keys(this.header)
          .sort((k1, k2) => this.columnOrder.indexOf(k1) - this.columnOrder.indexOf(k2))
          .map((key) => {
            return this.renderDataCell(
              key,
              row[key] ?? this.schema[key].default,
              index,
              index,
              key === 'enabled' ? (row.forced as boolean) : true
            )
          })}
        <td></td>
      </tr>
    `
  }

  protected override _updatePropertyFromValue = (
    event: Event,
    propertyName: string,
    propertySchema: CellDataSchema,
    rowId: number
  ): void => {
    if (propertyName !== 'enabled') return

    const target = event.target as HTMLInputElement
    const value = target ? !!target.checked : undefined

    if (value === undefined) {
      this.logger.warn('Could not update property : Target or value was undefined')
      return
    }

    const item = this.rows[rowId]

    if (!item) {
      this.logger.warn(`Could not update property : Did not find a property named '${propertyName}' in row '${rowId}'`)
      return
    }

    item.enabled = value

    this.requestUpdate('values')
    this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
  }
}
