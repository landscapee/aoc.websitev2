import FlightDetails from './index.vue';

const FlightDetailsObj = {};
let checkObj = (obj) => {
    return Object.prototype.toString.call(obj) === "[object Object]" && obj.flightId;
}
FlightDetailsObj.install = function (Vue) {
    const FlightDetailsExtend = Vue.extend(FlightDetails)
    let FlightInstance
    let initInstance = (vm) => {
        FlightInstance = new FlightDetailsExtend()
        let ele =FlightInstance?.$mount&& FlightInstance.$mount().$el;
        document.body.appendChild(ele) //、把元素放入VM实例，VM实例销毁元素销毁，放入body需要手动销毁
        // document.body.appendChild(ele)
    }
    let removeEle=(vm)=>{
         let ele=FlightInstance?.$mount&&FlightInstance.$mount().$el
        ele&&document.body.removeChild(ele)
        FlightInstance=null
     }


     Vue.prototype.$FlightDetais = {
        open:function (obj, blo) {
            //  校验object是否 包含 flightId
            if (checkObj(obj)) {
                if (!FlightInstance) {
                    initInstance()
                }
                // FlightInstance.open 返回的是一个promise  关闭弹窗会 resolve()
                FlightInstance.open({...obj}).then((d)=>{
                    //blo为true的话  关闭弹窗就会 移除这个 弹窗组件，
                    if(blo){
                        removeEle()
                    }
                })
            } else {
                throw  '使用  $FlightDetais.open 请传入一个包含 flightId 的 object';
            }
        },
         // 这个方法是手动移除 弹窗组件
        destroy(){
             removeEle()
         }
    }
 }
export default FlightDetailsObj
