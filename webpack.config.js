const webpack = require('webpack');
const path = require('path');

module.exports = function() {
    return {
        entry: path.join(__dirname, "src/index.ts"),
        output: {
            path: path.join(__dirname, "lib"),
            filename: "gotti-game-input.js",
            libraryExport: "default" ,
            libraryTarget: "umd",
            library: "GottiGameInput"
        },
        devtool: "source-map",
        module: {
            rules: [
                { test: /\.ts$/, loader: "ts-loader" },
            ],
        },
        resolve: {
            extensions: ['.ts']
        }
    }
};