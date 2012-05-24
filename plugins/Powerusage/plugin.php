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
		$html = '<script type="text/javascript" src="../plugins/Powerusage/power.js"></script><div id="disp" style="text-align:center; font-size:5em; margin: 100px auto;"></div>';
		//$js = "../plugins/Powerusage/power.js";
		$js = array('0' => "https://www.google.com/jsapi", '1' => "../plugins/Powerusage/power.js");
		$js = json_encode($js);
		
		$title = "Power usage";
		
		$this->bundleView($title, time(), $html, "", $js);
	}
}

?>