var webpack = require('./webpack.config')
var WebpackNotifierPlugin = require('webpack-notifier')

webpack.devtool = ''
webpack.plugins = [
  new WebpackNotifierPlugin({alwaysNotify: true}),
]

module.exports = webpack
