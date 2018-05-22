//GOOGLE PLACES API KEY:  AIzaSyBfr9AHIBiM-cj5XfxtP6Leh-k6X5Fm0d0 
//TIMEZONEDB API KEY: IFJLIHI7IEVB
//TIMEZONEDB DOCUMENTATION: https://timezonedb.com/references/get-time-zone

//create map, geocoder and array here so we can use them everywhere
var map;
var geocoder;
var displayedLocation;
var cityArray = [];

//constructor city object
function cityObject(name, location, latitude, longitude, timezone, currentTime, sunrise, sunset) {
    this.name = name;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.timezone = timezone;
    this.currentTime = currentTime;
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
            var timezone;
            var currentTime;
            var sunrise;
            var sunset;

            //create a new city object using the attributes specified above
            var city = new cityObject(name, location, latitude, longitude, timezone, currentTime, sunrise, sunset);  

            //create li elements for the searched city and add it to the list of searched cities
            var cityList = document.getElementById("cityList");

            //turn city name into a string so it concatenates more easily in the li element
            var nameString = "'"+city.name+"'";
            //when the element is clicked, it calls the displayLocation function and passes in the name of the city to display
            var element = '<li onclick="Javascript:displayLocation('+nameString+')">'+city.name+'</li>';
            cityList.innerHTML += element;

            var dataList = document.getElementById("cityDataList");
            dataList.innerHTML = "";
            dataList.innerHTML = "<li><b>City Data:</b></li><li>Loading City Data...</li>";
            
            //timezoneDB request to get cities timezone and current time
            ajaxRequest("POST", "timezone.php", true, "lat="+city.latitude+"&long="+city.longitude, function(results) {
                parsedResult = JSON.parse(results);

                //use returned data to set city properties
                city.timezone = parsedResult.abbreviation;
                city.currentTime = parsedResult.formatted;

                //sunrise-sunset API request to get sunrise/set times
                ajaxRequest("POST", "sunset-sunrise.php", true, "lat="+city.latitude+"&long="+city.longitude, function(results) {
                    parsedResult = JSON.parse(results);   

                    city.sunrise = new Date(parsedResult.results.sunrise);
                    city.sunset = new Date(parsedResult.results.sunset);

                    //add the city object to the city array
                    cityArray.push(city);  

                    //call function to display city data etc
                    displayLocation(city.name);
                });
            });
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

            //call function to update map
            updateMap(cityArray[i].location);
            map.setZoom(10);

            //creating and adding li elements to display the city data
            var dataList = document.getElementById("cityDataList");
            dataList.innerHTML = 
            "<li><b>City Data:</b></li>"
            +"<li>City Name: "+cityArray[i].name+"</li>"
            +"<li>Latitude/Longitude: "+cityArray[i].location+"</li>"
            +"<li>Local Time (at Time of Search): "+cityArray[i].currentTime+"</li>"
            +"<li>Local Timezone: "+cityArray[i].timezone+"</li>"
            +"<li>Sunrise (GMT): "+cityArray[i].sunrise.toUTCString()+"</li>"
            +"<li>Sunset (GMT): "+cityArray[i].sunset.toUTCString()+"</li>"
            +"<li>Sunrise (NZST): "+cityArray[i].sunrise+"</li>"
            +"<li>Sunset (NZST): "+cityArray[i].sunset+"</li>";
        };
    };  
};

function updateMap(coordinates){
    //function to center map on a given location and add a marker at said location
    map.setCenter(coordinates);
    map.setZoom(15);
    var marker = new google.maps.Marker({
        map: map,
        position: coordinates,
    });
};

//callback function for the google places API request made by clicking the find place button
//i.e what happens when you click the button
function displayPlaces(result) {
    var placeList = document.getElementById("placeList");
    placeList.innerHTML = "<li><b>Places of Interest:</b></li>";
    try {
        var parsedPlaces = JSON.parse(result);

        //loop through the array of places returned by the request and add an li element to the places list
        for (var i = 0; i < parsedPlaces.results.length; i++) {
            var locationString = JSON.stringify(parsedPlaces.results[i].geometry.location);
            //the onclick function calls the update map function to show the selected place
            var element = "<li onclick='Javascript:updateMap("+locationString+")'>"+parsedPlaces.results[i].name+" - "+parsedPlaces.results[i].vicinity+"</li>";
            placeList.innerHTML += element;
        };
    } catch {
        alert("No results found! Please try a different Search term.");
    };
  

};

