<?php
	$list = array(1,2,3);
	$slist = merge_sort($list);
	print_r($slist);
	
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
				if($left[0] > $right[0]){
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
		$numbOne = count($list) - array_search(1, $list);
		for($i = 0; $i < array_search(1,$list); $i++){
			for($n = 0; $n < $list[$i]-1; $n++){
				array_splice($list,array_search(1,$list)+$numbOne/$list[$i]+$n*$list[$i]+$i,0,$list[$i]);
			}
		}
		return $list;
	}
?>