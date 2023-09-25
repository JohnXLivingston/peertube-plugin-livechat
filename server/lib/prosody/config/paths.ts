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
  avatarsFiles: string[]
  botAvatars: string
  botAvatarsFiles: string[]
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
