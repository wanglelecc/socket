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


var onlineUsers = {};
var onlineCount = 0;

/**
 * Creat Socket Server.
 */
var io = socketIo(server);
io.on('connection',function(client){

    // 监听自定义事件
    client.on('login',function(obj){
        // console.log(obj);
        client.uuid = obj.uuid; // 登录后将 socket 标记
        var token = obj.uuid;
        var data = {
            uuid : token,
            name : token
        };
        if(!onlineUsers.hasOwnProperty(token)){
            onlineUsers[token] = data;
            onlineCount++;
        }

        console.log(token+':加入了连接池.当前连接数：'+onlineCount);
    });

    client.on('disconnect',function(){
        if(onlineUsers.hasOwnProperty(client.uuid)){
            delete onlineUsers[client.uuid];
            onlineCount--;
            console.log(client.uuid+':从连接池移除.当前连接数：'+onlineCount);
        }
    });

    // 单发（自己）
    // client.emit('message',{body:"Hi..."});
    // 群发(包含自己)
    //io.emit('message',{body:"Hi s..."});
    //client.broadcast.emit('message',{body:"Hi ..."});
    // client.to('others').emit('message',{body:"others compress Hi s..."});
    // client.compress(false).emit('message',{body:" compress Hi s..."});

    // client.emit('connection',{body:"连接服务器成功."});
});


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);