
function source(sourceAddress, type, priority, expireTime, displayTime) {
	this.sourceAddress = sourceAddress;
	this.type = type;
	this.priority = priority;
	this.expireTime = expireTime;
	this.displayTime = displayTime;
}

function Channel(name, note, mainContent, subContent) {
	this.name = name;
	this.note = note;
	this.mainContent = mainContent;
	this.subContent = subContent;
	
	this.parseContent = function(content) {
		console.log(content);
		var jsonContent = JSON.parse(content);
		
		var sources = [];
		
	}
	
	this.getJson = function() {
		
		//Start with mainContent
		var parsedMainContent = this.parseContent(mainContent);
		var parsedSubContent = this.parseContent(subContent);
	
		return 		'{' + 
				'"name"' + name + 
				'","priority":' + priority +
				'","expireTime":' + expireTime +
				'","displayTime":' + displayTime +
				'","maincontent":' + mainContent +
				',"subcontent":' + subContent +
				'}';
	}
}
	
