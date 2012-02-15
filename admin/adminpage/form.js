function createCont(form)
{
	var name = form.input.value;
	
	var divTag = document.createElement("div");
	divTag.id = "" + name;
	divTag.setAttribute("draggable","true");
	divTag.setAttribute("ondragstart","drag(event)");
	divTag.className ="contentitem";
	divTag.innerHTML = name + "<INPUT type='button' name='rbutton' value='X' class='removebutton' onClick='removeCont(this)'>";
	document.getElementById("contentlist").appendChild(divTag);
}

function removeCont(element){
	
	var name = element.parentNode.getAttribute("id");
	var parentname = element.parentNode.parentNode.getAttribute("id");
	document.getElementById(parentname).removeChild(document.getElementById(name));
}

function saveTemplate(form){
	var fname = form.name.value;
	var fnote = form.note.value;

	var children = document.getElementById('maindrop').childNodes;
	var length = children.length;
	var mainContent = "";
	
	for(var n = 0; n < length; n++){
		mainContent += children[n].getAttribute('id')  + ",";
	}
	mainContent = mainContent.substr(0,mainContent.length-1);
	
	children = document.getElementById('subdrop').childNodes;
	var length = children.length;
	var subContent = "";
	
	for(var n = 0; n < length; n++){
		subContent += children[n].getAttribute('id') + ",";
	}
	
	subContent = subContent.substr(0,subContent.length-1);
	
	console.log("{\"name\":\"" + fname + "\",\"note\":\"" + fnote + "\",\"maincontent\":\"" + mainContent + "\",\"subcontent\":\"" + subContent + "\"}");
}

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