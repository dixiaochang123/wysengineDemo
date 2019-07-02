'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here

let config = Object.assign({}, baseConfig, {
    debug: true,
    entry: {
        app: [
            'babel-polyfill',
            'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
            'webpack/hot/only-dev-server',
            './src/index.js'
        ],
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
    cache: true,
    devtool: 'eval-source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
    test: /\.(js|jsx)$/,
    loader: 'react-hot!babel-loader',
    include: [].concat(
        config.additionalPaths, [path.join(__dirname, '/../src')]
    )
});

module.exports = config;
