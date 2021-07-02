import FlightDetails from './index.vue';

const FlightDetailsObj = {};
let checkObj = (obj) => {
    return Object.prototype.toString.call(obj) === "[object Object]" && obj.id;
}
FlightDetailsObj.install = function (Vue) {
    const FlightDetailsExtend = Vue.extend(FlightDetails)
    let FlightInstance
    let initInstance = (vm) => {
        FlightInstance = new FlightDetailsExtend()
        let ele = FlightInstance.$mount().$el
        document.body.appendChild(ele) //、把元素放入VM实例，VM实例销毁元素销毁，放入body需要手动销毁
        // document.body.appendChild(ele)
    }
    let removeEle=(vm)=>{
         let ele=FlightInstance.$mount().$el
        document.body.removeChild(ele)
     }
    if (!FlightInstance) {
        initInstance()
    }
    FlightInstance.open({})
    //  Vue.prototype.$removeFlight=removeEle
    Vue.prototype.$FlightDetais = {
        open:function (obj, vm) {
            // if (!vm) {
            //     throw  '使用 function $openFlightDetais 请传入当前VM实例';
            // }
            if (checkObj(obj)) {
                if (!FlightInstance) {
                    initInstance()
                }
                FlightInstance.open({...obj}).then((d)=>{
                    removeEle()
                    FlightInstance=null
                })
            } else {
                throw  '使用 function $openFlightDetais 请传入一个包含 id 的 object';
            }
        },
        // destroy(){
         //     removeEle()
        //     FlightInstance=null
        // }
    }
}
export default FlightDetailsObj