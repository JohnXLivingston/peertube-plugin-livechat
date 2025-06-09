// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from './livechat'
import { TokenListService } from '../services/token-list'
import { tplTokenList } from './templates/token-list'
import { Task } from '@lit/task'
import { LivechatToken } from 'shared/lib/types'

@customElement('livechat-token-list')
export class LivechatTokenListElement extends LivechatElement {
  /**
   * Indicate the mode to use:
   * * list: just display tokens
   * * select: select one token
   */
  @property({ attribute: true })
  public mode: 'select' | 'list' = 'list'

  @property({ attribute: false })
  public tokenList?: LivechatToken[]

  @property({ attribute: false })
  public currentSelectedToken?: LivechatToken

  @property({ attribute: false })
  public actionDisabled = false

  private readonly _tokenListService: TokenListService
  private readonly _asyncTaskRender: Task

  constructor () {
    super()
    this._tokenListService = new TokenListService()
    this._asyncTaskRender = this._initTask()
  }

  protected _initTask (): Task {
    return new Task(this, {
      task: async () => {
        this.tokenList = await this._tokenListService.fetchTokenList()
        if (this.mode === 'select' && this.tokenList.length) {
          this.currentSelectedToken = this.tokenList[0]
          this.dispatchEvent(new CustomEvent('update', {}))
        }
        this.actionDisabled = false
      },
      args: () => []
    })
  }

  protected override render = (): unknown => {
    return this._asyncTaskRender.render({
      pending: () => html`<livechat-spinner></livechat-spinner>`,
      error: () => html`<livechat-error></livechat-error>`,
      complete: () => tplTokenList(this)
    })
  }

  public selectToken (ev: Event, token: LivechatToken): void {
    if (!this.tokenList?.includes(token)) { return }
    this.currentSelectedToken = token
    this.requestUpdate('tokenList')
    this.dispatchEvent(new CustomEvent('update', {}))
  }

  public async revokeToken (token: LivechatToken): Promise<void> {
    const confirmMsg = await this.ptTranslate(LOC_TOKEN_ACTION_REVOKE_CONFIRM)
    // Note: we can't use peertube showModal to confirm if we already are in a modal...
    if (!window.confirm(confirmMsg)) { return }

    this.actionDisabled = true
    try {
      await this._tokenListService.revokeToken(token)
      this.tokenList = this.tokenList?.filter(t => t !== token) ?? []
      if (this.currentSelectedToken === token) {
        this.currentSelectedToken = undefined
      }
      this.requestUpdate('tokenList')
      this.dispatchEvent(new CustomEvent('update', {}))
    } catch (err: any) {
      this.logger.error(err)
      this.ptNotifier.error((err as Error).toString(), await this.ptTranslate(LOC_ERROR))
    } finally {
      this.actionDisabled = false
    }
  }

  public async createToken (): Promise<void> {
    this.actionDisabled = true
    try {
      const token = await this._tokenListService.createToken(await this.ptTranslate(LOC_TOKEN_DEFAULT_LABEL))
      this.tokenList ??= []
      this.tokenList.push(token)
      if (this.mode === 'select') {
        this.currentSelectedToken = token
      }
      this.requestUpdate('tokenList')
      this.dispatchEvent(new CustomEvent('update', {}))
    } catch (err: any) {
      this.logger.error(err)
      this.ptNotifier.error((err as Error).toString(), await this.ptTranslate(LOC_ERROR))
    } finally {
      this.actionDisabled = false
    }
  }
}
