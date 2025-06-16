// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

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
import { AddSVG, RemoveSVG } from '../buttons'

export type DynamicTableAcceptedTypes = number | string | boolean | Date | Array<number | string>

export type DynamicTableAcceptedInputTypes = 'textarea'
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

export interface CellDataSchema {
  min?: number
  max?: number
  minlength?: number
  maxlength?: number
  size?: number
  options?: Record<string, string>
  datalist?: DynamicTableAcceptedTypes[]
  separator?: string
  inputType?: DynamicTableAcceptedInputTypes
  inputTitle?: string
  default?: DynamicTableAcceptedTypes
  colClassList?: string[] // CSS classes to add to the <td> element.
}

interface DynamicTableRowData {
  _id: number
  _originalIndex: number
  row: Record<string, DynamicTableAcceptedTypes>
}

export interface DynamicFormHeaderCellData {
  colName: TemplateResult | DirectiveResult
  description?: TemplateResult | DirectiveResult
  headerClassList?: string[]
}

export type DynamicFormHeader = Record<string, DynamicFormHeaderCellData>
export type DynamicFormSchema = Record<string, CellDataSchema>

@customElement('livechat-dynamic-table-form')
export class DynamicTableFormElement extends LivechatElement {
  @property({ attribute: false })
  public header: DynamicFormHeader = {}

  @property({ attribute: false })
  public schema: DynamicFormSchema = {}

  @property({ attribute: false })
  public maxLines?: number = undefined

  @property()
  public validation?: Record<string, ValidationErrorType[]>

  @property({ attribute: false })
  public validationPrefix = ''

  @property({ attribute: false })
  public rows: Array<Record<string, DynamicTableAcceptedTypes>> = []

  @state()
  public _rowsById: DynamicTableRowData[] = []

  @property({ attribute: false })
  public formName = ''

  @state()
  protected _lastRowId = 1

  @property({ attribute: false })
  protected columnOrder: string[] = []

  // fixes situations when list has been reinitialized or changed outside of CustomElement
  protected _updateLastRowId = (): void => {
    for (const rowById of this._rowsById) {
      this._lastRowId = Math.max(this._lastRowId, rowById._id + 1)
    }
  }

  private readonly _getDefaultRow = (): Record<string, DynamicTableAcceptedTypes> => {
    this._updateLastRowId()
    return Object.fromEntries([...Object.entries(this.schema).map((entry) => [entry[0], entry[1].default ?? ''])])
  }

  private async _addRow (): Promise<void> {
    const newRow = this._getDefaultRow()
    // Create row and assign id and original index
    this._rowsById.push({ _id: this._lastRowId++, _originalIndex: this.rows.length, row: newRow })
    this.rows.push(newRow)
    this.requestUpdate('rows')
    this.requestUpdate('_rowsById')
    this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))

    // Once the update is completed, we give focus to the first input field of the new row.
    await this.updateComplete
    // Note: we make multiple querySelector, to be sure to not get a nested table.
    // We want the top level table associated tr.
    const input = this.querySelector('table')?.querySelector(
      '&>tbody>tr:last-child>td input:not([type=hidden]),' +
      '&>tbody>tr:last-child>td livechat-tags-input,' +
      '&>tbody>tr:last-child>td textarea'
    )
    if (input) {
      (input as HTMLElement).focus()
    }
  }

  private async _removeRow (rowId: number): Promise<void> {
    const confirmMsg = await this.ptTranslate(LOC_ACTION_REMOVE_ENTRY_CONFIRM)
    await new Promise<void>((resolve, reject) => {
      this.ptOptions.peertubeHelpers.showModal({
        title: confirmMsg,
        content: '',
        close: true,
        cancel: {
          value: 'cancel',
          action: reject
        },
        confirm: {
          value: 'confirm',
          action: resolve
        }
      })
    })
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
    // FIXME: is this really necessary?
    this._rowsById = this._rowsById.filter(rowById => this.rows.includes(rowById.row))

    for (let i = 0; i < this.rows.length; i++) {
      if (!this._rowsById.find(rowById => rowById.row === this.rows[i])) {
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

  protected _renderHeader = (): TemplateResult => {
    const columns = Object.entries(this.header)
      .sort(([k1, _1], [k2, _2]) => this.columnOrder.indexOf(k1) - this.columnOrder.indexOf(k2))
    return html`<thead>
      <tr>
        ${columns.map(([_, v]) => this._renderHeaderCell(v))}
        <th scope="col"></th>
      </tr>
      <tr>
        ${columns.map(([_, v]) => this._renderHeaderDescriptionCell(v))}
        <th scope="col"></th>
      </tr>
    </thead>`
  }

  private readonly _renderHeaderCell = (headerCellData: DynamicFormHeaderCellData): TemplateResult => {
    return html`<th scope="col" class=${headerCellData.headerClassList?.join(' ') ?? ''}>
      <div
        data-toggle="tooltip"
        data-placement="bottom"
        data-html="true"
      >
        ${headerCellData.colName}
      </div>
    </th>`
  }

  private _renderHeaderDescriptionCell (headerCellData: DynamicFormHeaderCellData): TemplateResult {
    const classList = ['livechat-dynamic-table-form-description-header']
    if (headerCellData.headerClassList) {
      classList.push(...headerCellData.headerClassList)
    }
    return html`<th scope="col" class=${classList.join(' ')}>
      ${headerCellData.description ?? ''}
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
          class="dynamic-table-remove-row"
          .title=${ptTr(LOC_ACTION_REMOVE_ENTRY) as any}
          @click=${async () => this._removeRow(rowData._id)}
        >
          ${unsafeHTML(RemoveSVG)}
        </button>
      </td>
    </tr>`
  }

  protected _renderFooter = (): TemplateResult => {
    if (this.maxLines && this._rowsById.length >= this.maxLines) {
      return html``
    }
    // Note: the addRow button is in first column, so it won't be hidden if screen not wide enough.
    return html`<tfoot>
    <tr>
      <td class="dynamic-table-add-row-cell">
        <button type="button"
          class="dynamic-table-add-row"
          .title=${ptTr(LOC_ACTION_ADD_ENTRY) as any}
          @click=${this._addRow}
        >
          ${unsafeHTML(AddSVG)}
        </button>
      </td>
      ${Object.values(this.header).map(() => html`<td></td>`)}
    </tr>
  </tfoot>`
  }

  renderDataCell = (propertyName: string,
    propertyValue: DynamicTableAcceptedTypes,
    rowId: number,
    originalIndex: number,
    disabled?: boolean): TemplateResult => {
    const propertySchema = this.schema[propertyName] ?? {}

    let formElement

    const inputName = `${this.formName.replace(/-/g, '_')}_${propertyName.toString().replace(/-/g, '_')}_${rowId}`
    const inputId =
      `peertube-livechat-${this.formName.replace(/_/g, '-')}-${propertyName.toString().replace(/_/g, '-')}-${rowId}`

    const inputTitle: DirectiveResult | undefined = propertySchema.inputTitle ?? this.header[propertyName]?.colName
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
              inputTitle,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex,
              disabled)}
              ${feedback}
              `
            break

          case 'textarea':
            formElement = html`${this._renderTextarea(rowId,
              inputId,
              inputName,
              inputTitle,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex,
              disabled)}
              ${feedback}
              `
            break

          case 'select':
            formElement = html`${this._renderSelect(rowId,
              inputId,
              inputName,
              inputTitle,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex,
              disabled)}
              ${feedback}
              `
            break

          case 'image-file':
            formElement = html`${this._renderImageFileInput(rowId,
              inputId,
              inputName,
              inputTitle,
              propertyName,
              propertySchema,
              propertyValue?.toString(),
              originalIndex,
              disabled)}
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
              inputTitle,
              propertyName,
              propertySchema,
              (propertyValue as Date).toISOString(),
              originalIndex,
              disabled)}
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
              inputTitle,
              propertyName,
              propertySchema,
              propertyValue as string,
              originalIndex,
              disabled)}
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
              inputTitle,
              propertyName,
              propertySchema,
              propertyValue as boolean,
              originalIndex,
              disabled)}
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
              inputTitle,
              propertyName,
              propertySchema,
              (propertyValue)?.join(propertySchema.separator ?? ',') ?? propertyValue ?? propertySchema.default ?? '',
              originalIndex,
              disabled)}
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
              inputTitle,
              propertyName,
              propertySchema,
              (propertyValue)?.join(propertySchema.separator ?? ',') ?? propertyValue ?? propertySchema.default ?? '',
              originalIndex,
              disabled)}
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
              inputTitle,
              propertyName,
              propertySchema,
              propertyValue,
              originalIndex,
              disabled)}
              ${feedback}
              `
            break
        }
    }

    if (!formElement) {
      this.logger.warn(
        `value type '${(propertyValue.constructor.toString())}' is incompatible` +
        `with field type '${propertySchema.inputType as string}' for form entry '${propertyName.toString()}'.`
      )
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
    inputTitle: string | DirectiveResult | undefined,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number,
    disabled?: boolean): TemplateResult => {
    return html`<input
      type=${propertySchema.inputType as any}
      name=${inputName}
      class=${classMap(
        Object.assign(
          { 'form-control': true },
          this._getInputValidationClass(propertyName, originalIndex)
        )
      )}
      id=${inputId}
      title=${ifDefined(inputTitle)}
      aria-describedby="${inputId}-feedback"
      list=${ifDefined(propertySchema.datalist ? inputId + '-datalist' : undefined)}
      min=${ifDefined(propertySchema.min)}
      max=${ifDefined(propertySchema.max)}
      minlength=${ifDefined(propertySchema.minlength)}
      maxlength=${ifDefined(propertySchema.maxlength)}
      ?disabled=${disabled}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
    />
    ${(propertySchema.datalist)
? html`<datalist id=${inputId + '-datalist'}>
      ${(propertySchema.datalist ?? []).map((value) => html`<option value=${value.toString()}>`)}
    </datalist>`
: nothing}`
  }

  _renderTagsInput = (rowId: number,
    inputId: string,
    inputName: string,
    inputTitle: string | DirectiveResult | undefined,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: Array<string | number>,
    originalIndex: number,
    disabled?: boolean): TemplateResult => {
    return html`<livechat-tags-input
      .name=${inputName}
      class=${classMap(
        Object.assign(
          { 'form-control': true },
          this._getInputValidationClass(propertyName, originalIndex)
        )
      )}
      id=${inputId}
      .inputTitle=${inputTitle as any}
      aria-describedby="${inputId}-feedback"
      .min=${propertySchema.min}
      .max=${propertySchema.max}
      .minlength=${propertySchema.minlength}
      .maxlength=${propertySchema.maxlength}
      .datalist=${propertySchema.datalist as any}
      .separator=${propertySchema.separator ?? '\n'}
      .disabled=${disabled}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue as any}
      ></livechat-tags-input>`
  }

  _renderTextarea = (rowId: number,
    inputId: string,
    inputName: string,
    inputTitle: string | DirectiveResult | undefined,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number,
    disabled?: boolean): TemplateResult => {
    return html`<textarea
      name=${inputName}
      class=${classMap(
        Object.assign(
          { 'form-control': true },
          this._getInputValidationClass(propertyName, originalIndex)
        )
      )}
      id=${inputId}
      title=${ifDefined(inputTitle)}
      aria-describedby="${inputId}-feedback"
      min=${ifDefined(propertySchema.min)}
      max=${ifDefined(propertySchema.max)}
      minlength=${ifDefined(propertySchema.minlength)}
      maxlength=${ifDefined(propertySchema.maxlength)}
      ?disabled=${disabled}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}></textarea>`
  }

  _renderCheckbox = (rowId: number,
    inputId: string,
    inputName: string,
    inputTitle: string | DirectiveResult | undefined,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: boolean,
    originalIndex: number,
    disabled?: boolean): TemplateResult => {
    return html`<input
      type="checkbox"
      name=${inputName}
      class=${classMap(
        Object.assign(
          { 'form-check-input': true },
          this._getInputValidationClass(propertyName, originalIndex)
        )
      )}
      id=${inputId}
      title=${ifDefined(inputTitle)}
      aria-describedby="${inputId}-feedback"
      ?disabled=${disabled}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      value="1"
      ?checked=${propertyValue} />`
  }

  _renderSelect = (rowId: number,
    inputId: string,
    inputName: string,
    inputTitle: string | DirectiveResult | undefined,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number,
    disabled?: boolean): TemplateResult => {
    return html`<select
      class=${classMap(
        Object.assign(
          { 'form-select': true },
          this._getInputValidationClass(propertyName, originalIndex)
        )
      )}
      id=${inputId}
      title=${ifDefined(inputTitle)}
      aria-describedby="${inputId}-feedback"
      aria-label=${inputName}
      ?disabled=${disabled}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
    >
      <option ?selected=${!propertyValue}>${inputTitle ?? ''}</option>
      ${Object.entries(propertySchema.options ?? {})
        ?.map(([value, name]) =>
          html`<option ?selected=${propertyValue === value} value=${value}>${name}</option>`
        )}
    </select>`
  }

  _renderImageFileInput = (rowId: number,
    inputId: string,
    inputName: string,
    inputTitle: string | DirectiveResult | undefined,
    propertyName: string,
    propertySchema: CellDataSchema,
    propertyValue: string,
    originalIndex: number,
    disabled?: boolean
  ): TemplateResult => {
    return html`<livechat-image-file-input
      .name=${inputName}
      class=${classMap(this._getInputValidationClass(propertyName, originalIndex))}
      id=${inputId}
      .inputTitle=${inputTitle as any}
      aria-describedby="${inputId}-feedback"
      .disabled=${disabled}
      @change=${(event: Event) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
      .maxSize=${maxSize}
      .accept=${inputFileAccept}
    ></livechat-image-file-input>`
  }

  _getInputValidationClass = (propertyName: string,
    originalIndex: number): Record<string, boolean> => {
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

    // FIXME: this code is duplicated in channel-configuration
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
      if (validationErrorTypes.includes(ValidationErrorType.TooLong)) {
        errorMessages.push(html`${ptTr(LOC_INVALID_VALUE_TOO_LONG)}`)
      }

      return html`<div id="${inputId}-feedback" class="invalid-feedback">${errorMessages}</div>`
    } else {
      return nothing
    }
  }

  protected _updatePropertyFromValue = (event: Event,
    propertyName: string,
    propertySchema: CellDataSchema,
    rowId: number): void => {
    const target = event.target as (TagsInputElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    const value = (target)
      ? (target instanceof HTMLInputElement && target.type === 'checkbox')
          ? !!(target.checked)
          : target.value
      : undefined

    if (value === undefined) {
      this.logger.warn('Could not update property : Target or value was undefined')
      return
    }

    const rowById = this._rowsById.find(rowById => rowById._id === rowId)
    if (!rowById) {
      this.logger.warn(`Could not update property : Did not find a property named '${propertyName}' in row '${rowId}'`)
      return
    }

    switch (propertySchema.default?.constructor) {
      case Array:
        if (value.constructor === Array || !propertySchema.separator) {
          rowById.row[propertyName] = value
        } else {
          rowById.row[propertyName] = (value as string)
            .split(propertySchema.separator)
        }
        break
      case Number:
        rowById.row[propertyName] = Number(value)
        break
      default:
        rowById.row[propertyName] = value
        break
    }

    this.rows = this._rowsById.map(rowById => rowById.row)

    this.requestUpdate('rows')
    this.requestUpdate('_rowsById')
    this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
  }
}
