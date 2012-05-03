<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);

//Include the base class for services.
include_once("Service.php");

//Include a DOM parser
include_once("TodayInHistory/simple_html_dom.php");

class TodayInHistory extends Service {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public function getViews() {
		$day = date("j");
		$month = date("F");

		//Load the wikipedia data and pick out the event list
		$html = file_get_html("http://en.wikipedia.org/wiki/".$month."_".$day);
		$events = $html->find("div[id=mw-content-text] ul", 1)->find("li");

		//Select a random event and display it
		$content = "<h1>Today in History</h1>";

		$content .= "<p>".$events[rand(0, count($events)-1)]->plaintext."</p>";

		$content .= "<p style=\"font-size: 80%;\">";
		$content .= "Source: http://en.wikipedia.org/wiki/".$month."_".$day;
		$content .= "</p>";

		$this->bundleView(time(), $content);
	}
}
?>