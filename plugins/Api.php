<?php
//ini_set('display_errors',0); 
//error_reporting(0);

/**
 * getParameters
 * Prints a JSON string with all the required parameters, containing key, label
 * and the other values from the given plugin.
 *
 * Additional parameters:
 * 		plugin - The name of the plugin. 
 *
 * Query example: Api.php?getParameters&plugin=RSS
 * Output syntax: {key1:{"label":labelText, "value":defaultValue,...}, key2:...}
**/

if(isset($_GET["getParameters"]) && isset($_GET["plugin"])) {
	
	$directory = $_GET["plugin"];
	
	if(file_exists($directory)){
		include_once("$directory/plugin.php");

		$plugin = new $directory();
		echo $plugin->getParameters();
	}
}

?>
