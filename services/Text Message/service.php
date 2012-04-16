<?
//Include the base class for services.
include_once("Service.php");

class TextMessage extends Service {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("text", "Message text");
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled in a JSON string using makeViewJSON
	 * and returned.
	**/
	public function getView() {
		$text = $this->readParameter("text");
		
		//Generate a HTML string
		$html = "<p>$text</p>";

		return $this->makeViewJSON($html);
	}
}

//Give the AJAX API the name of this class
$SERVICE_NAME = "TextMessage";

?>