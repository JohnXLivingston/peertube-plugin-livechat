import { ensureProsodyRunning, ensureProsodyNotRunning } from './prosody/ctl'
import type { ChatType } from '../../shared/lib/types'

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
<a class="peertube-plugin-livechat-launch-diagnostic">Launch diagnostic</a>`
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
`Your XMPP room. You can use the placeholder {{VIDEO_UUID}} to add the video UUID.
Without this placeholder, all videos will point to the same chat room.<br>
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
The placeholder {{VIDEO_UUID}} will be replace by the video UUID if present.
Example : https://my_domain/conversejs.html?room=video_{{VIDEO_UUID}}.<br>
If this field is empty, it will use the builtin ConverseJS webchat.`,
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
    name: 'chat-only-locals',
    label: 'Chats are only available for local videos.',
    descriptionHTML: 'If you uncheck this settings, the chat will also be enabled on remote videos.',
    type: 'input-checkbox',
    default: true,
    private: false
  })
  registerSetting({
    name: 'chat-only-locals-warning',
    type: 'html',
    private: true,
    descriptionHTML:
`<span class="peertube-plugin-livechat-warning">
  The plugin is not compatible with video federation yet.
  The webchat will only be accessible for people watching videos on your server.
</span>`
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
