BlobManager = function (app) {
    var azure = require('azure')
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

    app.get('/hello from Doppler client', function (req, res) {
        res.send('recordAudio');
    });

    app.get('/recordAudio', function (req, res) {
        var container = 'webcontent';
        var hostName = 'https://biomed.blob.core.windows.net' + '/' + container;


        blobProvider.recordAudio(container, function (cb) {
            //            console.log('blobManager:  container: ' + container);
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
};



exports.BlobManager = BlobManager;
