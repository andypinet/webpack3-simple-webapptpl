const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin  = require("extract-text-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const utils = require("./utils");
const config = require("./config");

const PAGE = "index";

module.exports = {
    entry: `./src/${PAGE}/index.js`,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    watch: false,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
             template: `src/${PAGE}/index.html`
        }),
        new ExtractTextPlugin(config.build.assetsSubDirectory + "/css/[name]-[chunkhash:8].css"),
        // new StyleExtHtmlWebpackPlugin({
        //     position: 'head-bottom'
        // })
    ]
};