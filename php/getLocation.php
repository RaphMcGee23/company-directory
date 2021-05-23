<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');
$id = $_GET["id"];

// Query to get up to date location values
$query = "SELECT id, name from location WHERE id='$id'";
$result = mysqli_query($con,$query);

if(!$result){
  $output['status']['code'] = "400";
  $output['status']['name'] = "executed";
  $output['status']['description'] = "query failed";	
  $output['data'] = [];

  mysqli_close($con);
  echo json_encode($output); 

  exit;
}

$data = [];

while($row = mysqli_fetch_assoc($result)){
  array_push($data,$row);
}

// Check dependants for this ID
$sql = "SELECT count(id) as total FROM department WHERE locationID='$id'";
$result = mysqli_query($con,$sql);

if(!$result){
  $output['status']['code'] = "400";
  $output['status']['name'] = "executed";
  $output['status']['description'] = "query failed";	
  $output['data'] = [];

  mysqli_close($con);
  echo json_encode($output); 

  exit;
}

$total;

if(mysqli_num_rows($result) > 0){
  while($row = mysqli_fetch_assoc($result)){
    $total = $row["total"];
  }
}

  $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data']['count'] = $total;
  $output['data']['locations'] = $data;
	
	mysqli_close($con);

	echo json_encode($output);

  