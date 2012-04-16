var host = window.location.host/*"85.24.223.52"*/;

/*
 * Handles click events in index.php
*/
$(document).ready(function(){
	$('.content').click(function(e){
		if($(e.target).is('.screenAllPanicButton')){
			$.ajax({
				type: "POST",
				url: "http://" + host + ":8081/panic/?screen=*",
				data: "",
				success: function(msg){
					console.log(msg);
				}
			});
		}
			
		if($(e.target).is('.screenPanicButton')){
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
		if($(e.target).is('.screenSetButton')){
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
	});
});

/*
 * listScreens()
 * Will connect to the node server and get all the connected screens and display them.
*/
function listScreens(){
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
	var screenItem = document.createElement("div");
	screenItem.id = "screen:" + name;
	screenItem.className = "listItem";
	var pname = document.createElement("p");
	pname.className = "name"
	pname.appendChild(document.createTextNode(name));
	
	var panicButton = document.createElement("input");
	panicButton.id = "panic:" + name;
	panicButton.type = "button";
	panicButton.value = "Panic";
	panicButton.className = "itemButton red";
	
	var select = document.createElement("select");
	select.id = "select:" + name;
	select.className = "screenChannelSelect";
	
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
	
	
	
	var set = document.createElement("input");
	set.id = "set:" + name;
	set.type = "button";
	set.value = "Set";
	set.className = "itemButton maincolor";
	
	screenItem.appendChild(pname);
	pname.appendChild(panicButton);
	pname.appendChild(set);
	pname.appendChild(select);
	document.getElementById("screencontent").appendChild(screenItem);
}
