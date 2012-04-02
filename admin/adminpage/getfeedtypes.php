<?php
	$dir = "../../services/";
	if($handle = opendir("$dir")){
		$data = array();
		while(false !== ($entry = readdir($handle))){
			if(is_dir($dir."/".$entry) && ($entry !== "." && $entry !== "..")){
				$data[] = "$entry";
			}
		}

		$data = json_encode($data);
		echo "$data";
		closedir($handle);
	}
?>