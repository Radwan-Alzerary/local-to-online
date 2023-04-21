var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var url = require("url");
var bodyParser = require('body-parser');

app.use(bodyParser());

var clientResponseRef;
app.get('/*', (req, res) => {
    handleRequest(req, res);
});

app.post('/*', (req, res) => {
    handleRequest(req, res);
});

function handleRequest(req, res) {
    var pathname = url.parse(req.url).pathname;

    var obj = {
        pathname: pathname,
        method: req.method.toLowerCase(),
        params: req.method === 'GET' ? req.query : req.body
    };

    io.emit("page-request", obj);
    io.once("page-response", (response) => {
        res.send(response);
    });
}

io.on('connection', (socket) => {
    console.log('a node connected');
    socket.on("page-response", (response) => {
        clientResponseRef.send(response);
    })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
http.listen(server_port, () => {
    console.log('listening on *:' + server_port);
})
