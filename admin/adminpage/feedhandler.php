<?php
	$p = $_POST['p'];
	/* Create new feed */
	if($p == 1){
		$data = array();
		$data['name'] = $_POST['name'];
		$data['type'] = $_POST['type'];
		$custom = $_POST['custom'];
		$data['note'] = $_POST['note'];
		$data['priority'] = $_POST['priority'];
		$data['displaytime'] = $_POST['displaytime'];
		$data['expiretime'] = $_POST['expiretime'];
		$data['timingmode'] = $_POST['timingmode'];
		
		if($custom != ""){
			$c = explode(",",$custom);
			
			foreach($c as $item){
				$split = explode("|",$item);
				$data[$split[0]] = $split[1];
			}
		}
		
		$jsondata = json_encode($data);
		echo $jsondata;
		
		$fh = fopen("../../feeds/$data[name].json", "w");
		fwrite($fh, $jsondata);

		fclose($fh);
	}
	/* Edit feed */
	else if($p == 2){
		$name = $_POST['name'];
		$name = "../../feeds/$name";
		$fh = fopen("$name", "r");
		$jsondata = fread($fh, filesize($name));
		fclose($fh);
		echo $jsondata;
	}
	/* Delete feed */
	else if($p == 3){
		$name = $_POST['name'];
		unlink("../../feeds/$name");
	}
	/* Get plugin types */
	else if($p == "type"){
		$dir = "../../plugins/";
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
	/* Get all feeds */
	else if($p == "list"){
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