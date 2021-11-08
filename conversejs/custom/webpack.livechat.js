const prod = require('./webpack.prod.js')
const { merge } = require('webpack-merge')
// const path = require('path')

module.exports = merge(prod, {
  resolve: {
    extensions: ['.js'],
    alias: {
      // To override a template, use this syntax:
      // 'templates/muc_sidebar.js': path.resolve(__dirname, 'custom/templates/muc_sidebar.js')
    }
  }
})
