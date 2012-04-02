<?php
	$p = $_POST['p'];
	$name = $_POST['name'];
	if($p == 1){
		$note = $_POST['note'];
		$maincontent = $_POST['maincontent'];
		$subcontent = $_POST['subcontent'];
		
		$data = array('name' => $name ,'note' => $note, 'maincontent' => $maincontent, 'subcontent' => $subcontent);
		$jsondata = json_encode($data);
		echo $jsondata;
		
		$fh = fopen("../../templates/$name.json", "w");
		fwrite($fh, $jsondata);

		fclose($fh);
	}
	else if($p == 2){
		$name = "../../templates/$name";
		$fh = fopen("$name", "r");
		$jsondata = fread($fh, filesize($name));
		fclose($fh);
		echo $jsondata;
	}
	else if($p == 3){
		unlink("../../templates/$name");
	}
?>