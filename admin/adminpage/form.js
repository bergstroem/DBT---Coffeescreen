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