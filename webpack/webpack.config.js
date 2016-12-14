var webpack = require('webpack');
var path = require('path');
var webpackDevMiddleware = require('webpack-dev-middleware')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlMinify = require('html-minifier');
var pro = false;

if( !global.env){
  require('dotenv').config({ silent: true });
  global.env = process.env.NODE_ENV || 'development';
  pro = global.env == 'production';
}

function gPlugins(){
  var res = [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("css/[name].css", {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify( pro ? 'production' : 'development')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
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
  ];

  if(pro) {
    res.push(new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }));
  }

  return res;
}

module.exports = {
  devtool: pro ? 'cheap-module-source-map' : 'source-map',
  // devtool: 'source-map',

 //  entry: { 
 //    app: './frontend/js/index.js',
 //    test: './frontend/js/test.js',
 //    dev: 'webpack-hot-middleware/client'
 // },
 
  entry: pro ? ['./frontend/js/index.js'] : [
    'webpack-hot-middleware/client', 
    'webpack/hot/only-dev-server',
    './frontend/js/index.js'
  ],
  output: {
    path: __dirname + '/public/',
    filename: 'js/index.js',
    publicPath: '/'
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
        loaders: ['babel'],
        include: path.join(__dirname, 'frontend/js')
      },
      {
        test: /\_inline\.svg$/i,
        loader: 'babel?presets[]=es2015,presets[]=react!svg-react'
      },
      {
        test: /^(?!.*(\_b|\_inline)).*\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          // 'url?limit=10240&name=img/[hash:8].[name].[ext]',
          'file?hash=sha512&digest=hex&name=img/[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\_b\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?name=img/[hash:8].[name].[ext]',
          // 'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
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

  plugins: gPlugins(),

  postcss: [
    require('autoprefixer'),
    require('cssnano')
  ],
}