async function getProsodyDomain (options: RegisterServerOptions): Promise<string> {
  return 'localhost'
  // FIXME: there is something that is not working with this configuration.
  // const url = options.peertubeHelpers.config.getWebserverUrl()
  // const matches = url.match(/^https?:\/\/([^:/]*)(:\d+)?(\/|$)/)
  // if (!matches) {
  //   throw new Error(`Cant get a domain name from url '${url}'`)
  // }
  // return matches[1]
}

export {
  getProsodyDomain
}
