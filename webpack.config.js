const path = require("path")

const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin")

const clientFiles = [
  'common-client-plugin',
  'videowatch-client-plugin'
]

let config = clientFiles.map(f => ({
  entry: "./client/" + f + ".ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist/client"),
    filename: "./" + f + ".js",
    library: "script",
    libraryTarget: "var"
  },
  plugins: [ new EsmWebpackPlugin() ]
}))

config.push({
  entry: "./conversejs/builtin.js",
  output: {
    path: path.resolve(__dirname, "./dist/client/static"),
    filename: "./builtin.js"
  }
})

module.exports = config
