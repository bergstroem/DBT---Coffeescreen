<?php
//Include the base class for plugins.
include_once("Plugin.php");

class TextMessage extends Plugin {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("title", "Title", "The title for your message", Type::ShortText);
		$this->createParameter("text", "Message", "The text you want to display", Type::LongText);
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These must be bundeled using bundleView.
	**/
	public function getViews() {
		$text = $this->readParameter("text");
		$title = $this->readParameter("title");
		
		//Generate a HTML string
		$html = "<div style='margin: 0 auto'><h1>$title</h1><p>$text</p></div>";
		
		$this->bundleView($title, time(), $html);
	}
}

?>