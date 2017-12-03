
import webpack from 'webpack';
import path from 'path';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import config from './index';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import baseConfig from './webpack.config.base';

export default {

    ...baseConfig,

    devtool: 'false',

    entry: [
        'babel-polyfill',
        `${config.client}/app.js`,
    ],

    output: {
        path: config.dist,
        filename: 'app.[hash].js'
    },

    plugins: [
        new MinifyPlugin(),

        new webpack.optimize.OccurrenceOrderPlugin(),

        new webpack.DefinePlugin({
            DEBUG: false,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new CopyWebpackPlugin([
            {
                from: `${config.assets}/fonts/**/*`,
                to: `${config.dist}/src`
            }, {
                from: `${config.assets}/images/**/*`,
                to: config.dist
            }, {
                from: path.resolve(__dirname, '../package'),
                to: config.dist
            }
        ]),

        new HtmlWebpackPlugin({
            filename: `${config.dist}/src/index.html`,
            template: './src/index.html',
            inject: 'body',
            hash: true,
            minify: {
                collapseWhitespace: true
            }
        })
        
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
};
