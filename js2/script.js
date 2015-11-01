var map = new google.maps.Map(document.getElementById('map-canvas'),{zoom: 15,center: new google.maps.LatLng(41.4562186,-72.8224525) });
var makingPlaces = function(placeData) {
  this.name = ko.observable(placeData.name);
  this.description = ko.observable(placeData.description);
  this.address = ko.observable(placeData.address);
  this.lat = ko.observable(placeData.lat);
  this.lng = ko.observable(placeData.lng);
  this.myfunamount = ko.observableArray(['p']);
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
    return "<h2>" + this.name() + "</h2> " + "<h3>" + this.description() + "</h3> "  + "<h4>" + this.address() + "</h4> " + "<h5>" + "USDA Fun Facts:" + "</h5>" +  "<h5>"  +"<br>" +  this.myfunamount() + " calories" + "</h5>"},this )
this.infowin = new google.maps.InfoWindow({content: this.infowindowContent()  });
}
var viewModel = function() {
  var self = this;
  self.searchPlaces = ko.observable('');
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
  return myplacesarray },this)
  this.currentPlace = ko.observable(this.searchedLocations()[1]);
  this.selcurrentPlace = function(clickedPlace) {
    self.currentPlace(clickedPlace);
    clickedPlace.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      clickedPlace.marker.setAnimation(null);
    },800);
    clickedPlace.infowin.open(map, clickedPlace.marker);
  }
  this.searchedLocations().forEach(function(placeItem) {
    google.maps.event.addListener(placeItem.marker, 'click', function() {
      self.showpopup(placeItem);
    });
  });
  self.showpopup = function(placeItem){//1
    var nutrition_item  = placeItem.description();
    var myfunitem;
	  console.log(nutrition_item);
    myUrl = "https://api.nutritionix.com/v1_1/search/" + nutrition_item + "?fields=item_name,brand_name,nf_calories&appId=074b01eb&appKey=9f1a554a75a4427b22051e94ad1724cd"
    $.ajax({//2
      type: "GET",
      dataType: "json",
      limit: 10,
      url:  myUrl,
      success: function(response) {//3
        stp = 0;
        while (stp == 0) {//4
          i= Math.floor((Math.random() * 9) + 1);
          if (response.hits[i].fields != undefined ) {//5
            if (response.hits[i].fields.brand_name = "USDA") {//6
//	console.log(response.hits[i]);
//     console.log(response.hits[i].fields.item_name);
// console.log(response.hits[i].fields.brand_name);
              myfunitem  = (response.hits[i].fields.item_name);
              myfuncalorie = (response.hits[i].fields.nf_calories) ;
              placeItem.myfunamount().push('lmn');
//  placeItem.myfunname.push(placeItem.description);
//	placeItem.myfunamount.push(response.hits[i].fields.nf_calories);
              console.log(response.hits[i].fields.nf_calories) 
//      console.log(response.total_hits);
              stp =1 ;
            }//6
          }//5
        }//4
      }//3
    })//2
//Bounce markers with a time out of 800
    placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(
    function() {//2
      placeItem.marker.setAnimation(null);
    },800);//2
    self.infowinmarker = new google.maps.InfoWindow({
      maxHeight: 150,
      maxWidth: 200
    });
    self.infowinmarker.setContent(placeItem.infowindowContent());
    self.infowinmarker.open(map, placeItem.marker);
  };//1
}
ko.applyBindings(new viewModel());