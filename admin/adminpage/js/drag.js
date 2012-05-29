var dragSrcEl = null;

/*
 * Handles dragstart event.
 */
function handleDragStart(e){
	this.style.opacity = '0.5';
	
	dragSrcEl = this;
	
	e.dataTransfer.setData('Text', e.target.id);
}

/*
 * Handles dragover event.
 */
function handleDragOver(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	
	return false;
}

/*
 * Handles drop event.
 */
function handleDrop(e){
	if(e.stopPropagation){
		e.stopPropagation();
	}
	
	if(dragSrcEl != this){
		if(e.target.getAttribute("id") == "maincontent"){
			this.style.opacity = '1';
			var data = e.dataTransfer.getData("Text");
			e.target.appendChild(document.getElementById(data));
			e.target.style.backgroundImage = "url('')";
			e.preventDefault();
		}
	}
	
	return false;
}

/*
 * Handles dragend event.
 */
function handleDragEnd(e){
	this.style.opacity = '1';
}