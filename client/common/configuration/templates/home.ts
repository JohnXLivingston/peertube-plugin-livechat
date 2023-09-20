import type { RegisterClientOptions } from '@peertube/peertube-types/client'
// Must use require for mustache, import seems buggy.
const Mustache = require('mustache')

/**
 * Renders the livechat configuration setup home page.
 * @param registerClientOptions Peertube client options
 * @returns The page content
 */
async function renderConfigurationHome (registerClientOptions: RegisterClientOptions): Promise<string> {
  const { peertubeHelpers } = registerClientOptions

  try {
    // Getting the current username in localStorage. Don't know any cleaner way to do.
    const username = window.localStorage.getItem('username')
    if (!username) {
      throw new Error('Can\'t get the current username.')
    }

    // FIXME: if more than 100 channels, loop (or add a pagination)
    const channels = await (await fetch(
      '/api/v1/accounts/' + encodeURIComponent(username) + '/video-channels?start=0&count=100&sort=name',
      {
        method: 'GET',
        headers: peertubeHelpers.getAuthHeader()
      }
    )).json()
    if (!channels || !('data' in channels) || !Array.isArray(channels.data)) {
      throw new Error('Can\'t get the channel list.')
    }

    for (const channel of channels.data) {
      channel.livechatConfigurationUri = '/p/livechat/configuration/channel?channelId=' + encodeURIComponent(channel.id)
    }

    const view = {
      title: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_TITLE),
      description: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_DESC),
      please_select: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_PLEASE_SELECT),
      channels: channels.data
    }

    return Mustache.render(`
      <div class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-home">
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        <p>{{please_select}}</p>
        <ul class="peertube-plugin-livechat-configuration-home-channels">
        {{#channels}}
          <li>
            <a href="{{livechatConfigurationUri}}">
              {{#avatar}}
                <img class="avatar channel" src="{{path}}">
              {{/avatar}}
              {{^avatar}}
                <div class="avatar channel initial gray"></div>
              {{/avatar}}
            </a>
            <div class="peertube-plugin-livechat-configuration-home-info">
              <a href="{{livechatConfigurationUri}}">
                <div>{{displayName}}</div>
                <div>{{name}}</div>
              </a>
            </div>
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
  renderConfigurationHome
}
