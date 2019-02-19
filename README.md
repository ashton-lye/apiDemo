# apiDemo

This project is a webpage that allows you to search for locations like cities and towns, and for places of interest within those locations. It also displays a range of information about the searched locations.

The top search bar can be used to search for a location - a city or town, for example. This uses Google's Geocoder and Maps API's to get the coordinates of the searched location and display them on the map. The search result has a regional bias toward New Zealand, meaning that a search for 'Hamilton' will return Hamilton, New Zealand rather than Hamilton, New York. The Sunrise-Sunset and TimezoneDB API's are also used to gather other data about the searched location and this data is displayed on the right. Information about each location is stored in a JavaScript object.

Once a location has been searched, the bottom search bar can be used to search for places of interest near the searched location - for example "cafe" or "park". A list of places matching the search term is displayed below the search bar, and these can be clicked on to display the place on the map. 

A list of previously searched locations is displayed on the right. The list items can be clicked on to re-display that location and it's details.

This project was originally created for an assignment in the Web Applications Development paper I studied during my third year of study. I earned an A+ grade for the assignment and for the paper overall.  

<br>
API's used:  
  
Google Geocoding API: https://developers.google.com/maps/documentation/geocoding/start   
Google Maps API: https://developers.google.com/maps/documentation/javascript/tutorial  
Sunrise-Sunset API: https://sunrise-sunset.org/api  
TimezoneDB API: https://timezonedb.com/api
