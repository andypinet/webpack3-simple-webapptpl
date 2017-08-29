process.env.NODE_ENV = 'production'

const argv = require('yargs').argv
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('./config')
const webpackConfig = require('./webpack.conf')
const fs = require('fs');
const klawSync = require('klaw-sync')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

let staticfilepath = "";
staticfilepath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);

if (argv.watch) {
  webpackConfig.watch = true;
} else {
  // build 时 添加 压缩
  webpackConfig.plugins.push( new webpack.optimize.UglifyJsPlugin({
  }))
}

var spinner = ora('building for production... ')
spinner.start()

// 删除相关文件
function getRelateFilesByNameSync(deletefilename) {
  var files = klawSync(staticfilepath)
  return files.filter( (v, k) => {
    if (v.stats.isFile()) {
        return true;
    }
    return false
  } ).map((v, k) => v.path).filter((v, k) => {
    var name = v.split("/").pop();
    if (name.indexOf(deletefilename) > -1) {
      return true;
    }
    return false;
  })
}

var rmtasks = [];

if (fs.existsSync(staticfilepath)) {
  getRelateFilesByNameSync(config.build.page).map(function map(path) {
    rmtasks.push(new Promise(function (resolve, reject) {
      rm(path, err => {
        if (err) {
          reject(err)
        }
        resolve();
      });
    }));
  });
} else{
  console.log("no file exist")
}

Promise.all(rmtasks).then(() => {
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
}).catch((e) => {
  console.log('------------------------------------');
  console.log(e);
  console.log('------------------------------------');
})
