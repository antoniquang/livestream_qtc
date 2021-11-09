const express = require("express");
const app = express();
const axios = require('axios');
const cors = require("cors");
const cron = require("node-cron");
const mysql = require("mysql2");

var server = require("http").Server(app);
const io = require('socket.io')(server, {
    pingTimeout: 86400000,
    pingInterval: 1000,
    cors: {
        origin: '*',
    }
});

server.listen(process.env.PORT || 3000);


var arr_chat=[];

io.on('connection', function(socket) {
    console.log(socket.id + "connect thành công");

    socket.on("join_room",data=>{
        console.log("join room");
        console.log(arr_chat);
        var id_tran=data.id_tran;
        socket.join(id_tran);
        console.log(typeof arr_chat[id_tran]);
        if(typeof arr_chat[id_tran] === 'undefined')
        {
            arr_chat[id_tran]=[];
            console.log(111);
        }
        io.to(socket.id).emit("content_chat",arr_chat[id_tran])    
    })
    socket.on('send_chat', data=> {
        arr_chat[data.id_tran].push(data);
        if(arr_chat[data.id_tran].length==11)
        {
            arr_chat[data.id_tran].shift();
        }
        io.to(data.id_tran).emit("send_chat_ed",data)  
        console.log(arr_chat);
    });
});






