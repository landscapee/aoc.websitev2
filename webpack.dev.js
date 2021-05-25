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
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: 9000,
        open: true,
        progress: true, // 打包过程中的进度条
        host:'127.0.0.1',
        proxy:
          [{
              context: ['/api', '/api-login'],
              // target: 'http://10.33.64.1:6077', // 天府
              target: 'http://173.100.1.137', // 双流
              // target: 'http://173.101.1.30:6075', // 双流测试
              changeOrigin: true,
              ws:true
              // pathRewrite: {
              //     '^/api': '/',
              //     '^/api-login':'/',
              // }
          }]
    },
    plugins: [
        // 热更新插件
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(
          {
            'DEBUG': JSON.stringify(true)
          }),
    ]
})
