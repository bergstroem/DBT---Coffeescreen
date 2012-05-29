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
 * Function used for creating a new drag-/droppable div inside a target div.
 * name: Will be the id of the div
 * target: Id of the target div
 * feeddata: Data of the feed
 */
function createItem(name, target, feeddata){
	var data = feeddata || null;

	var divTag = document.createElement("div");
	divTag.id = "" + name;
	divTag.className = "contentitem";
	divTag.setAttribute("draggable","true");
	divTag.setAttribute("data",data);
	divTag.setAttribute("disabled","true");
	divTag.addEventListener('dragstart', handleDragStart, false);
	divTag.addEventListener('dragend', handleDragEnd, false);
	divTag.appendChild(document.createTextNode(name));
	
	var delbutton = document.createElement("input");
	delbutton.setAttribute("type","button");
	delbutton.setAttribute("name","rbutton");
	delbutton.setAttribute("value","Remove");
	delbutton.setAttribute("class","removebutton");
	delbutton.setAttribute("onclick","removeItem(this)");
	divTag.appendChild(delbutton);
	
	document.getElementById(target).appendChild(divTag);
}

/*
 * Removes a feed from the content area an returns it to the feedlist.
 * element: The element that will be removed.
 */
function removeItem(element){
	var name = element.parentNode.getAttribute("id");
	document.getElementById("contentlist").appendChild(document.getElementById(name));
	var maincont = document.getElementById("maincontent");
	
	if(maincont.childNodes.length == 0){
		maincont.style.backgroundImage = "url(images/dropFeedsHere.png)";
	}
}

/*
 * Used for saving a channel, saving information from the inputfields and 
 * the feeds dropped in the content area.
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

		var url = document.URL;
		url = url.substr(url.indexOf("?")+1);
		var p = url.substr(0,3);
		var oname = url.substr(9);
		
		/* Removes the old file if the channel get a new name */
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
		var datastr  = "p=1&name="+name+"&note="+note+"&static="+stat+"&maincontent="+mainContent;
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
									data: datastr,
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
							data: datastr,
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
				data: datastr,
				success: function(msg){
					window.location = "adminchannel.php";
				}
			});
		}
	}
}

/*
 * Get the information from the channel json-file and fill the form with the information.
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
			
			var title = document.getElementById("title");
			title.removeChild(title.lastChild);
			title.appendChild(document.createTextNode("Edit channel"));
			
			var arr = jsonobj["maincontent"].substr(0, jsonobj["maincontent"].length).split('},');
			arr = (arr[0] == "") ? undefined : arr;
			
			getFeeds(arr);
		}
	});
}

/*
 * Will delete the channel with the given name.
 * name: Name of the channel that is going to be deleted.
 */
function deleteChannel(name){
	var divname = name.substr(0, name.length-5);
	var parentname = document.getElementById(name).parentNode.parentNode.parentNode.getAttribute("id");
	if(confirm('This will delete this channel. Continue?')){
		$.ajax({
			type: "POST",
			url: "channelhandler.php",
			data: "p=3&name="+name,
			success: function(msg){
				document.getElementById(parentname).removeChild(document.getElementById(divname));
				$('#listContent tr').removeClass('grey');
				$('#listContent tr:nth-child(even)').addClass('grey');
			}
		});
	}
}

/*
 * Will fill the content area with feeds if the channel that is getting edited
 * has any feeds saved. Feeds not belonging to the channel will be placed in the
 * feedlist.
 */
function getFeeds(data){
	var arr = (data == undefined) ? new Array(0): data;

	var names = new Array(); 
	var maincontent = document.getElementById("maincontent");
	if(maincontent.childNodes.length != 0){
		maincontent.style.backgroundImage = "url('')";
	}
	
	if(arr.length > 0){
		for(var i = 0; i < arr.length-1; i++){
			arr[i] += "}";
		}
		for(var i = 0; i < arr.length; i++){
			var jsonitem = jQuery.parseJSON(arr[i]);
			var data = jsonToString(jsonitem);
			names.push(jsonitem["name"]);
		}
	}
	
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			if(names.length == 0){
				for(var i = 0; i < jsonobj.length; i++){
					var jsonitem = jQuery.parseJSON(jsonobj[i])
					var data = jsonToString(jsonitem);
					createItem(jsonitem["name"], "contentlist", data);
				}
			}
			else{
				for(var i = 0; i < jsonobj.length; i++){
					var jsonitem = jQuery.parseJSON(jsonobj[i])
					var data = jsonToString(jsonitem);
					if($.inArray(jsonitem["name"], names) != -1){
						createItem(jsonitem["name"], "maincontent", data);
					}
					else{
						createItem(jsonitem["name"], "contentlist", data);
					}
					
				}
			}
		}
	});
}

/*
 * Get and list all available channels.
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
				tr.className = "listItem";
				
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
				if(jsonitem["name"].toLowerCase() != "panic"){
					button = document.createElement("input");
					button.type = "button";
					button.id = jsonitem["name"] + ".json";
					button.value = "Delete";
					button.className = "itemButton redbutton";
					td.appendChild(button);
				}
				
				button = document.createElement("input");
				button.type = "button";
				button.id = jsonitem["name"] + ".json";
				button.value = "Edit";
				button.className = "itemButton cyanbutton";
				td.appendChild(button);
				
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
			$('#listContent tr:nth-child(even)').addClass('grey');
		}
	});
}

/*
 * Turn json into a string.
 */
function jsonToString(jsonitem){
	var data = "{";
	for(var key in jsonitem){
		data += "\"" + key + "\"" + ":" + "\"" + jsonitem[key] + "\"" + ",";
	}
	data = data.substr(0, data.length-1);
	data += "}";
	
	return data;
}
