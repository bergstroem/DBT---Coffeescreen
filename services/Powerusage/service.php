<?php
//Include the base class for services.
include_once("Service.php");

class Powerusage extends Service {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("power", "XML path", "Path to the xml with powerdata", Type::ShortText);
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public function getViews() {
		$path = "";
		$xml = simplexml_load_file("http://titan.codemill.se/~denols/infoboard/power/graphs/lastdata.xml");
		$arr = array();
		foreach($xml->data->row as $row){
			$arr[] = $row->v0;
		}
		for($i = sizeof($arr)-1; $i > 0; $i--){
			if($arr[$i] != "NaN"){
				$power = $arr[$i];
				break;
			}
		}
		
		//Generate a HTML string
		$html = "<p>$power</p>";
		
		$title = "Power usage";
		
		$this->bundleView($title, time(), $html);
	}
}

?>