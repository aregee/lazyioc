const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const isProd = process.env.NODE_SHELL_ENV === 'production';
const CompressionPlugin = require("compression-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
const devtool = isProd ?
  'source-map' :
  'cheap-module-eval-source-map';

const entry = {
  index: './index.js',
};

const output = {
  path: path.resolve('./bundle/'),
  filename: `[name].js`,
  library: 'skeletonpwa',
  libraryTarget: 'umd',
  umdNamedDefine: true
};

const modules = {
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [path.resolve(__dirname, 'node_modules')],
      query: {
        plugins: ['babel-plugin-transform-object-rest-spread'],
        presets: ['env']
      }
    }
  ]
};

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin()
];

const devServer = {
  historyApiFallback: {
    index: './index.html',
  },
  stats: 'minimal',
  disableHostCheck: true
};

// Production configs and setup
if (isProd) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_SHELL_ENV: JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new UglifyJsPlugin(),
    new CompressionPlugin({
    algorithm: 'gzip'
    }),
    // new BundleAnalyzerPlugin()
  );
}

module.exports = {
  devtool,
  entry,
  output,
  module: modules,
  plugins
};
