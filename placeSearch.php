<?php
    $search = $_POST['search'];
    $location = $_POST['location'];

    $request = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$location&radius=1500&keyword=$search&key=AIzaSyBfr9AHIBiM-cj5XfxtP6Leh-k6X5Fm0d0";

    $connection = curl_init($request);
    curl_setopt($connection, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($connection);

    curl_close($connection);

    echo $response;
?>