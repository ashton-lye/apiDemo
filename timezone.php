<?php
    $lat = $_POST['lat'];
    $long = $_POST['long'];

    $request = "http://api.timezonedb.com/v2/get-time-zone?key=IFJLIHI7IEVB&format=json&by=position&lat=$lat&lng=$long";

    $connection = curl_init($request);
    curl_setopt($connection, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($connection);

    curl_close($connection);

    echo $response;
?>