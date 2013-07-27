//author: Kip Williams
//date: July 20th, 2013
//version 1.0

//this is the communication backbone of the application using an eventing system
//it also provides some helper functions for dealing with formatting etc.

//transforms time from milliseconds to a human readable format
function toHumanReadableTimeFromMilliseconds(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = '0' + Math.floor( (t - d * cd) / ch),
        m = '0' + Math.round( (t - d * cd - h * ch) / 60000);
    return [d, h.substr(-2), m.substr(-2)].join(':');
}

//returns milliseconds from h- hours, m - minutes, s - seconds, ms - milliseconds
function getTimeInMilliseconds(h, m, s, ms){
    return h * 3600000 + m * 60000 + s * 1000 + ms;   
}

//formatting function for numbers.  Returns the suffix for a integer number
function suffix(n) {
	var d = (n|0)%100;
	return d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][d%10] || 'th';
};

//maps the persist model to the application viewmodel
function Map(profile){
	//do a reduce to the distances so we know the total times and distances run
    var result = _.reduce(profile.distances, function(partialResult, item){
                     if(item.distance)
                        partialResult.totaldistance = partialResult.totaldistance + item.distance;
                     if(item.deltaTime)
                        partialResult.totaltime = partialResult.totaltime + item.deltaTime;                                                                 
                     return partialResult;
                  }, { 
                      totaldistance: 0, 
                      totaltime: 0,
                      percent:0
                 });  
            
	//format the time, compute distances, and other metrics.
    result.totaltime = toHumanReadableTimeFromMilliseconds(result.totaltime);
    result.totaldistance = Math.round(result.totaldistance * 100) / 100;
    result.percentdone = result.totaldistance / 100; //hardcode 100kms    
    
    var maxDist = _.max(profile.distances, function(item){ 
        if(item.distance)
            return item.distance; 
        return 0;
    });
	
    var viewmodel = _.extend(result, profile);
	
	//format the distanes to a make the numbers look nice
    _.each(viewmodel.distances, function(item){
        if(item.distance)
            item.distance = (item.distance).toFixed(2);
        if(item.date)
            item.date = (new Date(item.date)).toString();
        item.percent = ((item.distance / maxDist.distance) * 100).toFixed(2);
    });    
        
    return viewmodel;    
}

//this initializes the backbone application for communication on document ready.
(function($){
    $(function(){
        
			//a simple application class build on top of an event class used to communicate between the components in
			//the application
            window.App = {
                registerLargeScreen : function(){
                    
                }            
            };
        
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
                            
            window.App = _.extend(new eventClass(), window.App);
    });
})(jQuery);