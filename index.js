import Vue from 'vue';
import App from '@/ui/App.vue';
import WorkerRegist from './workerRegist.js';//注册worker
import store from './src/ui/store'//vuex
import postal from 'postal';//广播
// import Worker from 'worker/manage/tf-init';
//引入全套element
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import './src/ui/styles/elementReset.scss';//element样式重置
import i18n from './src/ui/i18n'//中英双语

import router from './src/ui/lib/router'
import HttpRequest from '@/lib/axios'

import moment from 'moment';
import {memoryStore} from "./src/worker/lib/memoryStore";

import IconSvg from './src/ui/components/Icon-svg';// svg组件
import Logger from "@/lib/logger";

import {v4 as uuidv4} from "uuid";
Vue.prototype.$uuid = uuidv4;
Vue.prototype.$logger = Logger;

Vue.component('icon-svg', IconSvg);

import {servers,httpConfig} from "@/lib/interfaces"


//日期插件
moment.locale('zh-cn')
// let request = new HttpRequest(httpConfig);
Vue.use(ElementUI,{locale});

Vue.prototype.postal = postal
// Vue.prototype.$axios = axios
Vue.prototype.$request = new HttpRequest(httpConfig);
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
        let token = sessionStorage.token;
        memoryStore.setItem('global',{token});
        postal.publish({
            channel: 'Worker',
            topic: 'init',
            data: {
                servers,
                httpConfig,
                token
            },
        });
    }
});
