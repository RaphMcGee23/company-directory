<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$jobTitle = $_POST["jobTitle"];
$email = $_POST["email"];
$department = $_POST["department"];
$id = $_POST["id"];

// Find department ID
$sql = "SELECT id from department where name='$department'";

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
$departmentID;
while($row = mysqli_fetch_assoc($result)){
  $departmentID = $row["id"];
}

// Update employee
$sql = "UPDATE personnel SET firstName='$firstName', lastName='$lastName', email='$email', jobTitle='$jobTitle', departmentID='$departmentID' WHERE id='$id'";
mysqli_query($con,$sql);
http_response_code(200);
echo "Employee updated";