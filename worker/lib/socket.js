import io from 'socket.io-client';
import postal from 'postal';

class socket{
    constructor(path,option){
        this.path = path;
        this.option = option
        this.socket = null;
    }
    // 创建socket，并返回成功或失败状态
    socket_start(){
        // 创建io链接
        this.socket = io.connect(`${this.path}`, this.option);
        // 链接成功
        this.socket.on('connect', () => {
            console.log('开始连接')
        });
        // 链接错误
        this.socket.on('connect_error', err => {
            console.error('链接错误' + this.path, err)
        });
        // 超时
        this.socket.on('connect_timeout', err => {
            console.error('链接超时' + this.path, err)
        })
        // 超时
        this.socket.on('disconnect', err => {
            console.log('断开连接'+ this.path, err)
        })
        this.socket.on('reconnect', data=>{
            console.log('重连成功'+ this.path,data);
            postal.publish({
                channel:'web.aoc',
                topic:'reconnect_socket_connect'
            })
        });
        // 重新链接次数
        this.socket.on('reconnect_attempt', attempt => {
            if(attempt>30){
                this.socket_close()
                postal.publish({
                    channel:'web.aoc',
                    topic:'disconnect_socket_connect',
                    data:this.path
                })
            }
        })
    }
    //socket接收后台数据函数，返回promise
    socket_on(path, callback){
        this.socket.on(path, data => {
            setTimeout(() => {//异步处理
                callback(data);
            }, 0);
        });
    }
    //socket发送数据到后台
    socket_emit(path, data){
        this.socket.emit(path, data)
    }
    //手动关闭socket
    socket_close(){
        this.socket.close()
    }
    //socket手动重连
    socket_open(){
        this.socket.open()
    }
}

export default socket;