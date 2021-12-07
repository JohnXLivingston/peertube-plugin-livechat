interface ProsodyFilePaths {
  dir: string
  pid: string
  error: string
  log: string
  config: string
  data: string
  bots: {
    dir: string
    demobot: string
  }
  modules: string
}

export {
  ProsodyFilePaths
}
