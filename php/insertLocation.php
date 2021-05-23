<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$location = $_POST["location"];

$sql = "INSERT INTO location (name) VALUES ('$location')";

mysqli_query($con,$sql);
http_response_code(200);
$output['status']['code'] = '200';
$output['status']['name'] = "executed";
$output['status']['description'] = 'query success';
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

echo json_encode($output);