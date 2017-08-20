const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin  = require("extract-text-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const utils = require("./utils");
const config = require("./config");

const PAGE = config.build.page;

const entry = {};
entry[PAGE] = `./src/${PAGE}/index.js`;

module.exports = {
    entry: entry,
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
            },
            {
                test: /\.scss$/,
                use:  ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }]
                })
            },
            {
                test: /\.(png|gif|jpe?g)$/,
                loader: 'url-loader',
                query: {
                    /*
                     *  limit=10000 ： 10kb
                     *  图片大小小于10kb 采用内联的形式，否则输出图片
                     * */
                    limit: 10000,
                    name: '/img/[name]-[hash:8].[ext]'
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
             template: `src/${PAGE}/index.html`,
             filename: `${PAGE}.html`
        }),
        new ExtractTextPlugin(config.build.assetsSubDirectory + "/css/[name]-[chunkhash:8].css"),
        // new StyleExtHtmlWebpackPlugin({
        //     position: 'head-bottom'
        // })
    ]
};