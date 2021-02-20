const path = require('path')
const fs = require('fs').promises

async function register ({
  _registerHook,
  registerSetting,
  settingsManager,
  _storageManager,
  _videoCategoryManager,
  _videoLicenceManager,
  _videoLanguageManager,
  getRouter,
  peertubeHelpers
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
    name: 'chat-use-builtin',
    label: 'Use builtin ConverseJS',
    type: 'input-checkbox',
    default: true,
    private: false,
    descriptionHTML: 'If checked, use a builtin ConverseJS iframe.<br>' +
    'You still have to configure an external XMPP service. Please see the documentation.'
  })
  registerSetting({
    name: 'chat-room-server',
    label: 'Builtin webchat: XMPP room service server',
    type: 'input',
    default: '',
    descriptionHTML: 'When using the built-in converseJS webchat:<br>' +
      'Your XMPP room server. Example : room.peertube.im.your_domain.',
    private: true
  })
  registerSetting({
    name: 'chat-bosh-uri',
    label: 'Builtin webchat: BOSH uri',
    type: 'input',
    default: '',
    descriptionHTML: 'When using the built-in converseJS webchat:<br>' +
      'URI of the external BOSH server. Please make sure it accept cross origin request from your domain.',
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

  const converseJSIndex = await fs.readFile(path.resolve(__dirname, './conversejs/index.html'))

  const router = getRouter()
  router.get('/ping', (req, res) => res.json({ message: 'pong' }))
  router.get('/webchat', async (req, res, next) => {
    try {
      const settings = await settingsManager.getSettings([
        'chat-use-builtin', 'chat-room-server', 'chat-bosh-uri'
      ])

      if (!settings['chat-use-builtin']) {
        throw new Error('Builtin chat disabled.')
      }
      if (!settings['chat-room-server']) {
        throw new Error('Missing chat-room-server settings.')
      }

      // FIXME: with Peertube 3.0.1 the following method is not available...
      // When loadByIdOrUUID is available, change the entry point to
      // be /webchat/:videoId
      // const id = req.param('videoId')
      // const video = await peertubeHelpers.videos.loadByIdOrUUID(id)
      let url = req.query.url
      if (!url) {
        throw new Error('Missing url parameter)')
      }
      let video = await peertubeHelpers.videos.loadByUrl(url)
      if (!video) {
        // FIXME: remove this when loadByIdOrUUID will be available...
        // This is a dirty Hack for dev environnements...
        url = url.replace(/^https:/, 'http:')
        video = await peertubeHelpers.videos.loadByUrl(url)
      }
      if (!video) {
        throw new Error('Video not found')
      }

      let page = '' + converseJSIndex
      // FIXME: Peertube should provide the static folder path. For now:
      const staticRelative = '../static/conversejs'
      page = page.replace(/{{BASE_STATIC_URL}}/g, staticRelative)
      page = page.replace(/{{ROOM}}/g, 'public_' + video.uuid + '@' + settings['chat-room-server'])
      page = page.replace(/{{BOSH_SERVICE_URL}}/g, settings['chat-bosh-uri'])

      res.status(200)
      res.send(page)
    } catch (error) {
      return next(error)
    }
  })
}

async function unregister () {
}

module.exports = {
  register,
  unregister
}
