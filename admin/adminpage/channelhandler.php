﻿<?php
	$p = $_POST['p'];
	/* Save channel */
	if($p == 1){
		$name = $_POST['name'];
		$note = $_POST['note'];
		$static = $_POST['static'];
		$maincontent = $_POST['maincontent'];
		$panic = "";
		
		$fh = fopen("../../channels/Panic.json", "r");
		if($fh != FALSE && $name != "Panic"){
			$panic = fread($fh, filesize("../../channels/Panic.json"));
			$panic = json_decode($panic);
		}
		fclose($fh);
		
		$data = array('name' => $name ,'static' => $static, 'note' => $note, 'maincontent' => $maincontent, 'panic' => $panic);
		$jsondata = json_encode($data);
		
		$fh = fopen("../../channels/$name.json", "w");
		fwrite($fh, $jsondata);

		fclose($fh);
	}
	/* Edit channel */
	else if($p == 2){
		$name = $_POST['name'];
		$name = "../../channels/$name";
		$fh = fopen("$name", "r");
		$jsondata = fread($fh, filesize($name));
		fclose($fh);
		echo $jsondata;
	}
	/* Delete channel */
	else if($p == 3){
		$name = $_POST['name'];
		unlink("../../channels/$name");
	}
	/* Get all channels */
	else if($p === "list"){
		if($handle = opendir("../../channels/")){
			$data = array();
			while(false !== ($entry = readdir($handle))){
				if(!strcmp(substr($entry, -5), ".json")){
					$name = "../../channels/$entry";
					$fh = fopen("$name", "r");
					$jsondata = fread($fh, filesize($name));
					fclose($fh);
					$data[] = $jsondata;
				}
			}
			$data = json_encode($data);
			echo "$data";
			closedir($handle);
		}
	}
?>