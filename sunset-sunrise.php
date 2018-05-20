<?php
    $lat = $_POST['lat'];
    $long = $_POST['long'];

    $request = "https://api.sunrise-sunset.org/json?lat=$lat&lng=$long";

    $connection = curl_init($request);
    curl_setopt($connection, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($connection);
    $result = json_decode($response);

    curl_close($connection);

    echo $response;
?>