// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/* eslint no-fallthrough: "off" */

import { html, nothing, TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { LivechatElement } from './livechat'

// This content comes from the file assets/images/plus-square.svg, from the Feather icons set https://feathericons.com/
const AddSVG: string =
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
  stroke-linejoin="round" class="feather feather-plus-square">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>`

// This content comes from the file assets/images/x-square.svg, from the Feather icons set https://feathericons.com/
const RemoveSVG: string =
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
  stroke-linejoin="round" class="feather feather-x-square">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>
  </svg>`

type DynamicTableAcceptedTypes = number | string | boolean | Date | Array<number | string>

type DynamicTableAcceptedInputTypes = 'textarea'
| 'select'
| 'checkbox'
| 'range'
| 'color'
| 'date'
| 'datetime'
| 'datetime-local'
| 'email'
| 'file'
| 'image'
| 'month'
| 'number'
| 'password'
| 'tel'
| 'text'
| 'time'
| 'url'
| 'week'

interface CellDataSchema {
  min?: number
  max?: number
  minlength?: number
  maxlength?: number
  size?: number
  label?: string
  options?: { [key: string]: string }
  datalist?: DynamicTableAcceptedTypes[]
  separator?: string
  inputType?: DynamicTableAcceptedInputTypes
  default?: DynamicTableAcceptedTypes
}

@customElement('livechat-dynamic-table-form')
export class DynamicTableFormElement extends LivechatElement {
  @property({ attribute: false })
  public header: { [key: string]: { colName: TemplateResult, description: TemplateResult } } = {}

  @property({ attribute: false })
  public schema: { [key: string]: CellDataSchema } = {}

  @property({ attribute: false })
  public rows: Array<{ [key: string]: DynamicTableAcceptedTypes }> = []

  @state()
  public _rowsById: Array<{ _id: number, row: { [key: string]: DynamicTableAcceptedTypes } }> = []

  @property({ attribute: false })
  public formName: string = ''

  @state()
  private _lastRowId = 1

  @property({ attribute: false })
  private columnOrder: string[] = []

  // fixes situations when list has been reinitialized or changed outside of CustomElement
  private readonly _updateLastRowId = (): void => {
    for (const rowById of this._rowsById) {
      this._lastRowId = Math.max(this._lastRowId, rowById._id + 1)
    }
  }

  private readonly _getDefaultRow = (): { [key: string]: DynamicTableAcceptedTypes } => {
    this._updateLastRowId()
    return Object.fromEntries([...Object.entries(this.schema).map((entry) => [entry[0], entry[1].default ?? ''])])
  }

  private readonly _addRow = (): void => {
    const newRow = this._getDefaultRow()
    this._rowsById.push({ _id: this._lastRowId++, row: newRow })
    this.rows.push(newRow)
    this.requestUpdate('rows')
    this.requestUpdate('_rowsById')
    this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
  }

  private readonly _removeRow = (rowId: number): void => {
    const rowToRemove = this._rowsById.filter(rowById => rowById._id === rowId).map(rowById => rowById.row)[0]
    this._rowsById = this._rowsById.filter(rowById => rowById._id !== rowId)
    this.rows = this.rows.filter((row) => row !== rowToRemove)
    this.requestUpdate('rows')
    this.requestUpdate('_rowsById')
    this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
  }

  protected override render = (): unknown => {
    const inputId = `peertube-livechat-${this.formName.replace(/_/g, '-')}-table`

    this._updateLastRowId()

    this._rowsById.filter(rowById => this.rows.includes(rowById.row))

    for (const row of this.rows) {
      if (this._rowsById.filter(rowById => rowById.row === row).length === 0) {
        this._rowsById.push({ _id: this._lastRowId++, row })
      }
    }

    if (this.columnOrder.length !== Object.keys(this.header).length) {
      this.columnOrder = this.columnOrder.filter(key => Object.keys(this.header).includes(key))
      this.columnOrder.push(...Object.keys(this.header).filter(key => !this.columnOrder.includes(key)))
    }

    return html`
      <div class="table-responsive">
        <table class="table" id=${inputId}>
          ${this._renderHeader()}
          <tbody>
            ${repeat(this._rowsById, (rowById) => rowById._id, this._renderDataRow)}
          </tbody>
          ${this._renderFooter()}
        </table>
      </div>
    `
  }

  private readonly _renderHeader = (): TemplateResult => {
    return html`<thead>
      <tr>
        ${Object.entries(this.header)
                .sort(([k1, _1], [k2, _2]) => this.columnOrder.indexOf(k1) - this.columnOrder.indexOf(k2))
                .map(([_, v]) => this._renderHeaderCell(v))}
        <th scope="col"></th>
      </tr>
    </thead>`
  }

  private readonly _renderHeaderCell = (headerCellData: { colName: TemplateResult
    description: TemplateResult }): TemplateResult => {
    return html`<th scope="col">
      <div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${headerCellData.description}>
        ${headerCellData.colName}
      </div>
    </th>`
  }

  private readonly _renderDataRow = (rowData: { _id: number
    row: {[key: string]: DynamicTableAcceptedTypes} }): TemplateResult => {
    const inputId = `peertube-livechat-${this.formName.replace(/_/g, '-')}-row-${rowData._id}`

    return html`<tr id=${inputId}>
      ${Object.keys(this.header)
              .sort((k1, k2) => this.columnOrder.indexOf(k1) - this.columnOrder.indexOf(k2))
              .map(k => this.renderDataCell([k, rowData.row[k] ?? this.schema[k].default], rowData._id))}
      <td class="form-group">
        <button type="button"
        class="peertube-button-link orange-button dynamic-table-remove-row"
        @click=${() => this._removeRow(rowData._id)}>
          ${unsafeHTML(RemoveSVG)}
        </button>
      </td>
    </tr>`
  }

  private readonly _renderFooter = (): TemplateResult => {
    return html`<tfoot>
    <tr>
      ${Object.values(this.header).map(() => html`<td></td>`)}
      <td>
        <button type="button"
        class="peertube-button-link orange-button dynamic-table-add-row"
        @click=${this._addRow}>
          ${unsafeHTML(AddSVG)}
        </button>
      </td>
    </tr>
  </tfoot>`
  }

  renderDataCell = (property: [string, DynamicTableAcceptedTypes], rowId: number): TemplateResult => {
    let [propertyName, propertyValue] = property
    const propertySchema = this.schema[propertyName] ?? {}

    let formElement

    const inputName = `${this.formName.replace(/-/g, '_')}_${propertyName.toString().replace(/-/g, '_')}_${rowId}`
    const inputId =
      `peertube-livechat-${this.formName.replace(/_/g, '-')}-${propertyName.toString().replace(/_/g, '-')}-${rowId}`

    switch (propertySchema.default?.constructor) {
      case String:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'text'

          case 'text':
          case 'color':
          case 'date':
          case 'datetime':
          case 'datetime-local':
          case 'email':
          case 'file':
          case 'image':
          case 'month':
          case 'number':
          case 'password':
          case 'range':
          case 'tel':
          case 'time':
          case 'url':
          case 'week':
            formElement = this._renderInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string)
            break

          case 'textarea':
            formElement = this._renderTextarea(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string)
            break

          case 'select':
            formElement = this._renderSelect(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string)
            break
        }
        break

      case Date:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'datetime'

          case 'date':
          case 'datetime':
          case 'datetime-local':
          case 'time':
            formElement = this._renderInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              (propertyValue as Date).toISOString())
            break
        }
        break

      case Number:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'number'

          case 'number':
          case 'range':
            formElement = this._renderInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string)
            break
        }
        break

      case Boolean:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'checkbox'

          case 'checkbox':
            formElement = this._renderCheckbox(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as boolean)
            break
        }
        break

      case Array:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'text'

          case 'text':
          case 'color':
          case 'date':
          case 'datetime':
          case 'datetime-local':
          case 'email':
          case 'file':
          case 'image':
          case 'month':
          case 'number':
          case 'password':
          case 'range':
          case 'tel':
          case 'time':
          case 'url':
          case 'week':
            if (propertyValue.constructor !== Array) {
              propertyValue = (propertyValue) ? [propertyValue as (number | string)] : []
            }
            formElement = this._renderInput(rowId, inputId, inputName, propertyName, propertySchema,
              (propertyValue)?.join(propertySchema.separator ?? ',') ?? propertyValue ?? propertySchema.default ?? '')
            break
          case 'textarea':
            if (propertyValue.constructor !== Array) {
              propertyValue = (propertyValue) ? [propertyValue as (number | string)] : []
            }
            formElement = this._renderTextarea(rowId, inputId, inputName, propertyName, propertySchema,
              (propertyValue)?.join(propertySchema.separator ?? ',') ?? propertyValue ?? propertySchema.default ?? '')
            break
        }
    }

    if (!formElement) {
      console.warn(`value type '${(propertyValue.constructor.toString())}' is incompatible` +
        `with field type '${propertySchema.inputType as string}' for form entry '${propertyName.toString()}'.`)
    }

    return html`<td class="form-group">${formElement}</td>`
  }

  _renderInput = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string): TemplateResult => {
    return html`<input
      type=${propertySchema.inputType}
      name=${inputName}
      class="form-control"
      id=${inputId}
      list=${(propertySchema.datalist) ? inputId + '-datalist' : nothing}
      min=${ifDefined(propertySchema.min)}
      max=${ifDefined(propertySchema.max)}
      minlength=${ifDefined(propertySchema.minlength)}
      maxlength=${ifDefined(propertySchema.maxlength)}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
    />
    ${(propertySchema.datalist)
? html`<datalist id=${inputId + '-datalist'}>
      ${(propertySchema.datalist ?? []).map((value) => html`<option value=${value} />`)}
    </datalist>`
: nothing}
    `
  }

  _renderTextarea = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string): TemplateResult => {
    return html`<textarea
      name=${inputName}
      class="form-control"
      id=${inputId}
      min=${ifDefined(propertySchema.min)}
      max=${ifDefined(propertySchema.max)}
      minlength=${ifDefined(propertySchema.minlength)}
      maxlength=${ifDefined(propertySchema.maxlength)}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
    ></textarea>`
  }

  _renderCheckbox = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: boolean): TemplateResult => {
    return html`<input
      type="checkbox"
      name=${inputName}
      class="form-check-input"
      id=${inputId}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
      ?checked=${propertyValue}
    />`
  }

  _renderSelect = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string): TemplateResult => {
    return html`<select
      class="form-select"
      aria-label="Default select example"
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
    >
      <option ?selected=${!propertyValue}>${propertySchema.label ?? 'Choose your option'}</option>
      ${Object.entries(propertySchema.options ?? {})
        ?.map(([value, name]) =>
          html`<option ?selected=${propertyValue === value} value=${value}>${name}</option>`
        )}
    </select>`
  }

  _updatePropertyFromValue = (event: Event,
    propertyName: string,
    propertySchema: CellDataSchema,
    rowId: number): void => {
    const target = event.target as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    const value = (target)
      ? (target instanceof HTMLInputElement && target.type === 'checkbox')
          ? !!(target.checked)
          : target.value
      : undefined

    if (value !== undefined) {
      for (const rowById of this._rowsById) {
        if (rowById._id === rowId) {
          switch (propertySchema.default?.constructor) {
            case Array:
              rowById.row[propertyName] = (value as string).split(propertySchema.separator ?? ',')
              break
            default:
              rowById.row[propertyName] = value
              break
          }

          this.rows = this._rowsById.map(rowById => rowById.row)

          this.requestUpdate('rows')
          this.requestUpdate('_rowsById')
          this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
          return
        }
      }

      console.warn(`Could not update property : Did not find a property named '${propertyName}' in row '${rowId}'`)
    } else {
      console.warn('Could not update property : Target or value was undefined')
    }
  }
}
