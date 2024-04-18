type AcceptableAvatarMimeType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp'

interface ExternalAccountInfos {
  nickname: string
  jid: string
  password: string
  token: string
  avatar?: {
    mimetype: AcceptableAvatarMimeType
    base64: string
  }
}

export {
  ExternalAccountInfos,
  AcceptableAvatarMimeType
}
