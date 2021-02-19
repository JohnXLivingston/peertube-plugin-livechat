async function register ({
  registerHook,
  registerSetting,
  settingsManager,
  storageManager,
  videoCategoryManager,
  videoLicenceManager,
  videoLanguageManager
}) {
  registerSetting({
    name: 'chat-auto-display',
    label: 'Automatically open the chat',
    type: 'input-checkbox',
    default: false,
    private: false
  })
  registerSetting({
    name: 'chat-all-lives',
    label: 'Activate chat for all lives',
    type: 'input-checkbox',
    default: false,
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
    name: 'chat-uri',
    label: 'Webchat url',
    type: 'input',
    default: '',
    descriptionHTML: 'The webchat url. An iframe will be created pointing to this url. ' +
      'The placeholder {{VIDEO_UUID}} will be replace by the video UUID if present. ' +
      'Example : https://my_domain/conversejs.html?room=video_{{VIDEO_UUID}}.',
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
}

async function unregister () {
  return
}

module.exports = {
  register,
  unregister
}
