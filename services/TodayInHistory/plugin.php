<?php

//Include the base class for plugins.
include_once("Plugin.php");

//Include a DOM parser
include_once("TodayInHistory/simple_html_dom.php");

class TodayInHistory extends Plugin {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("latest", "Only latest event",
				"Check this if you only want to display the latest historical event of today.",
				Type::Boolean);
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public function getViews() {
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