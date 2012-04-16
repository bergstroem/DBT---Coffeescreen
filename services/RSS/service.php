<?
//Include the base class for services.
include_once("Service.php");

//Required for RSS
include_once('simplepie.inc');

//This is our custom service class
class TestService extends Service {

	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("url", "RSS Url", "http://");
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled in a JSON string using makeViewJSON
	 * and returned.
	**/
	public function getView() {
		$feedSourcesArray = array($this->readParameter("url"));
		
		$feed = new SimplePie();
		$feed->set_feed_url($feedSourcesArray);
		$feed->init();
		$feed->handle_content_type();
		
		$posts = array();
		
		foreach ($feed->get_items() as $item):
			$title = $item->get_title();
			$date = $item->get_date();
			$content = $item->get_content();

			$posts[] = array('title' => $title, 'date' => $date,
							 'content' => $content);
			
		endforeach;


		//Generate a HTML string
		$html = "<h1>".$posts[0]["title"]."</h1>".$posts[0]["content"];

		return $this->makeViewJSON($html);
	}
}

//Give the AJAX API the name of this class
$SERVICE_NAME = "TestService";

