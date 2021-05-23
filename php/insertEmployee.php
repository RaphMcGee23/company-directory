<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$email = $_POST["email"];
$jobTitle = $_POST["jobTitle"];
$departmentName = $_POST["department"];

// Find department ID
$sql = "SELECT id from department where name='$departmentName'";

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

$query = "INSERT INTO personnel (firstName,lastName,jobTitle,email,departmentID) VALUES ('$firstName','$lastName','$jobTitle','$email','$departmentID')";

mysqli_query($con,$query);
echo "Employee added to database";
http_response_code(200);


