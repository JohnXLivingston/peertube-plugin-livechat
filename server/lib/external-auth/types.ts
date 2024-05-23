// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

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
