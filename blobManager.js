BlobManager = function (app) {
    var azure = require('azure')
      , global = require('./global')
      , io = require('socket.io')
      , azure_storage = require('azure-storage');

    var BlobProvider = require('./blobuploaddownload').BlobProvider;
    var blobProvider = new BlobProvider();

    //	blobProvider.insertUser({_id:1, name:'Rocky', city:'Omaha', state:'NE'}, function(a,b){});
    //	blobProvider.insertUser({_id:2, name:'Dave', city:'Stafford', state:'VA'}, function(a,b){});

    app.get('/blobs', function (req, res) {
        var container = 'webcontent';
        var hostName = 'https://biomed.blob.core.windows.net' + '/' + container;


        blobProvider.listBlobs(container, function (cb) {
            //            console.log('blobManager:  container: ' + container);

            res.render('blobView', {
                title: 'Foghorn',
                url: hostName,
                results: cb
            });
        });
    });

    app.post('/downloadBlobs', function (req, res) {
        var destinationDirectoryPath = req.body.blobFile;
        blobProvider.downloadBlobs(function (container, destinationDirectoryPath, cb) {
            res.send('200');
        });
    });

    app.get('/users', function (req, res) {
        blobProvider.fetchAllUsers(function (error, users) {
            res.send(users);
        });
    });

    app.post('/users', function (req, res) {
        blobProvider.insertUser(req.body, function (error, user) {
            if (error) {
                res.send(error, 500);
            } else {
                res.send(user);
            }
        });
    });

    app.get('/users/:id', function (req, res) {
        blobProvider.fetchUserById(req.params.id, function (error, user) {
            if (user == null) {
                res.send(error, 404);
            } else {
                res.send(user);
            }
        });
    });

    app.post('/users/:id', function (req, res) {
        var _user = req.body;
        _user._id = req.params.id;

        blobProvider.updateUser(_user, function (error, user) {
            if (user == null) {
                res.send(error, 404);
            } else {
                res.send(user);
            }
        });
    });

    /*	app.delete('/users/:id', function(req, res) {
    blobProvider.deleteUser(req.params.id, function(error, user) {
    if (user == null) {
    res.send(error, 404);
    } else {
    res.send(user);
    }
    });
    });
    */

    /////////////// socket server //////////////////////////
    //exports.sensorServer = http.createServer(app).listen(app.get('port'), function(){
    var sensorServer = app.listen(app.get('port'));
    var io = require('socket.io').listen(sensorServer); // this tells socket.io 
    //var sensorServer = (app).listen(app.get('port'), function () {
//    console.log("Express server listening on port " + app.get('port'));

    var sockets = {};

    io.sockets.on('connection', function (webSocket) {
        sockets[webSocket.id] = webSocket;
        //    webSocket.setTimeout(0);
        //    console.log("Total clients connected : ", Object.keys(sockets).length - disconnect);

        console.log("Total clients connect: " + webSocket.client.conn.server.clientsCount);
        var dopplerClientConnected = false;
        var username;

        webSocket.on('hello from Doppler client', function (name) {
            console.log('Doppler client is connected');
            dopplerClientConnected = true;
            console.log('Doppler payload = ' + JSON.stringify(name));
            ////////////////
            webSocket.name = name;
            var strLen = JSON.stringify(webSocket.client.conn.remoteAddress).substr(8).length;
            global.dopplerClients[global.IPaddressKey] = JSON.stringify(webSocket.client.conn.remoteAddress).substr(8).slice(0, strLen - 1);
            global.dopplerClients[global.socketIDKey] = webSocket.id;
            global.dopplerClients[global.nameKey] = name;

            console.log('Doppler name: ' + global.dopplerClients[global.nameKey]);
            console.log('Doppler IPaddress: ' + global.dopplerClients[global.IPaddressKey]);
            console.log('Doppler socketID: ' + global.dopplerClients[global.socketIDKey]);
            console.log('' + '\n');
            console.log("Total clients connected : ", webSocket.client.conn.server.clientsCount);

            ///////////////////////////////////////
            // Now we'll send an event to the Doppler client
            //
            // 3/17/2015 Modification:
            // We will enable the browser to send the sendAudio command to the sensor
            //webSocket.to(global.dopplerClients[global.socketIDKey]).emit('recordAudio', { data: 'bar!' });
            webSocket.emit('recordAudio', { data: 'bar!' });
        });

        ///////////////////////////////////////////////////
        //  Record the client disconnect event and decrement
        //  the total number of connected clients
        //
        webSocket.on('disconnect', function () {
            console.log('webSocket is disconnecting...');
            delete sockets[webSocket.id];
            console.log((new Date()) + ' ' + global.dopplerClients[global.nameKey] + ' ' + global.dopplerClients[global.IPaddressKey] + ' disconnected.');
            global.disconnect++;
            if (Object.keys(sockets).length - global.disconnect <= 0) {
                console.log("Total clients connected : 0");
            }
            else {
                console.log("Total clients connected : ", webSocket.client.conn.server.clientsCount);
            }
        });


        webSocket.on('error', function (data) {
            console.log('Error: ' + data);
        });

    });
    ///////// Websocket section above /////////////////////////////////////

};

exports.BlobManager = BlobManager;
