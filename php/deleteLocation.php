<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$id = $_POST["id"];

// Check if there are dependants for this ID
$sql = "SELECT count(id) as total FROM department WHERE locationID=$id";
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

if($total > 0){
  echo "Personnel rows depend on this department!";
  exit;
}

$sql = "DELETE FROM location WHERE id='$id'";
mysqli_query($con,$sql);
http_response_code(200);

$output['status']['code'] = '200';
$output['status']['name'] = "executed";
$output['status']['description'] = 'query success';
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

echo json_encode($output);