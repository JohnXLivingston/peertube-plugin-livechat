// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { TagsInputElement } from './tags-input'
import type { DirectiveResult } from 'lit/directive'
import { ValidationErrorType } from '../models/validation'
import { maxSize, inputFileAccept } from 'shared/lib/emojis'
import { html, nothing, TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { classMap } from 'lit/directives/class-map.js'
import { LivechatElement } from './livechat'
import { ptTr } from '../directives/translation'

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
| 'tags'
| 'image-file'

interface CellDataSchema {
  min?: number
  max?: number
  minlength?: number
  maxlength?: number
  size?: number
  label?: TemplateResult | string
  options?: { [key: string]: string }
  datalist?: DynamicTableAcceptedTypes[]
  separators?: string[]
  inputType?: DynamicTableAcceptedInputTypes
  default?: DynamicTableAcceptedTypes
  colClassList?: string[] // CSS classes to add to the <td> element.
}

interface DynamicTableRowData {
  _id: number
  _originalIndex: number
  row: { [key: string]: DynamicTableAcceptedTypes }
}

interface DynamicFormHeaderCellData {
  colName: TemplateResult | DirectiveResult
  description: TemplateResult | DirectiveResult
  headerClassList?: string[]
}

export interface DynamicFormHeader {
  [key: string]: DynamicFormHeaderCellData
}
export interface DynamicFormSchema { [key: string]: CellDataSchema }

@customElement('livechat-dynamic-table-form')
export class DynamicTableFormElement extends LivechatElement {
  @property({ attribute: false })
  public header: DynamicFormHeader = {}

  @property({ attribute: false })
  public schema: DynamicFormSchema = {}

  @property({ attribute: false })
  public maxLines?: number = undefined

  @property()
  public validation?: {[key: string]: ValidationErrorType[] }

  @property({ attribute: false })
  public validationPrefix: string = ''

  @property({ attribute: false })
  public rows: Array<{ [key: string]: DynamicTableAcceptedTypes }> = []

  @state()
  public _rowsById: DynamicTableRowData[] = []

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
    // Create row and assign id and original index
    this._rowsById.push({ _id: this._lastRowId++, _originalIndex: this.rows.length, row: newRow })
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

    // Filter removed rows
    this._rowsById.filter(rowById => this.rows.includes(rowById.row))

    for (let i = 0; i < this.rows.length; i++) {
      if (this._rowsById.filter(rowById => rowById.row === this.rows[i]).length === 0) {
        // Add row and assign id
        this._rowsById.push({ _id: this._lastRowId++, _originalIndex: i, row: this.rows[i] })
      } else {
        // Update index in case it changed
        this._rowsById.filter(rowById => rowById.row === this.rows[i])
          .forEach((value) => { value._originalIndex = i })
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

  private readonly _renderHeaderCell = (headerCellData: DynamicFormHeaderCellData): TemplateResult => {
    return html`<th scope="col">
      <div
        data-toggle="tooltip"
        data-placement="bottom"
        data-html="true"
        title=${headerCellData.description}
        class=${headerCellData.headerClassList?.join(' ') ?? ''}
      >
        ${headerCellData.colName}
      </div>
    </th>`
  }

  private readonly _renderDataRow = (rowData: DynamicTableRowData): TemplateResult => {
    const inputId = `peertube-livechat-${this.formName.replace(/_/g, '-')}-row-${rowData._id}`

    return html`<tr id=${inputId}>
      ${Object.keys(this.header)
              .sort((k1, k2) => this.columnOrder.indexOf(k1) - this.columnOrder.indexOf(k2))
              .map(key => this.renderDataCell(key,
              rowData.row[key] ?? this.schema[key].default,
              rowData._id,
              rowData._originalIndex))}
      <td class="form-group">
        <button type="button"
          class="peertube-button-link orange-button dynamic-table-remove-row"
          .title=${ptTr(LOC_ACTION_REMOVE_ENTRY)}
          @click=${() => this._removeRow(rowData._id)}
        >
          ${unsafeHTML(RemoveSVG)}
        </button>
      </td>
    </tr>`
  }

  private readonly _renderFooter = (): TemplateResult => {
    if (this.maxLines && this._rowsById.length >= this.maxLines) {
      return html``
    }
    return html`<tfoot>
    <tr>
      ${Object.values(this.header).map(() => html`<td></td>`)}
      <td>
        <button type="button"
          class="peertube-button-link orange-button dynamic-table-add-row"
          .title=${ptTr(LOC_ACTION_ADD_ENTRY)}
          @click=${this._addRow}
        >
          ${unsafeHTML(AddSVG)}
        </button>
      </td>
    </tr>
  </tfoot>`
  }

  renderDataCell = (propertyName: string,
    propertyValue: DynamicTableAcceptedTypes,
    rowId: number,
    originalIndex: number): TemplateResult => {
    const propertySchema = this.schema[propertyName] ?? {}

    let formElement

    const inputName = `${this.formName.replace(/-/g, '_')}_${propertyName.toString().replace(/-/g, '_')}_${rowId}`
    const inputId =
      `peertube-livechat-${this.formName.replace(/_/g, '-')}-${propertyName.toString().replace(/_/g, '-')}-${rowId}`

    const feedback = this._renderFeedback(inputId, propertyName, originalIndex)

    switch (propertySchema.default?.constructor) {
      case String:
        propertySchema.inputType ??= 'text'
        switch (propertySchema.inputType) {
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
            formElement = html`${this._renderInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex)}
              ${feedback}
              `
            break

          case 'textarea':
            formElement = html`${this._renderTextarea(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex)}
              ${feedback}
              `
            break

          case 'select':
            formElement = html`${this._renderSelect(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex)}
              ${feedback}
              `
            break

          case 'image-file':
            formElement = html`${this._renderImageFileInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue?.toString(),
              originalIndex)}
              ${feedback}
              `
            break
        }
        break

      case Date:
        propertySchema.inputType ??= 'datetime'
        switch (propertySchema.inputType) {
          case 'date':
          case 'datetime':
          case 'datetime-local':
          case 'time':
            formElement = html`${this._renderInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              (propertyValue as Date).toISOString(),
              originalIndex)}
              ${feedback}
              `
            break
        }
        break

      case Number:
        propertySchema.inputType ??= 'number'
        switch (propertySchema.inputType) {
          case 'number':
          case 'range':
            formElement = html`${this._renderInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex)}
              ${feedback}
              `
            break
        }
        break

      case Boolean:
        propertySchema.inputType ??= 'checkbox'
        switch (propertySchema.inputType) {
          case 'checkbox':
            formElement = html`${this._renderCheckbox(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue as boolean,
              originalIndex)}
              ${feedback}
              `
            break
        }
        break

      case Array:
        propertySchema.inputType ??= 'text'
        switch (propertySchema.inputType) {
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
            formElement = html`${this._renderInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              (propertyValue)?.join(propertySchema.separators?.[0] ?? ',') ??
                propertyValue ?? propertySchema.default ?? '',
              originalIndex)}
              ${feedback}
              `
            break
          case 'textarea':
            if (propertyValue.constructor !== Array) {
              propertyValue = (propertyValue) ? [propertyValue as (number | string)] : []
            }
            formElement = html`${this._renderTextarea(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              (propertyValue)?.join(propertySchema.separators?.[0] ?? ',') ??
                propertyValue ?? propertySchema.default ?? '',
              originalIndex)}
              ${feedback}
              `
            break
          case 'tags':
            if (propertyValue.constructor !== Array) {
              propertyValue = (propertyValue) ? [propertyValue as (number | string)] : []
            }
            formElement = html`${this._renderTagsInput(rowId,
              inputId,
              inputName,
              propertyName,
              propertySchema,
              propertyValue,
              originalIndex)}
              ${feedback}
              `
            break
        }
    }

    if (!formElement) {
      console.warn(`value type '${(propertyValue.constructor.toString())}' is incompatible` +
        `with field type '${propertySchema.inputType as string}' for form entry '${propertyName.toString()}'.`)
    }

    const classList = ['form-group']
    if (propertySchema.colClassList) {
      classList.push(...propertySchema.colClassList)
    }
    return html`<td class=${classList.join(' ')}>${formElement}</td>`
  }

  _renderInput = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number): TemplateResult => {
    return html`<input
      type=${propertySchema.inputType}
      name=${inputName}
      class="form-control ${classMap(this._getInputValidationClass(propertyName, originalIndex))}"
      id=${inputId}
      aria-describedby="${inputId}-feedback"
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
      ${(propertySchema.datalist ?? []).map((value) => html`<option value=${value}>`)}
    </datalist>`
: nothing}`
  }

  _renderTagsInput = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: Array<string | number>,
    originalIndex: number): TemplateResult => {
    return html`<livechat-tags-input
      .type=${'text'}
      .name=${inputName}
      class="form-control ${classMap(this._getInputValidationClass(propertyName, originalIndex))}"
      id=${inputId}
      .inputPlaceholder=${ifDefined(propertySchema.label)}
      aria-describedby="${inputId}-feedback"
      .min=${ifDefined(propertySchema.min)}
      .max=${ifDefined(propertySchema.max)}
      .minlength=${ifDefined(propertySchema.minlength)}
      .maxlength=${ifDefined(propertySchema.maxlength)}
      .datalist=${ifDefined(propertySchema.datalist)}
      .separators=${ifDefined(propertySchema.separators)}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}></livechat-tags-input>`
  }

  _renderTextarea = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number): TemplateResult => {
    return html`<textarea
      name=${inputName}
      class="form-control ${classMap(this._getInputValidationClass(propertyName, originalIndex))}"
      id=${inputId}
      aria-describedby="${inputId}-feedback"
      min=${ifDefined(propertySchema.min)}
      max=${ifDefined(propertySchema.max)}
      minlength=${ifDefined(propertySchema.minlength)}
      maxlength=${ifDefined(propertySchema.maxlength)}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}></textarea>`
  }

  _renderCheckbox = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: boolean,
    originalIndex: number): TemplateResult => {
    return html`<input
      type="checkbox"
      name=${inputName}
      class="form-check-input ${classMap(this._getInputValidationClass(propertyName, originalIndex))}"
      id=${inputId}
      aria-describedby="${inputId}-feedback"
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
      ?checked=${propertyValue} />`
  }

  _renderSelect = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number): TemplateResult => {
    return html`<select
      class="form-select ${classMap(this._getInputValidationClass(propertyName, originalIndex))}"
      id=${inputId}
      aria-describedby="${inputId}-feedback"
      aria-label=${inputName}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
    >
      <option ?selected=${!propertyValue}>${propertySchema.label ?? 'Choose your option'}</option>
      ${Object.entries(propertySchema.options ?? {})
        ?.map(([value, name]) =>
          html`<option ?selected=${propertyValue === value} value=${value}>${name}</option>`
        )}
    </select>`
  }

  _renderImageFileInput = (rowId: number,
    inputId: string,
    inputName: string,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number
  ): TemplateResult => {
    return html`<livechat-image-file-input
      .name=${inputName}
      class="${classMap(this._getInputValidationClass(propertyName, originalIndex))}"
      id=${inputId}
      aria-describedby="${inputId}-feedback"
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
      .maxSize=${maxSize}
      .accept=${inputFileAccept}
    ></livechat-image-file-input>`
  }

  _getInputValidationClass = (propertyName: string,
    originalIndex: number): { [key: string]: boolean } => {
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this.validation?.[`${this.validationPrefix}.${originalIndex}.${propertyName}`]

    return validationErrorTypes !== undefined
      ? (validationErrorTypes.length ? { 'is-invalid': true } : { 'is-valid': true })
      : {}
  }

  _renderFeedback = (inputId: string,
    propertyName: string,
    originalIndex: number): TemplateResult | typeof nothing => {
    const errorMessages: TemplateResult[] = []
    const validationErrorTypes: ValidationErrorType[] | undefined =
      this.validation?.[`${this.validationPrefix}.${originalIndex}.${propertyName}`]

    if (validationErrorTypes !== undefined && validationErrorTypes.length !== 0) {
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
      if (validationErrorTypes.includes(ValidationErrorType.Duplicate)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_DUPLICATE)}`)
      }

      return html`<div id="${inputId}-feedback" class="invalid-feedback">${errorMessages}</div>`
    } else {
      return nothing
    }
  }

  _updatePropertyFromValue = (event: Event,
    propertyName: string,
    propertySchema: CellDataSchema,
    rowId: number): void => {
    const target = event.target as (TagsInputElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
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
              if (value.constructor === Array) {
                rowById.row[propertyName] = value
              } else {
                rowById.row[propertyName] = (value as string)
                  .split(new RegExp(`(?:${propertySchema.separators
                    ?.map((c: string) => c.replace(/^[.\\+*?[^\]$(){}=!<>|:-]$/, '\\'))
                    .join('|') ?? ''})+)`))
              }
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
