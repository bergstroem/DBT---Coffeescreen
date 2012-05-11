function test(){
	$.ajax({
		type: "GET",
		url: "../../services/Api.php",
		data: "getParameters",
		success: function(msg){
			var jarr = jQuery.parseJSON(msg);
			
			console.log(jarr);
			
			for(var tmp in jarr){
				console.log(jQuery.parseJSON(jarr[tmp]));
			}
		}
	});
}