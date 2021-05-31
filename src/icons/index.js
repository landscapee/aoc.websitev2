/*
 * @Descripttion: svg注册组件
 * @version: 
 * @Author: xdh.ss
 * @Date: 2020-04-07 10:47:03
 * @LastEditors: xdh.ss
 * @LastEditTime: 2020-04-07 11:09:31
 */
import Vue from 'vue';
import IconSvg from '../components/Icon-svg';// svg组件

// register globally
Vue.component('icon-svg', IconSvg);

const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./svg', false, /\.svg$/);
requireAll(req);
