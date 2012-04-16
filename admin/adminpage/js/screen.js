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
}

/*
 * createScreen(name)
 * Used for creating a screen, used by listScreens().
 * name: Name of the screen that will be displayed.
*/
function createScreen(name){
	var screenItem = document.createElement("div");
	screenItem.id = "screen:" + name;
	screenItem.className = "channelitem";
	screenItem.appendChild(document.createTextNode(name));
	
	var panicButton = document.createElement("input");
	panicButton.id = "panic:" + name;
	panicButton.type = "button";
	panicButton.value = "Panic";
	panicButton.className = "screenPanicButton red";
	
	var select = document.createElement("select");
	select.id = "select:" + name;
	select.className = "screenChannelSelect";
	$.ajax({
		type: "POST",
		url: "getchannels.php",
		data: "dir=channels",
		success: function(msg){
			var arr = msg.substr(2, msg.length-4).split('\",\"');
			for(var i = 0; i < arr.length; i++){
				var temp = document.createElement("option");
				temp.value = arr[i];
				temp.appendChild(document.createTextNode(arr[i]));
				select.appendChild(temp);
			}
		}
	});
	
	var set = document.createElement("input");
	set.id = "set:" + name;
	set.type = "button";
	set.value = "set";
	set.className = "screenSetButton maincolor";
	
	screenItem.appendChild(select);
	screenItem.appendChild(set);
	screenItem.appendChild(panicButton);
	document.getElementById("screencontent").appendChild(screenItem);
}
