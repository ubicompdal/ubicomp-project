var root = "ubicomp-project";
var routes = {
    login: "http://" + window.location.host + "/" + root + "/login.html",   
    home: "http://" + window.location.host + "/" + root + "/index.html"
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

function signinCallback(token) {
    widget.signIn(token);
}