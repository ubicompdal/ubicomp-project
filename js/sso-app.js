//author: Kip Williams
//date: July 20th, 2013
//version 1.0

//this is a helper function for the sso
//it provides some business logic ontop of the widget
// some routing mostly.

var root = _.initial(location.pathname.split('/')).join('/');
var routes = {
	login: "http://" + window.location.host + root + "/login.html",
	home: "http://" + window.location.host + root + "/index.html"
}

var widget = AuthWidget({
	container: '[data-role="authWidget"]',
	signinControl: '[data-role="signin"]',
	revokeControl: '[data-role="revoke"]'
});

widget.addEvent("login:failure", function () {
	var href = window.location.href;
	if (href && href.indexOf("login.html") === -1)
		window.location.href = routes.login;
});
widget.addEvent("revoke:successful", function () {
	var href = window.location.href;
	if (href && href.indexOf("login.html") === -1)
		window.location.href = routes.login;
});

//this will be called by google  with the token information for  the attempted login.
function signinCallback(token) {
	widget.signIn(token);
}
