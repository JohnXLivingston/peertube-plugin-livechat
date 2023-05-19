// import type { RegisterServerOptions } from '@peertube/peertube-types'
// import type { IncomingMessage } from 'http'
// import type { Duplex } from 'stream'
// import { WebSocketServer, WebSocket } from 'ws'
// import { Socket } from 'net'

// FIXME: this method should not be necessary anymore, it was a proof of concept.

// interface ProxyLogger {
//   debug: (s: string) => void
//   info: (s: string) => void
//   error: (s: string) => void
// }

// let xmppWsProxyServer: XMPPWsProxyServer | undefined
// class XMPPWsProxyServer {
//   private readonly logger: ProxyLogger
//   private readonly options: RegisterServerOptions
//   private readonly wsProxyServer: WebSocketServer
//   private prosodyPort: number | undefined
//   private readonly connections: Map<WebSocket, Socket> = new Map<WebSocket, Socket>()

//   constructor (options: RegisterServerOptions) {
//     const logger = options.peertubeHelpers.logger
//     this.logger = {
//       debug: s => logger.debug('XMPP-WS-PROXY: ' + s),
//       info: s => logger.info('XMPP-WS-PROXY: ' + s),
//       error: s => logger.error('XMPP-WS-PROXY: ' + s)
//     }
//     this.options = options

//     this.wsProxyServer = new WebSocketServer({ noServer: true, perMessageDeflate: false })
//   }

//   public handleUpgrade (request: IncomingMessage, incomingSocket: Duplex, head: Buffer): void {
//     this.wsProxyServer.handleUpgrade(request, incomingSocket, head, ws => {
//       this.handleUpgradeCallback(ws).then(() => {}, () => {})
//     })
//   }

//   public async handleUpgradeCallback (ws: WebSocket): Promise<void> {
//     this.logger.debug('Opening a Websocket Proxy connection')

//     const port = await this.getProsodyPort()
//     if (!port) {
//       this.logger.error('No port configured for Prosody, closing the websocket stream')
//       ws.close() // FIXME: add a code and error message
//       return
//     }

//     // Opening a tcp connection to local Prosody:
//     const prosodySocket = new Socket()
//     this.connections.set(ws, prosodySocket)
//     prosodySocket.connect(port, 'localhost', () => {
//       // TODO: write the remote IP in the header line.
//       prosodySocket.write('LIVECHAT-WS-PROXY\n')
//     })
//     prosodySocket.on('close', () => {
//       ws.close()
//     })
//     prosodySocket.on('data', (data) => {
//       ws.send(data)
//     })

//     ws.on('message', (data) => {
//       // TODO: remove this log
//       this.logger.debug('Receiving raw data')
//       if (Array.isArray(data)) {
//         data.forEach(chunck => {
//           prosodySocket.write(chunck)
//         })
//       } else if (data instanceof ArrayBuffer) {
//         prosodySocket.write(Buffer.from(data))
//       } else {
//         prosodySocket.write(data)
//       }
//     })
//     ws.on('close', () => {
//       this.logger.debug('Websocket connection is closed, closing socket')
//       prosodySocket.end()
//     })
//   }

//   private async getProsodyPort (): Promise<number> {
//     if (this.prosodyPort) {
//       return this.prosodyPort
//     }
//     const port = await this.options.settingsManager.getSetting('prosody-port') as string
//     this.prosodyPort = parseInt(port)
//     return this.prosodyPort
//   }

//   private async closeConnections (): Promise<void> {
//     this.logger.debug('Closing XMPPWsProxyServer connections...')
//     this.connections.forEach((socket, _ws) => {
//       socket.end()
//       // ws.terminate() // not necessary, socket close event should be called
//     })
//     // FIXME: wait for all connections to be closed...
//   }

//   static singleton (options: RegisterServerOptions): XMPPWsProxyServer {
//     if (!xmppWsProxyServer) {
//       xmppWsProxyServer = new XMPPWsProxyServer(options)
//     }
//     return xmppWsProxyServer
//   }

//   static async destroySingleton (): Promise<void> {
//     if (!xmppWsProxyServer) { return }
//     const server = xmppWsProxyServer
//     xmppWsProxyServer = undefined
//     await server.closeConnections()
//   }
// }

// export {
//   XMPPWsProxyServer
// }
