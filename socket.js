/**
 * Created by wll on 2016/10/21.
 */
var app = require('express')();

var redis = require("redis");
var redisClient = redis.createClient(); // 可加参数连接

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
        client.username = obj.username; // 登录后将 socket 标记

        var token = obj.username;
        var data = {
            uuid : obj.uuid,
            name : obj.username
        };
        if(!onlineUsers.hasOwnProperty(token)){
            onlineUsers[token] = data;
            onlineCount++;
        }

        console.log(obj.username+':加入了连接池.当前B2W连接数：'+onlineCount);
    });

    client.on('disconnect',function(){
        if(onlineUsers.hasOwnProperty(client.uuid)){
            delete onlineUsers[client.uuid];
            onlineCount--;
            console.log(client.uuid+':从连接池移除.当前B2W连接数：'+onlineCount);
        }
    });

    // 监听数据上传
    client.on('upload',function(data){
        // 将上传的数据推送到显示器
        //display.emit('push',data);
        guangbo(client.username,data);
    });
});

// 指定单播数据
function guangbo(username,data) {
    // if(onlineDisplayUsers.hasOwnProperty(username)){
    //     onlineDisplayUsers[username].socket.emit('push',data);
    // }
    if(redisClient.hexists('onlineDisplayUsers',username)){
        var data = redisClient.hget('onlineDisplayUsers',username);
        data.socket.emit('push',data);
    }
}


// 显示器端
var onlineDisplay = 0;
var onlineDisplayUsers = {};

var display = io.of('/display').on('connection',function(client){
    // 监听自定义事件
    client.on('login',function(obj){
        // console.log(obj);
        client.uuid = obj.uuid; // 登录后将 socket 标记
        client.username = obj.username; // 登录后将 socket 标记

        var token = obj.username;
        var data = {
            uuid : token,
            name : obj.username,
            socket : client
        };

        // if(!onlineDisplayUsers.hasOwnProperty(token)){
        //     onlineDisplayUsers[token] = data;
        //     onlineDisplay++;
        // }
        // HEXISTS
        if(redisClient.hexists('onlineDisplayUsers',token)){
            redisClient.hmset('onlineDisplayUsers',data);
            onlineDisplay++;
        }

        console.log(obj.username+':加入了连接池.当前显示端连接数：'+onlineDisplay);
    });

    client.on('disconnect',function(){
        if(redisClient.hexists('onlineDisplayUsers',client.username)){
            redisClient.hdel('onlineDisplayUsers',client.username)
            onlineDisplay--;
            console.log(client.username+':从连接池移除.当前显示端连接数：'+onlineDisplay);
        }
        // if(onlineDisplayUsers.hasOwnProperty(client.username)){
        //     delete onlineDisplayUsers[client.username];
        //     onlineDisplay--;
        //     console.log(client.username+':从连接池移除.当前显示端连接数：'+onlineDisplay);
        // }
    });

});




/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);