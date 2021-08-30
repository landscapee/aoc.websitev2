/*
 * @Descripttion:
 * @version:
 * @Author: xdh.ss
 * @Date: 2020-04-08 12:12:43
 * @LastEditors: xdh.ss
 * @LastEditTime: 2020-04-08 14:45:49
 */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 引入压缩插件
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack');
const SpeedMeasurePlugin=require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(common, {
  mode:'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        exclude: /node_modules|static/,
        terserOptions: {
          parallel: 4,
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'], // 移除console
          },
        },
      }),
    ],
  },
  plugins: [
    // 压缩js
    // new UglifyjsWebpackPlugin(),
    // 版权声明，添加到打包输出后的js代码之前
    new webpack.BannerPlugin('Qin Xiao'),
    // 打包前清除打包目录下的文件，但不删除打包目录
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin(
      {
        'DEBUG': JSON.stringify(false)
      }),
  ],
  module: {
    // rules: []
  }
  // optimization:{
  //     minimizer:[
  //         new UglifyjsWebpackPlugin({
  //             uglifyOptions: {
  //                 compress: {
  //                     warnings: false,
  //                     drop_debugger: true,
  //                     drop_console: true
  //                 }
  //             }
  //         })
  //     ]
  // }
}))
