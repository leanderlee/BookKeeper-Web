//  MappedIn Inc.

var host = require('host').init({ layout: 'template.html' });
var User = require('User');

exports.route = function(server) {
	host.bind('/', controllers.home);
	host.bind('/logout', controllers.logout);
	host.bind('/login', controllers.login);
	host.bind('/signup', controllers.signup);

	host.serve(server);
};


var controllers = {};

controllers.home = function (page) {
	if (page.get("auth") || true) {
		page.render('index.html', { user: { email: "me@leander.ca" } });
		//page.render('index.html', { user: page.get("user") });
	} else {
		page.render("login.html", { email: "" });
	}
};

controllers.logout = function (page) {
	page.set("auth", false);
	page.redirect("/");
};

controllers.login = {
	get: function (page) {
		page.redirect("/");
	},
	post: function (page) {
		var email = page.param("email");
		if (email) {
			User.authorize(email, page.param("password"),
			function (err, user) {
				if (!err) {
					page.set("auth", true);
					page.set("user", user);
					page.redirect("/");
				} else {
					page.render("login.html", { error: err.message, email: email })
				}
			});
		} else {
			page.redirect("/");
		}
	}
};

controllers.signup = {
	get: function (page) {
		page.render("signup.html");
	},
	post: function (page) {
		User.register(page.param("email"), page.param("password"),
		function (err, user) {
			if (!err) {
				page.set("auth", true);
				page.set("user", user);
				page.redirect("/");
			} else {
				page.render("signup.html", { error: err.message });
			}
		})
	}
};
