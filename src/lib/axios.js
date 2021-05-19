import Vue from 'vue';
import axios from "axios";
import router from '../router'
import store from '../store'
let hasIfm = self!=top//是否被镶嵌
let interfaceType = window.webConfig.interfaceType

let origin = window.location.origin;
if(_.includes(origin,'localhost')||_.includes(origin,'127.0.0.1')||_.includes(origin,'192.168.131.131')){
    origin = "http://173.101.1.30:6068"
}
axios.defaults.baseURL  =  origin+"/"+interfaceType+"/fpms-controller"
axios.interceptors.request.use(
    config => {
        let token = sessionStorage.token
        
        let noToken = false
        if(config.url.indexOf("/sso/login/")>-1){//登陆,不需要验证token
            noToken = true
            config.url = origin+"/"+interfaceType+ config.url
        }

        if( config.url.indexOf("/user/changeUserPwd")>-1
            ||config.url.indexOf("/department/getAllDepartmentByDeptIdWithTree")>-1
            ||config.url.indexOf("/user/getUsersByDeptId")>-1
        ){
            config.url = origin+"/"+interfaceType+ config.url
        }else{
            config.headers['remoteAddress'] = sessionStorage.remoteAddress;
        }
        if(!noToken){
            config.headers['Authorization'] = token;
        }
        
        config.headers['Accept'] = 'application/json';
        if(!token&&!noToken){
            config['cancelToken'] = new axios.CancelToken((c) => {
                Vue.prototype.$alert('用户已过期，请重新登录！', '提示', {
                    type: 'warning',
                    center: true
                }).then(() => {
                    router.replace("/")
                })
                c()
            });
        }
        
		return config;
    },
    err => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    response=>{
        if(response.data.date){
            store.commit('setServerTime',new Date(response.data.date))
        }
        
        if(response.data.code==200
            ||response.data.responseCode==1000
            ||response.data.responseCode==30002
            ||response.data.responseCode==30003
            ||response.data.responseCode==30010
        ){
            return response.data?response.data:{};
        } else{
            if(!hasIfm){
                if(response.data.responseCode==10003||response.data.responseCode==30008){//token过期
                    Vue.prototype.$alert('用户已过期，请重新登录！', '提示', {
                        type: 'warning',
                        center: true
                    }).then(() => {
                        router.replace("/")
                    })
                }else{
                    Vue.prototype.$alert(response.data.responseMessage||response.data.message||response.data.msg||response.config.url+'接口错误', '提示', {
                        type: 'error',
                        center: true
                    })
                }
            }
        }
    }, 
    err => {
        if(hasIfm){
            return false
        }
        if(_.includes(err.message,"code 500")||_.includes(err.message,"code 404")||_.includes(err.message,"code 400")||_.includes(err.message,"Network")){
            Vue.prototype.$alert('服务端错误，请联系管理员处理！', '提示', {
                type: 'error',
                center: true
            })
        }
        return Promise.reject(err);
    }
);

export default axios