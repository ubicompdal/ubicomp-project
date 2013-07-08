function toHumanReadableTimeFromMilliseconds(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = '0' + Math.floor( (t - d * cd) / ch),
        m = '0' + Math.round( (t - d * cd - h * ch) / 60000);
    return [d, h.substr(-2), m.substr(-2)].join(':');
}

function getTimeInMilliseconds(h, m, s, ms){
    return h * 3600000 + m * 60000 + s * 1000 + ms;   
}

function suffix(n) {
	var d = (n|0)%100;
	return d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][d%10] || 'th';
};

function Map(profile){
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
            
    result.totaltime = toHumanReadableTimeFromMilliseconds(result.totaltime);
    result.totaldistance = Math.round(result.totaldistance * 100) / 100;
    result.percentdone = result.totaldistance / 100; //hardcode 100kms    
    
    var maxDist = _.max(profile.distances, function(item){ 
        if(item.distance)
            return item.distance; 
        return 0;
    });
    var viewmodel = _.extend(result, profile);   
    _.each(viewmodel.distances, function(item){
        if(item.distance)
            item.distance = (item.distance).toFixed(2);
        if(item.date)
            item.date = (new Date(item.date)).toString();
        item.percent = ((item.distance / maxDist.distance) * 100).toFixed(2);
    });    
        
    return viewmodel;    
}

(function($){
    $(function(){
        
            window.App = {
                registerLargeScreen : function(){
                    
                }            
            };
        
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
                            
            window.App = _.extend(new eventClass(), window.App);
    });
})(jQuery);