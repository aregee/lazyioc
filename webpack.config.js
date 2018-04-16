const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const isProd = process.env.NODE_SHELL_ENV === 'production';

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
  loaders: [{
      test: /\.html$/,
      loader: 'html-loader'
    },
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    })
  );
}

module.exports = {
  devtool,
  entry,
  output,
  module: modules,
  plugins
};
