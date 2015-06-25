// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

/**
* 1. Demonstrates how to upload all files from a given directory in parallel
* 
* 2. Demonstrates how to download all files from a given blob container to a given destination directory.
* 
* 3. Demonstrate making requests using AccessConditions.
*/
var azure = require('azure')
  , azure_storage = require('azure-storage')
  , url = require('url')
  , path = require('path')
  , express = require('express');

var exports = module.exports = {};

var fs = require('fs');
if (!fs.existsSync) {
    fs.existsSync = require('path').existsSync;
}

var azure;
if (fs.existsSync('./../../lib/azure.js')) {
    azure = require('./../../lib/azure');
} else {
    azure = require('azure');
}

exports.BlobConstants = azure.Constants.BlobConstants;
exports.ServiceClient = azure.ServiceClient;
exports.CloudBlobClient = azure.CloudBlobClient;

var util = require('util');
var fs = require('fs');

BlobProvider = function () {

    //var blob = 'updownsample';
    //var blobAccess = 'updownaccesssample';
    var blobService = null;

    function time() {
        //    var now = new Date();
        //    console.log(now);

        var now = new Date();
        var jsonDate = now.toJSON();
        var time = jsonDate.replace('T', '_');
        console.log(time);
        var myTime = time.replace('.', ':');
        var theTime = myTime.substring(0, myTime.length - 1);

        theTime = theTime + '.mp3';

        return theTime;
    }



    this.createBlobService = function createBlobService() {
        blobService = azure.createBlobService(
        AZURE_STORAGE_ACCOUNT = 'biomed',
        AZURE_STORAGE_ACCESS_KEY = 'sB8G27x+fJ+UO5GPJNc9ztOawInooN2KV0QTs5YqQCzJDJQ/lHNx3+MuQCx/fQXNNCcUGIV3+5rBRxe35rstJg=='
    );
        console.log('created Blob Service...');
    }
    var processArguments = process.argv;

    this.createContainer = function createAContainer(container) {
        // Step 0: Create the container.
        console.log('container name = ' + container);
        var container = container;
        blobService.createContainerIfNotExists(container, {
            publicAccessLevel: 'blob'
        }, function (error, result, response) {
            if (error) {
                console.log(error);
            } else {
                if (result == true) {
                    console.log('Created the container ' + container);
                } else {
                    console.log('Unable to create container ' + container);
                }

                //            uploadSample();
            }
        });
    }

    ////////////////////////////////////////////////////
    //  Creating an audio blob and sending it to Storage
    //  This will be done on an andjustable cadence with
    //  a default preset to 60 seconds
    //
/*    this.recordAudio = function recordAudio(container, cb) {
        container = container;

        this.createBlobService();
        this.createContainer(container);

        // TODO Record the audio and store it as an mp3 in the media folder        


        var sourceDirectoryPath = path.join(__dirname, '/media/');
        sourceDirectoryPath = path.join(sourceDirectoryPath, 'pulse.wav');
        this.createBlockBlobFromLocalfile(sourceDirectoryPath, container);
    }
*/
    this.uploadSample = function uploadSample() {
        // Sample 1 : Demonstrates how to upload all files from a given directoy
        uploadBlobs(processArguments[2], container, function () {

            // Sample 2 : Demonstrates how to download all files from a given
            // blob container to a given destination directory.
            downloadBlobs(container, processArguments[3], function () {

                // Sample 3 : Demonstrate making requests using AccessConditions.
                requestAccessConditionSample(container);
            });
        });
    }

    ////////////////////////////////////////////////////
    //  Uploading a blob
    //
    this.createBlockBlobFromLocalfile = function createBlockBlobFromLocalfile(container, sourceDirectoryPath) {
        var fileNameTime = time();
        var blobService = azure.createBlobService(
            AZURE_STORAGE_ACCOUNT = 'biomed',
            AZURE_STORAGE_ACCESS_KEY = 'sB8G27x+fJ+UO5GPJNc9ztOawInooN2KV0QTs5YqQCzJDJQ/lHNx3+MuQCx/fQXNNCcUGIV3+5rBRxe35rstJg=='
        );

        // Step 0 : validate directory is valid.
        if (!fs.existsSync(sourceDirectoryPath)) {
            console.log(sourceDirectoryPath + ' is an invalid directory path.');
        } else {
            blobService.createBlockBlobFromLocalFile(container, fileNameTime, sourceDirectoryPath, function (error, result, response) {
                if (!error) {
                    console.log('Created blob ...');
                } else {
                    console.log('Error: ' + error);
                }
            })
        }
    }
    this.uploadBlobs = function uploadBlobsToStorage(sourceDirectoryPath, container, callback) {
        // Step 0 : validate directory is valid.
        if (!fs.existsSync(sourceDirectoryPath)) {
            console.log(sourceDirectoryPath + ' is an invalid directory path.');
        } else {
            listFilesUpload(sourceDirectoryPath, container, callback);
        }
    }

    this.listFilesUpload = function listFilesForUpload(sourceDirectoryPath, container, callback) {
        // Step 1 : Search the directory and generate a list of files to upload.
        walk(sourceDirectoryPath, function (error, files) {
            if (error) {
                console.log(error);
            } else {
                uploadFilesParallel(files, container, callback);
            }
        });
    }

    this.uploadFilesParallel = function uploadFilesInParallel(files, container, callback) {
        var finished = 0;

        // Step 3 : generate and schedule an upload for each file
        files.forEach(function (file) {
            var blobName = file.replace(/^.*[\\\/]/, '');

            blobService.createBlockBlobFromFile(container, blobName, file, function (error) {
                finished++;

                if (error) {
                    console.log(error);
                } else {
                    console.log('Blob ' + blobName + ' upload finished.');

                    if (finished === files.length) {
                        // Step 4 : Wait until all workers complete and the blobs are uploaded
                        // to the server.
                        console.log('All files uploaded');
                        callback();
                    }
                }
            });
        });
    }

    /*
    exports.listBlobsSegmented = blobService.listBlobsSegmented(container, null, function (error, result, response) {
    if (!error) {
    console.log(result);
    }
    });
    */


    this.listBlobs = function listBlobs(container, res) {
        if (!container) {
            var container = 'webcontent';
        }

        var blobService = azure.createBlobService(
            AZURE_STORAGE_ACCOUNT = 'biomed',
            AZURE_STORAGE_ACCESS_KEY = 'sB8G27x+fJ+UO5GPJNc9ztOawInooN2KV0QTs5YqQCzJDJQ/lHNx3+MuQCx/fQXNNCcUGIV3+5rBRxe35rstJg=='
        );
        console.log('blobuploaddownload: container: ' + container);

        blobService.listBlobsSegmented(container, null, function (error, result) {
            if (error) {
                console.log('listBlobsSegmented: ' + error);
                res.render('index', {
                    error: error
                });
            } else {
                delete result.continuationToken;
                //                console.log('KEYS: ' + Object.keys(result));

                var keys = [];
                for (var key in result) {
                    if (result.hasOwnProperty(key))
                        keys.push(key);
                }
//                result[keys[0]].sort(function(a,b) { 
//                    return parseFloat(a.last-modified) - parseFloat(b.last-modified)
//                });

                console.log(result[keys[0]]);
                /*
                for (var key.properties in key) {
                if (key.hasOwnProperty(subkey)) {
                var val = key[subkey];
                console.log(val);
                }
                }
                //var url = blobService.getUrl(containerName, file.name, null, hostName);

                */

                res(result);
            };
        });
    }

    this.downloadBlobs = function downloadAllBlobs(container, destinationDirectoryPath, callback) {
        var fs = require('fs');

        if (!fs.existsSync) {
            fs.existsSync = require('path').existsSync;
        }

        // Step 0. Validate directory
        if (!fs.existsSync(destinationDirectoryPath)) {
            console.log(destinationDirectoryPath + ' is an invalid directory path.');
        } else {
            downloadFilesParallel(container, destinationDirectoryPath, callback);
        }
    }

    this.downloadFilesParallel = function downloadFilesInParallel(container, destinationDirectoryPath, callback) {
        // NOTE: does not handle pagination.
        blobService.listBlobs(container, function (error, blobs) {
            if (error) {
                console.log(error);
            } else {
                var blobsDownloaded = 0;

                blobs.forEach(function (blob) {
                    blobService.getBlobToFile(container, blob.name, destinationDirectoryPath + '/' + blob.name, function (error2) {
                        blobsDownloaded++;

                        if (error2) {
                            console.log(error2);
                        } else {
                            console.log('Blob ' + blob.name + ' download finished.');

                            if (blobsDownloaded === blobs.length) {
                                // Step 4 : Wait until all workers complete and the blobs are downloaded
                                console.log('All files downloaded');
                                callback();
                            }
                        }
                    });
                });
            }
        });
    }

    this.getBlobToStream = function (container, fileName, res) {
        //    var blobService = azure.createBlobService();

        blobService.getBlobProperties(container, fileName, function (error, properties, status) {
            if (error || !status.isSuccessful) {
                res.header('Content-Type', "text/plain");
                res.status(404).send("File " + fileName + " not found");
                res.end();
            }
            else {
                res.header('Content-Type', properties.contentType);
                res.header('Content-Disposition', 'attachment; filename=' + fileName);
                //            blobService.createReadStream(container, fileName).pipe(res);
                res = blobService.createReadStream(container, fileName);
                var emit = io.sockets.connected[browserSocketID].emit('audio', res);

                res.end();
            }
        });
    };


    this.requestAccessConditionSample = function requestTheAccessConditionSample(container) {
        // Step 1: Create a blob.
        blobService.createBlockBlobFromText(container, blobAccess, 'hello', function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Created the blob ' + blobAccess);
                downloadBlobProperties(container, blobAccess);
            }
        });
    }

    this.downloadBlobProperties = function downloadAllBlobProperties(container, blobName) {
        // Step 2 : Download the blob attributes to get the ETag.
        blobService.getBlobProperties(container, blobName, function (error, blob) {
            if (error) {
                console.log(error);
            } else {
                console.log('Blob Etag is: ' + blob.etag);
                testAccess(container, blobName, blob.etag);
            }
        });
    }

    this.testAccess = function testBlobAccess(container, blobName, etag) {
        // Step 2: Use the If-not-match ETag condition to access the blob. By
        // using the IfNoneMatch condition we are asserting that the blob needs
        // to have been modified in order to complete the request. In this
        // sample no other client is accessing the blob, so this will fail as
        // expected.

        var options = { accessConditions: { 'If-None-Match': etag} };
        blobService.createBlockBlobFromText(container, blobName, 'new hello', options, function (error) {
            if (error) {
                console.log('Got an expected exception. Details:');
                console.log(error);
            } else {
                console.log('Blob was incorrectly updated');
            }
        });
    }

    if (processArguments.length > 5 || processArguments.length < 4) {
        console.log('Incorrect number of arguments');
    } else if (processArguments.length == 5) {
        // Adding a third argument on the command line, whatever it is, will delete the container before running the sample.
        blobService.deleteContainer(container, function (error) {
            if (error) {
                console.log(error);
            } else {
                createContainer();
            }
        });
    } else {
        createContainer();
    }

    // Utilitary functions

    var walk = function (dir, done) {
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, results);
                file = dir + '/' + file;
                fs.stat(file, function (err2, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (err3, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    };
};
exports.BlobProvider = BlobProvider;
