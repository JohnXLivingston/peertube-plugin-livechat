const path = require('path')
const webpack = require('webpack')

const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin')

const packagejson = require('./package.json')

const clientFiles = [
  'common-client-plugin',
  'videowatch-client-plugin',
  'admin-plugin-client-plugin'
]

let config = clientFiles.map(f => ({
  entry: "./client/" + f + ".ts",
  devtool: process.env.NODE_ENV === 'dev' ? 'eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, 'shared/')
    },
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    path: path.resolve(__dirname, "./dist/client"),
    filename: "./" + f + ".js",
    library: "script",
    libraryTarget: "var"
  },
  plugins: [
    new webpack.DefinePlugin({
      PLUGIN_CHAT_PACKAGE_NAME: JSON.stringify(packagejson.name),
      PLUGIN_CHAT_SHORT_NAME: JSON.stringify(packagejson.name.replace(/^peertube-plugin-/, ''))
    }),
    new EsmWebpackPlugin()
  ]
}))

config.push({
  entry: "./conversejs/builtin.ts",
  devtool: process.env.NODE_ENV === 'dev' ? 'eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist/client/static"),
    filename: "./builtin.js"
  }
})

config.push({
  entry: "./client/settings.ts",
  devtool: process.env.NODE_ENV === 'dev' ? 'eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    path: path.resolve(__dirname, "./dist/client/settings"),
    filename: "./settings.js"
  }
})

module.exports = config
