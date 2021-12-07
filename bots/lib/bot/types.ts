import { EventEmitter } from 'events'

export interface XMPP extends EventEmitter {
  send: (xml: any) => any
  start: () => any
  stop: () => Promise<any>
}

export interface XMPPAddress {
  toString: () => string
}

export type XMPPStanzaType = 'message' | 'iq' | 'presence'

export interface XMPPStanza {
  attrs: any
  is: (type: XMPPStanzaType) => boolean
  toString: () => string
}

export type XMPPXmlFunction = (type: string, attrs: object, content?: any) => any
