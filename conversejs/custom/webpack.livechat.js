const prod = require('./webpack.prod.js')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = merge(prod, {
  entry: path.resolve(__dirname, 'custom/entry.js'),
  resolve: {
    extensions: ['.js'],
    alias: {
      // To override a template, use this syntax:
      // 'templates/muc_sidebar.js': path.resolve(__dirname, 'custom/templates/muc_sidebar.js')
      '../../templates/background_logo.js$': path.resolve(__dirname, 'custom/templates/background_logo.js'),
      './styles/index.scss$': path.resolve(__dirname, 'custom/shared/styles/livechat.scss')
    }
  }
})
