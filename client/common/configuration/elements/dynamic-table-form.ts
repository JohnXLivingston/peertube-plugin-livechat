import { css, html, LitElement, nothing, TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

  // This content comes from the file assets/images/plus-square.svg, from the Feather icons set https://feathericons.com/
const AddSVG: string =
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-square">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>`

  // This content comes from the file assets/images/x-square.svg, from the Feather icons set https://feathericons.com/
const RemoveSVG: string =
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-square">
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
export class DynamicTableFormElement extends LitElement {

  @property({ attribute: false })
  public header: { [key: string]: { colName: TemplateResult, description: TemplateResult } } = {}


  @property({ attribute: false })
  public schema: { [key: string]: CellDataSchema } = {}

  @property({ attribute: false })
  public rows: { [key: string]: DynamicTableAcceptedTypes }[] = []

  @state()
  public _rowsById: { _id: number; row: { [key: string]: DynamicTableAcceptedTypes } }[] = []

  @property({ attribute: false })
  public formName: string = ''

  @state()
  private _lastRowId = 1

  @property({ attribute: false })
  private _colOrder: string[] = []

  static styles = css`
      table {
        table-layout: fixed;
        text-align: center;
      }

      table td, table th {
        word-wrap:break-word;
        vertical-align: top;
        padding: 5px 7px;
      }

      table tbody > :nth-child(odd) {
        background-color: var(--greySecondaryBackgroundColor);
      }

      button {
        padding: 2px;
      }

      .dynamic-table-add-row {
        background-color: var(--bs-green);
      }

      .dynamic-table-remove-row {
        background-color: var(--bs-orange);
      }
  `;

  protected createRenderRoot = (): HTMLElement | DocumentFragment => {
    if (document.head.querySelector(`style[data-tagname="${this.tagName}"]`)) {
      return this;
    }

    const style = document.createElement("style");
    style.innerHTML = DynamicTableFormElement.styles.toString();
    style.setAttribute("data-tagname", this.tagName);
    document.head.append(style);

    return this
  }

  // fixes situations when list has been reinitialized or changed outside of CustomElement
  private _updateLastRowId = () => {
    for (let rowById of this._rowsById) {
      this._lastRowId = Math.max(this._lastRowId, rowById._id + 1);
    }
  }

  private _getDefaultRow = () : { [key: string]: DynamicTableAcceptedTypes } => {
    this._updateLastRowId()

    return Object.fromEntries([...Object.entries(this.schema).map((entry) => [entry[0], entry[1].default ?? ''])])

  }

  private _addRow = () => {
    let newRow = this._getDefaultRow()
    this._rowsById.push({_id:this._lastRowId++, row: newRow})
    this.rows.push(newRow)
    this.requestUpdate('rows')
    this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
  }


  private _removeRow = (rowId: number) => {
    let rowToRemove = this._rowsById.filter(rowById => rowById._id == rowId).map(rowById => rowById.row)[0]
    this._rowsById = this._rowsById.filter((rowById) => rowById._id !== rowId)
    this.rows = this.rows.filter((row) => row !== rowToRemove)
    this.requestUpdate('rows')
    this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
  }

  render = () => {
    const inputId = `peertube-livechat-${this.formName.replaceAll('_', '-')}-table`

    this._updateLastRowId()

    this._rowsById.filter(rowById => this.rows.includes(rowById.row))

    for (let row of this.rows) {
      if (this._rowsById.filter(rowById => rowById.row === row).length == 0) {
        this._rowsById.push({_id: this._lastRowId++, row })
      }
    }

    return html`
      <table class="table table-striped table-hover table-sm" id=${inputId}>
        ${this._renderHeader()}
        <tbody>
          ${repeat(this._rowsById, (rowById) => rowById._id, this._renderDataRow)}
        </tbody>
        ${this._renderFooter()}
      </table>
    `
  }

  private _renderHeader = () => {
    if (this._colOrder.length !== Object.keys(this.header).length) {
      this._colOrder = this._colOrder.filter(key => Object.keys(this.header).includes(key))
      this._colOrder.push(...Object.keys(this.header).filter(key => !this._colOrder.includes(key)))
    }

    return html`<thead>
      <tr>
        ${Object.entries(this.header).sort(([k1,_1], [k2,_2]) => this._colOrder.indexOf(k1) - this._colOrder.indexOf(k2))
                                     .map(([k,v]) => this._renderHeaderCell(v))}
        <th scope="col"></th>
      </tr>
    </thead>`
  }

  private _renderHeaderCell = (headerCellData: { colName: TemplateResult, description: TemplateResult }) => {
    return html`<th scope="col">
      <div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${headerCellData.description}>${headerCellData.colName}</div>
    </th>`
  }

  private _renderDataRow = (rowData: { _id: number; row: {[key: string]: DynamicTableAcceptedTypes} }) => {
    const inputId = `peertube-livechat-${this.formName.replaceAll('_', '-')}-row-${rowData._id}`

    return html`<tr id=${inputId}>
      ${Object.entries(rowData.row).filter(([k, v]) => k != '_id')
                                   .sort(([k1,_1], [k2,_2]) => this._colOrder.indexOf(k1) - this._colOrder.indexOf(k2))
                                   .map((data) => this.renderDataCell(data, rowData._id))}
      <td class="form-group"><button type="button" class="peertube-button-link dynamic-table-remove-row" @click=${() => this._removeRow(rowData._id)}>${unsafeHTML(RemoveSVG)}</button></td>
    </tr>`

  }

  private _renderFooter = () => {
    return html`<tfoot>
    <tr>
      ${Object.values(this.header).map(() => html`<td></td>`)}
      <td><button type="button" class="peertube-button-link dynamic-table-add-row" @click=${this._addRow}>${unsafeHTML(AddSVG)}</button></td>
    </tr>
  </tfoot>`
  }

  renderDataCell = (property: [string, DynamicTableAcceptedTypes], rowId: number) => {
    const [propertyName, propertyValue] = property
    const propertySchema = this.schema[propertyName] ?? {}

    let formElement

    const inputName = `${this.formName.replaceAll('-', '_')}_${propertyName.toString().replaceAll('-', '_')}_${rowId}`
    const inputId = `peertube-livechat-${this.formName.replaceAll('_', '-')}-${propertyName.toString().replaceAll('_', '-')}-${rowId}`

    switch (propertyValue.constructor) {
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
            formElement = this._renderInput(rowId, inputId, inputName, propertyName, propertySchema, propertyValue as string)
            break

          case 'textarea':
            formElement = this._renderTextarea(rowId, inputId, inputName, propertyName, propertySchema, propertyValue as string)
            break

          case 'select':
            formElement = this._renderSelect(rowId, inputId, inputName, propertyName, propertySchema, propertyValue as string)
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
            formElement = this._renderInput(rowId, inputId, inputName, propertyName, propertySchema, (propertyValue as Date).toISOString())
            break
        }
        break

      case Number:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'number'

          case 'number':
          case 'range':
            formElement = this._renderInput(rowId, inputId, inputName, propertyName, propertySchema, propertyValue as string)
            break
        }
        break

      case Boolean:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'checkbox'

          case 'checkbox':
            formElement = this._renderCheckbox(rowId, inputId, inputName, propertyName, propertySchema, propertyValue as boolean)
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
            formElement = this._renderInput(rowId, inputId, inputName, propertyName, propertySchema,
              (propertyValue as Array<number | string>).join(propertySchema.separator ?? ','))
            break
          case 'textarea':
            formElement = this._renderTextarea(rowId, inputId, inputName, propertyName, propertySchema,
              (propertyValue as Array<number | string>).join(propertySchema.separator ?? ','))
            break
        }
    }

    if (!formElement) {
      console.warn(`value type '${propertyValue.constructor}' is incompatible`
        + `with field type '${propertySchema.inputType}' for form entry '${propertyName.toString()}'.`)
    }

    return html`<td class="form-group">${formElement}</td>`
  }

  _renderInput = (rowId: number, inputId: string, inputName: string, propertyName: string, propertySchema: CellDataSchema, propertyValue: string) => {
    return html`<input
      type=${propertySchema.inputType}
      name=${inputName}
      class="form-control"
      id=${inputId}
      list=${(propertySchema?.datalist) ? inputId + '-datalist' : nothing}
      min=${ifDefined(propertySchema?.min)}
      max=${ifDefined(propertySchema?.max)}
      minlength=${ifDefined(propertySchema?.minlength)}
      maxlength=${ifDefined(propertySchema?.maxlength)}
      @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
    />
    ${(propertySchema?.datalist) ? html`<datalist id=${inputId + '-datalist'}>
      ${(propertySchema?.datalist ?? []).map((value) => html`<option value=${value} />`)}
    </datalist>` : nothing}
    `
  }

  _renderTextarea = (rowId: number, inputId: string, inputName: string, propertyName: string, propertySchema: CellDataSchema, propertyValue: string) => {
    return html`<textarea
      name=${inputName}
      class="form-control"
      id=${inputId}
      min=${ifDefined(propertySchema?.min)}
      max=${ifDefined(propertySchema?.max)}
      minlength=${ifDefined(propertySchema?.minlength)}
      maxlength=${ifDefined(propertySchema?.maxlength)}
      @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
    ></textarea>`
  }

  _renderCheckbox = (rowId: number, inputId: string, inputName: string, propertyName: string, propertySchema: CellDataSchema, propertyValue: boolean) => {
    return html`<input
      type="checkbox"
      name=${inputName}
      class="form-check-input"
      id=${inputId}
      @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
      .value=${propertyValue}
      ?checked=${propertyValue}
    />`
  }

  _renderSelect = (rowId: number, inputId: string, inputName: string, propertyName: string, propertySchema: CellDataSchema, propertyValue: string) => {
    return html`<select
      class="form-select"
      aria-label="Default select example"
      @change=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, propertySchema, rowId)}
    >
      <option ?selected=${!propertyValue}>${propertySchema?.label ?? 'Choose your option'}</option>
      ${Object.entries(propertySchema?.options ?? {})
        ?.map(([value, name]) =>
          html`<option ?selected=${propertyValue === value} value=${value}>${name}</option>`
        )}
    </select>`
  }


  _updatePropertyFromValue = (event: Event, propertyName: string, propertySchema: CellDataSchema, rowId: number) => {
    let target = event?.target as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    let value = (target && target instanceof HTMLInputElement && target.type == "checkbox") ? !!(target?.checked) : target?.value

    if (value !== undefined) {
      for (let rowById of this._rowsById) {
        if (rowById._id === rowId) {
          switch (rowById.row[propertyName].constructor) {
            case Array:
              rowById.row[propertyName] = (value as string).split(propertySchema.separator ?? ',')
            default:
              rowById.row[propertyName] = value
          }

          this.rows = this._rowsById.map(rowById => rowById.row)

          this.requestUpdate('rows')
          this.requestUpdate('rowsById')
          this.dispatchEvent(new CustomEvent('update', { detail: this.rows }))
          return
        }
      }

      console.warn(`Could not update property : Did not find a property named '${propertyName}' in row '${rowId}'`)
    }
    else {
      console.warn(`Could not update property : Target or value was undefined`)
    }
  }
}
