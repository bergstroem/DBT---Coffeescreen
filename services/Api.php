<?
/**
 * getParameters
 * Prints a JSON string with all the required parameters, containing key, label
 * and default value.
 *
 * Additional parameters:
 * 		service - The name of the service. 
 *
 * Query example: Api.php?getParameters&service=RSS
 * Output syntax: {key1:{"label":labelText, "value":defaultValue}, key2:...}
**/

if(isset($_GET["getParameters"]) && isset($_GET["service"])) {
	
	$directory = $_GET["service"];
	
	if(file_exists($directory)){
		include_once("$directory/service.php");
		
		$service = new $directory();
		echo $service->getParameters();
	}
}

?>
