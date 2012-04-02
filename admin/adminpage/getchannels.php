<?php
	$dir = $_POST["dir"];

	if($handle = opendir("../../$dir/")){
		$data = array();
		while(false !== ($entry = readdir($handle))){
			if(!strcmp(substr($entry, -5), ".json")){
				$name = substr($entry, 0, -5);
				$data[] = "$name";
			}
		}
		$data = json_encode($data);
		echo "$data";
		closedir($handle);
	}
?>