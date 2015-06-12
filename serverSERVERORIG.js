/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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

var BlobManager = require('./blobManager').BlobManager;
var blobManagerService = new BlobManager(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

    ////////////////////////////////////////////////


    //    listBlobs(res, container);
    /*
    blobSerice.listBlobs(container, function (res, container) {
    res.render('blobView', {
    error: error,
    container: 'webcontent',
    blobs: JSON(res)
    });

    rest.get ('https://biomed.blob.core.windows.net/webcontent?restype=container&comp=list').on('complete', function(result){
    res.render('display.ejs', { 
    title: 'List of Blobs',
    serverBlobs: blobs
    });
    });
    */

