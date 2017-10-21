var map;
// var marker;
var infoWindow;
var messagewindow;

var status = false;
  function initMap() {
    var charlotte = {lat: 35.227085, lng: -80.843124};
    map = new google.maps.Map(document.getElementById('map'), {
      center: charlotte,
      zoom: 13
    });
  infowindow = new google.maps.InfoWindow({
   content: document.getElementById('form')
  });
  messagewindow = new google.maps.InfoWindow({
   content: document.getElementById('message')
  });

  var status = false;
  google.maps.event.addListener(map, 'click', function(event) {
    if (status) {
      infowindow.close(map, marker);
      status = false;
    } else {
      var marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });
      addMarker(marker);

    }

   google.maps.event.addListener(marker, 'click', function() {
     console.log(marker);
     console.log("LATITUDE", marker.position.lat());
     console.log("LONGITUDE", marker.position.lng());

     if (!status){
     infowindow.open(map, marker);
     status = true;
    }
    else {
      infowindow.close(map, marker);
      status = false;
    }
   });

  });
} //END initMap



if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
  var pos = {
   lat: position.coords.latitude,
   lng: position.coords.longitude
  };
 //infoWindow.setPosition(pos);
 //infoWindow.setContent('Location found.');
 //infoWindow.open(map);
  map.setCenter(pos);

  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
// Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}

     function handleLocationError(browserHasGeolocation, infoWindow, pos) {
       infoWindow.setPosition(pos);
       infoWindow.setContent(browserHasGeolocation ?
                             'Error: The Geolocation service failed.' :
                             'Error: Your browser doesn\'t support geolocation.');
       infoWindow.open(map);
     }


// function for the textbox character limit countdown//
var charRemain = function (element) {
  "use strict";
  var maxlength = element.getAttribute("maxlength");
  var currentCount = element.value.length;
  var remainCount = maxlength - currentCount;
document.getElementById("counter").innerHTML = remainCount;
};

