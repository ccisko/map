  var map = new google.maps.Map(document.getElementById('map-canvas'),{zoom: 15,center: new google.maps.LatLng(41.456358,-72.825021) });

var makingPlaces = function(placeData) {
this.name = ko.observable(placeData.name);
this.description = ko.observable(placeData.description);
this.address = ko.observable(placeData.address);
this.lat = ko.observable(placeData.lat);
this.lng = ko.observable(placeData.lng);
this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(placeData.lat,placeData.lng),
	  animation: google.maps.Animation.DROP,
	  title: this.name(),
      map: map
    });

this.togglemkr = function(mymaponoff) {
	this.marker.setMap(mymaponoff);
}


   this.infowindowContent = ko.computed(function() {
			  return "<h2>" + this.name() + "</h2> " + "<h3>" + this.description() + "</h3> "  + "<h4>" + this.address() + "</h4> " },this )




this.infowin = new google.maps.InfoWindow({content: this.infowindowContent()  });


} 
var viewModel = function() {
	var self = this;
	this.searchPlaces = ko.observable('');

self.locations = ko.observableArray([]);
   myPlaces.forEach(function(placeItem) {
        self.locations.push(new makingPlaces(placeItem));
    });


this.searchedLocations = ko.computed(function() {
		  var myplacesarray =[];
		  
	      for (var i = 0; i < myPlaces.length; i++) {
		  
			  	y = self.searchPlaces();
				 x=self.locations()[i].name().toLowerCase().indexOf(y.toLowerCase());
				 if (x != -1 ) {
			  	myplacesarray.push(self.locations()[i]);
				self.locations()[i].togglemkr(map); 
								 } else {
									 
				self.locations()[i].togglemkr();
								 }
			  
			  		}
			return myplacesarray },this)
						  
	this.currentPlace = ko.observable(this.searchedLocations()[1]);
	
	this.selcurrentPlace = function(clickedPlace) {
		
		
	self.currentPlace(clickedPlace);
	clickedPlace.marker.setAnimation(google.maps.Animation.BOUNCE);
setTimeout(function() {
                        clickedPlace.marker.setAnimation(null);
                    },
                    800);

	clickedPlace.infowin.open(map, clickedPlace.marker);

  
 	}
	
    this.searchedLocations().forEach(function(placeItem) {
            google.maps.event.addListener(placeItem.marker, 'click', function() {
                self.showpopup(placeItem);
            });
    });

   self.showpopup = function(placeItem){

                //Bounce markers with a time out of 800
                placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(
                    function() {
                        placeItem.marker.setAnimation(null);
                    },
                    800);

                
                self.infowinmarker = new google.maps.InfoWindow({
                    maxHeight: 150,
                    maxWidth: 200
                });

              
                self.infowinmarker.setContent(placeItem.infowindowContent());

                
                self.infowinmarker.open(map, placeItem.marker);
    };


	
}

ko.applyBindings(new viewModel());