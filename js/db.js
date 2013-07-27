//author: Kip Williams
//date: July 20th, 2013
//version 1.0

//this is the data access layer, it uses thing broker as the backend and requires settings.js to be included before hand.
//the purpose is primarly to save the metadata attached to the profile to thingbroker

//DAL LAYER!
window.Db = (function(){

    //returns the url from thingbroker
    //thingbroker variable is the root where thingbroker is installed
	function url(id){
		if(id)
			return thingbroker + "things?thingId=" + id;
		return thingbroker + "things";
	}

    //find all profiles
	function profileUrl(){
		return thingbroker + "things?type=profile";
	}

    //updates a particular profile.
    //id is the profile id, and data is the metadata assigned to the profile.
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

    //saves a new profile to thingbroker
    //data is the metadata assigned to the new profile
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

    //This function is a helper around save and update
    //if the profile has been saved before it will update it, otherwise it will save it.
    //requires the meta data to be saved or updated.  The id look up is based on email.
	function SaveOrUpdate(data){
		Get(data.email).done(function(_data){
			Update(data.email, data);
		}).fail(function(){
			Save(data);
		});
	}

    //returns all the profiles from thingbroker
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

    //returns a single profile by id (email)
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

    //this is the public interface for the DAL.
	return {
		profiles : {
			get: Get,
			save: SaveOrUpdate,
			all: All
		}
	};
})();
