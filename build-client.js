// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

const path = require('path')
const esbuild = require('esbuild')
const fs = require('fs')

const packagejson = require('./package.json')
const sourcemap = process.env.NODE_ENV === 'dev' ?  'inline' : false

const clientFiles = [
  // Client files list, without the file extension:
  'common-client-plugin',
  'videowatch-client-plugin',
  'admin-plugin-client-plugin'
]

function loadLocs() {
  // Loading english strings, so we can inject them as constants.
  const refFile = path.resolve(__dirname, 'dist', 'languages', 'en.reference.json')
  if (!fs.existsSync(refFile)) {
    throw new Error('Missing english reference file, please run "npm run build:languages" before building the client')
  }
  const english = require(refFile)

  // Reading client/@types/global.d.ts, to have a list of needed localized strings.
  const r = {}
  const globalFile = path.resolve(__dirname, 'client', '@types', 'global.d.ts')
  const globalFileContent = '' + fs.readFileSync(globalFile)
  const matches = globalFileContent.matchAll(/^declare const LOC_(\w+)\b/gm)
  for (const match of matches) {
    const key = match[1].toLowerCase()
    if (!(key in english) || (typeof english[key] !== 'string')) {
      throw new Error('Missing english string key=' + key)
    }
    r['LOC_' + match[1]] = JSON.stringify(english[key])
  }
  return r
}

const define = Object.assign({
  PLUGIN_CHAT_PACKAGE_NAME: JSON.stringify(packagejson.name),
  PLUGIN_CHAT_SHORT_NAME: JSON.stringify(packagejson.name.replace(/^peertube-plugin-/, ''))
}, loadLocs())

const configs = clientFiles.map(f => ({
  entryPoints: [ path.resolve(__dirname, 'client', f + '.ts') ],
  alias: {
    'shared': path.resolve(__dirname, 'shared/')
  },
  define,
  bundle: true,
  minify: true,
  // FIXME: sourcemap:`true` does not work for now, because peertube does not serve static files.
  // See https://github.com/Chocobozzz/PeerTube/issues/5185
  sourcemap,
  format: 'esm',
  target: 'safari11',
  outfile: path.resolve(__dirname, 'dist/client', f + '.js'),
}))

configs.push({
  entryPoints: ["./conversejs/builtin.ts"],
  bundle: true,
  minify: true,
  sourcemap,
  target: 'safari11',
  outfile: path.resolve(__dirname, 'dist/client/static', 'builtin.js'),
})

configs.push({
  entryPoints: ["./client/settings.ts"],
  bundle: true,
  minify: true,
  sourcemap,
  target: 'safari11',
  outfile: path.resolve(__dirname, 'dist/client/settings', 'settings.js'),
})

const promises = configs.map(c => esbuild.build(c))

Promise.all(promises)
  .catch(() => process.exit(1))
