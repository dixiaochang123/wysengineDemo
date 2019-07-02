'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here

let config = Object.assign({}, baseConfig, {
    entry: {
        app: path.join(__dirname, '../src/index.js'),
        vendor: [
            'jquery',
            'core-js',
            'echarts',
            'expose-loader',
            'jquery-mousewheel',
            'moment',
            'normalize.css',
            'rc-dropdown',
            'rc-menu',
            'rc-pagination',
            'rc-tooltip',
            'react',
            'react-dom',
            'react-modal',
            'react-redux',
            'react-router',
            'redux',
            'redux-thunk',
            'superagent',
            'superagent-legacyiesupport'
        ]
    },
    output: {
        path: path.join(__dirname, '/../dist/assets'),
        filename: 'app.js',
        publicPath: '/insight/assets/'
    },
    cache: false,
    devtool: 'sourcemap',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
    test: /\.(js|jsx)$/,
    loader: 'babel',
    include: [].concat(
        config.additionalPaths, [path.join(__dirname, '/../src')]
    )
});

module.exports = config;
