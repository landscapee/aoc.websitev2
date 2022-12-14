/*
 * @Descripttion:
 * @version:
 * @Author: xdh.ss
 * @Date: 2020-04-08 12:12:15
 * @LastEditors: xdh.ss
 * @LastEditTime: 2020-04-13 18:16:34
 */

const path = require('path');
const argv = require('yargs').argv;
const _ = require('lodash');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('vue-html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

let html_webpack_plugin;
let indexJs = './index.js';
const BUILD_DIR = path.resolve(__dirname, 'website');

const HtmlWebpackPluginConfig = {
    title: '',
    template: path.resolve(__dirname, './index.hbs'),
    filename: 'index.html',
    vue: true,
    hash: true
}

// if(argv.type=='shuangliu'){
//     HtmlWebpackPluginConfig.template = path.resolve(__dirname, './index_shuangliu.hbs')
// }

if (argv.type === 'tianfu') {
    html_webpack_plugin = new HtmlWebpackPlugin(_.extend(HtmlWebpackPluginConfig, {title:'天府机场A-CDM管理系统'}));
    indexJs = './index.js';
}

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, indexJs)
    ],
    output: {
        path: path.resolve(__dirname, 'website'),
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[name].[hash].chunk.js',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('static'), path.resolve(__dirname, indexJs)],
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include: [resolve('src/icons')],
                options: {
                  symbolId: 'icon-[name]'
                }
            },
            {
                test: /\.scss|.css$/,
                use:
                  [
                      // {
                      //     loader: MiniCssExtractPlugin.loader,
                      // },
                    'vue-style-loader',
                      {
                          loader: 'css-loader',
                          options: {
                              // alias: {
                              //     '/src': 'src',
                              // },
                              sourceMap: true,
                          },
                      },
                      {
                          loader: 'px2rem-loader',
                          options: {
                              remUnit:100
                          }
                      },
                      {
                          loader: 'sass-loader',
                          options: {
                              sourceMap: true,
                              implementation: require('sass')
                          }
                      }
                  ]

                //   ExtractTextPlugin.extract({
                //     fallback: 'vue-style-loader',
                //     use: [
                //         {
                //             loader: 'css-loader',
                //             options: {
                //                 sourceMap: true
                //             }
                //         },
                //         {
                //             loader: 'px2rem-loader',
                //             options: {
                //               remUnit:100
                //             }
                //         },
                //         {
                //             loader: 'sass-loader',
                //             options: {
                //                 sourceMap: true,
                //                 implementation: require('sass')
                //             }
                //         }
                //     ]
                // })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: [resolve('src/icons')],
                use: {
                    loader: 'url-loader',
                    // loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: './img/[name].[ext]',
                        esModule: false
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [
                    {loader: 'handlebars-loader'}
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                exclude: [resolve('src/icons')]
            }
        ]
    },
    node:{
        fs: "empty",
        net: 'empty',
    },
    plugins: [
        // new ExtractTextPlugin({
        //     filename:'[name].styles.css',
        //     allChunks:false
        // }),
        new MiniCssExtractPlugin({
            filename: '[name].styles.css',
        }),
        // 添加静态资源打包
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),

        new VueLoaderPlugin(),
        html_webpack_plugin,
        new webpack.DefinePlugin({
            PROGRAM: JSON.stringify(argv.Program),
            'ENVIROMENT': JSON.stringify(process.env.ENVIROMENT),
        }),
    ],
    optimization:{
        minimizer:[
            // new UglifyjsWebpackPlugin({
            //     uglifyOptions: {
            //         compress: {
            //             warnings: false,
            //             drop_debugger: true,
            //             drop_console: true,
            //             pure_funcs: ['console.log']
            //         }
            //     }
            // })
        ]
    },
    resolve: {
        modules: ['node_modules', 'common', 'src'],
        // modules: ['node_modules', 'src', 'static', 'worker'],
        extensions:['.js','.vue'], // 后缀省略设置
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.join(__dirname, 'src'),
            '@components': path.join(__dirname, 'src/ui/components'),
            '@ui_lib': path.join(__dirname, 'src/ui/lib'),
            '@assets': path.join(__dirname, 'src/ui/assets'),
        }
    },
}
