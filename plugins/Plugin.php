<?php

abstract class Plugin {
	private $parameters;
	private $views;

	public function __construct() {
		$parameters = array();
		$views = array();
	}

	/**
	 * Load parameters into the plugin from the given JSON string.
	**/
	public function loadParameters($params) {
		$this->parameters = array();
		if($params != null) {
			foreach ($params as $key => $value) {
				$this->parameters[$key]["value"] = $value;
			}
		}
	}

	/**
	 * Returns a list of the required parameters for the plugin.
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
	 * parameters. These must be bundeled using bundleView.
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
	 * 		$label 			- The form field label for the parameter.
	 * 		$tooltip		- The descriptive text shown inside or beside the
	 * 							element.
	 * 		$type			- [Optional] The expected datatype for the parameter
	 * 		$defaultValue	- [Optional] The default value for the parameter if
	 * 							nothing else is set.
	**/
	protected function createParameter(
			$key, $label, $tooltip, $type=Type::ShortText, $defaultValue="") {
		
		$this->parameters[$key]["label"] = $label;
		$this->parameters[$key]["tooltip"] = $tooltip;
		$this->parameters[$key]["type"] = $type;
		$this->parameters[$key]["value"] = $defaultValue;
	}

	/**
	 * Packs the provided HTML, CSS, JavaScript and info into the list of views.
	 * 		$title	- The title of the view. Will be used beside the forward and
	 * 					backwards arrows.
	 * 		$time	- The time of creation for the content.
	 * 		$html	- A string containing the HTML to show.
	 * 		$css	- [Optional] A string containing the url to the extra CSS
	 * 					for the view.
	 * 		$js		- [Optional] A string containing the url to the extra
	 * 					JavaScript for the view.
	**/
	protected function bundleView($title, $time, $html, $css="", $js="") {
		$this->views[] = array(
				"title" => $title,
				"date" => $time,
				"html" => $html,
				"css" => $css,
				"js" => $js
			);
	}

}


/**
 * This class is works like an enum for the field types. Example:
 * 		$type = Type::ShortText;
**/
abstract class Type {
	const ShortText = 0;	//Standard text field
	const LongText = 1;		//Textarea
	const Number = 2;		//HTML5 number field or text field if not supported
	const Boolean = 3;		//Checkbox
}

?>