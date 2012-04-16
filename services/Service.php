<?

abstract class Service {
	private static $ME = null;

	private $parameters;

	public function __construct() {
		$parameters = array();
	}

	/**
	 * Load parameters into the service from the given JSON string.
	**/
	public function loadParameters($params) {
		//$params = json_decode($json);
		$this->parameters = array();
		if($params != null) {
			foreach ($params as $key => $value) {
				$this->parameters[$key]["value"] = $value;
			}
		}
	}

	/**
	 * Returns a list of the required parameters for the service.
	**/
	public function getParameters() {
		$this->specifyParameters();

		return json_encode($this->parameters);
	}



	/***************************************
	 *    ABSTRACT METHODS FOR SUBCLASS    *
	 ***************************************/

	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected abstract function specifyParameters();


	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public abstract function getView();



	/************************************
	 *    METHODS USABLE IN SUBCLASS    *
	 ************************************/

	/**
	 * Returns the current value of the parameter with the provided key.
	**/
	protected function readParameter($key) {
		return $this->parameters[$key]["value"];
	}

	/**
	 * Creates a new parameter.
	 * 		$key			- The key for the parameter.
	 * 		$label 			- [Optional] The form field label for the parameter.
	 * 		$defaultValue	- [Optional] The default value for the parameter if
	 * 			nothing else is set.
	**/
	protected function createParameter($key, $label="", $defaultValue="") {
		$this->parameters[$key]["label"] = $label;
		$this->parameters[$key]["value"] = $defaultValue;
	}

	/**
	 * Packs the provided HTML, CSS and JavaScript in a hash map and returns
	 * it for exporting.
	 * 		$time	- The time of creation for the content.
	 * 		$html	- A string containing the HTML to show.
	 * 		$css	- [Optional] A string containing the extra CSS for the view.
	 * 		$js		- [Optional] A string containing the extra JavaScript for
	 * 					the view.
	**/
	protected function bundleView($time, $html, $css="", $js="") {
		return array("date" => $time, "html" => $html, "css" => $css, "js" => $js);
	}
}

?>
