import type { Element } from '@xmpp/xml'

export type XMPPStanzaType = 'message' | 'iq' | 'presence'

export interface XMPPStanza extends Element {
  name: XMPPStanzaType
}
