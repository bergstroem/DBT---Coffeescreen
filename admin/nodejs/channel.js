
function Channel(name) {
	this.name = name;
	this.priority = 0;
	this.expireTime = -1;
	this.displayTime; // The time every "slide" is shown
	
	this.mainContent = [];
	this.subContent = [];
	
	this.getJson = function() {
		return 		'{' + 
				'"name"' + name + 
				'","priority":' + priority +
				'","expireTime":' + expireTime +
				'","displayTime":' + displayTime +
				'","maincontent":' + mainContent +
				',"subcontent":' + subContent +
				'}';
	}
	
	this.parseAndSetMainContent = function(content) {
		
		var rssSources = "";
		
		//This is where all separate feeds are stored
		var feeds = [];
	
		var startIndex = 0;
		var stopIndex = 0;
		//Go through main content to separate the feeds from each other.
		while(stopIndex < content.length) {
			startIndex = content.indexOf("{", stopIndex);
			stopIndex = content.indexOf("}", startIndex) + 1;
			if(startIndex == -1)
				break;
			feeds.push(content.substring(startIndex, stopIndex));
		}
		
		//Identify feed types
		for(var i = 0; i < feeds.length; i++) {
			var feed = JSON.parse(feeds[i]);
		
			//We know what to do with this!
			if(feed.type == "RSS") {
				rssSources += feed.source + ";";
			}
			else {} // Handle other types
		}	
		
		// Handle rss feeds
		var rssResult = "";
		var options = {
		       host: 'localhost',   
		       port: 80,   
		       path: '/dbt/services/RSSFetcher.php?feeds=' + rssSources
		  };
		 var req = http.get(options, function(res) {  
		 	res.setEncoding('utf8');
			res.on('data', function(chunk) {  
				 rssResult += chunk;
				 
			}).on('end', function() {
				var rssItems = JSON.parse(rssResult);
				
				for(var i = 0; i < rssItems.length; i++) {
					mainContent.push(new ContentItem(rssItems[i].title, rssItems[i].content, rssItems[i].date));
				}
				
				//TODO: Other source types can be processed here
			});   
		 }).on('error', function(e) {  
			  console.log("Got error: " + e.message);   
		 });
		
	}
	
	this.parseAndSetSubContent = function(content) {
		//Stub
	}
}
