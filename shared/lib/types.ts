type ChatType = 'disabled' | 'builtin-prosody' | 'builtin-converse' | 'external-uri'

interface ProsodyListRoomsResultError {
  ok: false
  error: string
}

interface ProsodyListRoomsResultSuccess {
  ok: true
  rooms: Array<{
    jid: string
    localpart: string
    name: string
    lang: string
    description: string
  }>
}

type ProsodyListRoomsResult = ProsodyListRoomsResultError | ProsodyListRoomsResultSuccess

export {
  ChatType,
  ProsodyListRoomsResult
}
