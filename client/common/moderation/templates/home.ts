import type { RegisterClientOptions } from '@peertube/peertube-types/client'
// Must use require for mustache, import seems buggy.
const Mustache = require('mustache')

async function renderModerationHome (registerClientOptions: RegisterClientOptions): Promise<string> {
  const { peertubeHelpers } = registerClientOptions

  try {
    // Getting the current username in localStorage. Don't know any cleaner way to do.
    const username = window.localStorage.getItem('username')
    if (!username) {
      throw new Error('Can\'t get the current username.')
    }

    const channels = await (await fetch(
      '/api/v1/accounts/' + encodeURIComponent(username) + '/video-channels?start=0&count=100&sort=-createdAt',
      {
        method: 'GET',
        headers: peertubeHelpers.getAuthHeader()
      }
    )).json()
    if (!channels || !('data' in channels) || !Array.isArray(channels.data)) {
      throw new Error('Can\'t get the channel list.')
    }

    for (const channel of channels.data) {
      channel.livechatModerationUri = '/p/livechat/moderation/channel?id=' + encodeURIComponent(channel.id)
    }

    const view = {
      title: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_TITLE),
      description: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_DESC),
      please_select: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_PLEASE_SELECT),
      channels: channels.data
    }

    // TODO: remove this line
    console.log('Rendering the moderation home with view:', view)

    return Mustache.render(`
      <div class="margin-content">
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        <h2>{{please_select}}</h2>
        <ul>
        {{#channels}}
          <li>
            <a href="{{livechatModerationUri}}">
              {{displayName}}
            </a>
          </li>
        {{/channels}}
        </ul>
      </div>
    `, view) as string
  } catch (err: any) {
    peertubeHelpers.notifier.error(err.toString())
    return ''
  }
}

export {
  renderModerationHome
}
