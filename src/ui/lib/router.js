
import Vue from 'vue';
import router from '../router'
import store from '../store'
import postal from 'postal';
import axios from "axios";
import {httpConfig} from "@/lib/interfaces";
let loginFlag = 0;
let hasIfm = self!=top//是否被镶嵌
let socketInterfaceType = window.webConfig.socketInterfaceType
router.beforeEach((to, from, next) => {

    if(to.name=="login"){//登陆页清空信息
        loginFlag=0
        sessionStorage.clear()
		store.commit("resetStore",null)

		postal.publish({
            channel: 'worker.aoc',
            topic: 'socket_close',
        });
        postal.publish({
            channel: 'worker.aoc',
            topic: 'clear_lockjs',
		});
        next()
    }else{
        if(hasIfm){
            next()
        }else{
            if(sessionStorage.token&&sessionStorage.token!=undefined){
                let host = httpConfig['login'].host;
                let port = httpConfig['login'].port;
                axios({
                    method:"post",
                    // url:httpConfig['login'] 'api-login/sso/login/authorizeToken',
                    url:`http://${host}:${port}/${httpConfig['login'].path}/authorizeToken`,
                    dataType:"text",
                    data:sessionStorage.token,
                    async:false,
                    headers:{
                        'Content-Type':'application/json;charset=utf-8'
                    }
                })
                .then(res=>{
                    if(res&&res.responseCode=='1000'){
                        postal.publish({
                            channel: 'Worker',
                            topic: 'LoginSuccess',
                            data: res.data
                        })
                        next()
                    }
                })

            }else{
                next()
            }
        }

    }

})

router.afterEach(()=>{
    if(sessionStorage.token&&loginFlag==0){
        loginFlag = 1
        postal.publish({//建立socket
            channel:'worker.aoc',
            topic:'build_socket_connect',
            data:{
                token:sessionStorage.token,
                origin,
                path:'/'+socketInterfaceType+'/websocket/socket.io'
            }
        })
        postal.subscribe({
            channel:'web.aoc',
            topic:'disconnect_socket_connect',
            callback:data => {
                Vue.prototype.$alert(`socket(${data})连接失败，请联系管理处理！`, '提示', {
                    type: 'error',
                    center: true
                })
            }
        })
    }
})

export default router
