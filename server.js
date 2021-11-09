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


const url = 'https://olymp168.com/api/';
const token='b2x5bXAxNjhAZ21haWwuY29tOkAxMjNANDU2'
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




//io.emit('notify_receive', {success:"true"});

// setInterval(function(){
//     console.log("Thanh toán");
//         var data_api = { 
//                     detect:"thanhtoantructiep",
//                     type_manager:"check_status_all"
//              }; 
//         var url_api=url+"?detect=thanhtoantructiep&type_manager=check_status_all"      
//         axios.post(url,data_api, {
//             headers: {
//                 'Authorization': 'Basic '+token,
//             },
//         }).then((res) => {
//             console.log(res.data);
//             list_customer=res.data.list_customer;
//             if(list_customer!=null)
//             {
//                 list_customer.forEach(element => {
//                     io.to(element.id_customer).emit('notify_receive', {success:"true",message:"Thanh toán thành công",amount:element.amount});
//                 });
//             }
            
//             //
//         }).catch((error) => {

//         })
// },10000000)



