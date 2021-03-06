// Issues with filter- https://discussions.udacity.com/t/filter-from-knockout-error/506443

// Locations used for the project
var initialPoints = [
{
    title: "Raging Waves Waterpark",
    location: {lat: 41.6967971, lng: -88.4176992},
    iconColor: "1F618D",
    website: "https://api.yelp.com/v3/businesses/raging-waves-waterpark-yorkville/reviews",
    image: ""
},
{
    title: "Chicago Premium Outlets",
    location: {lat: 41.7829187, lng: -88.3169258},
    iconColor: "1E8449",
    website: "https://api.yelp.com/v3/businesses/chicago-premium-outlets-aurora/reviews",
    image: ""
},
{
    title: "Chipotle",
    location: {lat: 41.7546809, lng: -88.3089367},
    iconColor: "BA4A00",
    website: "https://api.yelp.com/v3/businesses/chipotle-mexican-grill-aurora-17?osq=chipotle/reviews",
    image: ""
},
{
    title: "Funway",
    location: {lat: 41.836494, lng: -88.2961499},
    iconColor: "A93226",
    website: "https://api.yelp.com/v3/businesses/funway-ultimate-entertainment-center-batavia/reviews",
    image: ""
},
{
    title: "Phillips Park Zoo",
    location: {lat: 41.7494086, lng: -88.3504218},
    iconColor: "6C3483",
    website: "https://api.yelp.com/v3/businesses/phillips-park-zoo-aurora/reviews",
    image: ""
}
];//end of initialPoints declaration

var map;
var markers = [];

// Create the map and give it dimensions
function initMap() {
    map = new google.maps.Map(document.getElementById("map"),
        {center: {lat: 41.7689162, lng: -88.3010038 },
        zoom: 12,
        mapTypeControl: false
        });

    largeInfoWindow = new google.maps.InfoWindow();
    var iconHighlighted = makeMarkerIcon("F2F3F4");

    // Loop through the points and give each point information
    for (var i = 0; i < initialPoints.length; i++) {
        var title = initialPoints[i].title;
        var position = initialPoints[i].location;
        var iconColor = initialPoints[i].iconColor;
        // var yelp_url = initialPoints[i].website;
        var iconDefault = makeMarkerIcon("1F818D");

        // create a marker per location and put it in an array
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: iconDefault,
            id: i,
            animation: google.maps.Animation.DROP
        });

        // push the marker to our marker array
        markers.push(marker);
        // open large infowindow at each marker
        marker.addListener("click", function () {
            populateInfoWindow(this, largeInfoWindow);
        });

        // Have the location box highlight when it's hovered over
        marker.addListener("mouseover", function() {
            this.setIcon(iconHighlighted);
        });
        marker.addListener("mouseout", function() {
            this.setIcon(iconDefault);
        });
    }//end of loop
    function populateInfoWindow(marker, infowindow) {
    // Is infowindow already open?
        if (infowindow.marker != marker) {
            infowindow.setContent("");
            infowindow.marker = marker;
            // Clear marker if infowindow is closed
            infowindow.addListener("closeclick", function () {
                infowindow.marker = null;
            });

            infowindow.setContent("<div>" + marker.title + "</div>" +
                "<div></div>");

            infowindow.open(map, marker);
        }
    }//end of populateInfoWindow function
}//end of initMap function



var bearerToken;
var cors_anywhere_url = "https://cors-anywhere.herokuapp.com/";
var yelp_auth_url = cors_anywhere_url + "https://api.yelp.com/oauth2/token";

$.ajax({
  url: yelp_auth_url,
  type: "POST",
  data: {
        client_secret: 'Y3RWO7eFpu5bJYRarOFvTAm86Qez8qB8LdWPG9dia9oJlIJGqDCtnr6SQEJgqHOM',
        client_id: '2VGbrnpR6An-WQ6o55yRdQ',
        grant_type: 'client_credentials'
    },
    headers: {"Authorization" : "Bearer " + bearerToken}
}).done(function(response) {
    bearerToken = response.access_token;
    console.log(response);
}).fail(function(error) {
    console.log("An error occured in getting Yelp access token!");
});//end of ajax call

// Create/populate infowindow for each marker
    

var i;

// Loop through the markers array and display them all
function showLocations() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
        adjustMarker(i);
    }

    google.maps.event.addDomListener(window, 'resize', function () {
    map.fitBounds(bounds);
    });
}//end of showLocations function

// Loop through the listings and hide them all.
function hideLocations() {
    for (i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
}//end of hideLocations function

// Hide or show side bar
function showSidebar() {
    $("#map").toggleClass("show-menu");
    $("#map").toggleClass("hide-menu");
}//end of showSidebar function


function adjustMarker(marker) {
        google.maps.event.trigger(markers[marker], 'click');
}//end of adjustMarker function

// Event listeners
document.getElementById("show-locations").addEventListener("click", showLocations);
document.getElementById("hide-locations").addEventListener("click", hideLocations);
document.getElementById("show-sidebar").addEventListener("click", showSidebar);


// Tale in a color and create a marker icon of the color
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|"+ markerColor +
        "|40|_|%E2%80%A2",
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34)
    );
    return markerImage;
}//end of makeMarkerIcon function


// Error handling
mapError = () => {
    // error handling here
};//end of mapError function

var Point = function(data) {

    var self = this;
    this.title = ko.observable(data.title);
    this.iconColor = ko.observable(data.iconColor);
};//end of Point declaration


ViewModel = function() {
    var self = this;

    this.filter = ko.observable('');
/*
http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
I keep getting the error "this.filter is not a function" but can't figure out why.

    this.filteredItems = ko.computed(function() {
        var filter = this.filter().toLowerCase();
        if (!filter) {
            return this.items();
        } else {
            return ko.utils.arrayFilter(this.items(), function(item) {
                return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
            });
        }
    });
*/
    this.pointList = ko.observableArray([]);

    initialPoints.forEach(function(pointItem) {
        self.pointList.push(new Point(pointItem));
    });

    this.currentPoint = ko.observable(this.pointList()[0]);

    this.setPoint = function() {
        populateInfoWindow;
    };
};//end of ViewModel declaration

ko.applyBindings(new ViewModel());
