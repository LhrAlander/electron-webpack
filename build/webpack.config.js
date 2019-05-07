const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function generateHtml () {
  const pages = fs.readdirSync(path.resolve(__dirname, '../src/pages'))
  const plugins = pages.map(page => {
    return new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../src/pages/${page}/index.html`),
      filename: path.resolve(__dirname, `../dist/${page}/index.html`),
      chunks: [page]
    })
  })
  return plugins;
}

module.exports = {
  mode: 'development',
  target: 'electron-renderer',
  entry: () => {
    return new Promise(resolve => {
      const folder = fs.readdirSync(path.resolve(__dirname, '../src/pages'))
      const entries = {}
      folder.forEach(f => {
        entries[f] = path.resolve(__dirname, `../src/pages/${f}/index.js`)
      })
      resolve(entries)
    })
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './[name]/index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '_',
      name: true,
      cacheGroups: {
        vendorJs: {
          test: /[\\/]node_modules[\\/]/,
          priority: 100
        },
        commonJs: {
          chunks: 'initial',
          minChunks: 1,
          priority: 90          
        },
        styles: {
          name: 'styles',
          test: /styles.*\.scss/,
          chunks: 'all',
          enforce: true,
          priority: 110
        },
        default: false
      }
    }
  },
  plugins: [
    ...generateHtml(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: './[name]/index.css',
      chunkFilename: './[id]/index.css'
    }),
  ]
}