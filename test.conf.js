const path = require('path');
const utils = require("./utils");
const fs = require("fs");
var babelrc = {};
try {
    babelrc =  JSON.parse(fs.readFileSync("./.babelrc").toString());
} catch (e) {
    console.error("error parse babelrc");
}

module.exports = {
  entry: './test/test.mjs',
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'test'),       
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: Object.assign({
                presets: [
                   [
                        'env',
                        {
                            modules: false,
                            targets: {
                                "browsers": ["ie >= 9"]
                            }
                        }
                   ]
                ],                    
              }, babelrc, {}),
            }
        },
    ] 
  }   
};