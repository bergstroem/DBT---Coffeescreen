<?php
// This file should not be called directly. It have to be required in a
// subclass file for Service.php



/**
 * getParameters
 * Prints a JSON string with all the required parameters, containing key, label
 * and default value.
 * Output syntax: {key1:{"label":labelText, "value":defaultValue}, key2:...}
**/
if(isset($_GET["getParameters"])) {
	/*$service = new $SERVICE_NAME();
	echo $service->getParameters();*/
	$key1 = array('label' => 'source', 'value' => 'oh hai');
	$key2 = array('label' => 'eersfd', 'value' => 'orly');
	$jk1 = json_encode($key1);
	$jk2 = json_encode($key2);
	$arr = array('key1' => $jk1, 'key2' => $jk2);
	echo json_encode($arr);
}

?>