<?php
	$p = $_POST['p'];
	if($p == 1){
		$name = $_POST['name'];
		$note = $_POST['note'];
		$maincontent = $_POST['maincontent'];
		$subcontent = $_POST['subcontent'];
		
		$data = array('name' => $name ,'note' => $note, 'maincontent' => $maincontent, 'subcontent' => $subcontent);
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
	else if($p == 9){
		if($handle = opendir("../../channels/")){
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
	}
?>