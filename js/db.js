//sahil ( kip :) )

//DAL LAYER!
window.Db = (function(){
	
	function url(id){
		if(id)
			return "http://localhost:8080/thingbroker/things?thingId=" + id;
		return "http://localhost:8080/thingbroker/things";
	}
    
    function profileUrl(){
        return 'http://localhost:8080/thingbroker/things?type=profile';
    }
	
	function Update(id, data){	
		var sData = JSON.stringify({
			thingId: data.email,
            name: data.name,
            type: "profile",
			metadata: data
		});
		
		return $.ajax({ 
			type:"PUT", 
			url : url(id), 
			data: sData,  
			contentType: "application/json",
			dataType: "JSON" });
	}
	
	function Save(data){
	
		var sData = JSON.stringify({
			thingId: data.email,
			name: data.name,
			type: "profile",
			metadata: data
		});
	
		return $.ajax({ 
			type:"POST", 
			url : url(),
			data: sData,  
			contentType: "application/json",
			dataType: "JSON" });
	}
	
	function SaveOrUpdate(data){	
		Get(data.email).done(function(_data){
			Update(data.email, data);							
		}).fail(function(){
			Save(data);
		});	
	}
	
    function All(){                
        var def = $.Deferred();
        $.ajax({ 
			type:"GET", 
			url : profileUrl(),
			contentType: "application/json",
			dataType: "JSON"
		}).done(function(data, textStatus, jqXHR) {
			var items = _.pluck(data, 'metadata');			
            def.resolve(items);			
		}).fail(def.reject);
		return def.promise();
    }
    
	function Get(id){
		var def = $.Deferred();
		
		if(!id)
		{
			def.reject();
			return def.promise();
		}
		
		$.ajax({ 
			type:"GET", 
			url : url(id),			
			contentType: "application/json",
			dataType: "JSON"
		}).done(function(data, textStatus, jqXHR) {
			var item = _.first(data);
			if(item) {
				def.resolve(item.metadata);
			} else {
				def.reject();
			}
		}).fail(def.reject);
		return def.promise();
	}

	return {
		profiles : {
			get: Get,
			save: SaveOrUpdate,
            all: All
		}
	};
})();
