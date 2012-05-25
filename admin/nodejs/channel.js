
/*

	Class and functions to handle channels.

*/

var async = require('async');
var http = require('http');

//Representation of a channel
function Channel(name, note, mainContent, panic, staticText) {
	this.name = name;
	this.note = note;
	this.mainContent = mainContent;
	this.panic = panic;
	this.staticText = staticText;
	
	//Parses and sends itself in json-format to the specified connection.
	this.sendJson = function(connection) {
		//Get main and sub content at the same time
		async.parallel([
		    function(callback){
				fetchContent(mainContent, callback);
		    },
		    function(callback){
				fetchContent(panic.mainContent, callback);
		    },
		],
		//Callback after both above functions are done.
		function(err, results){
		    var mainFeed = results[0];
		    var panicContent = results[1];
			
			panic.mainContent = panicContent;
			
			console.log("Fetched " + mainFeed);
		    
		    var feed = '{'
			+ '"name":"' + name + '","static":"' + staticText + '","maincontent":' + mainFeed + ',"panic":' + panic + "}";
			
		    connection.send(feed);
		});
	}
}

//
function fetchContent(content, callback) {
		if(content == null){
			content = "";
		}
		var options = {
			   host: 'localhost',
			   port: 80,   
			   path: '/coffeescreen/plugins/FeedFetcher.php?sources=' + encodeURI(content)
		};
		
		var result = "";
		
		var req = http.get(options, function(res) {  
		 	res.setEncoding('utf8');
		 	
			res.on('data', function(chunk) {
				result += chunk; 
			}).on('end', function() {
				result = result.substr(result.indexOf('{'));
				
				callback(null, result);
				
			});   
		}).on('error', function(e) {  
			console.log("Got error: " + e.message);   
		});
			
		
}

this.prepareChannelFileForDelivery = function(connection, channel) {
	var jsonObject = JSON.parse(channel);
	
	var name = jsonObject.name;
	var note = jsonObject.note;
	var mainContent = jsonObject.maincontent;
	var panic = JSON.parse(jsonObject.panic);
	var staticText = jsonObject.static;
	
	var panicChannel = new Channel(panic.name, panic.note, panic.mainContent, "", panic.static);
	
	var channel = new Channel(name, note, mainContent, panicChannel, staticText);
	
	var feed = channel.sendJson(connection);
	
}

