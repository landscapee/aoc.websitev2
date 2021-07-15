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
import {hasRole} from './src/ui/lib/common'

import router from './src/ui/lib/router'
import HttpRequest from '@/lib/axios'

import moment from 'moment';
import {memoryStore} from "./src/worker/lib/memoryStore";

import '@/ui/config/vuecomponent'
import Logger from "@/lib/logger";

import   {v4 as uuidv4} from "uuid";
import {getUser} from './src/ui/lib/localStorageTemp'
Vue.prototype.$uuid = uuidv4;
Vue.prototype.$logger = Logger;



import {servers,httpConfig} from "@/lib/interfaces"
import FlightDetails from './src/ui/components/flightDetails/index.js'

//日期插件
moment.locale('zh-cn')
// let request = new HttpRequest(httpConfig);
Vue.use(ElementUI,{locale});
Vue.use(FlightDetails);
Vue.prototype.postal = postal
Vue.prototype.$hasRole = hasRole
// Vue.prototype.$axios = axios
Vue.prototype.$request = new HttpRequest(httpConfig);
Vue.prototype.$moment = moment
Vue.prototype.sysEdition = window.webConfig.sysEdition//系统版本


// postal.subscribe({//系统时间更新
//     channel: 'web.aoc',
//     topic: 'sys_time',
//     callback:data => {
//         store.commit('setServerTime',new Date(data))
//     }
// })

// if(localStorage.lang){//设置语言
//     store.commit('setLanguage',localStorage.lang)
// }

if(getUser()){//刷新或者丢失用户信息，使用token获取用户信息
    store.commit('setUserMsg',JSON.parse(getUser()))
}



new Vue({
    el: '#app',
    components: {App},
    router,
    store,
    i18n,
    template: '<App />',
    created () {
         let clientId = uuidv4();
         console.log('clientId',clientId);
        const workerProces = new WorkerRegist();
        workerProces.start();
        let token = JSON.parse(getUser()).token;
        let now = moment().valueOf()
        memoryStore.setItem('global',{token, now,clientId});
        postal.publish({
            channel: 'Worker',
            topic: 'init',
            data: {
                servers,
                httpConfig,
                token,
                now,
                clientId
            },
        });
    }
});
