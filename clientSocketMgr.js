SocketManager = function (app) {
    var client = require('socket.io-client')
    , mic = require('microphone')
    , fs = require('fs')
    , path = require('path');

    var sockets = {};
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    // Below represents the client conversation to the webserver
    //
    //    var webSocket = client.connect('http://192.168.3.104:3000', { 'force new connection': true });
    var webSocket = client.connect('http://192.168.1.125:3000', { 'force new connection': true });
    console.log('Trying to connect to server ...');

    webSocket.on('connect', function (webSocket) {
        sockets[webSocket.id] = webSocket;
        //    console.log("Total clients connected : ", Object.keys(sockets).length);
        console.log("clientSocketManager is connected to the server");
    });

    webSocket.emit('hello from Doppler client', 'Doppler1');

    webSocket.on('recordAudio', function (webSocket) {
        //    sockets[webSocket.id] = webSocket;
        //    console.log("Total clients connected : ", Object.keys(sockets).length);
        console.log("Received recordAudio from the server");
        var timeOut;
        var blob;

        var dopplerStream = fs.createWriteStream(__dirname + '/media' + '/' + Date.now() + ".mp3", { flags: 'a' });

//  arecord -q -f cd -r 44100 -c2 -t raw | lame -S -x -h -b 128 - `date +%Y%m%d%H%M`.mp3

        var inputStream = spawn('arecord', [
        '-D',
        'plughw:0,0','-f', 'cd'
        ], { stdio: ['pipe', 'pipe', 'pipe'] });
        console.log('Spawned arecord to capture USB microphone');

        inputStream.on('data', function (data) {
            data.pipe(dopplerStream);
        });

        inputStream.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        inputStream.on('exit', function () {
            console.log('inputStream exited');
        });

        timeOut = setTimeout(function () {
            inputStream.end();
        }, 5000);


/*
        mic.startCapture({ 'mp3output': true });

        mic.audioStream.on('data', function (data) {
            data.pipe(dopplerStream);
        });

        mic.audioStream.on('end', function () {
            mic.stopCapture();            
        });


        timeOut = setTimeout(function () {
            mic.stopCapture();
        }, 5000);
*/


    });


    webSocket.on('error', function (err) {
        console.log(err); // 'not authorized' not output,  
    });
};



exports.SocketManager = SocketManager;
