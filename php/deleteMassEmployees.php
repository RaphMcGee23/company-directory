<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');
$ids = $_POST["ids"];
$value = implode(",",$ids);
$sql = "select count(id) as total from personnel where id in (".($value).")";
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
$count;
if(mysqli_num_rows($result) > 0){
  while($row=mysqli_fetch_assoc($result)){
    $count = $row["total"];
  }
}

if(count($ids) != $count){
  $output['status']['code'] = "400";
  $output['status']['name'] = "executed";
  $output['status']['description'] = "query failed, ids not present in database";	
  $output['data'] = [];

  mysqli_close($con);
  echo json_encode($output); 

  exit;
}

$sql = "DELETE FROM personnel where id in (".($value).")";
mysqli_query($con,$sql);
http_response_code(200);
$output['status']['code'] = '200';
$output['status']['name'] = "executed";
$output['status']['description'] = 'query success';
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

echo json_encode($output);