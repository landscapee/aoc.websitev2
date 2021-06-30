// import QS from 'qs';
import qs from 'qs';
import axios from "axios";
import router from '../ui/router'
import store from '../ui/store'
import postal from 'postal';
import { includes } from 'lodash';
import {memoryStore} from "../worker/lib/memoryStore";
// let hasIfm = self!=top//是否被镶嵌
axios.interceptors.request.use(
  config => {
    let token = memoryStore.getItem('global').token;

    let noToken = false
    if(config.url.indexOf("/sso/login/")>-1){//登陆,不需要验证token
      noToken = true
      // config.url = origin+"/"+interfaceType+ config.url
    }

    // if( config.url.indexOf("/user/changeUserPwd")>-1
    //   ||config.url.indexOf("/department/getAllDepartmentByDeptIdWithTree")>-1
    //   ||config.url.indexOf("/user/getUsersByDeptId")>-1
    // ){
    //   config.url = origin+"/"+interfaceType+ config.url
    // }else{
    //   config.headers['remoteAddress'] = sessionStorage.remoteAddress;
    // }
    if(!noToken){
      config.headers['Authorization'] = token;
    }

    config.headers['Accept'] = 'application/json';
    if(!token&&!noToken){
      config['cancelToken'] = new axios.CancelToken((c) => {
        postal.publish({
          channel:'Web',
          topic:'Login.Out',
          data: ''
        })
        // Vue.prototype.$alert('用户已过期，请重新登录！', '提示', {
        //   type: 'warning',
        //   center: true
        // }).then(() => {
        //   // router.replace("/")
        // })
        // c()
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
    // if(response.data.date){
    //   store.commit('setServerTime',new Date(response.data.date))
    // }
    if(response.data.code==200
      ||response.data.responseCode==1000
      ||response.data.responseCode==30002
      ||response.data.responseCode==30003
      ||response.data.responseCode==30010
      ||response.data.responseCode==200
    ){
      let data = response.data || response.responseData;
      return data ? data : {};
    } else{
      if(response.data.responseCode==10003||response.data.responseCode==30008){//token过期
        postal.publish({
          channel:'Web',
          topic:'Login.Out',
          data: ''
        })
        // })
      }else{
        postal.publish({
          channel:'Web',
          topic:'Global.Alert',
          data: [response.data.responseMessage||response.data.message||response.data.msg||response.config.url+'接口错误', '提示', {
            type: 'error',
            center: true
          }]
        })
        // Vue.prototype.$alert(response.data.responseMessage||response.data.message||response.data.msg||response.config.url+'接口错误', '提示', {
        //   type: 'error',
        //   center: true
        // })
      }
    }
  },
  err => {
    if(includes(err.message,"code 500")||includes(err.message,"code 404")||includes(err.message,"code 400")||includes(err.message,"Network")){
      postal.publish({
        channel:'Web',
        topic:'Global.Alert',
        data: [
          '服务端错误，请联系管理员处理！',
          '提示',
          {type: 'error',
            center: true
          }]
      })
      // Vue.prototype.$alert('服务端错误，请联系管理员处理！', '提示', {
      //   type: 'error',
      //   center: true
      // })
    }
    return Promise.reject(err);
  }
);
// export default axios = (address) => {
//   axios.defaults.baseURL  =  address;
//   return axios
// }

export default class HttpRequest {
  constructor(httpConfig) {
    this.httpConfig = httpConfig
  }
  post(channel, url, params, isFormData, method){
    let serverPath = this.httpConfig[channel].path;
    let host = this.httpConfig[channel].host;
    let port = this.httpConfig[channel].port;
    return new Promise((resolve, reject) => {
      axios({
        url:`http://${host}:${port}/${serverPath}/${url}`,
        method: method || 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        data: isFormData ? qs.stringify(params) : params,
      }).then(response => {
        resolve( response )
      }).catch(err => {
        reject( err )
      })
    })
  }

  get(channel, url, params){
    let serverPath = this.httpConfig[channel].path;
    let host = this.httpConfig[channel].host;
    let port = this.httpConfig[channel].port;
    return new Promise((resolve,reject) => {
      axios({
        url:`http://${host}:${port}/${serverPath}/${url}`,
        method: 'GET',
        params: params
      }).then(response => {
        resolve(response)
      }).catch(err=>reject(err))
    })
  }
}
