// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { LivechatElement } from './livechat'
import { ifDefined } from 'lit/directives/if-defined.js'
import { classMap } from 'lit/directives/class-map.js'
import { animate, fadeOut, fadeIn } from '@lit-labs/motion'
import { repeat } from 'lit/directives/repeat.js'

enum TagsInputSelectionMode {
  Single,
  Consecutive,
  Additive
}

@customElement('livechat-tags-input')
export class TagsInputElement extends LivechatElement {
  @property({ attribute: false })
  public type?: string = 'text'

  @property({ attribute: false })
  public name?: string

  @property({ attribute: false })
  public min?: string

  @property({ attribute: false })
  public max?: string

  @property({ attribute: false })
  public maxlength?: string

  @property({ attribute: false })
  public minlength?: string

  @state()
  private _inputValue?: string = ''

  @property({ attribute: false })
  public inputPlaceholder?: string = ''

  @property({ attribute: false })
  public datalist?: Array<string | number>

  @property({ reflect: true })
  public value: Array<string | number> = []

  @state()
  private _searchedTagsIndex: number[] = []

  @state()
  private readonly _isPressingKey: string[] = []

  @property({ attribute: false })
  public separators?: string[] = ['\n']

  @property({ attribute: false })
  public animDuration: number = 200

  private _selectionMode: TagsInputSelectionMode = TagsInputSelectionMode.Single

  @state()
  private _selectedTags: number[] = []

  @state()
  private _selectionToBeRemoved: boolean = false

  private _currentTag?: number = undefined
  private _firstConsecutiveSelectedTag?: number = undefined

  protected override render = (): unknown => {
    return html`<ul
          id="tags"
          class=${classMap({
            empty: !this.value.length,
            unfocused: this._searchedTagsIndex.length
          })}
          tabindex="0"
          @blur=${() => this._handleTagsListBlur()}
          @keydown=${(e: KeyboardEvent) => this._handleTagsListKeyDown(e, [...this.value.keys()])}
          @keyup=${(e: KeyboardEvent) => this._handleKeyUp(e)}>
          ${repeat(this.value, tag => tag,
            (tag, index) => html`<li key=${index}
              class="tag ${classMap({
                selected: !this._selectionToBeRemoved && this._selectedTags.includes(index),
                'to-be-removed': this._selectionToBeRemoved && this._selectedTags.includes(index)
              })}"
              title=${tag}
              ${animate({
                keyframeOptions: {
                  duration: this.animDuration,
                  fill: 'both'
                },
                in: fadeIn,
                out: fadeOut
              })}>
              <span class="tag-name"
                    @click=${() => this._handleSelectTag(index)}>${tag}</span>
              <span class="tag-close"
                    @click=${() => this._handleDeleteTag(index)}></span>
            </li>`
          )}
        </ul>
        <ul
          id="tags-searched"
          class=${classMap({ empty: !this._searchedTagsIndex.length })}
          tabindex="0"
          @blur=${() => this._handleTagsListBlur()}
          @keydown=${(e: KeyboardEvent) => this._handleTagsListKeyDown(e, this._searchedTagsIndex)}
          @keyup=${(e: KeyboardEvent) => this._handleKeyUp(e)}>
          ${repeat(this._searchedTagsIndex, index => index,
            (index) => html`<li key=${index}
              class="tag-searched ${classMap({
                selected: !this._selectionToBeRemoved && this._selectedTags.includes(index),
                'to-be-removed': this._selectionToBeRemoved && this._selectedTags.includes(index)
              })}"
              title=${this.value[index]}
              ${animate({
                keyframeOptions: {
                  duration: this.animDuration,
                  fill: 'both'
                },
                in: fadeIn,
                out: fadeOut
              })}>
              <span class="tag-name"
                    @click=${() => this._handleSelectTag(index)}>${this.value[index]}</span>
              <span class="tag-close"
                    @click=${() => this._handleDeleteTag(index)}>
              </span>
            </li>`
          )}
        </ul>
        <input
        type=${ifDefined(this.type)}
        name=${ifDefined(this.name)}
        id="${this.id ?? 'tags-input'}-input"
        list="${this.id ?? 'tags-input'}-input-datalist"
        min=${ifDefined(this.min)}
        max=${ifDefined(this.max)}
        minlength=${ifDefined(this.minlength)}
        maxlength=${ifDefined(this.maxlength)}
        @paste=${(e: ClipboardEvent) => this._handlePaste(e)}
        @keydown=${(e: KeyboardEvent) => this._handleInputKeyDown(e)}
        @keyup=${(e: KeyboardEvent) => this._handleKeyUp(e)}
        @input=${(e: InputEvent) => this._handleInputEvent(e)}
        @change=${(e: Event) => e.stopPropagation()}
        .value=${this._inputValue}
        .placeholder=${this.inputPlaceholder} />
        ${(this.datalist)
          ? html`<datalist id="${this.id ?? 'tags-input'}-datalist">
            ${(this.datalist ?? []).map((value) => html`<option value=${value}>`)}
          </datalist>`
          : ''
        }`
  }

  private readonly _handleSelectTag = (index?: number): boolean => {
    if (!index) {
      this._selectedTags = []
      this._currentTag = undefined
      this._firstConsecutiveSelectedTag = undefined

      return true
    }

    switch (this._selectionMode) {
      case TagsInputSelectionMode.Single:
        this._selectedTags = [index]
        break
      case TagsInputSelectionMode.Additive:
        if (!this._selectedTags.includes(index)) {
          this._selectedTags.push(index)
        }
        break
      case TagsInputSelectionMode.Consecutive:
        if (!this._firstConsecutiveSelectedTag) {
          this._firstConsecutiveSelectedTag = index
        }
        if (!this._selectedTags.includes(index)) {
          this._selectedTags.push(index)
        } else {
          this._selectedTags = this._selectedTags.filter(i => i === index)
        }
        break
    }

    this.renderRoot.querySelectorAll(`li [key="${index}"]`)
      .forEach(el => el.scrollIntoView({
        behavior: 'smooth'
      }))

    return true
  }

  private readonly _handlePaste = (e: ClipboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      e.preventDefault()

      const newValue = `${
          target?.value?.slice(0, target.selectionStart ?? target?.value?.length ?? 0) ?? ''
        }${e.clipboardData?.getData('text/plain') ?? ''}${
          target?.value?.slice(target.selectionEnd ?? target?.value?.length ?? 0) ?? ''
        }`

      let values = newValue.split(new RegExp(`(?:${this.separators
        ?.map((c: string) => c.replace(/^[.\\+*?[^\]$(){}=!<>|:-]$/, '\\'))
        .join('|') ?? ''})+`))

      values = values.map(v => v.trim()).filter(v => v !== '')

      if (values.length > 0) {
        // Keep value in input if value is unique and does not end with a separator
        if (values.length === 1 &&
            !this.separators?.some(separator => newValue.match(/\s+$/m)?.[0]?.includes(separator))) {
          target.value = values.pop() ?? ''
        } else {
          target.value = ''
        }
        // no duplicate
        this.value = [...new Set([...this.value, ...values])]

        this._inputValue = target.value

        this._updateSearchedTags() // is that necessary ?

        this.requestUpdate('value')
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }))

        return false
      }
    }
    return true
  }

  private readonly _handleTagsListBlur = (): boolean => {
    this._handleSelectTag(undefined)
    return true
  }

  private readonly _handleTagsListKeyDown = (e: KeyboardEvent, valueIndexes: number[]): boolean => {
    const target = e?.target as HTMLInputElement
    let selectedTag = (this._currentTag) ? valueIndexes.indexOf(this._currentTag) : undefined

    if (target) {
      switch (e.key) {
        case 'ArrowLeft':
          selectedTag = selectedTag ? selectedTag-- : this.value.length - 1

          this._handleSelectTag(selectedTag)
          this._currentTag = selectedTag
          break
        case 'ArrowRight':
          selectedTag = selectedTag ? selectedTag++ : 0

          this._handleSelectTag(selectedTag)
          this._currentTag = selectedTag
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)

            if (!e.isComposing) {
              this._selectionMode = TagsInputSelectionMode.Consecutive
              this._firstConsecutiveSelectedTag = selectedTag
            }
          }
          break
        case 'ControlLeft':
        case 'ControlRight':
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)

            if (!e.isComposing) {
              this._selectionMode = TagsInputSelectionMode.Additive
            }
          }
          break
        case 'Enter':
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)
          }

          this._handleSelectTag(undefined)
          break
        case 'Backspace':
        case 'Delete':
          // Avoid bounce delete
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)

            if (this._selectionToBeRemoved) {
              this._selectionToBeRemoved = false
              this._handleDeleteTags(this._selectedTags)
              this._handleSelectTag(undefined)
            } else {
              this._selectionToBeRemoved = true
            }
          }
          break
        default:
          break
      }
    }

    return true
  }

  private readonly _handleInputKeyDown = (e: KeyboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      switch (e.key) {
        case 'Tab':
          this._handleNewTag(e)
          break
        case 'Enter':
          // Avoid bounce
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)
          } else {
            e.preventDefault()
            return false
          }

          if (target.value === '') {
            if (!this._isPressingKey.includes(e.key)) {
              this._isPressingKey.push(e.key)
            }
            return true
          } else {
            e.preventDefault()
            this._handleNewTag(e)
            return false
          }
          // break useless as all cases returns here
        case 'Backspace':
          // Avoid bounce delete
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)

            if ((target.selectionStart === target.selectionEnd) &&
                 target.selectionStart === 0) {
              const indexToRemove = (this._searchedTagsIndex.length)
                ? this._searchedTagsIndex.slice(-1)[0]
                : (this.value.length - 1)
              if (this._selectionToBeRemoved) {
                this._selectionToBeRemoved = false
                this._handleDeleteTag(indexToRemove)
              } else {
                this._selectedTags = [indexToRemove]
                this._selectionToBeRemoved = true
                this.renderRoot.querySelectorAll(`li [key="${indexToRemove}"]`)
                  .forEach(el => el.scrollIntoView({
                    behavior: 'smooth'
                  }))
              }
            }
          }
          break
        case 'Delete':
          // Avoid bounce delete
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)

            if ((target.selectionStart === target.selectionEnd) &&
                 target.selectionStart === target.value.length) {
              const indexToRemove = (this._searchedTagsIndex.length)
                ? this._searchedTagsIndex[0]
                : 0
              if (this._selectionToBeRemoved) {
                this._selectionToBeRemoved = false
                this._handleDeleteTag(indexToRemove)
              } else {
                this._selectedTags = [indexToRemove]
                this._selectionToBeRemoved = true
                this.renderRoot.querySelectorAll(`li [key="${indexToRemove}"]`)
                  .forEach(el => el.scrollIntoView({
                    behavior: 'smooth'
                  }))
              }
            }
          }
          break
        default:
          break
      }
    }

    return true
  }

  private readonly _handleKeyUp = (e: KeyboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      switch (e.key) {
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'ControlLeft':
        case 'ControlRight':
          this._selectionMode = TagsInputSelectionMode.Single
        // eslint-disable-next-line no-fallthrough
        case 'Enter':
        case 'Backspace':
        case 'Delete':
          if (this._isPressingKey.includes(e.key)) {
            this._isPressingKey.splice(this._isPressingKey.indexOf(e.key))
          }
          break
        default:
          break
      }
    }

    return true
  }

  private readonly _handleInputEvent = (e: InputEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      this._inputValue = target.value
      if (this.separators?.includes(target.value.slice(-1))) {
        e.preventDefault()
        target.value = target.value.slice(0, -1)
        this._handleNewTag(e)
      } else {
        this._updateSearchedTags()
      }
    }

    return true
  }

  private readonly _handleNewTag = (e: Event): void => {
    const target = e?.target as HTMLInputElement

    if (target) {
      this._addTag(target.value)
      target.value = ''
      this._inputValue = ''

      this._updateSearchedTags()
    }
  }

  private readonly _handleDeleteTags = (indexes: number[]): void => {
    this._removeTags(indexes)

    this._updateSearchedTags()
  }

  private readonly _handleDeleteTag = (index: number): void => {
    this._removeTags([index])

    this._updateSearchedTags()
  }

  private readonly _updateSearchedTags = (): void => {
    const searchedTags = []
    const inputValue = this._inputValue?.trim()

    if (inputValue?.length) {
      for (const [i, tag] of this.value.entries()) {
        if ((tag as string).toLowerCase().includes(inputValue.toLowerCase())) {
          searchedTags.push(i)
        }
      }
    }

    this._searchedTagsIndex = searchedTags
    this.requestUpdate('_searchedTagsIndex')
  }

  private readonly _addTag = (value: string | undefined): void => {
    if (value === undefined) {
      console.warn('Could not add tag : Target or value was undefined')
      return
    }

    value = value.trim()

    if (value) {
      this.value.push(value)
      // no duplicate
      this.value = [...new Set(this.value)]

      this.requestUpdate('value')
      this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
    }
  }

  private readonly _removeTags = (indexes: number[]): void => {
    indexes.filter(index => {
      const valid = index > 0 && index < this.value.length
      if (!valid) {
        console.warn(`Could not remove tag at index ${index} : index out of range`)
      }

      return valid
    })

    this.value = this.value.filter((_, index) => !indexes.includes(index))

    this.requestUpdate('value')
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
  }
}
