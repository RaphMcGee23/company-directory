<?php

	$cd_host = "localhost";
	$cd_user = "root"; // user name
	$cd_password = "sElling@348"; // password
	$cd_dbname = "companydirectory"; // database name

  $con = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($con);

		echo json_encode($output);

		exit;

	}	

?>