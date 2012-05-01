<?php
	
	function merge_sort($list){
		if(count($list) <= 1)
			return $list;

		$middle = floor(count($list) / 2);
		
		$left = array_slice($list,0,$middle);
		$right = array_slice($list,$middle,count($list));
		$left = merge_sort($left);
		$right = merge_sort($right);
		
		return merge($left, $right);
	}
	
	function merge($left, $right){
		$result = array();
		while(count($left) > 0 || count($right) > 0){
			if(count($left) > 0 && count($right) > 0)
				if($left[0]["priority"] > $right[0]["priority"]){
					array_push($result,$left[0]);
					$left = array_slice($left,1,count($left));
				}
				else{
					array_push($result,$right[0]);
					$right = array_slice($right,1,count($right));
				}
			else if(count($left) > 0){
				array_push($result,$left[0]);
				$left = array_slice($left,1,count($left));
			}
			else if(count($right) > 0){
				array_push($result,$right[0]);
				$right = array_slice($right,1,count($right));
			}
		}
		
		return $result;
	}
	
	function duplicate($list){
		$numbOne = count($list) - prioritySearch(1, $list);
		for($i = 0; $i < prioritySearch(1,$list); $i++){
			for($n = 0; $n < $list[$i]["priority"]-1; $n++){
				//array_splice($list,prioritySearch(1,$list)+$numbOne/$list[$i]["priority"]+$n*$list[$i]["priority"]+$i,0,$list[$i]);
				array_insert($list, $list[$i], prioritySearch(1,$list)+$numbOne/$list[$i]["priority"]+$n*$list[$i]["priority"]+$i);
			}
		}
		return $list;
	}
	
	function prioritySearch($value, $list) {
	
		for($i = 0; $i < count($list); $i++) {
			if($list[$i]["priority"] == $value) {
				return $i;
			}
		}
		return -1;
	}
	
	function array_insert(&$array,$element,$position=null) {
	if (count($array) == 0) {
		$array[] = $element;
	}
	elseif (is_numeric($position) && $position < 0) {
		if((count($array)+position) < 0) {
	  		$array = array_insert($array,$element,0);
		}
		else {
	  		$array[count($array)+$position] = $element;
		}	
	}
	elseif (is_numeric($position) && isset($array[$position])) {
		$part1 = array_slice($array,0,$position,true);
		$part2 = array_slice($array,$position,null,true);
		$array = array_merge($part1,array($position=>$element),$part2);
		foreach($array as $key=>$item) {
		  if (is_null($item)) {
			unset($array[$key]);
		  }
		}
	}
	elseif (is_null($position)) {
		$array[] = $element;
	}
	elseif (!isset($array[$position])) {
		$array[$position] = $element;
	}
	
	$array = array_merge($array);
	return $array;
	}

?>
