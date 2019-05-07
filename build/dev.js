const path = require('path')
const { spawn } = require('child_process')

const webpack = require('webpack')
const devCfg = require('./webpack.config.js')
const mainCfg = require('./webpack.main.config')
const webpackDevServer = require('webpack-dev-server')
const electron = require('electron')


let electronProcess = null
let manualRestart = false

function startRender () {
  return new Promise (function (resolve, reject) {
    const devOps = {
      contentBase: path.resolve(__dirname, '../dist'),
      hot: true,
      host: 'localhost',
      contentBase: path.resolve(__dirname, '../src/pages'),
      watchContentBase: true,
      open: true
    }
    const compiler = webpack(devCfg)
    const server = new webpackDevServer(compiler, devOps)
    server.listen(2333, 'localhost', () => {
      console.log('started on port 2333')
      resolve()
    })
  })
}

function startMain () {
  return new Promise(function (resolve, reject) {
    const compiler = webpack(mainCfg)
    compiler.watch({}, (err, states) => {
      if (err) return
      if (electronProcess) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()
        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }
    })
    resolve()
  })
}

function startElectron () {
  const args = [
    '--inspect=5858',
    path.resolve(__dirname, '../dist/electron-main.js')
  ]
  electronProcess = spawn(electron, args)
  electronProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  electronProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  electronProcess.on('close', (code) => {
    if (!manualRestart) process.exit()
  });
}

Promise.all([startRender(), startMain()])
  .then(() => {
    startElectron()
  })
  .catch(err => {
    console.log(err)
  })
