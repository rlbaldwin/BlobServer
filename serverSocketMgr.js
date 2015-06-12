SocketManager = function (app) {
    var server = require('./server.js');
    //    var http = require('http').sensorServer(app);
    var io = require('socket.io')(server.sensorServer);

    var sockets = {};

    //    var io = require('socket.io').listen(app, { log: false });

    io.on('connection', function (socket) {
        console.log('New connection from ' + socket.id);
        sockets[socket.id] = socket;
        console.log("Total clients connect: " + socket.client.conn.server.clientsCount);

        socket.on('hello from Doppler client', function (name) {
            console.log('Doppler client is connected');
            console.log('Doppler payload = ' + JSON.stringify(name));
            ////////////////
            socket.name = name;
            var emit = socket.to(socket.id).emit('recordAudio');
            console.log('Emitted recordAudio command ...');
        });

        socket.on('error', function(err) {  
            console.log(err); // 'not authorized' not output,  
        });  
    });

    io.on('disconnect', function () {
        console.log('webSocket is disconnecting...');
        delete sockets[socket.id];
        if (Object.keys(sockets).length - global.disconnect <= 0) {
            console.log("Total clients connected : 0");
        }
        else {
            console.log("Total clients connected : ", socket.client.conn.server.clientsCount);
        }
    });

};

exports.SocketManager = SocketManager;