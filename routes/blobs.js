var azure = require('azure');
var azure_storage = require('azure-storage');


exports.blobs = function (req, res) {

//res.send("respond with a resource");

    var accessKey = 'sB8G27x+fJ+UO5GPJNc9ztOawInooN2KV0QTs5YqQCzJDJQ/lHNx3+MuQCx/fQXNNCcUGIV3+5rBRxe35rstJg==';
    var storageAccount = 'biomed';
    var container = 'webcontent';

//    var blobService = azure.createBlobService(storageAccount, accessKey);
    console.log('created blobService in blobs.js');
//    res.send("respond with a resource");

    res.render('blobs', {
        uri: 'https://biomed.blob.core.windows.net/webcontent?restype=container&comp=list',
        error: error,
        container: container,
        blobs: blobs
    });


/*
    //render blobs with blobs.jade view
    blobService.listBlobs(container, function (error, blobs) {
        res.render('blobs', {
            error: error,
            container: container,
            blobs: blobs
        });
    });
*/
}