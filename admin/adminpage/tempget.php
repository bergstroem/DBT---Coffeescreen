<?php
	if($handle = opendir('.')){
		$temps = array();
		while(false !== ($entry = readdir($handle))){
			if(!strcmp(substr($entry, -5), ".json")){
				$name = substr($entry, 0, -5);
				$temps[] = "$name";
			}
		}
		$temps = json_encode($temps);
		echo "$temps";
		closedir($handle);
	}
?>