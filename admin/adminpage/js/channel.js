/* 
 * createItem(name, target)
 * Function used for creating a new drag-/droppable div inside a target div.
 * name: Will be the id of the div
 * target: The target div to place the new div inside
*/
function createItem(name, target, filler, feeddata){
	var fill = filler || false;
	var data = feeddata || null;
	if(feedExists(name)){
		if(!fill){
			alert("Feed already exist");
		}
	}
	else{
		var divTag = document.createElement("div");
		divTag.id = "" + name;
		divTag.setAttribute("draggable","true");
		divTag.setAttribute("data",data);
		divTag.setAttribute("disabled","true");
		divTag.addEventListener('dragstart', handleDragStart, false);
		divTag.addEventListener('dragend', handleDragEnd, false);
		divTag.className = "contentitem";
		divTag.appendChild(document.createTextNode(name));
		
		var delbutton = document.createElement("input");
		delbutton.setAttribute("type","button");
		delbutton.setAttribute("name","rbutton");
		delbutton.setAttribute("value","Delete");
		delbutton.setAttribute("class","removebutton");
		delbutton.setAttribute("onclick","removeItem(this)");
		divTag.appendChild(delbutton);
		
		document.getElementById(target).appendChild(divTag);
	}
}

/*
 * fillcontent(csv, target)
 * Wrapper function for createItem, will create the given items from the csv 
 * string and put them in the target div.
 * csv: Comma-separated value containing the RSS feeds.
 * target: The id off the target div.
*/
function fillcontent(csv, target){
	if(csv.length > 0){
		var items = csv.split(',');
		
		for(var i = 0; i < items.length; i++){
			createItem(items[i],target)
		}
	}
}

/*
 * removeItem(element)
 * Used for removing a feed item.
 * element: The element that will be removed.
*/
function removeItem(element){
	var name = element.parentNode.getAttribute("id");
	var parentname = element.parentNode.parentNode.getAttribute("id");
	document.getElementById("contentlist").appendChild(document.getElementById(name));
	var maincont = document.getElementById("maincontent");
	if(maincont.childNodes.length == 0){
		maincont.style.backgroundImage = "url(images/dropFeedsHere.png)";
	}
}

/*
 * feedExists(name)
 * Used for checking so that the feed trying to be added does not already exist.
 * name: The name of the feed trying to be added.
*/
function feedExists(name){
	var children = document.getElementById('maincontent').childNodes;
	var length = children.length;
	for(var i = 0; i < length; i++){
		if(name == children[i].getAttribute('id'))
			return true;
	}
	
	children = document.getElementById('subcontent').childNodes;
	length = children.length;
	for(var i = 0; i < length; i++){
		if(name == children[i].getAttribute('id'))
			return true;
	}
	
	
	children = document.getElementById('contentlist').childNodes;
	length = children.length;
	for(var i = 0; i < length; i++){
		if(!(children[i].nodeName == "#text"))
			if(name == children[i].getAttribute('id'))
				return true;
	}
	
	return false;
}

/*
 * saveChannel()
 * Used for saving a channel, will use the information in the form.
*/
function saveChannel(){
	var name = document.getElementById("name").value;
	if(name == ""){
		alert("Please enter a name");
	}
	else{
		var note = document.getElementById("description").value;
		var stat = document.getElementById("static").value;

		var children = document.getElementById('maincontent').childNodes;
		var length = children.length;
		var mainContent = "";
		
		for(var i = 0; i < length; i++){
			mainContent += children[i].getAttribute('data') + ",";
		}
		mainContent = mainContent.substr(0,mainContent.length-1);
		
		children = document.getElementById('subcontent').childNodes;
		var length = children.length;
		var subContent = "";
		
		for(var i = 0; i < length; i++){
			subContent += children[i].getAttribute('data') + ",";
		}
		
		subContent = subContent.substr(0,subContent.length-1);
		var url = document.URL;
		url = url.substr(url.indexOf("?")+1);
		var p = url.substr(0,3);
		var oname = url.substr(9);
		if(p == "p=2"){
			if(!(oname.substr(0,oname.indexOf(".")) == name))
				$.ajax({
					type: "POST",
					url: "channelhandler.php",
					data: "p=3&name="+oname,
					success: function(msg){
					}
				});
		}
		
		if(oname.substr(0,oname.length-5) != name){
			$.ajax({
				type: "POST",
				url: "channelhandler.php",
				data: "p=list",
				success: function(msg){
					var jsonobj = jQuery.parseJSON(msg);
					for(var i = 0; i < jsonobj.length; i++){
						var jsonitem = jQuery.parseJSON(jsonobj[i]);
						if(jsonitem["name"] == name){
							var conflict = true;
							if(confirm('This will replace an existing channel. Continue?'))
								$.ajax({
									type: "POST",
									url: "channelhandler.php",
									data: "p=1&name="+name+"&note="+note+"&static="+stat+"&maincontent="+mainContent+"&subcontent="+subContent,
									success: function(msg){
										window.location = "adminchannel.php";
									}
								});
						}
					}
					if(!conflict)
						$.ajax({
							type: "POST",
							url: "channelhandler.php",
							data: "p=1&name="+name+"&note="+note+"&static="+stat+"&maincontent="+mainContent+"&subcontent="+subContent,
							success: function(msg){
								window.location = "adminchannel.php";
							}
						});
					}
			});
		}
		else{
			$.ajax({
				type: "POST",
				url: "channelhandler.php",
				data: "p=1&name="+name+"&note="+note+"&static="+stat+"&maincontent="+mainContent+"&subcontent="+subContent,
				success: function(msg){
					window.location = "adminchannel.php";
				}
			});
		}
	}
}

/*
 * editChannel(name)
 * Get the information from the json file and fill the form with the information.
 * name: Name of the channel that is going to be edited.
*/
function editChannel(name){
	$.ajax({
		type: "POST",
		url: "channelhandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			document.getElementById("name").value = jsonobj["name"];
			document.getElementById("static").value = jsonobj["static"];
			document.getElementById("description").value = jsonobj["note"];
			
			var arr = jsonobj["maincontent"].substr(0, jsonobj["maincontent"].length).split('},');
			if(arr.length > 0){
				for(var i = 0; i < arr.length-1; i++){
					arr[i] += "}";
				}
				for(var i = 0; i < arr.length; i++){
					var jsonitem = jQuery.parseJSON(arr[i]);
					var data = jsonToString(jsonitem);
					createItem(jsonitem["name"], "maincontent", true, jsonToString(jsonitem))
				}
			}
			/*
			var arr = jsonobj["subcontent"].substr(0, jsonobj["subcontent"].length).split('},');
			arr[0] += "}";
			if(arr.length > 1){
				for(var i = 0; i < arr.length; i++){
					var jsonitem = jQuery.parseJSON(arr[i]);
					createItem(jsonitem["name"], "subcontent", true, jsonToString(jsonitem))
				}
			}*/
			getFeeds();
		}
	});
}

/*
 * deleteChannel(name)
 * Will delete the channel with the given name.
 * name: Name of the channel that is going to be deleted.
*/
function deleteChannel(name){
	var divname = name.substr(0, name.length-5);
	var parentname = document.getElementById(name).parentNode.parentNode.parentNode.getAttribute("id");
	
	$.ajax({
		type: "POST",
		url: "channelhandler.php",
		data: "p=3&name="+name,
		success: function(msg){
			document.getElementById(parentname).removeChild(document.getElementById(divname));
		}
	});
}

/*
 * Handle clicks in adminchannel.php
*/
$(document).ready(function(){
	$('.content').click(function(e){
		if($(e.target).is('.itemButton')){
			if(e.target.value == "Add")
				window.location = "channel.php?p=1";
			else if(e.target.value == "Edit")
				window.location = "channel.php?p=2&name="+e.target.id;
			else if(e.target.value == "Delete")
				deleteChannel(e.target.id);
		}
	});
});

/*
 * addEL()
 * Used for adding eventhandlers to the channel form.
*/
function addEL(){
	document.getElementById("maincontent").addEventListener('dragover', handleDragOver, false);
	document.getElementById("maincontent").addEventListener('drop', handleDrop, false);
	
	document.getElementById("subcontent").addEventListener('dragover', handleDragOver, false);
	document.getElementById("subcontent").addEventListener('drop', handleDrop, false);
	
	document.getElementById("contentlist").addEventListener('dragover', handleDragOver, false);
	document.getElementById("contentlist").addEventListener('drop', handleDrop, false);
}

/*
 * listChannels()
 * Used for listing all the existing channels and displaying them.
*/
function listChannels(){
	var table = document.getElementById("listContent");
	
	$.ajax({
		type: "POST",
		url: "channelhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			for(var i = 0; i < jsonobj.length; i++){
				var jsonitem = jQuery.parseJSON(jsonobj[i]);
				
				var tr = document.createElement("tr");
				tr.id = jsonitem["name"];
				tr.className = (table.getElementsByTagName("tr").length % 2 == 0) ? "listItem" : "listItem grey";
				
				var td = document.createElement("td");
				td.className = "itemName";
				td.appendChild(document.createTextNode(jsonitem["name"]));
				tr.appendChild(td);
				
				td = document.createElement("td");
				td.className = "itemDescription";
				var note = (jsonitem["note"].length > 200) ? jsonitem["note"].substr(0,200) + "...": jsonitem["note"];
				td.appendChild(document.createTextNode(note));
				tr.appendChild(td);
				
				td = document.createElement("td");
				button = document.createElement("input");
				button.type = "button";
				button.id = jsonitem["name"] + ".json";
				button.value = "Delete";
				button.className = "itemButton redbutton";
				td.appendChild(button);
				
				button = document.createElement("input");
				button.type = "button";
				button.id = jsonitem["name"] + ".json";
				button.value = "Edit";
				button.className = "itemButton cyanbutton";
				td.appendChild(button);
				
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
		}
	});
}

function getFeeds(){
	
	$('#name').watermark('Descriptive title for this channel');
	$('#static').watermark('Static information at the bottom of the client display');
	$('#description').watermark('A short description of this channel');
	
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			for(var i = 0; i < jsonobj.length; i++){
				var jsonitem = jQuery.parseJSON(jsonobj[i])
				var data = jsonToString(jsonitem);
				createItem(jsonitem["name"], "contentlist", true, data);
			}
		}
	});
}

function jsonToString(jsonitem){
	var data = "{";
	for(var key in jsonitem){
		data += "\"" + key + "\"" + ":" + "\"" + jsonitem[key] + "\"" + ",";
	}
	data = data.substr(0, data.length-1);
	data += "}";
	
	return data;
}
