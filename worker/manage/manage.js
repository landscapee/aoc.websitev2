import postal from 'postal';
import {
    clear_DB,
} from '../database/database';
import {init as fpmsinit,send_message,close_socket} from '../channel/channel';



postal.subscribe({//初始化socket
    channel: 'worker.aoc',
    topic: 'build_socket_connect',
    callback: data => {
        fpmsinit(data)
    }
})

postal.subscribe({//消息发送后台
    channel: 'worker.aoc',
    topic: 'send_message',
    callback: data => {
        send_message(data)
    }
})

postal.subscribe({//关闭socket
    channel: 'worker.aoc',
    topic: 'socket_close',
    callback: () => {
        close_socket()
    }
})

postal.subscribe({//清空lock数据
    channel: 'worker.aoc',
    topic: 'clear_lockjs',
    callback: () => {
        clear_DB()
    }
})

postal.subscribe({//数据保存DB
    channel: 'worker.aoc',
    topic: 'save_data_schedule_body',
    callback: data => {
        
    }
})


