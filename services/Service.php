<?

abstract class Service {
	private static $ME = null;

	private $parameters = array();

	public function __construct() {
		Service::$ME = $this;
	}

	/**
	 * Load parameters into the service from the given JSON string.
	**/
	public function loadParameters($json) {
		$params = json_decode($json);
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

		echo json_encode($this->parameters);
	}

	/**
	 * Returns an instance of the service class
	**/
	public static function instance($className) {
		if(Service::$ME == NULL)
			$className::newInstance();

		return Service::$ME;
	}


	/***************************************
	 *    ABSTRACT METHODS FOR SUBCLASS    *
	 ***************************************/

	/**
	 * Creates a new instance of the service object.
	 * It's enough to just call
	 * 		new ServiceName();
	 * where ServiceName is the name of the sublcass.
	**/
	protected abstract static function newInstance();

	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected abstract function specifyParameters();


	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled in a JSON string using makeViewJSON
	 * and returned.
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
	 * Packs the provided HTML, CSS and JavaScript in a JSON string and returns
	 * it for exporting.
	 * 		$html	- A string containing the HTML to show.
	 * 		$css	- [Optional] A string containing the extra CSS for the view.
	 * 		$js		- [Optional] A string containing the extra JavaScript for
	 * 					the view.
	**/
	protected function makeViewJSON($html, $css="", $js="") {
		$data = array("html" => $html, "css" => $css, "js" => $js);
		return json_encode($data);
	}
}

?>