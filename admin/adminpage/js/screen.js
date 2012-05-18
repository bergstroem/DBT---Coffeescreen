
﻿var host = window.location.host;//"dbt2k12b.codemill.se";//window.location.host/*"85.24.223.52"*/;
/*
 * Handles click events in index.php
*/

$(document).ready(function(){
	$.ajax({
		type: "POST",
		url: "http://" + host + ":18081/isPanic",
		data: "",
		success: function(msg){
			if(msg == "true") {
				document.getElementById('panicAll').value = "Unpanic all";
			}
		}
	});

	$('.content').click(function(e){
		if($(e.target).is('.itemButton')){
			if(e.target.value == "Panic all"){
				e.target.value = "Unpanic all";
				$('#panicAll').removeClass('redbutton');
				$('#panicAll').addClass('greenbutton');
				$.ajax({
					type: "POST",
					url: "http://" + host + ":18081/panic/?screen=*",
					data: "",
					success: function(msg){
						console.log(msg);
					}
				});
			}
			else if(e.target.value == "Unpanic all"){
				e.target.value = "Panic all";
				$('#panicAll').removeClass('greenbutton');
				$('#panicAll').addClass('redbutton');
				$.ajax({
					type: "POST",
					url: "http://" + host + ":18081/unPanic/?screen=*",
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
					url: "http://" + host + ":18081/set/?screen="+name+"&channel="+select.value,
					data: "",
					success: function(msg){
						console.log(msg);
						alert("Setting channel " + select.value + " to the screen " + name);
					}
				});
			}
			else{
				var name = e.target.id.substr(e.target.id.indexOf(":")+1);
				$(e.target).toggleClass('redbutton');
				$(e.target).toggleClass('greenbutton');
				var panic = "unPanic";
				if(e.target.value == "Panic") {
					e.target.value = "Unpanic";
					panic = "panic";
					
				}
				else
					e.target.value = "Panic";
					
				$.ajax({
					type: "POST",
					url: "http://" + host + ":18081/"+panic+"/?screen="+name,
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
		url: "http://" + host + ":18081/listscreens",
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
 * createScreen(info)
 * Used for creating a screen, used by listScreens().
 * info: Name of the screen that will be displayed and current channel (comma separated).
*/
function createScreen(info){
	console.log(info.split(","));
	var name = info.split(",")[0];
	var currentChannel = info.split(",")[1];
	var isPanic = info.split(",")[2];
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
	
	if(isPanic == "false"){
		button.className = "itemButton redbutton";
		button.value = "Panic";
	}
	else{
		button.className = "itemButton greenbutton";
		button.value = "Unpanic";
	}
	td.appendChild(button);
	
	button = document.createElement("input");
	button.type = "button";
	button.id = "set:" + name;
	button.className = "itemButton cyanbutton";
	button.value = "Set";
	td.appendChild(button);
	
	tr.appendChild(td);
	
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
			//Select the current channel
			var options = select.options;
			for(var i = 0; i < options.length; i++) {
				console.log(options[i].value + " " + currentChannel);
				if(options[i].value == currentChannel) {
					select.selectedIndex = i;
				}
			}
		}
	});
}
