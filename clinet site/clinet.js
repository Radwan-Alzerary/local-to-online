var sockerServerUrl = "https://hzgroup.net/";
var hostToLive = "http://localhost:8080";
var socket = require('socket.io-client')(sockerServerUrl)
const { response } = require('express');
const superagent = require('superagent');

socket.on('connect',function(){
    console.log("connected");
})

socket.on('disconnect',function(){
    console.log("connection lost");
})

socket.on('page-request',function(data){
    var path = data.pathname;
    var method = data.method;
    var params = data.params

    var localhosturl = hostToLive + path
    
    if(method == "get")executeget(localhosturl,params);
    else if(method == "post")executePost(localhosturl,params);
})

function executeget(url,params){
    superagent.get(url)
    .query(params)
    .end((err,response)=>{
        if(err){return console.log(err); }
        socket.emit('page-response',response.text)
    })
}


function executePost(url,params){
    superagent.post(url)
    .query(params)
    .end((err,response)=>{
        if(err){return console.log(err); }
        socket.emit('page-response',response.text)
    })
}