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



var routes = [
  { path: '/', name: 'login', component:login},
  { path: '/menu', name: 'menu', component:menu},
  {
    path: '/index', name: 'index', component: index, children: [
      { path: '/home', name: 'home', component:home},
      { path: '/flight', name: 'flight', component:flight},
      { path: '/runMonitoring', name: 'runMonitoring', component:runMonitoring},
      { path: '/poolMonitorWithRunway', name: 'poolMonitorWithRunway', component:poolMonitorWithRunway},
      { path: '/adv', name: 'adv', component:adv},
    ]
  },









]

export default new Router({
	fallback:false,
	routes:routes
})
