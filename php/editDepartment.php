<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$department = $_POST["department"];
$location = $_POST["location"];
$id = $_POST["id"];

// Find location ID
$sql = "SELECT id from location where name='$location'";

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
$locationID;
while($row = mysqli_fetch_assoc($result)){
  $locationID = $row["id"];
}

// Update department
$sql = "UPDATE department SET name='$department', locationID='$locationID' WHERE id='$id'";
mysqli_query($con,$sql);
http_response_code(200);
echo "Employee updated";