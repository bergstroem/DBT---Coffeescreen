<?
// This file should not be called directly. It have to be required in a
// subclass file for Service.php




/**
 * getView
 * Prints a JSON string for the view with HTML, CSS and JavaScript.
 * Output syntax: {"html":htmlString, "css":cssString, "js":jsString}
 *
 * Aditional parameters:
 * 		parameters - A JSON string with the parameters.
 * 			Input syntax: {key1:value1, key2:value2, ...}
**/
if(isset($_GET["getView"])) {
	$SERVICE_NAME::instance($SERVICE_NAME)->loadParameters($_GET["parameters"]);
	echo $SERVICE_NAME::instance($SERVICE_NAME)->getView();

/**
 * getParameters
 * Prints a JSON string with all the required parameters, containing key, label
 * and default value.
 * Output syntax: {key1:{"label":labelText, "value":defaultValue}, key2:...}
**/
}else if(isset($_GET["getParameters"])) {
	echo $SERVICE_NAME::instance($SERVICE_NAME)->getParameters();
}

?>