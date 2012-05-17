
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
	this.isPanic = false;
	
	//Parses and sends itself in json-format to the specified connection.
	this.sendJson = function(connection) {
		//Get main and sub content at the same time
		async.parallel([
		    function(callback){
				fetchContent(mainContent, callback);
		    },
		    function(callback){
				fetchContent(panic, callback);
		    },
		],
		//Callback after both above functions are done.
		function(err, results){
		    var mainFeed = results[0];
		    var panic = results[1];
			
			console.log("Fetched " + mainFeed);
		    
		    var feed = '{'
			+ '"name":"' + name + '","static":"' + staticText + '","maincontent":' + mainFeed + ',"panic":' + panic + "}";
			
		    connection.send(feed);
		});
	}
}

//
function fetchContent(content, callback) {
		
		var options = {
			   host: 'localhost',
			   port: 80,   
			   path: '/coffeescreen/services/FeedFetcher.php?sources=' + encodeURI(content)
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
	var panic = jsonObject.subcontent;
	var staticText = jsonObject.static;
	
	var channel = new Channel(name, note, mainContent, panic, staticText);
	
	var feed = channel.sendJson(connection);
	
}

