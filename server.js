/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var clientProc = process.env.CLIENT;
console.log('clientProc = ' + clientProc);

if(!clientProc || '') { clientProc = 'false'};
console.log('clientProc = ' + clientProc);

app.configure(function () {
    if (clientProc == 'true') {
        app.set('port', process.env.PORT || 4000);
    } else {
        app.set('port', process.env.PORT || 3000);
    }
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/users', user.list);

exports.sensorServer = http.createServer(app).listen(app.get('port'), function(){
//var sensorServer = (app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


var BlobManager = require('./blobManager').BlobManager;
var blobManagerService = new BlobManager(app);

//var SocketManager = require('./serverSocketMgr').SocketManager;
//var socketManagerService = new SocketManager(sensorServer);

var foundSocketMgr;

if(clientProc == 'true') {
    try {
        var SocketManager = require('./clientSocketMgr').SocketManager;
        var socketManagerService = new SocketManager(app);
        console.log('Found clientSocketMgr ...');
    }
    catch (err) {
        console.log('Unable to locate clientSocketMgr');
        console.log(err);
    }
}
else {

    try {
        var SocketManager = require('./serverSocketMgr').SocketManager;
        var socketManagerService = new SocketManager(app);
        console.log('Found serverSocketMgr');
    }
    catch (err) {
        console.log('Unable to locate any SocketMgrs');
        console.log(err);
    }
}

