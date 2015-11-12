//Default Map settings
var aftergoogle = function() {
  var map = new google.maps.Map(document.getElementById('map-canvas'),
    {zoom: 15,center: new google.maps.LatLng(41.4562186,-72.8224525) });
// creating locations
  var makingPlaces = function(placeData) {
    this.name = ko.observable(placeData.name);
    this.description = ko.observable(placeData.description);
    this.address = ko.observable(placeData.address);
    this.lat = ko.observable(placeData.lat);
    this.lng = ko.observable(placeData.lng);
    this.myfunamount = ko.observableArray();
    this.myfunitem = ko.observableArray();
    this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(placeData.lat,placeData.lng),
    animation: google.maps.Animation.DROP,
    title: this.name(),
    map: map
  });
  //reset markers
  this.togglemkr = function(mymaponoff) {
    this.marker.setMap(mymaponoff);
  };
};
// start viewmodel
var viewModel = function() {
  var self = this;
  // input box
  self.searchPlaces = ko.observable('');
  // create array of locations
  self.locations = ko.observableArray([]);
  myPlaces.forEach(function(placeItem) {
  self.locations.push(new makingPlaces(placeItem));
  });
  self.searchedLocations = ko.computed(function() {
    var myplacesarray =[];
    for (var i = 0; i < myPlaces.length; i++) {
      y = self.searchPlaces();
      x=self.locations()[i].name().toLowerCase().indexOf(y.toLowerCase());
      Z=self.locations()[i].description().toLowerCase().indexOf(y.toLowerCase());
      if (Z != -1 || x != -1 ) {
        myplacesarray.push(self.locations()[i]);
        self.locations()[i].togglemkr(map); 
      } else {
        self.locations()[i].togglemkr();
      }
    }
  return myplacesarray; },this);

  this.searchedLocations().forEach(function(placeItem) {
    google.maps.event.addListener(placeItem.marker, 'click', function() {
      self.showpopup(placeItem);
    });
  });
  // infowindows and second API
  self.showpopup = function(placeItem){
    if (self.infowinmarker) {
      self.infowinmarker.close(map, placeItem.marker);
    }
    var nutrition_item  = placeItem.description();
    myUrl = "https://api.nutritionix.com/v1_1/search/" + nutrition_item + "?fields=item_name,brand_name,nf_calories&appId=074b01eb&appKey=9f1a554a75a4427b22051e94ad1724cd";

    $.ajax({
      type: "GET",
      dataType: "json",
      limit: 20,
      url:  myUrl,
	  error: function(response) {
        console.log("i have an error");
        placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(
            function() {
              placeItem.marker.setAnimation(null);
            },800);
            self.infowinmarker = new google.maps.InfoWindow({
              maxHeight: 100,
              maxWidth: 140
            });
        placeItem.infowindowContent = ko.computed(function() {
          return "<h2>" + placeItem.name() + "</h2> " + "<h5>" +"Menu Items:" +  placeItem.description() + "</h5>"  + "<h4>" + placeItem.address() + "</h4> " + "<h5>" + "<h2>" + "Sorry having trouble getting Calorie information , perhaps you reached daily limit of 500 queries." + "</h2> ";},this );
        self.infowinmarker.setContent(placeItem.infowindowContent());
        self.infowinmarker.open(map, placeItem.marker);
      },
      success: function(response) {
        while (true) {
          i= Math.floor((Math.random() * 9) + 1);
          if (response.hits[i].fields != undefined ) {
		  if (response.hits[i].fields.brand_name = "USDA") {
            var myfunamounttest = response.hits[i].fields.nf_calories;
            var myfunitemtest = response.hits[i].fields.item_name;
          }
          placeItem.myfunamount.removeAll();
          placeItem.myfunitem.removeAll();
          placeItem.myfunamount().push(myfunamounttest);
          placeItem.myfunitem().push(myfunitemtest);
          placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
		  //Bounce markers with a time out of 800
            setTimeout(
              function() {
                placeItem.marker.setAnimation(null);
              },800);
              self.infowinmarker = new google.maps.InfoWindow({
              maxHeight: 100,
              maxWidth: 140
            });
          placeItem.infowindowContent = ko.computed(function() {
            return "<h2>" + placeItem.name() + "</h2> " + "<h5>" +"Menu Items" + "</h5>" + "<br>" +"<h3>" + placeItem.description() + "</h3> "  + "<h4>" + placeItem.address() + "</h4> " + "<h5>" + "USDA Fun Facts:" + "<br>" + placeItem.myfunitem()[0] + "<br>" +  placeItem.myfunamount()[0] + " calories" + "</h5>";},this );
            self.infowinmarker.setContent(placeItem.infowindowContent());
            self.infowinmarker.open(map, placeItem.marker);
          break;
          }
        }
      }
    });

  };
};
ko.applyBindings(new viewModel());
}