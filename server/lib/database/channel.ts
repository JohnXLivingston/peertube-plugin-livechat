async function getChannelNameById (options: RegisterServerOptions, channelId: number): Promise<string | null> {
  if (!channelId) {
    throw new Error('Missing channelId')
  }
  if (!Number.isInteger(channelId)) {
    throw new Error('Invalid channelId: not an integer')
  }
  const [results] = await options.peertubeHelpers.database.query(
    'SELECT "actor"."preferredUsername"' +
    ' FROM "videoChannel"' +
    ' RIGHT JOIN "actor" ON "actor"."id" = "videoChannel"."actorId"' +
    ' WHERE "videoChannel"."id" = ' + channelId.toString()
  )
  if (!Array.isArray(results)) {
    throw new Error('getChannelNameById: query result is not an array.')
  }
  if (!results[0]) {
    options.peertubeHelpers.logger.debug(`getChannelNameById: channel ${channelId} not found.`)
    return null
  }
  return (results[0].preferredUsername ?? null) as string
}

export {
  getChannelNameById
}
