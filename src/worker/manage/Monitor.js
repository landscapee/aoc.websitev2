import {getFlightDetail} from "../lib/storage";
import {forEach, map, flow, orderBy, extend} from 'lodash';
import {memoryStore} from "../../worker/lib/memoryStore";
import moment from 'moment';
import {flightDB} from "@/worker/lib/storage";

export const getFlightDatas = (data, blo) => {
    let arr = [];
    if (blo) {
        arr = {}
        map(data, (k, l) => {
            arr[l] = []
            map(k, (item) => {
                if (getFlightDetail(item.flightId)) {
                    arr[l].push({...getFlightDetail(JSON.stringify(item.flightId)), ...item})
                }
            })
        })
    } else {
        map(data, (k, l) => {
            if (getFlightDetail(k.flightId)) {
                let flightId=k.flightId+''
                arr.push({...getFlightDetail(flightId),...k})
            }
        })
    }
    return arr
}
export const grounpStatus = (res, key, key1) => {
    let data = {}
    let criticalNoRequested = [];
    let criticalRequested = [];
    forEach(res, (item) => {
        // status 0:未协调 1:已协调 2:已拒绝
        if (!item[key1] && item[key1] !== 0) {
            criticalNoRequested.push(item);
        } else {
            criticalRequested.push(item);
        }
    });

    data[key + '_noRequested'] = getFlightDatas(criticalNoRequested)
    data[key + '_requested'] = getFlightDatas(criticalRequested)

    return data
}

export const transRunwayData = (worker, time) => {
    let obj = {
        '01': '19', '19': '01', '02': '20', '20': '02', '11': '11'
    }
    let duo_one = {}
    let runwayObj = {}
    let monitorQueue = memoryStore.getItem('Pools').monitorQueue
    let runwayModels = memoryStore.getItem('Pools').runwayModels
    let noRunWay=[[],[],[]]
    // let noRunWay={delay:[],normal:[]}
    if (monitorQueue && runwayModels) {
        if (time) {
            let arr = [time.startTime, time.startTime + 30 * 60 * 1000]
            let flights = flightDB.find({$or: [{atd: {$jbetween: arr}}, {ata: {$jbetween: arr}}, {eta: {$jbetween: arr}}, {ctot: {$jbetween: arr}}]});
            let normal = map(flights, (f) => {
                return extend({actualTime: f.atd || f.ata || f.eta || f.ctot}, f);
            });
            monitorQueue = {normal, delay: []}
        }
        let orderByFn = (data) => orderBy(data, ['actualTime', 'eta', 'ctot'], ['asc'])

        //按时间排序 后面处理层级 时间越小 层级越高
        // monitorQueue.normal = orderByFn(monitorQueue.normal)
        // monitorQueue.delay = orderByFn(monitorQueue.delay)
        let arr= orderByFn([...monitorQueue.delay,...monitorQueue.normal])
        let zIndex = 1000 //设置层级 时间越小 层级越高
        map(arr,(k,l)=>{
            if(k.runway){
                zIndex--
                k.zIndex=zIndex
            }
        })
        map(runwayModels, (k, l) => {
            // delayLen: 0, normalLen: 0,
            let o = {...k, runway: k.runway, delay: [], normal: []}
            runwayObj[k.runway] = o
            duo_one[k.runway] = k.runway
            runwayObj[obj[k.runway]] = o
            duo_one[obj[k.runway]] = k.runway
        })
        // 分类
        let classifyFn = (data, key) => {
            // let len = key + 'Len'
            let checkObj = {}
            // A进港 D离港
            let mapNoRunWay={delay:2,D:1,A:0}
             map(data, (k, l) => {
               // 过滤 未匹配 跑到
                if(!duo_one[k.runway]){
                    // 处理无跑到数据
                    if(!k.runway){
                        let s=key=='delay'?'delay':k.movement
                        noRunWay[mapNoRunWay[s]].push(k)
                    }
                    return
                }
                // 转换跑到
                let paodao = duo_one[k.runway]
                let shifen = moment(k.actualTime || k.eta || k.ctot).format('HH_mm')
                let o = checkObj[paodao] && checkObj[paodao][shifen]
                if (o) {
                    // 同一 跑到 同一 shifen 的放入一个数组
                    runwayObj[paodao][key][o.len].push({...k})
                 } else {
                    // runwayObj[paodao][key]=[[{},{}],[[{}]]
                    // runwayObj[paodao][key] 表示同一个跑到的 delay 或 normal a[index]表示同一 时分 段的数据 合
                    //记录 同一个跑到 不同 shifen 的大数组下标
                    checkObj[paodao] = checkObj[paodao] || {}
                    checkObj[paodao][shifen] = {len: runwayObj[paodao][key].length}

                     runwayObj[paodao][key].push([{...k}])
                    // runwayObj[paodao][len] = runwayObj[paodao][len] + 1
                 }
            });
            // checkObj
            // debugger
        }

        classifyFn(monitorQueue.normal, 'normal')
        classifyFn(monitorQueue.delay, 'delay')
        let runway = []
        let usage = null
        map(runwayModels, (k, l) => {
            if (k.usage == 3) {
                usage = runwayObj[k.runway]
            } else {
                runway.push(runwayObj[k.runway])
            }
        })
        usage && runway.push(usage)
        map(noRunWay,(k,l)=>{
            noRunWay[l]= orderByFn(k)
        })
        worker.publish('Web', 'runwayModels', {runway,noRunWay})

    }
}


export const situationStart = (posWorker) => {
    posWorker.subscribe('push.runway.Data', () => {
        transRunwayData(posWorker )
    });
}

export const situationStop = (posWorker) => {
    posWorker.unsubscribe('push.runway.Data')
}


