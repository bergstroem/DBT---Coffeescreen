/*
 * saveFeed()
 * Used for saving a feed, will use the information in the form.
*/
function saveFeed(){
	var name = document.getElementById("name").value;
	
	var table = document.getElementById("required");
	var poststr = "&custom=";
	for(var i = table.getElementsByTagName("tr").length-1; i >= 5; i--){
		poststr += table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].childNodes[0].name + "|";
		poststr += table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].childNodes[0].value + ",";
	}
	poststr = poststr.substr(0, poststr.length-1);
	
	if(name == ""){
		alert("Please enter the required fields");
	}
	else{
		var type = document.getElementById("type").value;
		var note = document.getElementById("description").value;
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
					var jsonobj = jQuery.parseJSON(msg);
					for(var i = 0; i < jsonobj.length; i++){
						var jsonitem = jQuery.parseJSON(jsonobj[i]);
						if(jsonitem["name"] == name){
							var conflict = true;
							if(confirm('This will replace an existing feed. Continue?'))
								$.ajax({
									type: "POST",
									url: "feedhandler.php",
									data: "p=1&name="+name+"&type="+type+poststr+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
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
							data: "p=1&name="+name+"&type="+type+poststr+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
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
				data: "p=1&name="+name+"&type="+type+poststr+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
				success: function(msg){
					window.location = "adminfeed.php";
				}
			});
		}
	}
}

function editFeed(full, name){
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			document.getElementsByName("type")[0].value = jsonobj["type"];
			var keys = Object.keys(jsonobj);
			
			if(full){
				
				var title = document.getElementById("title");
				title.removeChild(title.lastChild);
				title.appendChild(document.createTextNode("Edit feed"));
				
				for(var i = 0; i < keys.length; i++){
					var key = keys[i];
					document.getElementsByName(key)[0].value = jsonobj[key];
				}
			}
			else{
				getTypeParameters(name);
			}
		}
	});
}

function getFeedTypes(name){
	var select = document.getElementById("type");
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
			if(name){
				editFeed(false,name);
			}
			else{
				getTypeParameters();
			}
		}
	});
}

function listFeeds(){
	var table = document.getElementById("listContent");
	
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
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
				td.className = "itemType";
				td.appendChild(document.createTextNode(jsonitem["type"]));
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
			$('#listContent tr:nth-child(even)').addClass('grey');
		}
	});
}

/*
 * Handle clicks in adminfeed.php
*/
$(document).ready(function(){
	$('.content').click(function(e){
		if($(e.target).is('.itemButton')){
			if(e.target.value == "Add")
				window.location = "feed.php?p=1";
			else if(e.target.value == "Edit")
				window.location = "feed.php?p=2&name="+e.target.id;
			else if(e.target.value == "Delete"){
				deleteFeed(e.target.id);
			}
		}
	});
	
	$('#type').bind('change', function(e){
		getTypeParameters();
	});
});

/*
 * deleteFeed(name)
 * Will delete the feed with the given name.
 * name: Name of the feed that is going to be deleted.
*/
function deleteFeed(name){
	var divname = name.substr(0, name.length-5);
	var parentname = document.getElementById(name).parentNode.parentNode.parentNode.getAttribute("id");
	if(confirm('This will delete this feed. Continue?')){
		$.ajax({
			type: "POST",
			url: "feedhandler.php",
			data: "p=3&name="+name,
			success: function(msg){
				document.getElementById(parentname).removeChild(document.getElementById(divname));
				$('#listContent tr').removeClass('grey');
				$('#listContent tr:nth-child(even)').addClass('grey');
			}
		});
	}
}

/**
 * Parametertypes:
 * ShortText = 0; (input text)
 * LongText = 1; (text area)
 * Number = 2; (input number)
 * Boolean = 3; (input checkbox)
 */
function getTypeParameters(fname){
	var table = document.getElementById("required").getElementsByTagName("tbody")[0];
	var select = document.getElementById("type").value;
	
	if(table.getElementsByTagName("tr").length > 5){
		for(var i = table.getElementsByTagName("tr").length-1; i >= 5; i--){
			table.removeChild(table.getElementsByTagName("tr")[i]);
		}
	}
	
	$('#name').watermark('Descriptive title for this feed');
	$('#description').watermark('Short description of this feed');
	
	$.ajax({
		type: "GET",
		url: "../../services/Api.php",
		data: "getParameters&service="+select,
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			for(row in jsonobj){
				item = jsonobj[row];
				var tr = document.createElement("tr");
				tr.className = "listItem";
				
				var td = document.createElement("td");
				td.appendChild(document.createTextNode(item["label"]));
				tr.appendChild(td);
				
				var td = document.createElement("td");
				var type = parseInt(item["type"]);
				var input = null;
				switch(type)
				{
					case 0:
					//ShortText = 0; (input text)
						input = document.createElement("input");
						input.name = row;
						input.id = row;
						input.className = "formTXB";
						input.value = item["value"];

						td.appendChild(input);
						tr.appendChild(td);
						table.appendChild(tr);

						$('#'+row).watermark(item["tooltip"]);
						break;
					case 1:
					//LongText = 1; (text area)
						input = document.createElement("textarea");	
						input.id = row;
						input.name = row;
						input.className = "noteTXB";
						input.appendChild(document.createTextNode(item["value"]));

						td.appendChild(input);
						tr.appendChild(td);
						table.appendChild(tr);
						
						$('#'+row).watermark(item["tooltip"]);
						break;
					case 2:
					//Number = 2; (input number)
						input = document.createElement("input");
						input.name = row;
						input.type = "number";
						input.className = "formNB";
						input.value = item["value"];

						td.appendChild(input);
						tr.appendChild(td);
						table.appendChild(tr);
						
						var tooltip = document.createElement("div");
						tooltip.className = "tooltip";
						tooltip.appendChild(document.createTextNode(item["tooltip"]));
						td.appendChild(tooltip);
						break;
					case 3:
					//Boolean = 3; (input checkbox)
						input = document.createElement("input");
						input.name = row;
						input.type = "checkbox";
						input.className = "formCB";
						input.value = item["value"];

						td.appendChild(input);
						tr.appendChild(td);
						table.appendChild(tr);
						
						var tooltip = document.createElement("div");
						tooltip.className = "tooltip";
						tooltip.appendChild(document.createTextNode(item["tooltip"]));
						td.appendChild(tooltip);
						break;
					default:
					  break;
				}
			}
			if(fname){
				editFeed(true, fname);
			}
		}
	});
}