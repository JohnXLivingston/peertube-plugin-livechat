// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

interface ProsodyFilePaths {
  dir: string
  pid: string
  error: string
  log: string
  config: string
  data: string
  certs?: string
  certsDirIsCustom: boolean
  modules: string
  avatars: string
  exec?: string
  execArgs: string[]
  execCtl?: string
  execCtlArgs: string[]
  appImageToExtract?: string
  appImageExtractPath: string
}

export {
  ProsodyFilePaths
}
