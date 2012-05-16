<?php
	$p = $_POST['p'];
	if($p == 1){
		$name = $_POST['name'];
		$type = $_POST['type'];
		$custom = $_POST['custom'];
		$note = $_POST['note'];
		$priority = $_POST['priority'];
		$displaytime = $_POST['displaytime'];
		$expiretime = $_POST['expiretime'];
		$timingmode = $_POST['timingmode'];
		
		$c = explode(",",$custom);
		
		$data = array();
		$data['name'] = $name;
		$data['type'] = $type;
		
		foreach($c as $item){
			$split = explode("|",$item);
			$data[$split[0]] = $split[1];
		}
		
		$data['note'] = $note;
		$data['priority'] = $priority;
		$data['displaytime'] = $displaytime;
		$data['expiretime'] = $expiretime;
		$data['timingmode'] = $timingmode;
		
		$jsondata = json_encode($data);
		echo $jsondata;
		
		$fh = fopen("../../feeds/$name.json", "w");
		fwrite($fh, $jsondata);

		fclose($fh);
	}
	else if($p == 2){
		$name = $_POST['name'];
		$name = "../../feeds/$name";
		$fh = fopen("$name", "r");
		$jsondata = fread($fh, filesize($name));
		fclose($fh);
		echo $jsondata;
	}
	else if($p == 3){
		$name = $_POST['name'];
		unlink("../../feeds/$name");
	}
	else if($p === "type"){
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
	}
	else if($p === "list"){
		if($handle = opendir("../../feeds/")){
			$data = array();
			while(false !== ($entry = readdir($handle))){
				if(!strcmp(substr($entry, -5), ".json")){
					$name = "../../feeds/$entry";
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