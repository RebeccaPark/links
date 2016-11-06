import path from 'path';
import webpack from 'webpack';

export const config = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
    ],    
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './node_modules/bootstrap/scss/')],
  },
  devtool: 'source-map',
  debug: true,
};
