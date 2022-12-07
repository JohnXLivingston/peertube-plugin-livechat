const path = require('path')
const esbuild = require('esbuild')

const packagejson = require('./package.json')
const sourcemap = process.env.NODE_ENV === 'dev' ?  'inline' : false

const clientFiles = [
  // Client files list, without the file extension:
  'common-client-plugin',
  'videowatch-client-plugin',
  'admin-plugin-client-plugin'
]

const configs = clientFiles.map(f => ({
  entryPoints: [ path.resolve(__dirname, 'client', f + '.ts') ],
  alias: {
    'shared': path.resolve(__dirname, 'shared/')
  },
  define: {
    PLUGIN_CHAT_PACKAGE_NAME: JSON.stringify(packagejson.name),
    PLUGIN_CHAT_SHORT_NAME: JSON.stringify(packagejson.name.replace(/^peertube-plugin-/, ''))
  },
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
