const path = require("path")

const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin")

let config = {
  entry: "./client/common-client-plugin.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "./common-client-plugin.js",
    library: "script",
    libraryTarget: "var"
  },
  plugins: [new EsmWebpackPlugin()]
}

module.exports = config
