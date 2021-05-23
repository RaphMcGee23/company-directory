<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$location = $_POST["location"];
$department = $_POST["department"];

$sql = "SELECT id from location WHERE name='$location'";
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
if(mysqli_num_rows($result) > 0){
  while($row = mysqli_fetch_assoc($result)){
    $locationID = $row["id"];
  }
}

$sql = "INSERT INTO department (name,locationID) VALUES ('$department','$locationID')";
mysqli_query($con,$sql);
http_response_code(200);
echo "Department inserted";