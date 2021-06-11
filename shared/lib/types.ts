type ChatType = 'disabled' | 'builtin-prosody' | 'builtin-converse' | 'external-uri'

interface ProsodyListRoomsResultError {
  ok: false
  error: string
}

interface ProsodyListRoomsResultSuccess {
  ok: true
  rooms: Array<{
    name: string
    href: string
  }>
}

type ProsodyListRoomsResult = ProsodyListRoomsResultError | ProsodyListRoomsResultSuccess

export {
  ChatType,
  ProsodyListRoomsResult
}
