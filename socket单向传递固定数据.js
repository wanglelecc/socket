/**
 * Created by wll on 2016/10/21.
 */
var app = require('express')();

var redis = require("redis");
var redisClient = redis.createClient();

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
var b2w = io.of('/b2w').on('connection',function(client){

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

    // 监听数据上传
    client.on('upload',function(data){
        // 将上传的数据推送到显示器
        display.emit('push',data);
    });

    // 单发（自己）
    // client.emit('message',{body:"Hi..."});
    // 群发(包含自己)
    //b2w.emit('message',{body:"Hi s..."});
    //client.broadcast.emit('message',{body:"Hi ..."});
    // client.to('others').emit('message',{body:"others compress Hi s..."});
    // client.compress(false).emit('message',{body:" compress Hi s..."});

    // client.emit('connection',{body:"连接服务器成功."});
});


// 显示器端
var onlineDisplay = 0;
var display = io.of('/display').on('connection',function(client){
    // 连接上了..
    onlineDisplay++;
    console.log('.当前显示端连接数：'+onlineDisplay);

    client.on('disconnect',function(){
        onlineDisplay--;
        console.log('.当前显示端连接数：'+onlineDisplay);
    });
});




/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);