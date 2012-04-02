<?php
	$p = $_POST['p'];
	$name = $_POST['name'];
	if($p == 1){
		$source = $_POST['source'];
		$type = $_POST['type'];
		$note = $_POST['note'];
		$priority = $_POST['priority'];
		$displaytime = $_POST['displaytime'];
		$expiretime = $_POST['expiretime'];
		
		$data = array('name' => $name, 'source' => $source, 'type' => $type, 'note' => $note, 'priority' => $priority, 'displaytime' => $displaytime, 'expiretime' => $expiretime);
		$jsondata = json_encode($data);
		echo $jsondata;
		
		$fh = fopen("../../feeds/$name.json", "w");
		fwrite($fh, $jsondata);

		fclose($fh);
	}
	else if($p == 2){
		$name = "../../feeds/$name";
		$fh = fopen("$name", "r");
		$jsondata = fread($fh, filesize($name));
		fclose($fh);
		echo $jsondata;
	}
	else if($p == 3){
		unlink("../../feeds/$name");
	}
?>