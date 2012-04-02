/*
 * saveFeed()
 * Used for saving a feed, will use the information in the form.
*/
function saveFeed(){
	var name = document.getElementById("name").value;
	var source = document.getElementById("source").value;
	if(name == "" || source == ""){
		alert("Please enter the required fields");
	}
	else{
		var type = document.getElementById("typeSelect").value;
		var note = document.getElementById("note").value;
		var priority = document.getElementById("priority").value;
		var displaytime = document.getElementById("displayTime").value;
		var expiretime = document.getElementById("expireTime").value;
		
		$.ajax({
			type: "POST",
			url: "feedhandler.php",
			data: "p=1&name="+name+"&source="+source+"&type="+type+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
			success: function(msg){
				console.log("Succesful channel save");
				window.location = "adminfeed.php";
			}
		});
		/*
		var url = document.URL;
		url = url.substr(url.indexOf("?")+1);
		var p = url.substr(0,3);
		if(p == "p=2"){
			var tname = url.substr(9);
			if(!(tname.substr(0,tname.indexOf(".")) == fname))
				$.ajax({
					type: "POST",
					url: "channelhandler.php",
					data: "p=3&name="+tname,
					success: function(msg){
					}
				});
		}
		
		$.ajax({
			type: "POST",
			url: "getchannels.php",
			data: "dir=channels",
			success: function(msg){
				if(msg.length > 2){
					var arr = msg.substr(2, msg.length-4).split('\",\"');
					for(var i = 0; i < arr.length; i++){
						if(arr[i] == fname){
							var conflict = true;
							if(confirm('This will replace an existing channel. Continue?'))
								$.ajax({
									type: "POST",
									url: "channelhandler.php",
									data: "p=1&name="+fname+"&note="+fnote+"&maincontent="+mainContent+"&subcontent="+subContent,
									success: function(msg){
										console.log("Succesful channel save");
										window.location = "adminchannel.php";
									}
								});
						}
					}
					if(!conflict)
						$.ajax({
							type: "POST",
							url: "channelhandler.php",
							data: "p=1&name="+fname+"&note="+fnote+"&maincontent="+mainContent+"&subcontent="+subContent,
							success: function(msg){
								console.log("Succesful channel save");
								window.location = "adminchannel.php";
							}
						});
				}
			}
		});*/
	}
}

function editFeed(name){
	$.ajax({
		type: "POST",
		url: "channelhandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			console.log("Succesful channel load");
			var jsonobj = JSON.parse(msg);
			document.getElementById("nameTXB").setAttribute("value",jsonobj["name"]);
			document.getElementById("noteTXB").appendChild(document.createTextNode(jsonobj["note"]));
			getFeeds();
		}
	});
}

function getFeedData(name){
	var jsonobj = null;
	$.ajax({
		type: "POST",
		url: "channelhandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			console.log("Succesful channel load");
			jsonobj = JSON.parse(msg);
			document.getElementById("nameTXB").setAttribute("value",jsonobj["name"]);
			document.getElementById("noteTXB").appendChild(document.createTextNode(jsonobj["note"]));
			console.log(jsonobj);
		}
	});
	return jsonobj;
}

function getFeedTypes(){
	var select = document.getElementById("typeSelect");
	$.ajax({
		type: "POST",
		url: "getFeedTypes.php",
		data: "",
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
}

function listFeeds(){
	var chanList = document.getElementById("feedcontent");
	
	$.ajax({
		type: "POST",
		url: "getchannels.php",
		data: "dir=feeds",
		success: function(msg){
			if(msg.length > 2){
				var arr = msg.substr(2, msg.length-4).split('\",\"');
				for(var i = 0; i < arr.length; i++){
					var item = document.createElement("div");
					item.id = arr[i];
					item.className = "channelitem";
					var p1 = document.createElement("p");
					var p2 = document.createElement("p");
					item.appendChild(p1);
					item.appendChild(p2);
					p1.appendChild(document.createTextNode(arr[i]));
					$.ajax({
						type: "POST",
						url: "feedhandler.php",
						data: "p=2&name="+arr[i]+".json",
						success: function(msg){
							var jsonobj = JSON.parse(msg);
							
							p1.appendChild(document.createTextNode(" - (" + jsonobj["source"] + ")"));
							p2.appendChild(document.createTextNode(jsonobj["note"]));
						}
					});
					
					var editButton = document.createElement("input");
					editButton.type = "button";
					editButton.id = arr[i] + ".json";
					editButton.value = "Edit";
					editButton.className = "editItemButton";
					item.appendChild(editButton);
					
					var delButton = document.createElement("input");
					delButton.type = "button";
					delButton.id = arr[i] + ".json";
					delButton.value = "Delete";
					delButton.className = "deleteItemButton";
					item.appendChild(delButton);
					
					chanList.appendChild(item);
				}
			}
		}
	});
}

/*
 * Handle clicks in adminfeed.php
*/
$(document).ready(function(){
	$('.newItemButton').click(function(e){
		window.location = "feed.php?p=1";
	});
	
	$('.content').click(function(e){
		if($(e.target).is('.editItemButton')){
			window.location = "feed.php?p=2&name="+e.target.id;
		}
		if($(e.target).is('.deleteItemButton')){
			deleteFeed(e.target.id);
		}
	});
});

/*
 * deleteFeed(name)
 * Will delete the feed with the given name.
 * name: Name of the feed that is going to be deleted.
*/
function deleteFeed(name){
	var divname = name.substr(0, name.length-5);
	var parentname = document.getElementById(name).parentNode.parentNode.getAttribute("id");
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=3&name="+name,
		success: function(msg){
			document.getElementById(parentname).removeChild(document.getElementById(divname));
			console.log("Succesful channel delete");
		}
	});
}

/*
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
}*/