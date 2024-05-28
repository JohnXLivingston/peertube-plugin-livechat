// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { CustomEmojiDefinition, ChannelEmojis } from 'shared/lib/types'

/**
 * livechat emojis ConverseJS plugin:
 * this plugin handles custom channel emojis (if enabled).
 */
export const livechatEmojisPlugin = {
  dependencies: ['converse-emoji'],
  initialize: function (this: any) {
    const _converse = this._converse

    _converse.api.settings.extend({
      livechat_custom_emojis_url: false
    })

    _converse.api.listen.on('loadEmojis', async (_context: Object, json: any) => {
      const url = _converse.api.settings.get('livechat_custom_emojis_url')
      if (!url) {
        return json
      }

      let customs
      try {
        customs = await loadCustomEmojis(url)
      } catch (err) {
        console.error(err)
      }
      if (customs === undefined || !customs?.length) {
        return json
      }

      // We will put default emojis at the end
      const defaultCustom = json.custom ?? {}
      json.custom = {}

      let defaultDef: CustomEmojiDefinition | undefined

      for (const def of customs) {
        json.custom[def.sn] = {
          sn: def.sn,
          url: def.url,
          c: 'custom'
        }
        if (def.isCategoryEmoji) {
          defaultDef ??= def
        }
      }

      for (const key in defaultCustom) {
        if (key in json.custom) {
          // Was overriden by the backend, skipping.
          continue
        }
        json.custom[key] = defaultCustom[key]
      }

      // And if there was a default definition, using it for the custom cat icon.
      if (defaultDef) {
        const cat = _converse.api.settings.get('emoji_categories')
        cat.custom = defaultDef.sn
      }
      return json
    })
  }
}

async function loadCustomEmojis (url: string): Promise<CustomEmojiDefinition[]> {
  const response = await fetch(
    url,
    {
      method: 'GET',
      // Note: no need to be authenticated here, this is a public API
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Can\'t get channel emojis options.')
  }

  const customEmojis = (await response.json()) as ChannelEmojis
  return customEmojis.customEmojis
}
