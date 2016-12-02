var webpack = require('webpack')
var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['whatwg-fetch', './public/js/app.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'bundle.min.js',
    sourceMapFilename: 'bundle.map.js',
  },
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.s?css$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
}
