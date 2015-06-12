var express = require('express')
  , azure = require('azure')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , blobs = require('./routes/blobs')
  , storage = require('./routes/storage')
  , azureTable = require('azure-table-node')
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
app.get('/users', user.list);
//app.get('/blobs', blobs.blobs);

var ob = {
    "entries": [
    {
        "name": "628x471.jpg",
        "properties": {
            "last-modified": "Wed, 13 May 2015 23:47:42 GMT",
            "etag": "0x8D25BEE56D5744D",
            "content-length": "60324",
            "content-type": "image/jpeg",
            "content-encoding": "",
            "content-language": "",
            "content-md5": "h52MZmNsp+g8lbYieW8T3A==",
            "cache-control": "",
            "content-disposition": "",
            "blobtype": "BlockBlob",
            "leasestatus": "unlocked",
            "leasestate": "available"
        }
    },
    {
        "name": "Pulse.wav",
        "properties": {
            "last-modified": "Wed, 13 May 2015 23:40:43 GMT",
            "etag": "0x8D25BED5C9C22CA",
            "content-length": "1422766",
            "content-type": "audio/wav, audio/x-wav",
            "content-encoding": "",
            "content-language": "",
            "content-md5": "toYxyXcvcW0fjDUvEhU3nw==",
            "cache-control": "",
            "content-disposition": "",
            "blobtype": "BlockBlob",
            "leasestatus": "unlocked",
            "leasestate": "available"
        }
    },
    {
        "name": "audio.mp4",
        "properties": {
            "last-modified": "Wed, 13 May 2015 23:40:52 GMT",
            "etag": "0x8D25BED62124E44",
            "content-length": "70552",
            "content-type": "application/octet-stream",
            "content-encoding": "",
            "content-language": "",
            "content-md5": "3CbUBBMkyUgDcKNjOw8JaA==",
            "cache-control": "",
            "content-disposition": "",
            "blobtype": "BlockBlob",
            "leasestatus": "unlocked",
            "leasestate": "available"
        }
    }
  ],
    "continuationToken": null
};



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

app.get('/blobs', function (req, res) {

    delete ob.continuationToken;
    console.log('KEYS: ' + Object.keys(ob));

    //    for (var myKey in ob) {
    //        if ('+myKey+' == 'entries') {
    //            console.log("key:" + myKey + ", value:" + ob[mykey]);
    //        if ('+myKey+' == 'continuationToken') {
    //            ob = delete ob['mykey'];
    //        }

    //            console.log("key:" + myKey + ", value:" + ob[myKey]);


    //        console.log("key:" + myKey + ", value:" + ob[myKey]);
    //        }
    var error;

    res.render('blobView', {
        title: 'All my Blobs',
        results: ob
    });
    //    }
});