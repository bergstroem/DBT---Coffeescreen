function createItem(name, target)
{
	var divTag = document.createElement("div");
	divTag.id = "" + name;
	divTag.setAttribute("draggable","true");
	divTag.setAttribute("ondragstart","drag(event)");
	divTag.className ="contentitem";
	divTag.innerHTML = name + "<INPUT type='button' name='rbutton' value='X' class='removebutton' onClick='removeItem(this)'>";
	document.getElementById(target).appendChild(divTag);
}

function createCont(form)
{
	var name = form.input.value;
	createItem(name, "contentlist");
}

function fillcontent(text, target){
	if(text.length > 0){
		var items = text.split(',');
		
		for(var i = 0; i < items.length; i++){
			createItem(items[i],target)
		}
	}
}

function removeItem(element){
	var name = element.parentNode.getAttribute("id");
	var parentname = element.parentNode.parentNode.getAttribute("id");
	document.getElementById(parentname).removeChild(document.getElementById(name));
}

function saveTemplate(form){
	var fname = form.name.value;
	var fnote = form.note.value;

	var children = document.getElementById('maincontent').childNodes;
	var length = children.length;
	var mainContent = "";
	
	for(var n = 0; n < length; n++){
		mainContent += children[n].getAttribute('id')  + ",";
	}
	mainContent = mainContent.substr(0,mainContent.length-1);
	
	children = document.getElementById('subcontent').childNodes;
	var length = children.length;
	var subContent = "";
	
	for(var n = 0; n < length; n++){
		subContent += children[n].getAttribute('id') + ",";
	}
	
	subContent = subContent.substr(0,subContent.length-1);
	
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

function editTemplate(name){
	$.ajax({
		type: "POST",
		url: "templatehandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			console.log("Succesful template load");
			var jsonobj = JSON.parse(msg);
			console.log(jsonobj);
			document.getElementById("nameTXB").setAttribute("value",jsonobj["name"]);
			document.getElementById("noteTXB").innerHTML = jsonobj["note"];
			fillcontent(jsonobj["maincontent"], "maincontent");
			fillcontent(jsonobj["subcontent"], "subcontent");
				
			$.ajax({
				type: "POST",
				url: "templatehandler.php",
				data: "p=3&name="+name,
				success: function(msg){
				}
			});
		}
	});
}

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

$(document).ready(function(){
	$('.TIdelete').click(delRedirect);
	$('.TIedit').click(editRedirect);
	
	function editRedirect(){
		window.location = "template.php?p=2&name="+event.target.id;
	}

	function delRedirect(){
		deleteTemplate(event.target.id);
	}
});

function createContTEST()
{
	for(var i = 0; i < 35; i++)
	{
		var name = i;
	
		var divTag = document.createElement("div");
		divTag.id = "" + name;
		divTag.setAttribute("draggable","true");
		divTag.setAttribute("ondragstart","drag(event)");
		divTag.className ="contentitem";
		divTag.innerHTML = name + "<INPUT type='button' name='rbutton' value='X' class='removebutton' onClick='removeCont(this)'>";
		document.getElementById("contentlist").appendChild(divTag);
	}
}