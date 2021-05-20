import Vue from 'vue';
import App from './src/App.vue';
import WorkerRegist from './workerRegist.js';//注册worker
import store from './src/store'//vuex
import postal from 'postal';//广播
// import Worker from 'worker/manage/tf-init';
//引入全套element
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import './src/styles/elementReset.scss';//element样式重置
import i18n from './src/i18n'//中英双语

import router from './src/lib/router'
import axios from './src/lib/axios'

import moment from 'moment';//日期插件
moment.locale('zh-cn')

Vue.use(ElementUI,{locale});

Vue.prototype.postal = postal
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.sysEdition = window.webConfig.sysEdition//系统版本


postal.subscribe({//系统时间更新
    channel: 'web.aoc',
    topic: 'sys_time',
    callback:data => {
        store.commit('setServerTime',new Date(data))
    }
})

if(localStorage.lang){//设置语言
    store.commit('setLanguage',localStorage.lang)
}

if(sessionStorage.userData){//刷新或者丢失用户信息，使用token获取用户信息
    store.commit('setUserMsg',JSON.parse(sessionStorage.userData))
}

/***************************拆分server 测试环境********************************/
// let locationHost = '173.101.1.30'; // 双流测试
let locationHost = location.hostname;
// let port = process.env.ENVIROMENT === 'test' ? '6080' : '6070';
// console.log('env', process.env.ENVIROMENT);
// let locationHost = '173.100.1.137';
let port = location.port;
// let port = '6075'; // 双流测试
// let locationHost = '173.100.1.133';
let serverPreset = 'api/';
// let serverPreset = '';

const servers = [
    {
        name: 'Flight', //航班动态
        host: locationHost,
        port: port,
        channel: serverPreset + 'flight/endpointWisely',
    },
    {
        name: 'Situation', //监控池子+首页
        host: locationHost,
        port: port,
        channel: serverPreset + 'situation/endpointWisely',
    },
    {
        name: 'Delays', //大面积延误
        host: locationHost,
        port: port,
        channel: serverPreset + 'delays/endpointWisely',
    },
    {
        name: 'RunwayWeather', //跑道天气
        host: locationHost,
        port: port,
        channel: serverPreset + 'runwayweather/endpointWisely',
    },
    {
        name: 'MSG',
        host: locationHost,
        port: port,
        channel: serverPreset + 'notice/endpointWisely',
    },
    {
        name: 'Adverse',
        host: locationHost,
        port: port,
        channel: serverPreset + 'adverse-condition/endpointWisely',
    },
    {
        name: 'Resource',
        host: locationHost,
        port: port,
        channel: serverPreset + 'resource/endpointWisely',
    },
];

const httpConfig = {
    flight: {
        host: locationHost,
        port: port,
        path: serverPreset + 'flight',
    },
    situation: {
        host: locationHost,
        port: port,
        path: serverPreset + 'situation',
    },
    delays: {
        host: locationHost,
        port: port,
        path: serverPreset + 'delays',
    },
    milestone: {
        host: locationHost,
        port: port,
        path: serverPreset + 'milestone',
    },
    // milestone: {
    // 	host: locationHost,
    // 	port: '6070',
    // 	path: 'milestone/new',
    // },
    other: {
        host: locationHost,
        port: port,
        path: serverPreset + 'milestone/operation/report',
    },
    weatherTips: {
        host: locationHost,
        port: port,
        path: serverPreset + 'weather',
    },
    login: {
        host: locationHost,
        port: port,
        path: 'api-login/sso/login',
    },
    // login: {
    // 	host: '173.100.1.5',
    // 	port: port,
    // 	path: 'sso/login',
    // },
    msg: {
        host: locationHost,
        port: port,
        path: serverPreset + 'notice',
    },
    statistics: {
        host: locationHost,
        port: port,
        path: serverPreset + 'statistics',
    },
    adverse: {
        host: locationHost,
        port: port,
        path: serverPreset + 'adverse-condition',
    },
};


new Vue({
    el: '#app',
    components: {App},
    router,
    store,
    i18n,
    template: '<App />',
    created () {
        const workerProces = new WorkerRegist();
        workerProces.start();
        // let myWorker;
        // if (!myWorker){
        //     myWorker = new Worker();
        // }
        postal.publish({
            channel: 'Worker',
            topic: 'init',
            data: {
                servers,
                httpConfig,
            },
        });
    }
});
