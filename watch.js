var watch = require('watch')
watch.createMonitor('.', function (monitor) {
    console.log('monitoring files');

    monitor.files['media/.wav'] // Stat object for my zshrc.
    monitor.on("created", function (f, stat) {
        console.log(f +' was created');
        // Handle new files
    })
    monitor.on("changed", function (f, curr, prev) {
        console.log(f +' was changed');
        // Handle file changes
    })
    monitor.on("removed", function (f, stat) {
        console.log(f +' was removed');
        // Handle removed files
    })
//    monitor.stop(); // Stop watching
})