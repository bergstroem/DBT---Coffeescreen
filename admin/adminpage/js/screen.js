var host = window.location.host/*"85.24.223.52"*/;

/*
 * Handles click events in index.php
*/
$(document).ready(function(){
	$('.content').click(function(e){
		if($(e.target).is('.itemButton')){
			if(e.target.value == "Panic all"){
				$.ajax({
					type: "POST",
					url: "http://" + host + ":8081/panic/?screen=*",
					data: "",
					success: function(msg){
						console.log(msg);
					}
				});
			}
			else if(e.target.value == "Set"){
				var name = e.target.id.substr(e.target.id.indexOf(":")+1);
				var select = document.getElementById("select:"+name);
				
				$.ajax({
					type: "POST",
					url: "http://" + host + ":8081/set/?screen="+name+"&channel="+select.value,
					data: "",
					success: function(msg){
						console.log(msg);
					}
				});
			}
			else{
				var name = e.target.id.substr(e.target.id.indexOf(":")+1);
			
				$.ajax({
					type: "POST",
					url: "http://" + host + ":8081/panic/?screen="+name,
					data: "",
					success: function(msg){
						console.log(msg);
					}
				});
			}
		}
	});
});

/*
 * listScreens()
 * Will connect to the node server and get all the connected screens and display them.
*/
function listScreens(){
	var table = document.getElementById("listContent");
	$.ajax({
		type: "POST",
		url: "http://" + host + ":8081/listscreens",
		data: "",
		success: function(msg){
			if(msg.length > 2){
				var screenNames = msg.split(";");
				for(var i = 0; i < screenNames.length; i++){
					createScreen(screenNames[i]);
				}
			}
		}
	});
	
	createScreen("temp");
}

/*
 * createScreen(name)
 * Used for creating a screen, used by listScreens().
 * name: Name of the screen that will be displayed.
*/
function createScreen(name){
	table = document.getElementById("listContent");
	
	var tr = document.createElement("tr");
	tr.className = (table.getElementsByTagName("tr").length % 2 == 0) ? "listItem" : "listItem grey";
	
	var td = document.createElement("td");
	td.className = "itemName";
	td.id = "screen" + name;
	td.appendChild(document.createTextNode(name));
	tr.appendChild(td);
	
	td = document.createElement("td");
	td.className = "itemType";
	
	var select = document.createElement("select");
	select.id = "select:" + name;
	select.className = "screenChannelSelect";
	
	td.appendChild(select);
	tr.appendChild(td);
	
	td = document.createElement("td");
	var button = document.createElement("input");
	button.type = "button";
	button.id = "panic:" + name;
	button.className = "itemButton red";
	button.value = "Panic";
	td.appendChild(button);
	
	button = document.createElement("input");
	button.type = "button";
	button.id = "set:" + name;
	button.className = "itemButton maincolor";
	button.value = "Set";
	td.appendChild(button);
	
	tr.appendChild(td);
	
	var set = document.createElement("input");
	set.id = "set:" + name;
	set.type = "button";
	set.value = "Set";
	set.className = "itemButton maincolor";
	
	table.appendChild(tr);
	$.ajax({
		type: "POST",
		url: "channelhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			for(var i = 0; i < jsonobj.length; i++){
				var jsonitem = jQuery.parseJSON(jsonobj[i]);
				var item = document.createElement("option");
				item.value = jsonitem["name"];
				item.appendChild(document.createTextNode(jsonitem["name"]));
				
				select.appendChild(item);
			}
		}
	});
}
