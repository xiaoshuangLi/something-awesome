var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlMinify = require('html-minifier');

if( !global.env){
  require('dotenv').config({ silent: true });
  global.env = process.env.NODE_ENV || 'development';
  var pro = global.env == 'production';
}

module.exports = {
  devtool: pro ? 'cheap-module-source-map' : 'source-map',
  // devtool: 'cheap-module-source-map',

 //  entry: { 
 //    app: './frontend/js/index.js',
 //    test: './frontend/js/test.js',
 //    dev: 'webpack-hot-middleware/client'
 // },
 
  entry: pro ? ['./frontend/js/index.js'] : [
    'webpack-hot-middleware/client', 
    './frontend/js/index.js'
  ],
  output: {
    path: __dirname + '/public/',
    filename: 'js/index.js',
    publicPath: '/public/'
  },

  // entry: './frontend/html/index.html',
  // output: {
  //   path: __dirname + '/public/html',
  //   filename: 'index.html',
  //   publicPath: '/public/'
  // },

  devServer: {
    contentBase: './public',
    colors: true,
    historyApiFallBack: true,
    inline: true,
    hot: true,
    compress: true
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ["es2015", "react"],
          env: {
            "development": {
              "presets": ["react-hmre"]
            }
          }
        }
      },
      {
        test: /\.css$/,
        loader: pro ? ExtractTextPlugin.extract('style-loader', 'css!postcss') : 'style!css!postcss'
      },
      {
        test: /\.scss$/,
        loader: pro ? ExtractTextPlugin.extract('style-loader', 'css!sass!postcss') : 'style!css!sass!postcss'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("css/[name].css", {
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
      hash: true,
      cache: true,
      inject: true,
      minify: pro ? htmlMinify: false,
      dev: !pro,
      // chunks: ['app'],
      // excludeChunks: ['dev'],
      filename: 'html/index.html'
    })
  ],

  postcss: [
    require('autoprefixer'),
    require('cssnano')
  ],
}