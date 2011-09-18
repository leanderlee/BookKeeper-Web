//  Leander Lee

require.paths.unshift('./library');
require.paths.unshift('./library/core');

require('connect-redis');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var app = require('express');
var config = require('./config.conf');

var server = app.createServer();
process.on('uncaughtException', function (err) {
	console.error(err);
	console.log("Node NOT Exiting...");
});

server.register('.html', ejs);
server.set('views', path.resolve(config.templates));
server.set('view options', { layout: false, open: '{{', close: '}}' });
server.use(app.static(config.static));
server.use(app.errorHandler({ dumpExceptions: true, showStack: true }));
server.use(app.bodyParser());
server.use(app.cookieParser());
server.use(app.session({ secret: 'ASDFKL2@#$$%230jWpzo4Wm19480923AM9eKKf7sp18SDFMA>>DSA324<<!+~.@AJ$#AK(' }));

// Load Controllers
fs.readdir(config.controllers, function (err, files) {
	var handler_test = /\.js$/i;
	if (!err && files) {
		for (var i = 0; i < files.length; i++) {
			if (handler_test.test(files[i])) {
				var handler = require(config.controllers + '/' + files[i]);
				handler.route && handler.route(server);
			}
		}
	}
});

console.log('\n BookKeeper Web Client.\n   mode: ' + config.mode + '\n   port: ' + config.port + '\n');

server.listen(config.port);

