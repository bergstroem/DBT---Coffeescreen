<?php
//Include the base class for services.
include_once("Service.php");

class Powerusage extends Service {
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
		$time = $this->readParameter("time");
		$html = '<div id="disp" style="text-align:center; font-size:5em; margin: 100px auto;"></div>';
		$js = "../services/Powerusage/power.js";
		
		$title = "Power usage";
		
		$this->bundleView($title, time(), $html, "", $js);
	}
}

?>