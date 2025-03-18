const { merge } = require('webpack-merge');
const path = require('path');  
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'public'),  
        filename: 'bundle.js',  
        publicPath: '/'
    },
    plugins: [
        new Dotenv({
            safe: true,
            systemvars: true
        })
    ]
});