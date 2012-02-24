/*
 * listTemplates()
 * Used for listing all the existing templates and displaying them.
*/
function powerUsage(){
	var tmp = document.getElementById("temp");
	$.ajax({
		type: "POST",
		url: "powerusage.php",
		data: "",
		success: function(msg){
			tmp.innerHTML = "Current powerusage: " + msg.substr(0,4) + " kW";
		}
	});
	setTimeout("powerUsage()",5000);
}