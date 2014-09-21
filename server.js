
var express = require('express');

var app = express();
var socket = require('socket.io');
app.configure(function(){
    app.use(express.static(__dirname + '/'));
});
var server = app.listen(8000);
var io = socket.listen(server);
io.set('log level', 2);

players = [];
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

io.sockets.on('connection', function (socket) {
    console.log('Client connected from: ' + socket.handshake.address.address);
    // setTimeout(function () {
    //     socket.send(JSON.stringify({'text': 'waited 2 seconds'}) );
    // }, 2000);

    socket.on('disconnect', function () {
        console.log("disconnect");
        if (socket.username) {
            socket.broadcast.emit('m5', JSON.stringify( {'name': socket.username} ));
            players.splice(players.indexOf(socket.username), 1);
        }
    });

    socket.on('m1', function (data) {
        // get coordinates and rotation
        socket.broadcast.emit('m2', data);
    });
    socket.on('m5', function (data) {
        // new listener, send connected players
        console.log('--new listener, send player list' + JSON.stringify(players));
        socket.emit('m6', JSON.stringify(players) );
    });

    socket.on('m3', function (data) {
        // new player, get name from client
        obj = JSON.parse(data);

        if (obj.name == undefined) obj.name = 'user'+players.length
        console.log('-- new player: '+obj.name)
        // send all players
        socket.emit('m6', JSON.stringify(players) );

        if (! (players.indexOf(obj.name) > -1) )  {
           players.push(obj.name)
           socket.username = obj.name
           console.log(players)
           socket.broadcast.emit('m4', JSON.stringify(obj));
        }
    });
});
