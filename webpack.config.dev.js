const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: [
      { directory: path.resolve(__dirname, 'src/app/sections'), publicPath: '/sections' },
      { directory: path.resolve(__dirname, 'src/app/pages'), publicPath: '/pages' },
      { directory: path.resolve(__dirname, 'src/app/developers'), publicPath: '/developers' },
      { directory: path.resolve(__dirname, 'src/js'), publicPath: '/js' },
      { directory: path.resolve(__dirname, 'src/tests'), publicPath: '/tests' },
      { directory: path.resolve(__dirname, 'src/img'), publicPath: '/img' },
      { directory: path.resolve(__dirname, '.'), publicPath: '/' },
    ],
  },
});
