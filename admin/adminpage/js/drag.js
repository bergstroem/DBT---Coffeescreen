var dragSrcEl = null;

function handleDragStart(e){
	this.style.opacity = '0.5';
	
	dragSrcEl = this;
	
	e.dataTransfer.setData('Text', e.target.id);
}

function handleDragOver(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	
	return false;
}
/*
function handleDragEnter(e){
	this.style.background = '#00AEEF';
	this.style.opacity = '0.3';
	//this.style.border = '2px solid #000';
}

function handleDragLeave(e){
	this.style.background = '#FFFFFF';
	this.style.opacity = '1';
	//this.style.border = '0';
}*/

function handleDrop(e){
	if(e.stopPropagation){
		e.stopPropagation();
	}
	
	if(dragSrcEl != this){
		if(e.target.getAttribute("class") != "contentitem"){
			this.style.background = '#FFFFFF';
			this.style.opacity = '1';
			var data = e.dataTransfer.getData("Text");
			e.target.appendChild(document.getElementById(data));
			e.preventDefault();
		}
	}
	
	return false;
}

function handleDragEnd(e){
	this.style.opacity = '1';
}