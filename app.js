// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);

process.on('uncaughtException', function(err) {
    console.log("Uncaught exception!", err);
});
