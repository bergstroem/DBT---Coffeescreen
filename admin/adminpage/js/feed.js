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
		
		var url = document.URL;
		url = url.substr(url.indexOf("?")+1);
		var p = url.substr(0,3);
		var oname = url.substr(9);
		if(p == "p=2"){
			if(!(oname.substr(0,oname.indexOf(".")) == name))
				$.ajax({
					type: "POST",
					url: "feedhandler.php",
					data: "p=3&name="+oname,
					success: function(msg){
					}
				});
		}
		
		if(oname.substr(0,oname.length-5) != name){
			$.ajax({
				type: "POST",
				url: "feedhandler.php",
				data: "p=list",
				success: function(msg){
					var jsonobj = JSON.parse(msg);
					for(var i = 0; i < jsonobj.length; i++){
						var jsonitem = JSON.parse(jsonobj[i]);
						if(jsonitem["name"] == name){
							var conflict = true;
							if(confirm('This will replace an existing feed. Continue?'))
								$.ajax({
									type: "POST",
									url: "feedhandler.php",
									data: "p=1&name="+name+"&source="+source+"&type="+type+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
									success: function(msg){
										window.location = "adminfeed.php";
									}
								});
						}
					}
					if(!conflict)
						$.ajax({
							type: "POST",
							url: "feedhandler.php",
							data: "p=1&name="+name+"&source="+source+"&type="+type+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
							success: function(msg){
								window.location = "adminfeed.php";
							}
						});
					}
			});
		}
		else{
			$.ajax({
				type: "POST",
				url: "feedhandler.php",
				data: "p=1&name="+name+"&source="+source+"&type="+type+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
				success: function(msg){
					window.location = "adminfeed.php";
				}
			});
		}
	}
}

function editFeed(name){
	getFeedTypes();
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			var jsonobj = JSON.parse(msg);
			document.getElementById("name").value = jsonobj["name"];
			document.getElementById("source").value = jsonobj["source"];
			document.getElementById("typeSelect").value = jsonobj["type"];
			document.getElementById("note").value = jsonobj["note"];
			document.getElementById("priority").value = jsonobj["priority"];
			document.getElementById("displayTime").value = jsonobj["displaytime"];
			document.getElementById("expireTime").value = jsonobj["expiretime"];
		}
	});
}

function getFeedTypes(){
	var select = document.getElementById("typeSelect");
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=type",
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
		url: "feedhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = JSON.parse(msg);
			for(var i = 0; i < jsonobj.length; i++){
				var jsonitem = JSON.parse(jsonobj[i]);
				var item = document.createElement("div");
				item.id = jsonitem["name"];
				item.className = "channelitem";
				
				var p1 = document.createElement("p");
				p1.appendChild(document.createTextNode(jsonitem["name"] + " - " + jsonitem["type"] +":" + jsonitem["source"]));
				var p2 = document.createElement("p");
				p2.className = "note";
				var note = (jsonitem["note"].length > 300) ? jsonitem["note"].substr(0,300) + "...": jsonitem["note"];
				p2.appendChild(document.createTextNode("Note: " + note));
				
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