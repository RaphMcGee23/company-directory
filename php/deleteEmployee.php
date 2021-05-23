<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');
$id = $_POST["id"];
$sql = "DELETE FROM personnel where id='$id'";
mysqli_query($con,$sql);
http_response_code(200);
echo "Row deleted";