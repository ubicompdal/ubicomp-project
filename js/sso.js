<<<<<<< HEAD
//kip
=======
   var AuthWidget = function (_options) {

            var eventClass = function () {
                this._callbacks = {};
            };
            eventClass.prototype = {
                addEvent: function (evname, callback) {
                    if (!this._callbacks[evname])
                        this._callbacks[evname] = $.Callbacks();
                    this._callbacks[evname].add(callback);
                },
                removeEvent: function (evname, callback) {
                    if (!this._callbacks[evname])
                        return;
                    this._callbacks[evname].remove(callback);
                },
                triggerEvent: function () {
                    var evname = _.first(arguments);
                    var args = _.rest(arguments);
                    if (!this._callbacks[evname])
                        return;
                    this._callbacks[evname].fire.apply(this, args);
                }
            };

            var defaults = {
                signinControl: "[data-role='signin']",
                revokeControl: "[data-role='revoke']",
                container: 'body'
            };

            var options = _.extend(defaults, _options);
           
            function disconnectUser(access_token) {
                $.ajax({ type: 'GET', url: 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token, async: false, contentType: "application/json", dataType: 'jsonp' })
                .success(function () {
                    $(options.revokeControl, options.container).hide();
                    $(options.signinControl, options.container).show();
                    obj.triggerEvent("revoke:successful");
                    obj.profile = undefined;
                    obj.token = undefined;
                }).error(function (e) {
                    obj.triggerEvent("revoke:failure", e);
                });
            }

            function signIn(authResult) {
                obj.token = undefined;
                obj.profile = undefined;
                if (authResult['error']) {
                    obj.triggerEvent("login:failure", authResult['error']);
                    return;
                }

                obj.token = authResult['access_token'];

                $(options.revokeControl, options.container).show();
                $(options.signinControl, options.container).hide();

                obj.triggerEvent("login:successful");

                gapi.client.load('oauth2', 'v2', function () {
                    gapi.client.oauth2.userinfo.get()
                        .execute(function (profile) {
                            obj.profile = profile;
                            obj.triggerEvent("loaded:profile", profile);
                        });
                });
            }

            function setupSigninButton() {                
                $(options.revokeControl, options.container).on('click', function (ev) {
                    ev.preventDefault();
                    disconnectUser(obj.token);
                });
            };

            function loadGoogleApi() {

                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = 'https://apis.google.com/js/client:plusone.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            };

            function setupInternalEvents() {
                obj.addEvent("login:failure", function (err) {
                    console.log('login error: ' + err);
                });

                obj.addEvent("revoke:failure", function (err) {
                    console.log("revoke error: " + err);
                });

                obj.addEvent("login:successful", function () {
                    console.log("login was successful");
                });

                obj.addEvent("revoke:successful", function () {
                    console.log("revoke login was successful");
                });

                obj.addEvent("loaded:profile", function (profile) {
                    console.log("sucessfully loaded profile");
                    console.log(profile)
                });
            };

            var obj = _.extend(new eventClass(), {
                init: function () {
                    setupSigninButton(options);
                    loadGoogleApi(options);
                    setupInternalEvents(options);
                },

                signIn: function (token) {
                    signIn(token);
                }
            });

            obj.options = options;
            obj.init();
            return obj;
        };
>>>>>>> origin/sso
