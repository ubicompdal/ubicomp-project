//author: Kip Williams
//date: July 20th, 2013
//version 1.0

//this provides a widget wrapper around the google single sign on for authenticating a person with their google+ profile.

   var AuthWidget = function (_options) {

            var eventClass = function () {
                this._callbacks = {};
            };

            //backbone class, this is used for events in the system
            eventClass.prototype = {
                //add an event, provide it an event name, and a callback function
                //it will add the callback to the named event
                addEvent: function (evname, callback) {
                    if (!this._callbacks[evname])
                        this._callbacks[evname] = $.Callbacks();
                    this._callbacks[evname].add(callback);
                },
                //remove an event, provide it an event name, and a callback function
                //it will remove the callback from the named event
                removeEvent: function (evname, callback) {
                    if (!this._callbacks[evname])
                        return;
                    this._callbacks[evname].remove(callback);
                },
                //this will trigger the event, invoking all the callbacks associated to it.
                //it requires the first argument to be the event name, and the rest are arguments
                //to the callback
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

            //this will revoke the token from google and sign off the person.
            //it will trigger the event revoke:successful if sign off was successful
            //it will trigger the event revoke:failure if sign off was unsucessful
            //it requires the access_token provided by google authentication return.
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

            //will sign you into google using the google api auth token
            //if successful it will load your google+ profile into the application
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
                    getProfile();
                });
            }

            //provides the google plus profile. Will invoke an event called loaded:profile
            //and if given a function will call it back when profile has been loaded.
            function getProfile(fn) {
                gapi.client.oauth2.userinfo.get()
                .execute(function (profile) {
                    obj.profile = profile;
                    obj.triggerEvent("loaded:profile", profile);
                    if(_.isFunction(fn))
                        fn(profile);
                });
            }

            function setupSigninButton() {                
                $(options.revokeControl, options.container).on('click', function (ev) {
                    ev.preventDefault();
                    disconnectUser(obj.token);
                });
            };

            //this will load the google api from google, and start the authorization process.
            function loadGoogleApi() {

                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = 'https://apis.google.com/js/client:plusone.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            };

            //sets up internal events used primarly for logging.
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

            //build the public widget interface.
            var obj = _.extend(new eventClass(), {
                init: function () {
                    setupSigninButton(options);
                    loadGoogleApi(options);
                    setupInternalEvents(options);
                },

                signIn: function (token) {
                    signIn(token);
                },

                loadProfile: function (fn) {
                    getProfile(fn);
                }
            });

            obj.options = options;            
            return obj;
        };
