function test(){
	var array = new Array(1,2,1,1,1,1,3,1);
	console.log(array);
	
	var sarr = duplicate(merge_sort(array));
	console.log(sarr);
}

function merge_sort(list){
	if (list.length <= 1)
		return list;
	var left;
	var right;

	var middle = Math.floor(list.length / 2);
	
	left = list.slice(0,middle);
	right = list.slice(middle,list.length);
	left = merge_sort(left);
	right = merge_sort(right);
	
	return merge(left, right);
}

function merge(left, right){
	var result = new Array();
	while(left.length > 0 || right.length > 0){
		if(left.length > 0 && right.length > 0)
			if(left[0] > right[0]){
				result.push(left[0]);
				left = left.slice(1,left.length);
			}
			else{
				result.push(right[0]);
				right = right.slice(1,right.length);
			}
		else if(left.length > 0){
			result.push(left[0]);
			left = left.slice(1,left.length);
		}
		else if(right.length > 0){
			result.push(right[0]);
			right = right.slice(1,right.length);
		}
	}
	
	return result;
}

function duplicate(list){
	var numbOne = list.length - list.indexOf(1);
	//console.log(numbOne);
	for(var i = 0; i < list.indexOf(1); i++){
		for(var n = 0; n < list[i]-1; n++){
		//	console.log(list.indexOf(1)+numbOne/list[i]+n*list[i]+i);
			list.splice((list.indexOf(1)+numbOne/list[i])+n*list[i]+i,0,list[i]);
		}
	}
	return list;
}