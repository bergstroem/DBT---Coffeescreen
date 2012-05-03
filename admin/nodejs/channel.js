

/*

	Class and functions to handle channels.

*/

var async = require('async');
var http = require('http');

//Representation of a channel
function Channel(name, note, mainContent, subContent) {
	this.name = name;
	this.note = note;
	this.mainContent = mainContent;
	this.subContent = subContent;
	
	//Parses and sends itself in json-format to the specified connection.
	this.sendJson = function(connection) {
		//Get main and sub content at the same time
		async.parallel([
		    function(callback){
				fetchContent(mainContent, callback);
		    },
		    function(callback){
				fetchContent(subContent, callback);
		    },
		],
		//Callback after both above functions are done.
		function(err, results){
		    var mainFeed = results[0];
		    var subFeed = results[1];
		    
		    var feed = '{'
			+ '"name":"' + name + '","maincontent":' + mainFeed + ',"subcontent":' + subFeed + "}";
			
		    connection.send(feed);
		});
	}
}

//
function fetchContent(content, callback) {
		
		var options = {
			   host: 'localhost',
			   port: 80,   
			   path: '/dbt/services/FeedFetcher.php?sources=' + encodeURI(content)
		};
		
		var result = "";
		
		var req = http.get(options, function(res) {  
		 	res.setEncoding('utf8');
		 	
			res.on('data', function(chunk) {
				result += chunk; 
			}).on('end', function() {
				
				console.log("Fetched " + result);
				
				callback(null, result.substr(result.indexOf('{')));
				
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
	var subContent = jsonObject.subcontent;
	
	var channel = new Channel(name, note, mainContent, subContent);
	
	var feed = channel.sendJson(connection);
	
}

