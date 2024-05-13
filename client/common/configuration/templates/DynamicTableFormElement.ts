import { html, LitElement, TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { customElement, property, state } from 'lit/decorators.js'

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
  public header: { [key : string]: TemplateResult<1> } = {}


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


    return html`
        <div class="row mt-5">
          <div class="col-12 col-lg-4 col-xl-3">
            <h2>Bot command #1</h2>
            <p>You can configure the bot to respond to commands. A command is a message starting with a "!", like for example "!help" that calls the "help" command. For more information about how to configure this feature, please refer to the documentation by clicking on the help button.</p>
            <a href="https://livingston.frama.io/peertube-plugin-livechat/documentation/user/streamers/bot/commands/" target="_blank" title="Online help" class="orange-button peertube-button-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233">
                <path style="display:inline;opacity:.998;fill:none;fill-opacity:1;stroke:currentColor;stroke-width:.529167;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M1.48 1.583V.86c0-.171.085-.31.19-.31h.893c.106 0 .19.139.19.31v.838c0 .171-.107.219-.19.284l-.404.314c-.136.106-.219.234-.221.489l-.003.247"></path>
                <path style="display:inline;fill:currentColor;stroke-width:.235169" d="M1.67 3.429h.529v.597H1.67z"></path>
              </svg>
            </a>
          </div>
          <div class="col-12 col-lg-8 col-xl-9">
            <table class="table table-striped table-hover table-sm" id=${inputId}>
              ${this._renderHeader()}
              <tbody>
                ${repeat(this.rows, this._renderDataRow)}
              </tbody>
              <tfoot>
                <tr><td><button @click=${this._addRow}>Add Row</button></td></tr>
              </tfoot>
            </table>
          </div>
        </div>
        ${JSON.stringify(this.rows)}
    `

  }

  private _renderHeader = () => {
    return html`<thead><tr><th scope="col">#</th>${Object.values(this.header).map(this._renderHeaderCell)}<th scope="col">Remove Row</th></tr></thead>`

  }

  private _renderHeaderCell = (headerCellData: TemplateResult<1> | any) => {
    return html`<th scope="col">${headerCellData}</th>`

  }

  private _renderDataRow = (rowData: { _id: number; [key : string]: DynamicTableAcceptedTypes }) => {
    if (!rowData._id) {
      rowData._id = this._lastRowId++

    }

    const inputId = `peertube-livechat-${this.formName.replaceAll('_','-')}-row-${rowData._id}`

    return html`<tr id=${inputId}><td class="form-group">${rowData._id}</td>${repeat(Object.entries(rowData).filter(([k,v]) => k != '_id'), (data) => this.renderDataCell(data, rowData._id))}<td class="form-group"><button @click=${() => this._removeRow(rowData._id)}>Remove</button></td></tr>`

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
              min=${propertySchema?.min}
              max=${propertySchema?.max}
              minlength=${propertySchema?.minlength}
              maxlength=${propertySchema?.maxlength}
              @oninput=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${propertyValue}
            />`
            break

          case 'textarea':
            formElement = html`<textarea
              name=${inputName}
              class="form-control"
              id=${inputId}
              min=${propertySchema?.min}
              max=${propertySchema?.max}
              minlength=${propertySchema?.minlength}
              maxlength=${propertySchema?.maxlength}
              @oninput=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${propertyValue}
            ></textarea>`
            break

          case 'select':
            formElement = html`<select class="form-select" aria-label="Default select example">
              <option ?selected=${!propertyValue}>${propertySchema?.label ?? 'Choose your option'}</option>
              ${Object.entries(propertySchema?.options ?? {})?.map(([value,name]) => html`<option ?selected=${propertyValue === value} value=${value}>${name}</option>`)}
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
                min=${propertySchema?.min}
                max=${propertySchema?.max}
                minlength=${propertySchema?.minlength}
                maxlength=${propertySchema?.maxlength}
                @oninput=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
                .value=${propertyValue}
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
              min=${propertySchema?.min}
              max=${propertySchema?.max}
              minlength=${propertySchema?.minlength}
              maxlength=${propertySchema?.maxlength}
              @oninput=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              .value=${propertyValue}
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
              @oninput=${(event: InputEvent) => this._updatePropertyFromValue(event, propertyName, rowId)}
              value=""
              ?checked=${propertyValue}
            />`
            break

        }
        break

    }

    if (!formElement) {
      console.warn(`value type '${propertyValue.constructor}' is incompatible with field type '${propertySchema.inputType}' for form entry '${propertyName.toString()}'.`)

    }

    console.log

    return html`<td class="form-group">${formElement}</td>`

  }


  _updatePropertyFromValue(event: InputEvent, propertyName: string, rowId : number) {
    let target = event?.target as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)

    if(target?.value) {
      for(let row of this.rows) {
        if(row._id === rowId) {
          row[propertyName] = target?.value

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
