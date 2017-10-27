var webpack = require('webpack');
var path = require('path');
var webpackDevMiddleware = require('webpack-dev-middleware')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var htmlMinify = require('html-minifier');
var pro = process.env.NODE_ENV == 'production';
var rootPath = path.resolve(__dirname, '..');

var babelConfig = require('../babel.json');
var babelrcObjectDevelopment = babelConfig.env && babelConfig.env.development || {};

// merge global and dev-only presets & plugins
var combinedPlugins = babelConfig.plugins || [];
var combinedPresets = babelConfig.presets || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);
combinedPresets = combinedPresets.concat(babelrcObjectDevelopment.presets);

var babelLoaderQuery = Object.assign({}, babelConfig, {
  presets: combinedPresets,
  plugins: combinedPlugins
});
delete babelLoaderQuery.env;

var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var postLoader = {
  loader: 'postcss-loader',
  options: {
    plugins() {
      return [
        require('autoprefixer')({
          browsers: [
            'last 3 versions',
            'ie >= 9',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 6',
            'opera >= 12.1',
            'ios >= 6',
            'android >= 4.4',
            'bb >= 10',
            'and_uc 9.9',
          ],
        }),
        require('postcss-write-svg')(),
      ];
    },
  },
};

function gPlugins(){
  var res = [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendors' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [ 
          require('autoprefixer')({
            browsers: ['last 4 version']
          }),
          require('cssnano')(),
        ]
      }
    }),
    new ExtractTextPlugin({
      filename: "css/[name].css",
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
      hash: true,
      cache: true,
      inject: true,
      minify: pro ? htmlMinify: false,
      dev: !pro,
      chunks: ['vendors', 'global'],
      // excludeChunks: ['dev'],
      filename: 'html/index.html'
    })
  ];

  if(pro) {
    res.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        collapse_vars: true,
        reduce_vars: true,
      },
      beautify: false,
      comments: false,
      sourceMap: true,
    }));

    res.push(webpackIsomorphicToolsPlugin);
    res.push(new CleanPlugin([rootPath + '/public'], { root: rootPath }));
  }

  return res;
}

module.exports = {
  devtool: pro ? 'hidden-source-map' : 'source-map',
 
  entry: {
    global: pro ? [rootPath + '/frontend/js/index.js']: [
      'webpack-hot-middleware/client', 
      'webpack/hot/only-dev-server',
      rootPath + '/frontend/js/index.js'
    ],
  },
  output: {
    path: rootPath +  '/public/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: '/'
  },

  resolve: {
    modules: [
      'frontend',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /^(?!.*(\_inline)).*\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelLoaderQuery
      },
      {
        test: /\_inline\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'file-loader?hash=sha512&digest=hex&name=js/[hash].[ext]',
      },
      {
        test: /\_inline\.svg$/i,
        loader: 'babel-loader?presets[]=es2015,presets[]=react!svg-react-loader'
      },
      {
        test: /^(?!.*(\_b|\_inline)).*\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            },
          },
        ]
      },
      {
        test: /\_b\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?name=img/[hash:8].[name].[ext]',
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            },
          },
        ]
      },
      {
        test: /\.scss$/,
        use: pro ? ExtractTextPlugin.extract({
          fallback: 'style-loader', 
          use: ['css-loader?minimize', 'resolve-url-loader', postLoader,'sass-loader']
        })
        : ['style-loader', 'css-loader?minimize', 'resolve-url-loader', postLoader,'sass-loader']
      },
    ],
  },

  plugins: gPlugins()
}