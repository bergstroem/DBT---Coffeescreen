<?php
	require_once('simplepie.inc');
	
	/* Takes a list of feed sources and aggregates the posts to a list in JSON.
		Feed sources are sent as a GET variable named 'feeds', the sources should
		be comma separated.
	*/
	
	$feedSourcesArray = explode(",", $_GET["feeds"]);
	
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

	$response = array();
	$response['posts'] = $posts;

	echo json_encode($response);
?>
