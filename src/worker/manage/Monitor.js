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
                arr.push({...getFlightDetail(JSON.stringify(k.flightId)), ...k})
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
            zIndex--
            k.zIndex=zIndex
        })
        map(runwayModels, (k, l) => {
            let o = {...k, runway: k.runway, delayLen: 0, normalLen: 0, delay: [], normal: []}
            runwayObj[k.runway] = o
            duo_one[k.runway] = k.runway
            runwayObj[obj[k.runway]] = o
            duo_one[obj[k.runway]] = k.runway
        })
        // 分类

        let classifyFn = (data, key) => {
            let len = key + 'Len'
            let checkObj = {}
            // let zIndex = 1000 //设置层级 时间越小 层级越高
            map(data, (k, l) => {
                // 转换跑到
                let paodao = duo_one[k.runway]
                let shifen = moment(k.actualTime || k.eta || k.ctot).format('HH_mm')
                let o = checkObj[paodao] && checkObj[paodao][shifen]
                if (o) {
                    // 同一 跑到 同一 shifen 的放入一个数组
                    runwayObj[paodao][key][o.len].push({...k})
                    // zIndex--
                } else {
                    //记录 同一个跑到 不同 shifen 的大数组下标
                    checkObj[paodao] = checkObj[paodao] || {}
                    checkObj[paodao][shifen] = {len: runwayObj[paodao][len]}
                    runwayObj[paodao][key].push([{...k}])
                    runwayObj[paodao][len] = runwayObj[paodao][len] + 1
                    // zIndex--
                }
            });
            // checkObj
            // debugger
        }

        classifyFn(monitorQueue.normal, 'normal')
        classifyFn(monitorQueue.delay, 'delay')
        let endObj = []
        let usage = null
        map(runwayModels, (k, l) => {
            if (k.usage == 3) {
                usage = runwayObj[k.runway]
            } else {
                endObj.push(runwayObj[k.runway])
            }
        })
        usage && endObj.push(usage)
        worker.publish('Web', 'runwayModels', endObj)
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
    posWorker.subscribe('Situation.Change.Sync', (data) => {

    })
}

export const situationStop = (posWorker) => {
    posWorker.unsubscribe('Situation.Change.Sync')
}


