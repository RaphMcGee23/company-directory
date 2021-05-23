<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');
$id = $_GET["id"];

// Query to get up to date department values
$query = "SELECT department.id, department.name, location.name as locationName from department left join location on (location.id = department.locationID) WHERE department.id='$id'";
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

// Query to get up to date locations
$query = "SELECT id, name from location";
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

$locations=[];
while($row = mysqli_fetch_assoc($result)){
  array_push($locations,$row);
}


// Check dependants for this ID
$sql = "SELECT count(id) as total FROM personnel WHERE departmentID=$id";
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
	$output['data']['departments'] = $data;
  $output['data']['departments']['count'] = $total;
  $output['data']['locations'] = $locations;
	
	mysqli_close($con);

	echo json_encode($output);

  