<?php

abstract class Service {
	private $parameters;
	private $views;

	public function __construct() {
		$parameters = array();
		$views = array();
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

	/**
	 * Returns a list of preformated views for showing in the client.
	**/
	public function getViewList() {
		$this->getViews();

		return $this->views;
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
	protected abstract function getViews();



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
	protected function createParameter($key, $label, $tooltip, $type=Type::ShortText, $defaultValue="") {
		$this->parameters[$key]["label"] = $label;
		$this->parameters[$key]["tooltip"] = $tooltip;
		$this->parameters[$key]["type"] = $type;
		$this->parameters[$key]["value"] = $defaultValue;
	}

	/**
	 * Packs the provided HTML, CSS and JavaScript into the list of views.
	 * 		$time	- The time of creation for the content.
	 * 		$html	- A string containing the HTML to show.
	 * 		$css	- [Optional] A string containing the extra CSS for the view.
	 * 		$js		- [Optional] A string containing the extra JavaScript for
	 * 					the view.
	**/
	protected function bundleView($title, $time, $html, $css="", $js="") {
		$this->views[] = array("title" => $title, "date" => $time, "html" => $html, "css" => $css, "js" => $js);
	}


	/************************************
	 *           FIELD TYPES            *
	 ************************************/

	
}

abstract class Type {
	const ShortText = 0;
	const LongText = 1;
	const Number = 2;
	const Boolean = 3;
}

?>
