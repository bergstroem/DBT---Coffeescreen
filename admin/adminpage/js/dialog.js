
function Dialog(title, content, buttons) {
	this.dialogBackground = null;
	this.title = title;
	this.content = content;
	this.buttons = buttons;
	
	this.buttonClicked = function (button) {
		for(var i = 0; i  < buttons.length; i++) {
			if(button.name == buttons[i].name) {
				buttons[i].callback(button);
			}
		}
		document.body.removeChild(this.dialogBackground);
	}
	
	this.showDialog = function() {
		//Builds the dialogBox
		console.log("Creating box");
		this.dialogBackground = this.constructDialog();
		
		document.body.appendChild(this.dialogBackground);
	}
	
	this.constructDialog = function() {
		//Create the elements
		
		//Create the box
		var dialogBox = document.createElement('div');
		dialogBox.setAttribute("id", "dialog-box");
		
		//Add the title
		var title = document.createElement('h1');
		title.appendChild(document.createTextNode(this.title));
		dialogBox.appendChild(title);
		
		//Add the content
		var content = document.createElement('p');
		content.appendChild(document.createTextNode(this.content));
		dialogBox.appendChild(content);
		
		//Create the buttons and buttontable
		var buttonTableRow = document.createElement('tr');
		
		for(var i = 0; i  < this.buttons.length; i++) {
			var buttonTableCell = document.createElement('td');
			var button = document.createElement("input");
			button.type = "button";
			button.className = "itemButton cyanbutton dialog-button";
			button.value = buttons[i].value;
			var dia = this;
			button.onclick = function(e) { dia.buttonClicked(e.target); };
			button.name = buttons[i].name;
			//Append button to tablecell
			buttonTableCell.appendChild(button);
			//Append table cell to button row
			buttonTableRow.appendChild(buttonTableCell);
		}
		
		//Add the buttons to a table and append it to the dialogbox
		var buttonTable = document.createElement('table');
		buttonTable.appendChild(buttonTableRow);
		dialogBox.appendChild(buttonTable);
		
		//Create the background
		var dialogBackground = document.createElement('div');
		dialogBackground.setAttribute("id", "dialog-background");
		
		dialogBackground.appendChild(dialogBox);
		
		return dialogBackground;
	}
	
}