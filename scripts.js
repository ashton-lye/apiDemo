//GOOGLE PLACES API KEY:  AIzaSyBfr9AHIBiM-cj5XfxtP6Leh-k6X5Fm0d0 

//create map, geocoder and array here so we can use them everywhere
var map;
var geocoder;
var displayedLocation;
var cityArray = [];

function someJSFunction() {
    alert('someJSFunction');
}

//constructor city object
function cityObject(name, location, latitude, longitude, sunrise, sunset) {
    this.name = name;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.sunrise = sunrise;
    this.sunset = sunset;
};

//ajax request function - looks familiar...
function ajaxRequest(method, url, async, data, callback){

	var request = new XMLHttpRequest();
	request.open(method,url,async);
	
	if(method == "POST"){
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	}
	
	request.onreadystatechange = function(){
		if (request.readyState == 4) {
			if (request.status == 200) {
				var response = request.responseText;
				callback(response);
			} else {
				alert(request.statusText);
			}
		}
    }

	request.send(data);
}

//initialize function, runs automatically when google maps API is loaded
function initialize() {
    //create map object
    map = new google.maps.Map(document.getElementById('mapContainer'), {
      zoom: 2,
      center: {lat: 0.0, lng: 0.0}
    });

    //create geocoder object
    geocoder = new google.maps.Geocoder();
    var citySearch = ""; 
    var placeSearch = "";

    //add event listener for the find city button
    //this is better than using onclick because I can pass values
    document.getElementById('findCity').addEventListener('click', function() {
        citySearch = document.getElementById('cityInput').value;
        createCityObject(citySearch);
    });

    //event listener for the place of interest button
    document.getElementById('findPlace').addEventListener('click', function() {
        placeSearch = document.getElementById('placeInput').value;
        var data = "location="+displayedLocation+"&search="+placeSearch;
        ajaxRequest("POST", "placeSearch.php", true, data, displayPlaces);
    });
};

function createCityObject(search) {
    //use the geocoder to search for the user's search term
    geocoder.geocode({'address': search}, function(result, status) {
        if (status == 'OK') {
            //get the formatted address and co-ordinates from geocoder response
            var name = result[0].formatted_address;
            var location = result[0].geometry.location;
            var latitude = result[0].geometry.location.lat();
            var longitude = result[0].geometry.location.lng();
            var sunrise;
            var sunset;

            //create a new city object using the attributes specified above
            var city = new cityObject(name, location, latitude, longitude, sunrise, sunset);    
            
            //sunrise-sunset API request to get sunrise/set times
            ajaxRequest("POST", "sunset-sunrise.php", false, "lat="+city.latitude+"&long="+city.longitude, function(results) {
                console.log(results);
                parsedResult = JSON.parse(results);   
                console.log(parsedResult);
                console.log(parsedResult.results.sunrise);
                var sunrise = parsedResult.results.sunrise;
                var sunset = parsedResult.results.sunset;
                var splitSunrise = sunrise.split(" ");
                var splitSunset = sunset.split(" ");

                //give the city object the sunrise and sunset values
                city.sunrise = splitSunrise[0];
                city.sunset = splitSunset[0];
                console.log(city);
            });
            //add the city object to the city array
            cityArray.push(city);   
            console.log(cityArray);         

            //create li elements for the searched city and add it to the list of searched cities
            var cityList = document.getElementById("cityList");
            
            //turn city name into a string so it concatenates more easily in the li element
            var nameString = '"'+city.name+'"';
            //when the element is clicked, it calls the displayLocation function and passes in the name of the city to display
            var element = "<li onclick='Javascript:displayLocation("+nameString+")'>"+city.name+"</li>";
            cityList.innerHTML += element;
            displayLocation(city.name);
        }
        else {
            alert('Geocoder search failed. Status code: ' + status);
        };
    });
};

//function to update the map and display city data
function displayLocation(cityName) {
    //iterate through the city array looking for a city with the name that was passed in
    for (var i = 0; i < cityArray.length; i++){
        if (cityName == cityArray[i].name){
            //update map to show city
            displayedLocation = ""+cityArray[i].latitude+","+cityArray[i].longitude;
            console.log(displayedLocation);
            updateMap(cityArray[i].location);
            map.setZoom(10);

            //creating and adding li elements to display the city data
            var dataList = document.getElementById("cityDataList");
            dataList.innerHTML = 
            "<li><b>City Data:</b></li>"
            +"<li>City Name: "+cityArray[i].name+"</li>"
            +"<li>Latitude/Longitude: "+cityArray[i].location+"</li>"
            //+"<li>Current Time: WIP</li>"
            +"<li>Sunrise Time: "+cityArray[i].sunrise+" AM</li>"
            +"<li>Sunset Time: "+cityArray[i].sunset+" PM</li>";
        };
    };  
};

function updateMap(coordinates){
    console.log("map updating");
    //function to center map on a given location and add a marker at said location
    map.setCenter(coordinates);
    map.setZoom(15);
    var marker = new google.maps.Marker({
        map: map,
        position: coordinates,
    });
};

function displayPlaces(result) {
    var placeList = document.getElementById("placeList");
    placeList.innerHTML = "<li><b>Places of Interest:</b></li>";
    var parsedPlaces = JSON.parse(result);
    console.log(parsedPlaces);
    for (var i = 0; i < parsedPlaces.results.length; i++) {
        var locationString = JSON.stringify(parsedPlaces.results[i].geometry.location);
        console.log(locationString);
        var element = "<li onclick='Javascript:updateMap("+locationString+")'>"+parsedPlaces.results[i].name+" - "+parsedPlaces.results[i].vicinity+"</li>";
        console.log(element);
        placeList.innerHTML += element;
    };
};

