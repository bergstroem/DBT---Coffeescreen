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
		$html = "<script>
					console.log('herpderp');
					$.ajax({
						type: 'POST',
						url: 'powerusage.php',
						data: '',
						success: function(msg){
							document.body.appendChild(document.createTextNode(msg));
						}
					});
				</script>";
		
		$title = "Power usage";
		
		$this->bundleView($title, time(), $html);
	}
}

?>