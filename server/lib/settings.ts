import { getBaseRouterRoute } from './helpers'
import { ensureProsodyRunning, ensureProsodyNotRunning } from './prosody/ctl'

type ChatType = 'disabled' | 'builtin-prosody' | 'builtin-converse' | 'external-uri'

function initSettings (options: RegisterServerOptions): void {
  const { peertubeHelpers, registerSetting, settingsManager } = options

  registerSetting({
    name: 'chat-read-documentation',
    label: 'I have read the documentation',
    type: 'input-checkbox',
    default: false,
    private: false, // not private so that I can check when doing support
    descriptionHTML: `
Please read the
<a href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/README.md" target="_blank">
  documentation
</a>
before trying to use this plugin.<br>
There is 3 way to use it:
<ul>
  <li>
    By installing the Prosoxy XMPP server package on your server,
    and using the «builtin Prosody XMPP Server» feature.
    <a
      href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/documentation/prosody.md"
      target="_blank"
    >
      See Documentation
    </a>
  </li>
  <li>
    By using an existing XMPP server, with anonymous authentication and rooms enabled.
    <a
      href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/documentation/conversejs.md"
      target="_blank"
    >
      See Documentation
    </a>
  </li>
  <li>
    By using any external webchat that can be included in an iframe.
    <a
      href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/documentation/external.md"
      target="_blank"
    >
      See Documentation
    </a>
  </li>
</ul>
<br>
Before asking for help, please use this diagnostic tool:
<a href="${getBaseRouterRoute(options)}settings/diagnostic" target="_blank">Launch diagnostic</a>
<br>`
  })
  registerSetting({
    name: 'chat-auto-display',
    label: 'Automatically open the chat',
    type: 'input-checkbox',
    default: true,
    private: false
  })
  registerSetting({
    name: 'chat-open-blank',
    label: 'Show the «open in new window» button',
    private: false,
    type: 'input-checkbox',
    default: true
  })
  registerSetting({
    name: 'chat-only-locals',
    label: 'Chats are only available for local videos.',
    type: 'input-checkbox',
    default: true,
    private: false
  })
  registerSetting({
    name: 'chat-all-lives',
    label: 'Activate chat for all lives',
    type: 'input-checkbox',
    default: true,
    descriptionHTML: 'If checked, a chat will be added to all lives.',
    private: false
  })
  registerSetting({
    name: 'chat-all-non-lives',
    label: 'Activate chat for all non-lives',
    type: 'input-checkbox',
    default: false,
    descriptionHTML: 'If checked, a chat will be added to all video that are not lives.',
    private: false
  })
  registerSetting({
    name: 'chat-videos-list',
    label: 'Activate chat for specific videos',
    type: 'input-textarea',
    default: '',
    descriptionHTML: 'Videos UUIDs for which we want a chat. ' +
      'Can be non-live videos. One per line. <br />' +
      'You can add comments: everything after the # character will be stripped off, and empty lines ignored.<br />' +
      'Don\'t add private videos, the UUIDs will be send to frontend.',
    private: false
  })

  registerSetting({
    name: 'chat-use-prosody',
    label: 'Use builtin Prosody XMPP Server',
    type: 'input-checkbox',
    // /!\ dont auto-activate on existing settups. FIXME: how to do this?
    default: false, // TODO: set to true when we have a way to know if the plugin was previously installed.
    private: false,
    descriptionHTML: 'If checked, this will use a builtin XMPP server. This is the recommanded setup.'
  })

  registerSetting({
    name: 'prosody-port',
    label: 'Builtin prosody: Prosody port',
    type: 'input',
    default: '52800',
    private: true,
    descriptionHTML: 'The port that will be used by the builtin Prosody server.<br>' +
    'Change it if this port is already in use on your server.<br>' +
    'You can close this port on your firewall, it will not be accessed from the outer world.'
  })

  registerSetting({
    name: 'chat-use-builtin',
    label: 'Use builtin ConverseJS',
    type: 'input-checkbox',
    default: false,
    private: false,
    descriptionHTML: 'If checked, use a builtin ConverseJS iframe.<br>' +
    'You still have to configure an external XMPP service. Please see the ' +
    '<a href="https://github.com/JohnXLivingston/peertube-plugin-livechat" target="_blank">documentation<a>.<br>' +
    'If you have no running webchat service, you can follow this ' +
    // eslint-disable-next-line max-len
    '<a href="https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/documentation/tutorials/prosody.md" target="blank_">tutorial</a>.'
  })
  registerSetting({
    name: 'chat-server',
    label: 'Builtin webchat: XMPP service server',
    type: 'input',
    default: '',
    descriptionHTML: 'When using the built-in converseJS webchat:<br>' +
      'Your XMPP server. Without any scheme. Example : peertube.im.your_domain.',
    private: true
  })
  registerSetting({
    name: 'chat-room',
    label: 'Builtin webchat: XMPP room template',
    type: 'input',
    default: '',
    descriptionHTML: 'When using the built-in converseJS webchat:<br>' +
      'Your XMPP room. You can use the placeholder {{VIDEO_UUID}} to add the video UUID.' +
      'Without this placeholder, all videos will point to the same chat room.<br>' +
      'Example: public@room.peertube.im.your_domain<br>' +
      'Example: public_{{VIDEO_UUID}}@room.peertube.im.your_domain',
    private: true
  })
  registerSetting({
    name: 'chat-bosh-uri',
    label: 'Builtin webchat: BOSH uri',
    type: 'input',
    default: '',
    descriptionHTML: 'When using the built-in converseJS webchat:<br>' +
      'URI of the external BOSH server. Please make sure it accept cross origin request from your domain.<br>' +
      'You must at least have a BOSH or a Websocket uri.',
    private: true
  })
  registerSetting({
    name: 'chat-ws-uri',
    label: 'Builtin webchat: WS uri',
    type: 'input',
    default: '',
    descriptionHTML: 'When using the built-in converseJS webchat:<br>' +
      'URI of the external WS server. Please make sure it accept cross origin request from your domain.<br>' +
      'You must at least have a BOSH or a Websocket uri.',
    private: true
  })

  registerSetting({
    name: 'chat-uri',
    label: 'Webchat url',
    type: 'input',
    default: '',
    descriptionHTML: '<b>If you dont want to use the builtin ConverseJS webchat:</b><br>' +
      'Put here your webchat url. An iframe will be created pointing to this url. ' +
      'The placeholder {{VIDEO_UUID}} will be replace by the video UUID if present. ' +
      'Example : https://my_domain/conversejs.html?room=video_{{VIDEO_UUID}}.<br>' +
      'If this field is empty, it will use the builtin ConverseJS webchat.',
    private: false
  })

  registerSetting({
    name: 'chat-style',
    label: 'Webchat iframe style attribute',
    type: 'input-textarea',
    default: '',
    descriptionHTML: 'Additional styles to be added on the iframe style attribute. <br>' +
      'Example: height:400px;',
    private: false
  })

  // settings changes management

  settingsManager.onSettingsChange(async (settings: any) => {
    if ('chat-use-prosody' in settings) {
      if (settings['chat-use-prosody'] === true) {
        peertubeHelpers.logger.info('Saving settings, ensuring prosody is running')
        await ensureProsodyRunning(options)
      } else if (settings['chat-use-prosody'] === false) {
        peertubeHelpers.logger.info('Saving settings, ensuring prosody is not running')
        await ensureProsodyNotRunning(options)
      }
    }
  })
}

export {
  ChatType,
  initSettings
}
