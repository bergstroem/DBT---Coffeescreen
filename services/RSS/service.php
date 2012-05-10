<?php
//Include the base class for services.
include_once("Service.php");

//Required for RSS
include_once('simplepie.inc');

//This is our custom service class
class RSS extends Service {

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
		$feedSourcesArray = array($this->readParameter("url"));
		$quantity = max(array($this->readParameter("quantity")), 0);
		
		$feed = new SimplePie();
		$feed->set_feed_url($feedSourcesArray);
		$feed->init();
		$feed->handle_content_type();
		
		$posts = array();
		
		for ($i = 0; $i < min($feed->get_item_quantity(), $quantity); $i++){
			$item = $feed->get_item($i);

			$title = $item->get_title();
			$date = $item->get_date();
			$content = $item->get_content();

			//Generate a HTML string
			$html = "<h1>".$title."</h1><p>".$date."</p>".$content;

			$this->bundleView(strtotime($date), $html);
		}
	}
}

?>
