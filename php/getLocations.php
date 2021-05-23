<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$sql = "SELECT id, name from location";
$result = mysqli_query($con,$sql);

if (!$result) {

  $output['status']['code'] = "400";
  $output['status']['name'] = "executed";
  $output['status']['description'] = "query failed";	
  $output['data'] = [];

  mysqli_close($con);

  echo json_encode($output); 

  exit;

}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
	array_push($data, $row);
}

  $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data']['locations'] = $data;
	
	mysqli_close($con);

	echo json_encode($output); 
