// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

const prod = require('./webpack/webpack.build.js')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const locKeys = require('./loc.keys.js')

function loadLocs () {
  // Loading english strings, so we can inject them as constants.
  const refFile = path.resolve(__dirname, '..', '..', 'dist', 'languages', 'en.reference.json')
  if (!fs.existsSync(refFile)) {
    throw new Error('Missing english reference file, please run "npm run build:languages" before building ConverseJS')
  }
  const english = require(refFile)

  const r = {}
  for (const key of locKeys) {
    if (!(key in english) || (typeof english[key] !== 'string')) {
      throw new Error('Missing english string key=' + key)
    }
    r['LOC_' + key] = JSON.stringify(english[key])
  }
  return r
}

module.exports = merge(prod, {
  entry: path.resolve(__dirname, 'custom/entry.js'),
  output: {
    filename: 'converse.min.js'
  },
  plugins: [
    new webpack.DefinePlugin(loadLocs())
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      './templates/muc-bottom-panel.js': path.resolve('custom/templates/muc-bottom-panel.js'),
      './templates/muc-head.js': path.resolve(__dirname, 'custom/templates/muc-head.js'),
      '../../templates/background_logo.js$': path.resolve(__dirname, 'custom/templates/background_logo.js'),
      './templates/muc-chatarea.js': path.resolve('custom/templates/muc-chatarea.js'),

      '../templates/icons.js': path.resolve(__dirname, 'custom/shared/components/font-awesome.js'),

      'shared/styles/index.scss$': path.resolve(__dirname, 'custom/shared/styles/livechat.scss'),

      'shared/modals/livechat-external-login.js': path.resolve(
        __dirname,
        'custom/shared/modals/livechat-external-login.js'
      ),
      'templates/livechat-external-login-modal.js': path.resolve(
        __dirname,
        'custom/templates/livechat-external-login-modal.js'
      ),
      'livechat-external-login-content.js': path.resolve(
        __dirname,
        'custom/livechat-external-login-content.js'
      )
    }
  }
})
