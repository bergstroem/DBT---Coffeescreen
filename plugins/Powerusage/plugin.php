<?php
//Include the base class for plugins.
include_once("Plugin.php");

class Powerusage extends Plugin {
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
		$html = '<div id="powercontainer"><canvas id="gauge" width="220" height="150"></canvas><div id="powertext"></div><div id="wisdom"></div></div>';
		$js = "../plugins/Powerusage/power.js";
		$css = "../plugins/Powerusage/power.css";
		
		$title = "Power usage";
		
		$this->bundleView($title, time(), $html, $css, $js);
	}
}

?>