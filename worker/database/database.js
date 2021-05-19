/*
 * @Descripttion: 数据库操作
 * @version: 
 * @Author: xdh.ss
 * @Date: 2020-04-02 10:55:04
 * @LastEditors: xdh.ss
 * @LastEditTime: 2020-04-03 14:51:56
 */
import loki from 'lokijs';
import Promise from 'bluebird';

const DB = new loki('aoc.db' );

const flight_schedule_body_DB = DB.addCollection('flight_schedule_body', {
    unique: ['id','flightId']
});

flight_schedule_body_DB.ensureUniqueIndex('id');


export const clear_DB = () => {//保存header所有数据
    flight_schedule_body_DB.clear()
}

export const save_data_schedule_body_DB = data => {//保存body所有数据
    let flight = data.flight || {}
    flight_schedule_body_DB.clear()
    Promise.all([
        save_to_flight_schedule_body_DB(flight),
    ]).then(()=>{
        
    })
}

export const get_data_schedule_body_DB = () => {//获取body所有数据
    return new Promise((resolve, reject) => {
        Promise.props({
            flight_body:get_flight_schedule_body_data()
        }).then(res=>{
            var data = {
                flight:res.flight_body,
                process:res.process_body[0]
            }
            if (data) {
                resolve(data);
            } else {
                reject(null);
            }
        })
    })
}

//fight_body

export const save_to_flight_schedule_body_DB = data => {//保存flightbody信息
    return new Promise((resolve, reject) => {
        if (data) {
            flight_schedule_body_DB.insert(data);
            resolve(data);
        } else {
            reject(null);
        }

    })
}

export const get_flight_schedule_body_data = () => {//获取flightbody数据
    return new Promise((resolve, reject) => {
        let data = flight_schedule_body_DB.chain().find().data();
        if (data) {
            resolve(data);
        } else {
            reject(null);
        }
    })
}

export const add_update_flight_data = async (data) => {//flightbody 更新
    
    let list =  await get_flight_item(data) || {}
    list = _.extend(list, data)
    if (list.$loki) {
        flight_schedule_body_DB.update(list)
    } else {
        flight_schedule_body_DB.insert(list)
    }
}

export const get_flight_item = data => {//获取单个item信息
    let bodyData = flight_schedule_body_DB.chain().find().data()
    let result = _.find(bodyData,flight=>{
        return flight.flightId==data.flightId||(flight.successionFlight?flight.successionFlight.flightId==data.flightId:false)
    })
    return new Promise((resolve) => {
        resolve(result);
    })
}

export const del_flight_item = async (data) => {//flight 删除
    let list =  await get_flight_item(data) 
    list = _.extend(list,data)
    if(list){
        flight_schedule_body_DB.remove(list)
    }
    
}



















































































































