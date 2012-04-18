<?php
	require('RSS/service.php');
	require('prioritysort.php');
	
	$string = '{"posts": [' . $_GET["sources"] . "]}";
	$sources = json_decode($string);
	
	//Resulting feeds is stored here
	$result = array();
	
	foreach ($sources->posts as $item) {
		$service = new $SERVICE_NAME();
		
		$url = array();
		$url["url"] = $item->source;
		$service->loadParameters($url);
		$result[] = $service->getView();
		
		//Check if the post has past its expire time
		$now = time();
		$expireTime = $result[count($result)-1]["date"] + ($item->expiretime * 60 * 60);
		
		if ($expireTime > $now) {
			//Expired post. Remove!
			unset($result[count($result)-1]);
		} else {
			//Set values
			$result[count($result)-1]["displaytime"] = $item->displaytime;
			$result[count($result)-1]["priority"] = $item->priority;
		}
	}
	
	if(count($result) < 1) {
		$result = null;
	}
	else {
		$result = merge_sort($result);
	}
	
	echo '{"posts": ' . json_encode($result) . "}";
	
?>
