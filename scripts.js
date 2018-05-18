//GOOGLE PLACES API KEY:  AIzaSyBfr9AHIBiM-cj5XfxtP6Leh-k6X5Fm0d0 

var map;
var geocoder;
var cityArray = [];

function someJSFunction() {
    alert('someJSFunction');
}

function cityObject(name, location, sunrise, sunset) {
    this.name = name;
    this.location = location;
    this.sunrise = sunrise;
    this.sunset = sunset;
};

function initialize() {
    map = new google.maps.Map(document.getElementById('mapContainer'), {
      zoom: 8,
      center: {lat: 0.0, lng: 0.0}
    });
    geocoder = new google.maps.Geocoder();
    var search = ""; 

    document.getElementById('findCity').addEventListener('click', function() {
        search = document.getElementById('cityInput').value;
        console.log(search);
        createCityObject(search);
    });
};

function createCityObject(search) {

    geocoder.geocode({'address': search}, function(result, status) {
        if (status == 'OK') {
            var name = search;
            var location;
            var sunrise;
            var sunset;

            location = result[0].geometry.location;
            //alert('result: '+result[0].geometry.location+', lat: '+location);
            
            var city = new cityObject(name, location, sunrise, sunset);
            cityArray.push(city);

            var cityList = document.getElementById("cityList");
            console.log(city);
            var nameString = '"'+city.name+'"';
            var element = "<li onclick='Javascript:displayLocation("+nameString+")'>"+city.name+"</li>";
            console.log(element);
            cityList.innerHTML += element;
            displayLocation(city.name);
        }
        else {
            alert('Geocoder search failed. Status code: ' + status);
        };
    });
};

function displayLocation(cityName) {
    for (var i = 0; i < cityArray.length; i++){
        if (cityName == cityArray[i].name){
            map.setCenter(cityArray[i].location);
            var marker = new google.maps.Marker({
            map: map,
            position: cityArray[i].location,
            });
        };
    };  
};

