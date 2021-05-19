/*
 * @Descripttion: 
 * @version: 
 * @Author: xdh.ss
 * @Date: 2020-04-08 12:12:33
 * @LastEditors: xdh.ss
 * @LastEditTime: 2020-04-08 14:44:26
 */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');


module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        port: 9000,
        open: false,
        progress: true, // 打包过程中的进度条
        host:'0.0.0.0'
    },
    plugins: [
        // 热更新插件
        new webpack.HotModuleReplacementPlugin(),
    ]
})