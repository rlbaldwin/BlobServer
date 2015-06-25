SocketManager = function (app) {
    var client = require('socket.io-client')
    , azure = require('azure')
    , azure_storage = require('azure-storage')
    , fs = require('fs')
    , spawn = require('child_process').spawn
    , watch = require('watch')
    , path = require('path');

    var inputStream;
    var sockets = {};
    var development;

    exports.development = process.env.development;
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    // Below represents the client conversation to the webserver
    //
    if(development=true) {
        var webSocket = client.connect('http://192.168.3.106:3000', { 'force new connection': true });
        console.log('development=true');
    } else {
//    var webSocket = client.connect('https://biomed.blob.core.windows.net', { 'force new connection': true });
        var webSocket = client.connect('http://foghorn.azurewebsites.net', { 'force new connection': true });
        console.log('development=false');
    }

    console.log('Trying to connect to server ...');

    webSocket.on('connect', function (webSocket) {
        // sockets[webSocket.id] = webSocket;
        //    console.log("Total clients connected : ", Object.keys(sockets).length);
        console.log("clientSocketManager is connected to the server");
    });

    webSocket.emit('hello from Doppler client', 'Doppler1');

    webSocket.on('recordAudio', function (data) {
        //    sockets[webSocket.id] = webSocket;
        //    console.log("Total clients connected : ", Object.keys(sockets).length);
        console.log("Received recordAudio from the server");
        var timeOut;
        var blob;
        var audBuf = new Buffer([]);


        var container = data;
        if (!container) {
            var container = 'webcontent';
        }

        var blobService = azure.createBlobService(
            AZURE_STORAGE_ACCOUNT = 'biomed',
            AZURE_STORAGE_ACCESS_KEY = 'sB8G27x+fJ+UO5GPJNc9ztOawInooN2KV0QTs5YqQCzJDJQ/lHNx3+MuQCx/fQXNNCcUGIV3+5rBRxe35rstJg=='
        );
        console.log('clientSocketMgr: container= ' + container);

        /////////// Clean up media directory of wav files ///////////////////
        var files = [];
        var path = '/media/temp/Sensor/media';
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                fs.unlinkSync(curPath);
            })
        };
/*        
        ////////////////////////////////////////////////////////////////////

        //        var dopplerStream = fs.createWriteStream(__dirname + '/media' + '/' + Date.now() + ".mp3", { flags: 'a' });
        var watcher = spawn('watcher.js', [], { stdio: ['pipe', 'pipe', 'pipe'] });
//        var watcher = spawn('node', ['./watchAndUpload.js']);
        console.log('Spawned watcher with pid: ' + watcher.pid);

        // watcher.unref();

        watcher.on('data', function (data) {
        console.log('Got some data from watcher ...');
        });

        watcher.on('error', function (error) {
        console.log('watcher error: ' + error);
        });

        watcher.on('exit', function () {
        console.log('watcher exited');
        });

        watcher.on('close', function () {
        console.log('watcher has stopped watching and closed');
        });
*/

        var watch = spawn('node', ['./watchAndUpload.js']);

        watch.on('data', function (data) {
            console.log('watch output: ' + data);
        });

        watch.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        watch.on('close', function () {
            console.log('watch.js has closed');
            //            dopplerStream.drain();
        });

        watch.on('error', function (err) {
            console.log('watch ERROR: ' + err);
        });



        inputStream = spawn('arecord', [
        '-D', 'plughw:0,0',  // USB microphone
        '-r', 48000,    // sample rate
//        '-c', '1',      // mono
       '-f', 'S16_LE',     // (16 bit little endian, 44100, stereo) [-f S16_LE -c2 -r44100]
        '--max-file-time', '30',  // will close current file and open a new one
        //        '-d', '5'       // duration=5 seconds
        '/media/temp/Sensor/media/Doppler1_.wav'
        ]);
        //        ], { stdio: ['pipe', 'pipe', 'pipe'] });
        console.log('Spawned arecord to capture USB microphone');

        inputStream.on('data', function (data) {
            console.log('Adding to the output buffer ...');
        });

        inputStream.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
            //data.pipe(dopplerStream);
        });

        inputStream.on('exit', function () {
            console.log('inputStream exited');
        });

        inputStream.on('close', function () {
            console.log('inputStream has stopped recording and closed');
            //            dopplerStream.drain();
        });



        /*
        setTimeout(function() {
        console.log('Sending stdin to terminal');
        terminal.stdin.write('echo "Hello $USER. Your machine runs since:"\n');
        terminal.stdin.write('uptime\n');
        console.log('Ending terminal session');
        terminal.stdin.end();
        }, 1000);
        */

    });


    webSocket.on('error', function (err) {
        console.log(err); // 'not authorized' not output,  
    });
};



exports.SocketManager = SocketManager;
