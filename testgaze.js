var gaze = require('gaze');
 
// Watch all .js files/dirs in process.cwd() 
gaze('media/**/*.wav', function(err, watcher) {
  // Files have all started watching 
  // watcher === this 
    console.log('watching ...');
 
  // Get all watched files 
//  this.watched(function(watched) {
//    console.log(watched);
//  });
 
  // On file changed 
  this.on('changed', function(filepath) {
    console.log(filepath + ' was changed');
  });
 
  // On file added 
  this.on('added', function(filepath) {
    console.log(filepath + ' was added');
  });
 
  // On file deleted 
  this.on('deleted', function(filepath) {
    console.log(filepath + ' was deleted');
  });
 
  // On changed/added/deleted 
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
  });
 
  // On error
  this.on('error', function (err) {
      console.log('gaze error: ' + err);
  });

  // Get watched files with relative paths 
  this.relative(function(err, files) {
    console.log(files);
  });
});
 
// Also accepts an array of patterns 
gaze(['stylesheets/*.css', 'images/**/*.png'], function() {
  // Add more patterns later to be watched 
  this.add(['js/*.js']);
});