/*
 * @Descripttion: 数据ws链接模块
 * @version:
 * @Author: xdh.ss
 * @Date: 2020-04-02 17:30:40
 * @LastEditors: xdh.ss
 * @LastEditTime: 2020-04-03 16:31:57
 */
import postal from 'postal';
import {omit} from 'lodash'

import {
    add_update_flight_data,
    get_flight_item,
} from '../database/database';

let getDataSocket = null

export const init = (data) => {

};

// socket链接 channel
const ws_channel = {
    flight_info: '/flight/info', // 航班信息

}


export const send_message = (data)=>{
    getDataSocket.socket_emit(data.path,omit(data, ['path']))
}

export const close_socket = ()=>{
    if(getDataSocket){
        getDataSocket.socket_close()
    }
}


function socket_on_fun(){
    getDataSocket.socket_on(ws_channel.flight_info, async data => {//航班信息
        if(data.option=="update"){
            let item = await get_flight_item(data.data)
            if(!item){return false}//航班存在在更新
            await add_update_flight_data(data.data);//更新DB
            postal.publish({
                channel: 'web.aoc',
                topic: 'update_flight_body',
                data: data.data
            });
        }else{
            data.data.flight.map(async flight=>{
                await add_update_flight_data(flight)
            })


            postal.publish({
                channel: 'web.aoc',
                topic: 'add_flight_body',
                data: data.data
            });
        }
    });
}



