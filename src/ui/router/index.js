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
//运行监控
const runMonitoring = () => import(/*webpackChunkName:"runMonitoring"*/ '../views/runMonitoring')
const poolMonitorWithRunway = () => import(/*webpackChunkName:"poolMonitorWithRunway"*/ '../views/poolMonitorWithRunway')
const adv = () => import(/*webpackChunkName:"runMonitoring"*/ '../views/runMonitoring/adv')

//不利条件运行
const conditionalOperation = () => import(/*webpackChunkName:"conditionalOperation"*/ '../views/conditionalOperation/conditionalOperation')
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
//调时调减
const decrease = () => import(/*webpackChunkName:"decrease"*/ '../views/conditionalOperation/decrease/decrease')
//消息发布
const specialTreatment = () => import(/*webpackChunkName:"specialTreatment"*/ '../views/specialTreatment/index')
//资源监控
const resourceMonitoring = () => import(/*webpackChunkName:"resourceMonitoring"*/ '../views/resourceMonitoring/index')
//tobt配置
const tobtConfig = () => import(/*webpackChunkName:"tobtConfig"*/ '../views/tobtConfig/index')



var routes = [
  { path: '/', name: 'login', component:login},
  { path: '/menu', name: 'menu', component:menu},
  {
    path: '/index', name: 'index', component: index, children: [
      { path: '/home', name: 'home', component:home},
      { path: '/flight', name: 'flight', component:flight},
      { path: '/runMonitoring', name: 'runMonitoring', component:runMonitoring},
      { path: '/poolMonitorWithRunway', name: 'poolMonitorWithRunway', component:poolMonitorWithRunway},
      { path: '/resourceMonitoring', name: 'resourceMonitoring', component:resourceMonitoring},
      { path: '/adv', name: 'adv', component: adv },
       {
        path: '/conditionalOperation', name: 'conditionalOperation', component: conditionalOperation, children: [
           { path: '/alternate', name: 'alternate', component: alternate },
           { path: '/runningNew', name: 'runningNew', component: runningNew },
           { path: '/deice', name: 'deice', component: deice },
           { path: '/weatherNew', name: 'weatherNew', component: weatherNew },
           { path: '/delayNew', name: 'delayNew', component: delayNew },
           { path: '/decrease', name: 'decrease', component: decrease },
        ]
      },
          { path: '/specialTreatment', name: 'specialTreatment', component: specialTreatment },
          { path: '/tobtConfig', name: 'tobtConfig', component: tobtConfig },

      ]
  },









]

export default new Router({
	fallback:false,
	routes:routes
})
