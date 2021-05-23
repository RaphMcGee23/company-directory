<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');
$id = $_GET["id"];

// Query for user data
$sql = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.id = '$id'";
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

$data = [];

while($row = mysqli_fetch_assoc($result)){
  array_push($data,$row);
}

// Query for departments
$query = "SELECT department.name, department.locationID from department left join location on department.locationID = location.id";

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

$departments = [];

while($row = mysqli_fetch_assoc($result)){
  array_push($departments,$row);
}



$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['employee'] = $data;
$output['departments'] = $departments;

mysqli_close($con);

echo json_encode($output);
