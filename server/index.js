const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8989);

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

io.of('/flight').on('connection', (socket) => {
    socket.emit('connect', {hello: 'world'});
    socket.on('test', (data) => {
        socket.emit('test', 'news-two发送数据')
    });
});
