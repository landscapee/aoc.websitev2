import {getFlightDetail} from "../lib/storage";
import { forEach,map,flow,orderBy} from 'lodash';
import {memoryStore} from "../../worker/lib/memoryStore";
import moment from 'moment';

export const getFlightDatas = (data,blo) => {
    let arr=[];
    if(blo){
        arr={}
        map(data,(k,l)=>{
                arr[l]=[]
            map(k,(item)=>{
                if(getFlightDetail(item.flightId)){
                    arr[l].push(getFlightDetail(JSON.stringify(item.flightId)))
                }
            })
        })
    }else{
        map(data,(k,l)=>{
            if(getFlightDetail(k.flightId)){
                arr.push(getFlightDetail(JSON.stringify(k.flightId)))
            }
        })
    }
    return arr
}
export const grounpStatus = (res,key) => {
    let data={

    }
    let criticalNoRequested = [];
    let criticalRequested = [];
    forEach(res, (item) => {
        // status 0:未协调 1:已协调 2:已拒绝
        if (!item.overStationStatus && item.overStationStatus !== 0) {
            criticalNoRequested.push(item);
        } else {
            criticalRequested.push(item);
        }
    });
    data[key+'_noRequested']=getFlightDatas(criticalNoRequested)
    data[key+'_requested']=getFlightDatas(criticalRequested)

    return data
}

export const transRunwayData=(worker)=>{
    let obj={
        '01':'19', '19': '01', '02':'20', '20':'02', '11':'11'
    }
    let runwayObj={}
    let normalTimeObj={}
    let delayTimeObj={}
     let monitorQueue= memoryStore.getItem('Pools').monitorQueue
    let runwayModels= memoryStore.getItem('Pools' ).runwayModels
    if(monitorQueue&&runwayModels){
        map(runwayModels,(k,l)=>{
            let o={...k,runway:k.runway,delayLen:0,normalLen:0,delay:[],normal:[]}
            runwayObj[k.runway]=o
             runwayObj[obj[k.runway]]=o

        })
        // 分类
        let classifyFn=(data,key,checkObj)=>{
            let len=key+'Len'
            map(data,(k,l)=>{
                let time=moment(k.ctot).format('HH:mm')
                let o=checkObj[k.runway]&&checkObj[k.runway][k.ctot]
                if(o){
                    //  时间ctot 为 k.ctot 重复时  o.len为前一个 ctot的 大数组下标
                    runwayObj[k.runway][key][o.len].push({...k,displayCTOT:time})
                }else{
                    //记录 时间ctot 为 k.ctot 项的下标
                    checkObj[k.runway]={[k.ctot]:{len:runwayObj[k.runway][len]}}
                    runwayObj[k.runway][key].push([{...k,displayCTOT:time}])
                    runwayObj[k.runway][len]=runwayObj[k.runway][len]+1
                }
            });
        }

        classifyFn(monitorQueue.normal,'normal',normalTimeObj)
        classifyFn(monitorQueue.delay,'delay',delayTimeObj)
        let endObj={}
        map(runwayModels,(k,l)=>{
            endObj[k.runway]=runwayObj[k.runway]
        })
        worker.publish('Web','runwayModels',endObj)
        // worker.publish('Web','runwayModels',{monitorQueue,runwayModels})

        // map(monitorQueue.normal,(k,l)=>{
        //     let time=moment(k.ctot).format('HH:mm')
        //     let o=normalTimeObj[k.runway][k.ctot]
        //     if(o){
        //         runwayObj[k.runway].delay[o.len].push({...k,displayCTOT:time})
        //     }else{
        //         normalTimeObj[k.runway][k.ctot]={len:num}
        //         runwayObj[k.runway].delay=[[{...k,displayCTOT:time}]]
        //         num++
        //     }
        // });
    }
}


export const situationStart = (posWorker) => {
   posWorker.subscribe('Situation.Change.Sync',(data)=>{

  })
}

export const situationStop = (posWorker) => {
  posWorker.unsubscribe('Situation.Change.Sync')
 }


