import { resolve } from 'path'
import { existsSync, promises as fsPromises } from 'fs'

const locContent: Map<string, string> = new Map<string, string>()

/**
 * Currently, the Peertube plugin system assumes that settings strings
 * are localized in english, and will be translated on front-end.
 * This system make it hard to have complex strings (with html, newlines, ...).
 * See https://github.com/Chocobozzz/PeerTube/issues/4523
 *
 * Waiting for a better solution, we implemented a custom solution:
 * - We are using keys to identify strings
 * - the `loc` function gets the english segment for the key
 * - the build-languages.js script builds all needed files.
 * @param key The key to translate
 */
function loc (key: string): string {
  return locContent.get(key) ?? key
}

async function loadLoc (): Promise<void> {
  const filePath = resolve(__dirname, '..', '..', 'languages', 'en.reference.json')
  if (!existsSync(filePath)) {
    throw new Error(`File ${filePath} missing, can't load plugin loc strings`)
  }
  const content = await fsPromises.readFile(filePath, 'utf8')
  const json = JSON.parse(content ?? '{}')
  if (typeof json !== 'object') {
    throw new Error(`File ${filePath} invalid, can't load plugin loc strings`)
  }
  for (const k in json) {
    const v = json[k]
    if (typeof v === 'string') {
      locContent.set(k, v)
    }
  }
}

export {
  loc,
  loadLoc
}
