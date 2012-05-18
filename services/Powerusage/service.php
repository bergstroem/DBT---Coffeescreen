<?php
//Include the base class for services.
include_once("Service.php");

class PowerUsage extends Service {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		//$this->createParameter("power", "XML path", "Path to the xml with powerdata", Type::ShortText);
		$this->createParameter("latest", "Only latest event",
				"Check this if you only want to display the latest historical event of today.",
				Type::Boolean);
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public function getViews() {
		/*$path = "";
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
		
		//$text = $this->readParameter("text");
		
		//Generate a HTML string
		$html = "<p>$power</p>";
		
		$title = "Power usage";
		
		$this->bundleView($title, time(), $html);*/
		$day = date("j");
		$month = date("F");

		$onlyLatest = $this->readParameter("latest");

		//Load the wikipedia data and pick out the event list
		$html = file_get_html("http://en.wikipedia.org/wiki/".$month."_".$day);
		$events = $html->find("div[id=mw-content-text] ul", 1)->find("li");

		//Select a random event and display it
		$content = "<h1>Today in History</h1>";
		if($onlyLatest)
			$content .= "<p>".$events[count($events)-1]->plaintext."</p>";
		else
			$content .= "<p>".$events[rand(0, count($events)-1)]->plaintext."</p>";

		$content .= "<p style=\"font-size: 80%;\">";
		$content .= "Source: http://en.wikipedia.org/wiki/".$month."_".$day;
		$content .= "</p>";

		$title = "Today in History";
		$this->bundleView($title, time(), $content);
	}
}

?>