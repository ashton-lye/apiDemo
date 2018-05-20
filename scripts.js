//GOOGLE PLACES API KEY:  AIzaSyBfr9AHIBiM-cj5XfxtP6Leh-k6X5Fm0d0 

//create map, geocoder and array here so we can use them everywhere
var map;
var geocoder;
var cityArray = [];

function someJSFunction() {
    alert('someJSFunction');
}

//constructor city object
function cityObject(name, location, sunrise, sunset) {
    this.name = name;
    this.location = location;
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
      zoom: 8,
      center: {lat: 0.0, lng: 0.0}
    });

    //create geocoder object
    geocoder = new google.maps.Geocoder();
    var search = ""; 

    //add event listener for the find city button
    //this is better than using onclick because I can pass values
    document.getElementById('findCity').addEventListener('click', function() {
        search = document.getElementById('cityInput').value;
        createCityObject(search);
    });
};

function createCityObject(search) {
    //use the geocoder to search for the user's search term
    geocoder.geocode({'address': search}, function(result, status) {
        if (status == 'OK') {
            //get the formatted address and co-ordinates from geocoder response
            var name = result[0].formatted_address;
            var location = result[0].geometry.location;

            //create a new city object using the name and location above
            var city = new cityObject(name, location);

            var sunrise;
            var sunset;
            
            //break the location into latitude and longitude
            var lat = result[0].geometry.location.lat();
            var long = result[0].geometry.location.lng();
            //sunrise-sunset API request to get sunrise/set times
            ajaxRequest("POST", "sunset-sunrise.php", false, "lat="+lat+"&long="+long, function(results) {
                console.log(results);
                parsedResult = JSON.parse(results);   
                console.log(parsedResult);
                console.log(parsedResult.results.sunrise);
                //give the city object the sunrise and sunset values
                city.sunrise = parsedResult.results.sunrise;
                city.sunset = parsedResult.results.sunset;
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
            //setting the center of the map and adding a marker
            map.setCenter(cityArray[i].location);
            var marker = new google.maps.Marker({
            map: map,
            position: cityArray[i].location,
            });

            //creaing and adding li elements to display the city data
            var dataList = document.getElementById("cityDataList");
            dataList.innerHTML = 
            "<li><b>City Data:</b></li>"
            +"<li>City Name: "+cityArray[i].name+"</li>"
            +"<li>Latitude/Longitude: "+cityArray[i].location+"</li>"
            +"<li>Current Time: WIP</li>"
            +"<li>Sunrise Time: "+cityArray[i].sunrise+"</li>"
            +"<li>Sunset Time: "+cityArray[i].sunset+"</li>";
        };
    };  
};

