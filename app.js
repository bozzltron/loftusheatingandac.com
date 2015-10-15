// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);

// handle errors
process.on('uncaughtException', function(err) {
    console.log("Uncaught exception!", err);
});
