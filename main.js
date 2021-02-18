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
    name: 'chat-all-lives',
    label: 'Activate chat for all lives',
    type: 'input-checkbox',
    default: false,
    descriptionHTML: 'If checked, a chat will be added to all lives.'
  })
  registerSetting({
    name: 'chat-all-non-lives',
    label: 'Activate chat for all non-lives',
    type: 'input-checkbox',
    default: false,
    descriptionHTML: 'If checked, a chat will be added to all video that are not lives.'
  })
  registerSetting({
    name: 'chat-videos-list',
    label: 'Activate chat for specific videos',
    type: 'input-textarea',
    default: '',
    descriptionHTML: 'Videos UUIDs for which we want a chat. Can be non-live videos. One per line. Don\'t add private videos, the UUIDs will be send to frontend.'
  })
  registerSetting({
    name: 'chat-uri',
    label: 'Webchat url',
    type: 'input',
    default: '',
    descriptionHTML: 'The webchat url. An iframe will be created pointing to this url. The placeholder {{VIDEO_UUID}} will be replace by the video UUID if present. Example : https://my_domain/conversejs.html?room=video_{{VIDEO_UUID}}.'
  })
  
}

async function unregister () {
  return
}

module.exports = {
  register,
  unregister
}
