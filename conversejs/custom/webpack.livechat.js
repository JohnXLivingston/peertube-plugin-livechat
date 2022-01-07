const prod = require('./webpack.prod.js')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = merge(prod, {
  entry: path.resolve(__dirname, 'custom/entry.js'),
  resolve: {
    extensions: ['.js'],
    alias: {
      './templates/muc-bottom-panel.js': path.resolve('custom/templates/muc-bottom-panel.js'),
      '../../templates/background_logo.js$': path.resolve(__dirname, 'custom/templates/background_logo.js'),
      'shared/styles/index.scss$': path.resolve(__dirname, 'custom/shared/styles/livechat.scss')
    }
  }
})
