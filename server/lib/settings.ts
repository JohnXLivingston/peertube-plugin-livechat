import { ensureProsodyRunning, ensureProsodyNotRunning } from './prosody/ctl'
import type { ChatType, ConverseJSTheme } from '../../shared/lib/types'

function initSettings (options: RegisterServerOptions): void {
  const { peertubeHelpers, registerSetting, settingsManager } = options

  // ********** IMPORTANT NOTES
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: '<h3>Important notes</h3>'
  })
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: `Please read the
<a href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/README.md" target="_blank">
  documentation
</a> first.`
  })
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: `Before asking for help, please use the diagnostic tool:
<a class="peertube-plugin-livechat-launch-diagnostic">Launch diagnostic</a>
(if this button is not opening a new window, please try to refresh the page).`
  })

  // ********** Chat Mode
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: '<h3>Chat mode</h3>'
  })
  registerSetting({
    name: 'chat-type',
    label: 'Chat mode',
    type: 'select',
    default: 'disabled' as ChatType,
    private: false,
    options: [
      { value: 'disabled', label: 'Disabled' },
      { value: 'builtin-prosody', label: 'Prosody server controlled by Peertube (recommended)' },
      { value: 'builtin-converse', label: 'Connect to an existing XMPP server with ConverseJS' },
      { value: 'external-uri', label: 'Use an external web chat tool' }
    ] as Array<{value: ChatType, label: string}>,
    descriptionHTML: 'Please choose the webchat mode you want to use.'
  })

  registerSetting({
    name: 'chat-type-help-disabled',
    type: 'html',
    descriptionHTML: 'The chat is disabled.',
    private: true
  })
  registerSetting({
    name: 'chat-type-help-builtin-prosody',
    type: 'html',
    label: 'Prosody server controlled by Peertube (recommended)',
    descriptionHTML: `With this mode, the Peertube server will control a local Prosody XMPP server.<br>
Note: you have to install the Prosody XMPP server.
Please read the <a
  href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/documentation/prosody.md"
  target="_blank"
>documentation</a>.`,
    private: true
  })
  registerSetting({
    name: 'chat-type-help-builtin-converse',
    type: 'html',
    label: 'Connect to an existing XMPP server with ConverseJS',
    descriptionHTML:
`With this mode, you can connect to an existing XMPP server, that allow anonymous authentication and room creation.
Please read the
<a
  href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/documentation/conversejs.md"
  target="_blank"
>documentation</a>.`,
    private: true
  })
  registerSetting({
    name: 'chat-type-help-external-uri',
    type: 'html',
    label: 'Use an external webchat',
    descriptionHTML:
`With this mode, you can use any external web chat that can be included in an iframe.
Please read the
<a
  href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/documentation/external.md"
  target="_blank"
>documentation</a>.`,
    private: true
  })

  registerSetting({
    name: 'prosody-list-rooms',
    label: 'List existing rooms',
    type: 'html',
    descriptionHTML: '<a class="peertube-plugin-livechat-prosody-list-rooms-btn">List rooms</a>',
    private: true
  })

  registerSetting({
    name: 'prosody-room-type',
    label: 'Room type',
    type: 'select',
    descriptionHTML: 'You can choose here to have separate rooms for each video, or to group them by channel.',
    private: false,
    default: 'video',
    options: [
      { value: 'video', label: 'Each video has its own webchat room' },
      { value: 'channel', label: 'Webchat rooms are grouped by channel' }
    ]
  })

  registerSetting({
    name: 'prosody-port',
    label: 'Prosody port',
    type: 'input',
    default: '52800',
    private: true,
    descriptionHTML:
`The port that will be used by the builtin Prosody server.<br>
Change it if this port is already in use on your server.<br>
You can close this port on your firewall, it will not be accessed from the outer world.`
  })

  registerSetting({
    name: 'chat-server',
    label: 'XMPP service server',
    type: 'input',
    default: '',
    descriptionHTML: 'Your XMPP server. Without any scheme. Example : peertube.im.your_domain.',
    private: true
  })
  registerSetting({
    name: 'chat-room',
    label: 'XMPP room template',
    type: 'input',
    default: '',
    descriptionHTML:
`Your XMPP room. You can use following placeholders to inject video metadata in the room name:
<ul>
  <li>{{VIDEO_UUID}} to add the video UUID.</li>
  <li>{{CHANNEL_ID}} to add the CHANNEL numerical ID.</li>
  <li>{{CHANNEL_NAME}} to add the channel name (see the Peertube's documentation for possible characters).</li>
</ul>
Without any placeholder, all videos will point to the same chat room.<br>
Example: public@room.peertube.im.your_domain<br>
Example: public_{{VIDEO_UUID}}@room.peertube.im.your_domain`,
    private: true
  })
  registerSetting({
    name: 'chat-bosh-uri',
    label: 'BOSH uri',
    type: 'input',
    default: '',
    descriptionHTML:
`URI of the external BOSH server.
Please make sure it accept cross origin request from your domain.<br>
You must at least have a BOSH or a Websocket uri.`,
    private: true
  })
  registerSetting({
    name: 'chat-ws-uri',
    label: 'Websocket uri',
    type: 'input',
    default: '',
    descriptionHTML: `
URI of the external WS server.
Please make sure it accept cross origin request from your domain.<br>
You must at least have a BOSH or a Websocket uri.`,
    private: true
  })

  registerSetting({
    name: 'chat-uri',
    label: 'Webchat url',
    type: 'input',
    default: '',
    descriptionHTML:
`Put here your webchat url. An iframe will be created pointing to this url.
You can use following placeholders to inject video metadata in the url:
<ul>
  <li>{{VIDEO_UUID}} to add the video UUID.</li>
  <li>{{CHANNEL_ID}} to add the CHANNEL numerical ID.</li>
</ul>
Example : https://my_domain/conversejs.html?room=video_{{VIDEO_UUID}}.`,
    private: false
  })

  // ********** Chat behaviour
  registerSetting({
    type: 'html',
    private: true,
    descriptionHTML: '<h3>Chat behaviour</h3>'
  })
  registerSetting({
    name: 'chat-auto-display',
    label: 'Automatically open the chat',
    descriptionHTML: 'When watching a video, the chatbox will automatically open',
    type: 'input-checkbox',
    default: true,
    private: false
  })
  registerSetting({
    name: 'chat-open-blank',
    label: 'Show the «open in new window» button',
    descriptionHTML: 'There will be a button for opening the web chat in a new window.',
    private: false,
    type: 'input-checkbox',
    default: true
  })
  registerSetting({
    name: 'chat-per-live-video',
    label: 'Users can activate the chat for their lives',
    type: 'input-checkbox',
    default: true,
    descriptionHTML: 'If checked, all live videos will have a checkbox in their properties for enabling the web chat.',
    private: false
  })
  registerSetting({
    name: 'chat-per-live-video-warning',
    type: 'html',
    private: true,
    descriptionHTML:
`<span class="peertube-plugin-livechat-warning">
  You have enabled the setting «Users can activate the chat for their lives».
  It is redundant with the «Activate chat for all lives» setting.
</span>`
  })
  registerSetting({
    name: 'chat-all-lives',
    label: 'Activate chat for all lives',
    type: 'input-checkbox',
    default: false,
    descriptionHTML: 'If checked, the chat will be enabled for all lives.',
    private: false
  })
  registerSetting({
    name: 'chat-all-non-lives',
    label: 'Activate chat for all non-lives',
    type: 'input-checkbox',
    default: false,
    descriptionHTML: 'If checked, the chat will be enable for all video that are not lives.',
    private: false
  })
  registerSetting({
    name: 'chat-videos-list',
    label: 'Activate chat for these videos',
    type: 'input-textarea',
    default: '',
    descriptionHTML:
`Videos UUIDs for which we want a web chat.
Can be non-live videos. One per line. <br />
You can add comments: everything after the # character will be stripped off, and empty lines ignored.<br />
Don't add private videos, the UUIDs will be send to frontend.`,
    private: false
  })

  registerSetting({
    name: 'chat-style',
    label: 'Webchat iframe style attribute',
    type: 'input-textarea',
    default: '',
    descriptionHTML:
`Additional styles to be added on the iframe style attribute. <br>
Example: height:400px;`,
    private: false
  })

  // ********** ConverseJS advanced settings
  registerSetting({
    name: 'converse-advanced',
    type: 'html',
    private: true,
    descriptionHTML: '<h3>ConverseJS advanced settings</h3>'
  })

  registerSetting({
    name: 'converse-theme',
    label: 'ConverseJS theme',
    type: 'select',
    default: 'peertube' as ConverseJSTheme,
    private: false,
    options: [
      { value: 'peertube', label: 'Peertube theme' },
      { value: 'default', label: 'Default ConverseJS theme' },
      { value: 'concord', label: 'ConverseJS concord theme' }
    ] as Array<{value: ConverseJSTheme, label: string}>,
    descriptionHTML: 'Please choose the converseJS theme you want to use.'
  })

  registerSetting({
    name: 'converse-autocolors',
    label: 'Automatic color detection',
    type: 'input-checkbox',
    default: true,
    private: false,
    descriptionHTML:
`Try to auto detect colors from user's current theme.<br>
When this settings is enabled, the plugin tries to auto-detect colors to apply to the chat theme.<br>
If this is not correctly working for some of your Peertube theme, you can disable this option.
You can report the bug on the official
<a href="https://github.com/JohnXLivingston/peertube-plugin-livechat/issues" target="_blank">
  issue tracker
</a>. Don't forget to specify which theme is not working.`
  })

  // ********** Built-in Prosody advanced settings
  registerSetting({
    name: 'prosody-advanced',
    type: 'html',
    private: true,
    descriptionHTML: '<h3>Prosody advanced settings</h3>'
  })

  registerSetting({
    name: 'prosody-peertube-uri',
    label: 'Peertube url for API calls',
    type: 'input',
    default: '',
    private: true,
    descriptionHTML:
`Please let this settings empty if you don't know what you are doing.<br>
In some rare case, Prosody can't call Peertube's API from its public URI.
You can use this field to customise Peertube's URI for Prosody modules (for example with «http://localhost:9000»).`
  })

  registerSetting({
    name: 'prosody-muc-log-by-default',
    label: 'Log rooms content by default',
    type: 'input-checkbox',
    default: true,
    private: true,
    descriptionHTML:
`If checked, room contents will be saved by default.
Any user that join a room will we what was written before he joins.<br>
Please note that it is always possible to enable/disable the content
archiving for a specific room, by editing its properties.
`
  })

  registerSetting({
    name: 'prosody-muc-expiration',
    label: 'Room logs expiration',
    type: 'input',
    default: '1w',
    private: true,
    descriptionHTML:
`You can choose here how long the chatting room's content is kept by the server. The value can be:
<ul>
    <li><b>60</b>: the content will be saved for 60 <b>seconds</b>. You can replace 60 by any integer value.</li>
    <li><b>1d</b>: the content will be saved for 1 <b>day</b>. You can replace 1 by any integer value.</li>
    <li><b>1w</b>: the content will be saved for 1 <b>week</b>. You can replace 1 by any integer value.</li>
    <li><b>1m</b>: the content will be saved for 1 <b>month</b>. You can replace 1 by any integer value.</li>
    <li><b>1y</b>: the content will be saved for 1 <b>year</b>. You can replace 1 by any integer value.</li>
    <li><b>never</b>: the content will never expire, and will be kept forever.</li>
</ul>`
  })

  registerSetting({
    name: 'prosody-component-port',
    label: 'The port to be use for external components',
    type: 'input',
    default: '53470',
    private: true,
    descriptionHTML:
`The port that will be used for extra components used by the builtin Prosody server.<br>
This is only used when one of these special features is used:<br>
<ul>
  <li>Demo bot: this is a hidden feature, for demonstration purposes. See the documentation for more information.</li>
</ul><br>
Change it if this port is already in use on your server.
`
  })

  registerSetting({
    name: 'prosody-c2s',
    label: 'Enable client to server connections',
    type: 'input-checkbox',
    default: false,
    private: true,
    descriptionHTML:
`Enable XMPP clients to connect to the builtin Prosody server.<br>
This option alone only allows connections from localhost clients.`
  })

  registerSetting({
    name: 'prosody-c2s-port',
    label: 'Prosody client to server port',
    type: 'input',
    default: '52822',
    private: true,
    descriptionHTML:
`The port that will be used by the c2s module of the builtin Prosody server.<br>
XMPP clients shall use this port to connect.<br>
Change it if this port is already in use on your server.<br>
Keep it close this port on your firewall for now, it will not be accessed from the outer world.`
  })

  // ********** settings changes management
  settingsManager.onSettingsChange(async (settings: any) => {
    if ('chat-type' in settings) {
      const chatType: ChatType = settings['chat-type'] ?? 'disabled'
      if (chatType === 'builtin-prosody') {
        peertubeHelpers.logger.info('Saving settings, ensuring prosody is running')
        await ensureProsodyRunning(options)
      } else {
        peertubeHelpers.logger.info('Saving settings, ensuring prosody is not running')
        await ensureProsodyNotRunning(options)
      }
    }
  })
}

export {
  initSettings
}
