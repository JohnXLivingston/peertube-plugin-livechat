interface Affiliations { [jid: string]: 'outcast' | 'none' | 'member' | 'admin' | 'owner' }

async function getVideoAffiliations (options: RegisterServerOptions, _video: MVideoThumbnail): Promise<Affiliations> {
  const peertubeHelpers = options.peertubeHelpers
  // Get all admins and moderators
  const [results] = await peertubeHelpers.database.query(
    'SELECT "username" FROM "user"' +
    ' WHERE "user"."role" IN (0, 1)'
  )
  if (!Array.isArray(results)) {
    throw new Error('getVideoAffiliations: query result is not an array.')
  }
  const r: Affiliations = {}
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (typeof result !== 'object') {
      throw new Error('getVideoAffiliations: query result is not an object')
    }
    if (!('username' in result)) {
      throw new Error('getVideoAffiliations: no username field in result')
    }
    const jid = (result.username as string) + '@localhost'
    r[jid] = 'owner'
  }

  // TODO: add a 'admin' affiliation for video owner

  return r
}

export {
  Affiliations,
  getVideoAffiliations
}
