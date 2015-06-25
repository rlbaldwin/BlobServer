var watch = require('watch')
    , fs = require('fs')
    , azure = require('azure')
    , azure_storage = require('azure-storage')

console.log('in the watchAndUpload file.  Calling watch next...');
// Watch all .wav files/dirs in media directory

watch.createMonitor('.', function (monitor) {
    console.log('monitoring files');

    var BlobProvider = require('./blobuploaddownload').BlobProvider;
    var blobProvider = new BlobProvider();

    monitor.files['media/.wav'] // Stat object for my zshrc.
    monitor.on("created", function (f, stat) {
        console.log(f + ' was created');
        // Handle new files
        var container = 'webcontent';
        var filepath = f;

        setTimeout(function() {
//            fs.unlink(filepath, function (err) {
//                if (err) throw err;
//                    console.log('successfully deleted ' + filepath);
//                });
//            }, 30000);

            blobProvider.createBlockBlobFromLocalfile(container, filepath, function (cb) {
                console.log('watchAndUpload: uploading ' + filepath + ' to ' + container);
                if (error) {
                    console.log('Error: ' + error);
                } else {
                    setTimeout(function() {
                        fs.unlink(filepath, function (err) {
                            if (err) console.log('Deleting the local file failed');
                            console.log('successfully deleted ' + filepath);
                        });
                    }, 4000);
                }
            });
        }, 30000);

    })

    monitor.on("changed", function (f, curr, prev) {
        console.log(f + ' was changed');
        // Handle file changes
    })

    monitor.on("removed", function (f, stat) {
        console.log(f + ' was removed');
        // Handle removed files
    })

    // On error
    monitor.on('error', function (err) {
        console.log('watch error: ' + err);
    });

    //    monitor.stop(); // Stop watching
})



/*
gaze('/media/temp/Sensor/media/*.wav', function (err, watcher) {
    var BlobProvider = require('./blobuploaddownload').BlobProvider;
    var blobProvider = new BlobProvider();

    console.log('Watching files in the media directory');

    // Files have all started watching 
    // watcher === this 

    // Get all watched files 
    this.watched(function (watched) {
        console.log(watched);
    });

    // On file changed 
    this.on('changed', function (filepath) {
        console.log(filepath + ' was changed');
    });

    // On file added 
    this.on('added', function (filepath) {
        console.log(filepath + ' was added');

        var container = 'webcontent';

        blobProvider.createBlockBlobFromLocalfile(container, filepath, function (cb) {
            console.log('watchAndUpload: uploading ' + filepath + ' to ' + container);
            if (error) {
                console.log('Error: ' + error);
            } else {
                //                setTimeout(function() {
                //                    fs.unlink(filepath, function (err) {
                //                        if (err) throw err;
                console.log('successfully deleted ' + filepath);
                //                    });
                //                }, 4000);
            }
        });
    });

    // On file deleted 
    this.on('deleted', function (filepath) {
        console.log(filepath + ' was deleted');
    });

    // On changed/added/deleted 
    this.on('all', function (event, filepath) {
        console.log(filepath + ' was ' + event);
    });

    // On error
    this.on('error', function (err) {
        console.log('gaze error: ' + err);
    });

    // Get watched files with relative paths 
    this.relative(function (err, files) {
        console.log(files);
    });
});
*/