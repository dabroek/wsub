var path = require('path');
var webpack = require('webpack');
var base = require('./webpack.base');

module.exports = {
  entry: './app/main',
  profile: true,
  output: {
    path: path.resolve(__dirname, '../app'),
    publicPath: '',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
      }
    })
  ],
  resolve: base.resolve,
  module: base.module,
};
