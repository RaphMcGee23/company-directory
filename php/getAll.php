<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName';

	$result = $con->query($query);
	
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

  // Get locations
  $query = 'SELECT * FROM location';
  $result = $con->query($query);

  if(!$result){
    
    $output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($con);

		echo json_encode($output); 

		exit;

  }

  $locations = [];

  while($row = mysqli_fetch_assoc($result)){
    array_push($locations,$row);
  }

  // Get departments
  $query = 'SELECT d.id, d.name, l.name as location FROM department d LEFT JOIN location l ON (l.id = d.locationID)';
  $result = $con->query($query);

  if(!$result){
    
    $output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($con);

		echo json_encode($output); 

		exit;

  }

  $departments= [];

  while($row = mysqli_fetch_assoc($result)){
    array_push($departments,$row);
  }

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['personnel'] = $data;
  $output['data']['locations'] = $locations;
  $output['data']['departments'] = $departments;
	
	mysqli_close($con);

	echo json_encode($output); 

?>