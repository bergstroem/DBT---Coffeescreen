<?php
	if($handle = opendir('../../channels/')){
		$chans = array();
		while(false !== ($entry = readdir($handle))){
			if(!strcmp(substr($entry, -5), ".json")){
				$name = substr($entry, 0, -5);
				$chans[] = "$name";
			}
		}
		$chans = json_encode($chans);
		echo "$chans";
		closedir($handle);
	}
?>