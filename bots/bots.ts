import * as path from 'path'

let demoBotConfigFile = process.argv[2]
if (!demoBotConfigFile) {
  throw new Error('Missing parameter: the demobot configuration file path')
}
demoBotConfigFile = path.resolve(demoBotConfigFile)

// Not necessary, but just in case: perform some path checking...
function checkBotConfigFilePath (configPath: string): void {
  const parts = configPath.split(path.sep)
  if (!parts.includes('peertube-plugin-livechat')) {
    // Indeed, the path should contain the plugin name
    // (/var/www/peertube/storage/plugins/data/peertube-plugin-livechat/...)
    throw new Error('demobot configuration file path seems invalid (not in peertube-plugin-livechat folder).')
  }
  if (parts[parts.length - 1] !== 'demobot.js') {
    throw new Error('demobot configuration file path seems invalid (filename is not demobot.js).')
  }
}
checkBotConfigFilePath(demoBotConfigFile)

const demoBotConf = require(demoBotConfigFile).getConf()
if (!demoBotConf || !demoBotConf.UUIDs || !demoBotConf.UUIDs.length) {
  process.exit(0)
}

const { component, xml } = require('@xmpp/component')
const xmpp = component({
  service: demoBotConf.service,
  domain: demoBotConf.domain,
  password: demoBotConf.password
})
const roomId = `${demoBotConf.UUIDs[0] as string}@${demoBotConf.mucDomain as string}`

xmpp.on('error', (err: any) => {
  console.error(err)
})

xmpp.on('offline', () => {
  console.log('offline')
})

xmpp.on('stanza', async (stanza: any) => {
  console.log('stanza received' + (stanza?.toString ? ': ' + (stanza.toString() as string) : ''))
  // if (stanza.is('message')) {
  //   console.log('stanza was a message: ' + (stanza.toString() as string))
  // }
})

xmpp.on('online', async (address: any) => {
  console.log('Online with address: ' + JSON.stringify(address))

  const presence = xml(
    'presence',
    {
      from: address.toString(),
      to: roomId + '/DemoBot'
    },
    xml('x', {
      xmlns: 'http://jabber.org/protocol/muc'
    })
  )
  console.log('Sending presence...: ' + (presence.toString() as string))
  await xmpp.send(presence)

  setTimeout(() => {
    const message = xml(
      'message',
      { type: 'groupchat', to: roomId, from: address.toString() },
      xml('body', {}, 'Hello world')
    )
    console.log('Sending message...: ' + (message.toString() as string))
    xmpp.send(message)
  }, 1000)
})

xmpp.start().catch(console.error)
