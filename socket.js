/**
 * Created by wll on 2016/10/21.
 */
var app = require('express')();

var http = require('http');
var socketIo = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = 3001;

/**
 * Create HTTP server.
 */

var server = http.createServer(app);


/**
 * Creat Socket Server.
 */
var io = socketIo(server);
io.on('connection',function(client){
    console.log('a user connected');

    // 监听自定义事件
    client.on('login',function(data){

    });

    // 监听断开事件
    client.on('disconnect',function(){
        console.log('断开连接.');
    });

    // 单发（自己）
    // client.emit('message',{body:"Hi..."});
    // 群发(包含自己)
    //io.emit('message',{body:"Hi s..."});
    client.broadcast.emit('message',{body:"Hi ..."});
    // client.to('others').emit('message',{body:"others compress Hi s..."});
    // client.compress(false).emit('message',{body:" compress Hi s..."});

});


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);