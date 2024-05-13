import { html, LitElement, TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { customElement, property, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { StaticValue, unsafeStatic } from 'lit/static-html.js'

type DynamicTableAcceptedTypes = number | string | boolean | Date

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
  inputType?: DynamicTableAcceptedInputTypes
  default?: DynamicTableAcceptedTypes
}

@customElement('dynamic-table-form')
export class DynamicTableFormElement extends LitElement {

  @property({ attribute: false })
  public header: { [key : string]: { colName: TemplateResult, description: TemplateResult } } = {}


  @property({ attribute: false })
  public schema: { [key : string]: CellDataSchema } = {}


  @property({ reflect: true })
  public rows: { _id: number; [key : string]: DynamicTableAcceptedTypes }[] = []


  @property({ attribute: false })
  public formName: string = ''


  @state()
  private _lastRowId = 1

  createRenderRoot = () => {
    return this
  }

  private _getDefaultRow = () => {
    return Object.fromEntries([...Object.entries(this.schema).map((entry) => [entry[0], entry[1].default ?? '']), ['_id', this._lastRowId++]])

  }

  private _addRow = () => {
      this.rows.push(this._getDefaultRow())

      this.requestUpdate('rows')

  }


  private _removeRow = (rowId: number) => {
      this.rows = this.rows.filter((x) => x._id != rowId)

      this.requestUpdate('rows')

  }


  render = () => {
    const inputId = `peertube-livechat-${this.formName.replaceAll('_','-')}-table`

    for(let row of this.rows) {
      if (!row._id) {
        row._id = this._lastRowId++
      }
    }

    return html`
      <table class="table table-striped table-hover table-sm" id=${inputId}>
        ${this._renderHeader()}
        <tbody>
          ${repeat(this.rows,(row) => row._id, this._renderDataRow)}
        </tbody>
        <tfoot>
          <tr><td><button @click=${this._addRow}>Add Row</button></td></tr>
        </tfoot>
      </table>
    `

  }

  private _renderHeader = () => {
    return html`<thead>
      <tr>
        <!-- <th scope="col">#</th> -->
        ${Object.values(this.header).map(this._renderHeaderCell)}
        <th scope="col">Remove Row</th>
      </tr>
    </thead>`

  }

  private _renderHeaderCell = (headerCellData: { colName: TemplateResult, description: TemplateResult }) => {
    return html`<th scope="col">
      <div data-toggle="tooltip" data-placement="bottom" data-html="true" title="${headerCellData.description}">${headerCellData.colName}</div>
    </th>`
  }

  private _renderDataRow = (rowData: { _id: number; [key : string]: DynamicTableAcceptedTypes }) => {
    const inputId = `peertube-livechat-${this.formName.replaceAll('_','-')}-row-${rowData._id}`

    return html`<tr id=${inputId}>
      <!-- <td class="form-group">${rowData._id}</td> -->
      ${Object.entries(rowData).filter(([k,v]) => k != '_id').map((data) => this.renderDataCell(data, rowData._id))}
      <td class="form-group"><button @click=${() => this._removeRow(rowData._id)}>Remove</button></td>
    </tr>`

  }

  renderDataCell = (property: [string, DynamicTableAcceptedTypes], rowId: number) => {
    const [propertyName, propertyValue] = property
    const propertySchema = this.schema[propertyName] ?? {}

    let formElement

    const inputName = `${this.formName.replaceAll('-','_')}_${propertyName.toString().replaceAll('-','_')}_${rowId}`
    const inputId = `peertube-livechat-${this.formName.replaceAll('_','-')}-${propertyName.toString().replaceAll('_','-')}-${rowId}`

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
            formElement = html`<input
              type=${propertySchema.inputType}
              name=${inputName}
              class="form-control"
              id=${inputId}
              min=${ifDefined(propertySchema?.min)}
              max=${ifDefined(propertySchema?.max)}
              minlength=${ifDefined(propertySchema?.minlength)}
              maxlength=${ifDefined(propertySchema?.maxlength)}
              @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${propertyValue as string}
            />`
            break

          case 'textarea':
            formElement = html`<textarea
              name=${inputName}
              class="form-control"
              id=${inputId}
              min=${ifDefined(propertySchema?.min)}
              max=${ifDefined(propertySchema?.max)}
              minlength=${ifDefined(propertySchema?.minlength)}
              maxlength=${ifDefined(propertySchema?.maxlength)}
              @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${propertyValue as string}
            ></textarea>`
            break

          case 'select':
            formElement = html`<select
              class="form-select"
              aria-label="Default select example"
              @change=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
            >
              <option ?selected=${!propertyValue}>${propertySchema?.label ?? 'Choose your option'}</option>
              ${Object.entries(propertySchema?.options ?? {})
                      ?.map(([value,name]) => 
                        html`<option ?selected=${propertyValue === value} value=${value}>${name}</option>`
                      )}
            </select>`
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
              formElement = html`<input
                type=${propertySchema.inputType}
                name=${inputName}
                class="form-control"
                id=${inputId}
              min=${ifDefined(propertySchema?.min)}
              max=${ifDefined(propertySchema?.max)}
              minlength=${ifDefined(propertySchema?.minlength)}
              maxlength=${ifDefined(propertySchema?.maxlength)}
              @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${(propertyValue as Date).toISOString()}
              />`
              break

          }
          break

      case Number:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'number'

          case 'number':
          case 'range':
            formElement = html`<input
              type=${propertySchema.inputType}
              name=${inputName}
              class="form-control"
              id=${inputId}
              min=${ifDefined(propertySchema?.min)}
              max=${ifDefined(propertySchema?.max)}
              minlength=${ifDefined(propertySchema?.minlength)}
              maxlength=${ifDefined(propertySchema?.maxlength)}
              @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${propertyValue as String}
            />`
            break

        }
        break

      case Boolean:
        switch (propertySchema.inputType) {
          case undefined:
            propertySchema.inputType = 'checkbox'

          case 'checkbox':
            formElement = html`<input
              type="checkbox"
              name=${inputName}
              class="form-check-input"
              id=${inputId}
              @input=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${propertyValue as String}
              ?checked=${propertyValue as Boolean}
            />`
            break

        }
        break

    }

    if (!formElement) {
      console.warn(`value type '${propertyValue.constructor}' is incompatible`
                 + `with field type '${propertySchema.inputType}' for form entry '${propertyName.toString()}'.`)

    }

    return html`<td class="form-group">${formElement}</td>`

  }


  _updatePropertyFromValue(event: Event, propertyName: string, rowId : number) {
    let target = event?.target as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    let value = (target && target instanceof HTMLInputElement && target.type == "checkbox") ? !!(target?.checked) : target?.value

    if(value !== undefined) {
      for(let row of this.rows) {
        if(row._id === rowId) {
          row[propertyName] = value

          this.requestUpdate('rows')

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
