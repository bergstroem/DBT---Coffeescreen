<?php
//Include the base class for services.
include_once("Service.php");

class Powerusage extends Service {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("time", "Update Time", "Seconds between updates", Type::Number, "1");
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public function getViews() {
		$time = $this->readParameter("time");
		$html = "<p>Herpderp</p>";
		$js = "setInterval(function(){ $.ajax({type: 'POST', url: '../services/Powerusage/powerusage.php', data: '', success: function(msg){console.log(msg);}});}, 1000);";
		
		$title = "Power usage";
		
		$this->bundleView($title, time(), $html, "", $js);
	}
}

?>