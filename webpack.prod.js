const { merge } = require('webpack-merge');
const path = require('path');  // Añade esta línea
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'public'),  // Añade esta línea
        filename: 'bundle.js',  // Añade esta línea
        publicPath: '/'
    },
    plugins: [
        new Dotenv({
            safe: true,
            systemvars: true
        })
    ]
});