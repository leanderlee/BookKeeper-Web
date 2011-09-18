//  Leander Lee

var mongo = require('mongo').db;
var bcrypt = require('bcrypt');


exports.find = function(email, callback) {
	callback = callback || function(){};
	mongo('user').find({ email: email }, function (found) {
		callback.call(this, null, found.documents);
	});
};


exports.register = function (email, password, callback) {
	exports.find(email, function(err, users) {
		if (users.length == 0) {
			callback = callback || function(){};
			
			var user = {};
			user.email = email;
			user.work_factor = 10;
			user.salt = bcrypt.gen_salt_sync(user.work_factor);
			var hashed_password = bcrypt.encrypt_sync(password, user.salt);
			user.password = hashed_password || '';
			
			mongo('user').save(user);
			callback.call(null, null, user);
		} else {
			callback.call(null, { message: "User already exists." });
		}
	});
};


exports.authorize = function(email, password, callback) {
	exports.find(email, function (err, users) {
		if (users.length > 0) {
			var user = users[0];
			if (bcrypt.compare_sync(password, user.password)) {
				callback.call(null, null, user);
			} else {
				callback.call(null, { message: "Invalid email/password combination." });
			}
		} else {
			callback.call(null, { message: "Invalid email/password combination." });
		}
	});
};
