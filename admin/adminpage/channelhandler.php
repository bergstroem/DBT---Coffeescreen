<?php
	$p = $_POST['p'];
	if($p == 1){
		$name = $_POST['name'];
		$note = $_POST['note'];
		$static = $_POST['static'];
		$maincontent = $_POST['maincontent'];
		$subcontent = $_POST['panic'];
		
		$data = array('name' => $name ,'static' => $static, 'note' => $note, 'maincontent' => $maincontent, 'panic' => $subcontent);
		$jsondata = json_encode($data);
		echo $jsondata;
		
		$fh = fopen("../../channels/$name.json", "w");
		fwrite($fh, $jsondata);

		fclose($fh);
	}
	else if($p == 2){
		$name = $_POST['name'];
		$name = "../../channels/$name";
		$fh = fopen("$name", "r");
		$jsondata = fread($fh, filesize($name));
		fclose($fh);
		echo $jsondata;
	}
	else if($p == 3){
		$name = $_POST['name'];
		unlink("../../channels/$name");
	}
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