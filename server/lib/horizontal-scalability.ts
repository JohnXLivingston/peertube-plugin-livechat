// SPDX-FileCopyrightText: 2026 Chocobozzz
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'

/*
Horizontal scalability (Peertube >= 9.0).

A Peertube instance can be served by a primary process and secondary processes.
The plugin is registered in every process, and hooks run in the process that handles the request.
But only the primary process serves plugin routes and websockets, and each process has its own data directory.

So the primary process runs the chat server (Prosody, bots, ...) and owns the data directory.
*/

type PrimaryHandler<P, R> = (payload: P) => Promise<R>

// Not in @peertube/peertube-types yet (Peertube >= 9.0)
interface HorizontalScalabilityOptions {
  registerPrimaryHandler?: (options: { name: string, handler: PrimaryHandler<any, any> }) => void
  peertubeHelpers: {
    server: {
      getProcessRole?: () => 'primary' | 'secondary'
      callPrimary?: <T>(options: { name: string, payload?: any, timeout?: number }) => Promise<T>
    }
  }
}

const readCacheTTL = 60 * 1000
const readCacheMaxEntries = 10000
const readTimeout = 10 * 1000
const readCache = new Map<string, { expires: number, value: Promise<any> }>()

function isPrimaryProcess (options: RegisterServerOptions): boolean {
  const getProcessRole = (options as unknown as HorizontalScalabilityOptions).peertubeHelpers.server.getProcessRole
  return typeof getProcessRole !== 'function' || getProcessRole() === 'primary'
}

/**
 * Registers a handler that the primary process will run
 * Must be called in every process, when registering the plugin
 * @returns a function that runs the handler on the primary process, from any process
 */
function registerPrimaryHandler<P, R> (
  options: RegisterServerOptions,
  name: string,
  handler: PrimaryHandler<P, R>
): PrimaryHandler<P, R> {
  const o = options as unknown as HorizontalScalabilityOptions
  // Peertube < 9.0: there is only one process
  if (typeof o.registerPrimaryHandler !== 'function' || typeof o.peertubeHelpers.server.callPrimary !== 'function') {
    return handler
  }

  o.registerPrimaryHandler({ name, handler })
  const callPrimary = o.peertubeHelpers.server.callPrimary
  return async (payload: P) => callPrimary<R>({ name, payload })
}

/**
 * Reads and cache data from the primary process, using a handler registered with registerPrimaryHandler
 */
async function readFromPrimary<R> (options: RegisterServerOptions, name: string, payload: any): Promise<R> {
  const key = name + '#' + JSON.stringify(payload)
  const cached = readCache.get(key)
  if (cached && cached.expires > Date.now()) { return cached.value }

  if (readCache.size >= readCacheMaxEntries) { readCache.clear() }

  const callPrimary = (options as unknown as HorizontalScalabilityOptions).peertubeHelpers.server.callPrimary
  if (!callPrimary) { throw new Error('This Peertube version can\'t call the primary process') }
  const value = callPrimary<R>({ name, payload, timeout: readTimeout })
  readCache.set(key, { expires: Date.now() + readCacheTTL, value })
  value.catch(() => readCache.delete(key))
  return value
}

export {
  isPrimaryProcess,
  registerPrimaryHandler,
  readFromPrimary
}
