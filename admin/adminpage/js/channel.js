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
		delbutton.setAttribute("value","X");
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
	var name = document.getElementById("nameTXB").value;
	if(name == ""){
		alert("Please enter a name");
	}
	else{
		var note = document.getElementById("noteTXB").value;

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
					var jsonobj = JSON.parse(msg);
					for(var i = 0; i < jsonobj.length; i++){
						var jsonitem = JSON.parse(jsonobj[i]);
						if(jsonitem["name"] == name){
							var conflict = true;
							if(confirm('This will replace an existing channel. Continue?'))
								$.ajax({
									type: "POST",
									url: "channelhandler.php",
									data: "p=1&name="+name+"&note="+note+"&maincontent="+mainContent+"&subcontent="+subContent,
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
							data: "p=1&name="+name+"&note="+note+"&maincontent="+mainContent+"&subcontent="+subContent,
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
				data: "p=1&name="+name+"&note="+note+"&maincontent="+mainContent+"&subcontent="+subContent,
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
			var jsonobj = JSON.parse(msg);
			document.getElementById("nameTXB").value = jsonobj["name"];
			document.getElementById("noteTXB").value = jsonobj["note"];
			
			var arr = jsonobj["maincontent"].substr(0, jsonobj["maincontent"].length).split('},');
			arr[0] += "}";
			if(arr.length > 1){
				for(var i = 0; i < arr.length; i++){
					var jsonitem = JSON.parse(arr[i]);
					var data = jsonToString(jsonitem);
					createItem(jsonitem["name"], "maincontent", true, jsonToString(jsonitem))
				}
			}
			var arr = jsonobj["subcontent"].substr(0, jsonobj["subcontent"].length).split('},');
			arr[0] += "}";
			if(arr.length > 1){
				for(var i = 0; i < arr.length; i++){
					var jsonitem = JSON.parse(arr[i]);
					createItem(jsonitem["name"], "subcontent", true, jsonToString(jsonitem))
				}
			}
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
	var parentname = document.getElementById(name).parentNode.parentNode.getAttribute("id");
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
	$('.newItemButton').click(function(e){
		window.location = "channel.php?p=1";
	});
	
	$('.content').click(function(e){
		if($(e.target).is('.editItemButton')){
			window.location = "channel.php?p=2&name="+e.target.id;
		}
		if($(e.target).is('.deleteItemButton')){
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
	var chanList = document.getElementById("adminchannelcontent");
	
	$.ajax({
		type: "POST",
		url: "channelhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = JSON.parse(msg);
			for(var i = 0; i < jsonobj.length; i++){
				var jsonitem = JSON.parse(jsonobj[i]);
				var item = document.createElement("div");
				item.id = jsonitem["name"];
				item.className = "channelitem";
				
				var p1 = document.createElement("p");
				p1.appendChild(document.createTextNode(jsonitem["name"]));
				var p2 = document.createElement("p");
				p2.className = "note";
				p2.appendChild(document.createTextNode("Note: " + jsonitem["note"]));
				
				item.appendChild(p1);
				item.appendChild(p2);
				
				var editButton = document.createElement("input");
				editButton.type = "button";
				editButton.id = jsonitem["name"] + ".json";
				editButton.value = "Edit";
				editButton.className = "editItemButton";
				item.appendChild(editButton);
				
				var delButton = document.createElement("input");
				delButton.type = "button";
				delButton.id = jsonitem["name"] + ".json";
				delButton.value = "Delete";
				delButton.className = "deleteItemButton";
				item.appendChild(delButton);
				
				chanList.appendChild(item);
			}
		}
	});
}

function getFeeds(){
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = JSON.parse(msg);
			for(var i = 0; i < jsonobj.length; i++){
				var jsonitem = JSON.parse(jsonobj[i])
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