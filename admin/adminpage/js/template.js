/* 
 * createItem(name, target)
 * Function used for creating a new drag-/droppable div inside a target div.
 * name: Will be the id of the div
 * target: The target div to place the new div inside
*/
function createItem(name, target){
	if(sourceExists(name)){
		alert("Source already exist");
	}
	else{
		var divTag = document.createElement("div");
		divTag.id = "" + name;
		divTag.setAttribute("draggable","true");
		divTag.addEventListener('dragstart', handleDragStart, false);
		divTag.addEventListener('dragend', handleDragEnd, false);
		divTag.className ="contentitem";
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
 * createCont(form)
 * Wrapper function for createItem, will create items and put them in the contentlist.
 * form: The submitted form containing the input text.
*/
function createCont(){
	var sourcename = document.getElementById("sourcename");
	if(sourcename.value == ""){
		alert("Please enter a sourcename");
	}
	else{
		createItem(sourcename.value, "contentlist");
		sourcename.value = "";
	}
}

/*
 * fillcontent(csv, target)
 * Wrapper function for createItem, will create the given items from the csv 
 * string and put them in the target div.
 * csv: Comma-separated value containing the RSS sources.
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
 * Used for removing a source item.
 * element: The element that will be removed.
*/
function removeItem(element){
	var name = element.parentNode.getAttribute("id");
	var parentname = element.parentNode.parentNode.getAttribute("id");
	document.getElementById(parentname).removeChild(document.getElementById(name));
}

/*
 * sourceExists(name)
 * Used for checking so that the source trying to be added does not already exist.
 * name: The name of the source trying to be added.
*/
function sourceExists(name){
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
 * saveTemplate()
 * Used for saving a template, will use the information in the form.
*/
function saveTemplate(){
	var name = document.getElementById("nameTXB");
	if(name.value == ""){
		alert("Please enter a name");
	}
	else{
		var fname = name.value;	
		var fnote = document.getElementById("noteTXB").value;

		var children = document.getElementById('maincontent').childNodes;
		var length = children.length;
		var mainContent = "";
		
		for(var i = 0; i < length; i++){
			mainContent += children[i].getAttribute('id')  + ",";
		}
		mainContent = mainContent.substr(0,mainContent.length-1);
		
		children = document.getElementById('subcontent').childNodes;
		var length = children.length;
		var subContent = "";
		
		for(var i = 0; i < length; i++){
			subContent += children[i].getAttribute('id') + ",";
		}
		
		subContent = subContent.substr(0,subContent.length-1);
		var url = document.URL;
		url = url.substr(url.indexOf("?")+1);
		var p = url.substr(0,3);
		if(p == "p=2"){
			var tname = url.substr(9);
			if(!(tname.substr(0,tname.indexOf(".")) == fname))
				$.ajax({
					type: "POST",
					url: "templatehandler.php",
					data: "p=3&name="+tname,
					success: function(msg){
					}
				});
		}
		
		$.ajax({
			type: "POST",
			url: "tempget.php",
			data: "",
			success: function(msg){
				if(msg.length > 2){
					var arr = msg.substr(2, msg.length-4).split('\",\"');
					for(var i = 0; i < arr.length; i++){
						if(arr[i] == fname){
							var conflict = true;
							if(confirm('This will replace an existing template. Continue?'))
								$.ajax({
									type: "POST",
									url: "templatehandler.php",
									data: "p=1&name="+fname+"&note="+fnote+"&maincontent="+mainContent+"&subcontent="+subContent,
									success: function(msg){
										console.log("Succesful template save");
										window.location = "admintemplate.php";
									}
								});
						}
					}
					if(!conflict)
						$.ajax({
							type: "POST",
							url: "templatehandler.php",
							data: "p=1&name="+fname+"&note="+fnote+"&maincontent="+mainContent+"&subcontent="+subContent,
							success: function(msg){
								console.log("Succesful template save");
								window.location = "admintemplate.php";
							}
						});
				}
			}
		});
	}
}

/*
 * editTemplate(name)
 * Get the information from the json file and fill the form with the information.
 * name: Name of the template that is going to be edited.
*/
function editTemplate(name){
	$.ajax({
		type: "POST",
		url: "templatehandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			console.log("Succesful template load");
			var jsonobj = JSON.parse(msg);
			document.getElementById("nameTXB").setAttribute("value",jsonobj["name"]);
			document.getElementById("noteTXB").appendChild(document.createTextNode(jsonobj["note"]));
			fillcontent(jsonobj["maincontent"], "maincontent");
			fillcontent(jsonobj["subcontent"], "subcontent");
		}
	});
}

/*
 * deleteTemplate(name)
 * Will delete the template with the given name.
 * name: Name of the template that is going to be deleted.
*/
function deleteTemplate(name){
	var divname = name.substr(0, name.length-5);
	var parentname = document.getElementById(name).parentNode.parentNode.getAttribute("id");
	$.ajax({
		type: "POST",
		url: "templatehandler.php",
		data: "p=3&name="+name,
		success: function(msg){
			document.getElementById(parentname).removeChild(document.getElementById(divname));
			console.log("Succesful template delete");
		}
	});
}

/*
 * Handle clicks in admintemplate.php
*/
$(document).ready(function(){
	$('.TInew').click(function(e){
		window.location = "template.php?p=1";
	});
	
	$('.content').click(function(e){
		if($(e.target).is('.TIedit')){
			window.location = "template.php?p=2&name="+e.target.id;
		}
		if($(e.target).is('.TIdelete')){
			deleteTemplate(e.target.id);
		}
	});
});

/*
 * addEL()
 * Used for adding eventhandlers to the template form.
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
 * listTemplates()
 * Used for listing all the existing templates and displaying them.
*/
function listTemplates(){
	var tempList = document.getElementById("admintemplatecontent");
	
	$.ajax({
		type: "POST",
		url: "tempget.php",
		data: "",
		success: function(msg){
			if(msg.length > 2){
				var arr = msg.substr(2, msg.length-4).split('\",\"');
				for(var i = 0; i < arr.length; i++){
					var item = document.createElement("div");
					item.id = arr[i];
					item.className = "templateitem";
					item.appendChild(document.createTextNode(arr[i]));
					
					var editButton = document.createElement("input");
					editButton.type = "button";
					editButton.id = arr[i] + ".json";
					editButton.value = "Edit";
					editButton.className = "TIedit";
					item.appendChild(editButton);
					
					var delButton = document.createElement("input");
					delButton.type = "button";
					delButton.id = arr[i] + ".json";
					delButton.value = "Delete";
					delButton.className = "TIdelete";
					item.appendChild(delButton);
					
					tempList.appendChild(item);
				}
			}
		}
	});
}

/*
 * createContTest()
 * Used for testing purpose it will spawn 35 sourceitems.
*/
function createContTEST()
{
	for(var i = 0; i < 35; i++)
	{
		createItem(i, "contentlist");
	}
}