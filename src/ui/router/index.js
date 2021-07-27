import Vue from 'vue'
import Router from 'vue-router'


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)
// 登录
const login = () => import(/*webpackChunkName:"login"*/ '../views/login/login')
//菜单
const menu = () => import(/*webpackChunkName:"menu"*/ '../views/menu/menu')

//首页
const index = () => import(/*webpackChunkName:"index"*/ '../views')
//运行态势
const home = () => import(/*webpackChunkName:"home"*/ '../views/home/home')
//航班动态
const flight = () => import(/*webpackChunkName:"flight"*/ '../views/flight/flight')
const flightHistory = () => import(/*webpackChunkName:"flight"*/ '../views/flight/flightHistory')
//运行监控
const runMonitoring = () => import(/*webpackChunkName:"runMonitoring"*/ '../views/runMonitoring')
const poolMonitorWithRunway = () => import(/*webpackChunkName:"poolMonitorWithRunway"*/ '../views/poolMonitorWithRunway')

//不利条件运行
const conditionalOperation = () => import(/*webpackChunkName:"conditionalOperation"*/ '../views/conditionalOperation/conditionalOperation')
//调减调整
const adjustmentReduction = () => import(/*webpackChunkName:"adjustmentReduction"*/ '../views/adjustmentReduction/adjustmentReduction')
//大面积备降
const alternate = () => import(/*webpackChunkName:"alternate"*/ '../views/conditionalOperation/alternate/index')
//低能见运行
const runningNew = () => import(/*webpackChunkName:"runningNew"*/ '../views/conditionalOperation/runningNew/runningNew')
//除冰
const deice = () => import(/*webpackChunkName:"decrease"*/ '../views/conditionalOperation/deice/deice')
//气象灾害
const weatherNew = () => import(/*webpackChunkName:"weatherNew"*/ '../views/conditionalOperation/weatherNew/weatherNew')
//大面积延误
const delayNew = () => import(/*webpackChunkName:"weatherNew"*/ '../views/conditionalOperation/delayNew/delayNew')
//调整调减
const decrease = () => import(/*webpackChunkName:"decrease"*/ '../views/conditionalOperation/decrease/decrease')
//消息发布
const specialTreatment = () => import(/*webpackChunkName:"specialTreatment"*/ '../views/specialTreatment/index')
//资源监控
const resourceMonitoring = () => import(/*webpackChunkName:"resourceMonitoring"*/ '../views/resourceMonitoring/index')
//tobt配置
const tobtConfig = () => import(/*webpackChunkName:"tobtConfig"*/ '../views/tobtConfig/index')


export var routes = [
    {path: '/', name: 'login', component: login},
    {path: '/menu', name: 'menu', component: menu},
    {
        path: '/index', name: 'index', component: index, children: [
            {
                path: '/home', name: 'home', component: home,
                title:'运行态势',icon:'yunxingtaishi',role:'situation-all'
            },
            {
                path: '/flight', name: 'flight', component: flight,
                title:'航班动态',icon:'hangbandongtai1',role:'flight'
            },
            {
                path: '/flightHistory', name: 'flightHistory', component: flightHistory,
                title:'航班历史',icon:'hangbandongtai1',role:'flight'
            },
            {
                path: '/poolMonitorWithRunway', name: 'poolMonitorWithRunway', component: poolMonitorWithRunway,
                title:'航班正常监控',icon:'hbzcjk',role:'normal_monitoring_runway'
            },
            {
                path: '/runMonitoring', name: 'runMonitoring', component: runMonitoring,
                title:'运行监控',icon:'yunxingjiankong',role:'run_monitoring'
            },

            {
                path: '/flightAdjustment', name: 'flightAdjustment', component: resourceMonitoring,
                title:'动态调整',icon:'tiaozheng1',role:'flight_schedule_dynamic_adjustment'
            },


            {
                path: '/conditionalOperation',
                name: 'conditionalOperation',
                component: conditionalOperation,
                title:'不利条件运行',icon:'bulitiaojian',role:'conditionalOperationMain',
                children: [
                    {path: '/alternate', name: 'alternate', component: alternate},
                    {path: '/runningNew', name: 'runningNew', component: runningNew},
                    {path: '/deice', name: 'deice', component: deice},
                    {path: '/weatherNew', name: 'weatherNew', component: weatherNew},
                    {path: '/delayNew', name: 'delayNew', component: delayNew},
                    {path: '/decrease', name: 'decrease', component: decrease},
                ]
            },
            {
                path: '/resourceMonitoring', name: 'resourceMonitoring', component: resourceMonitoring,
                title:'资源监控',icon:'ziyuanjiankong',role:'resourceMonitoring'
            },
            {
                path: '/adjustmentReduction', name: 'adjustmentReduction', component: adjustmentReduction,
                title:'调整调减',icon:'tiaozhengtiaojian',role:'adjustReduction'
            },
            {
                path: '/tobtConfig', name: 'tobtConfig', component: tobtConfig,
                title:'TOBT配置',icon:'tiaozhengtiaojian',role:'TOBTConfig'
            },
            {
                path: '/specialTreatment', name: 'specialTreatment', component: specialTreatment,
                title:'消息发布',icon:'xiaoxifabu',role:'news_releaseAll'
            },


        ]
    },



]

export default new Router({
    fallback: false,
    routes: routes
})
