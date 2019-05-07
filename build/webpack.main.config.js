const path = require('path')

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'electron-[name].js'
  },
  target: 'electron-main'
}