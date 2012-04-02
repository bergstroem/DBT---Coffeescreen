<?php
	$xml = simplexml_load_file("http://titan.codemill.se/~denols/infoboard/power/graphs/lastdata.xml");
	$arr = array();
	foreach($xml->data->row as $row){
		$arr[] = $row->v0;
	}
	for($i = sizeof($arr)-1; $i > 0; $i--){
		if($arr[$i] != "NaN"){
			echo $arr[$i];
			break;
		}
	}
?>