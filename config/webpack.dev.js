const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base');

module.exports = {
  target: 'electron',
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './app/main',
  ],
  output: {
    path: path.resolve(__dirname, '../app'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  resolve: base.resolve,
  module: base.module,
};
