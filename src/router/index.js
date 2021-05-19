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
const index = () => import(/*webpackChunkName:"index"*/ '../views/index')

//航班动态
const flight = () => import(/*webpackChunkName:"flight"*/ '../views/flight/flight')



var routes = [
  { path: '/', name: 'login', component:login},
  { path: '/menu', name: 'menu', component:menu},
  {
    path: '/index', name: 'index', component: index, children: [
      { path: '/flight', name: 'flight', component:flight},
    ]
  },
  



  
  
  
  
  
]

export default new Router({
	fallback:false,
	routes:routes
})
