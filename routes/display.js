var azure = require('azure');
var azure_storage = require('azure-storage');


exports.blobs = function (req, res) {

//res.send("respond with a resource");

    var accessKey = 'sB8G27x+fJ+UO5GPJNc9ztOawInooN2KV0QTs5YqQCzJDJQ/lHNx3+MuQCx/fQXNNCcUGIV3+5rBRxe35rstJg==';
    var storageAccount = 'biomed';
    var container = 'webcontent';

    var blobService = azure.createBlobService(storageAccount, accessKey);



