<?php
//Include the base class for plugins.
include_once("Plugin.php");

//Required for RSS
include_once('simplepie.inc');

//This is our custom plugin class
class RSS extends Plugin {

	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("url", "RSS Url", "The URL to the RSS feed", Type::ShortText, "");
		$this->createParameter("quantity", "Quantity", "How many articles should be displayed?", Type::Number, 3);
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public function getViews() {
		if(substr($this->readParameter("url"), 0, 4) == "http"){
			$feedSource = $this->readParameter("url");
		}
		else{
			$feedSource = "http://".$this->readParameter("url");
		}
		
		$feedSourcesArray = array($feedSource);
		$quantity = max(array($this->readParameter("quantity")), 0);
		
		$feed = new SimplePie();
		$feed->set_feed_url($feedSourcesArray);
		$feed->init();
		$feed->handle_content_type();
		
		$posts = array();
		
		for ($i = 0; $i < min($feed->get_item_quantity(), $quantity); $i++){
			$item = $feed->get_item($i);

			$title = $item->get_title();
			
			$feedTitle = $feed->get_title();
			
			$source = ($item->get_link())? $item->get_link(): $feedSource;

			$time = strtotime($item->get_date());
			$content = $item->get_content();

			//Generate a HTML string
			$html = "<h1>".$title."</h1>";
			$html .= "<p class='small-text'>".$feedTitle." ".date("j F Y H:i", $time)."</p>";
			$html .= "<div style=\"overflow: auto; margin: 10px 0;\">$content</div>";
			$html .= "<p class=\"small-text\" style=\"color:#999;\">Source: $source</p>";
			$html .= "<img src=\"http://chart.apis.google.com/chart?cht=qr&chs=50x50&chld=L|0&chl=$source\" />";
			$this->bundleView($title, $time, $html);
		}
	}
	
}

?>
