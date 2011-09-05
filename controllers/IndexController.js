//  MappedIn Inc.

var host = require('host').init({ layout: 'template.html' });

exports.route = function(server) {
	host.bind('/', controllers.home);
	host.serve(server);
};


var controllers = {};

controllers.home = function (page) {
	page.render('index.html');
}

