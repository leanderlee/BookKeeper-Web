// Usage:
//   
//   var db = require('mongo').db;
//
//   db(table_name).save({});
//   db(table_name).find({}, function (found) { ... });
//

var config = require('../../config.conf');
var db = require('mongous').Mongous;
var oid = require("mongous/bson/bson.js").ObjectID;
db('').open();

var controllerNamePattern = new RegExp("[^/]*.js$", "gi");
var testControllerPattern = new RegExp("Controller.js$", "gi");
if (testControllerPattern.test(module.parent.id)) {
	var filename = controllerNamePattern.exec(module.parent.id)[0];
	console.log(" WARNING: Bad practice to require mongo in a controller (" + filename + ")\n");
}

exports.db = function (collection) {
	return db(config.mongodb + '.' + collection);
}
exports.oid = function (hash) {
	return new oid(hash);
}
