
import webpack from 'webpack';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import config from './index';
import baseConfig from './webpack.config.base';

export default {

    ...baseConfig,

    devtool: 'false',

    entry: [
        'babel-polyfill',
        './main.js'
    ],

    output: {
        path: config.dist,
        filename: 'main.js'
    },

    plugins: [
        new MinifyPlugin(),

        new webpack.DefinePlugin({
            DEBUG: false,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-main',

    node: {
        __dirname: false,
        _filename: false
    }
};
