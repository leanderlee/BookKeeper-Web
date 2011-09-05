
var Request = function (req, res, defaults) {
	return {
		protect: function () {
			if (req.session.authenticated) {
				if (typeof(page) == 'function') {
					page.call(null);
				} else {
					this.render(res, page, params);
				}
			} else {
				this.render(res, defaults.login);
			}
		},
		headers: function () {
			return req.headers;
		},
		accepts: function (mime) {
			return (req.headers.accept.indexOf(mime) >= 0);
		},
		set: function (name, value) {
			req.session[name] = value;
		},
		get: function (name) {
			return req.session && req.session[name];
		},
		param: function (name, def) {
			return req.param(name, def || '');
		},
		redirect: function (url) {
			res.writeHead(302, { 'Location': url });
			res.end();
		},
		json: function (obj) {
			//res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(obj));
		},
		write: function (str) {
			res.end(str);
		},
		render: function (template, params) {
			params = params || {};
			for (var i in defaults) {
				if (params[i] == undefined) {
					params[i] = defaults[i];
				}
			}
			res.render(template, params);
		}
	};
};

var Host = function (defaults) {
	var bindings = {};
	return {
		bind: function (url, controller) {
			bindings[url] = controller;
		},
		serve: function (server) {
			var serve_controller = function (url, controller) {
				controller = controller || {};
				if (typeof(controller['get']) == 'function') {
					server.get(url, function (req, res) {
						var page = new Request(req, res, defaults);
						controller['get'].call(null, page);
					});
				}
				if (controller['post']) {
					server.post(url, function (req, res) {
						var page = new Request(req, res, defaults);
						controller['post'].call(null, page);
					});
				}
				if (controller['put']) {
					server.put(url, function (req, res) {
						var page = new Request(req, res, defaults);
						controller['put'].call(null, page);
					});
				}
				if (controller['del']) {
					server.del(url, function (req, res) {
						var page = new Request(req, res, defaults);
						controller['del'].call(null, page);
					});
				}
				if (controller['delete']) {
					server.del(url, function (req, res) {
						var page = new Request(req, res, defaults);
						controller['delete'].call(null, page);
					});
				}
				if (controller['all']) {
					server.all(url, function (req, res) {
						var page = new Request(req, res, defaults);
						controller['all'].call(null, page);
					});
				}
				if (typeof(controller) == 'function') {
					server.all(url, function (req, res) {
						var page = new Request(req, res, defaults);
						controller.call(null, page);
					});
				}
			};
			for (var url in bindings) {
				serve_controller(url, bindings[url]);
			}
		}
	};
};

exports.init = function (options) {
	options = options || {};
	return new Host(options);
};
