var bcrypt = require('bcrypt');

if(process.argv[2]) {

	console.log("Hashing " + process.argv[2]);

    bcrypt.genSalt(10, function(err, salt) {
      if (err) console.log(err);
      console.log("salt", salt);
      bcrypt.hash(process.argv[2], salt, function(err, hash) {
        // Store hash in your password DB.
        if (err) console.log(err);

        console.log(hash)
      });
    });
} else {
	console.log("pass a password, i.e. node make-password.js <your password>");
}