<?php
	if($handle = opendir(".")){
		$plugins = array();
		while(false !== ($entry = readdir($handle))){
			if(is_dir("./".$entry) && ($entry !== "." && $entry !== "..")){
				$plugins[] = "$entry";
			}
		}

		closedir($handle);
	}
	foreach($plugins as $plugin){
		require("$plugin/plugin.php");
	}
	/*require('TodayInHistory/plugin.php');
	require('RSS/plugin.php');*/
	require('prioritysort.php');
	
	$string = '{"posts": [' . $_GET["sources"] . "]}";
	$sources = json_decode($string);
	
	//Resulting feeds is stored here
	$result = array();
	
	foreach ($sources->posts as $item) {
		
		$pluginname = $item->type;
		$plugin = new $pluginname();
		
		$plugin->loadParameters($item);
		
		$itemList = $plugin->getViewList();
		
		foreach($itemList as $key => $resultItem) {
			//Check if the post has past its expire time
			$now = time();
			
			$expireTime = $resultItem["date"] + ($item->expiretime * 60 * 60);
			if ($expireTime <= $now || $item->expiretime <= 0) {
				//Set values
				$resultItem["displaytime"] = $item->displaytime;
				$resultItem["priority"] = $item->priority;
				$resultItem["timingmode"] = $item->timingmode;
				$result[] = $resultItem;
			}
    	}
    		
    	
	}
	
	
	if(count($result) < 1) {
		$result = null;
	}
	else {
		$result = duplicate(merge_sort($result));
	}
	
	echo '{"posts": ' . json_encode($result) . "}";
	
?>
