function Screen(id, name, channel, connection) {
	this.id = id;
	this.name = name;
	this.channel = channel;
	this.connection = connection;
	
	this.setChannel = function(newChannel) {
		channel = newChannel;
	}
	
	this.sendChannel = function() {
		//TODO: Start reading from channels instead of templates
		fs.readFile("../../templates/" + channel + ".json", 'utf8', function (err, data) {
			if (err) {
				console.log("Looking for default");
				fs.readFile("../../templates/default_template.json", 'utf8', function (err, data) {
					if(err) {
						//Send no data
						connection.send("No data available");
					}
					else prepareChannelFileForDelivery(connection, data);
				
				});
			}
			else prepareChannelFileForDelivery(connection, data);
		});
	}
}

var screens = [];

function getScreen(connection) {
	for(i = 0; i < screens.length; i++) {
		if(connection === screens[i].connection) {
			return screens[i];
		}
	}
}

function removeConnection(connection) {
	for(i = 0; i < screens.length; i++) {
		if(connection === screens[i].connection) {
			console.log("Screen " + screens[i].name + " disconnected.");
			screens.splice(i, 1);
			break;
		}
	}
}

function setScreenName(connection, name) {
	for(i = 0; i < screens.length; i++) {
		if(connection === screens[i].connection) {
			console.log(screens[i].name + " changed name to " + name);
			screens[i].name = name;
			break;
		}
	}
}

var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
    
    var url_parts = url.parse(request.url, true);
    
    //List all connected screens
    if(url_parts.pathname == '/listscreens' || url_parts.pathname == '/listscreens/'){
    	var connectedScreens = "";
    
		for(i = 0; i < screens.length; i++) {
			connectedScreens += screens[i].name + ";";
		}
		
		connectedScreens = connectedScreens.substring(0, connectedScreens.length-1);
		
		response.end(connectedScreens);
    }
    
    //Send panic template
    else if(url_parts.pathname == "/panic" || url_parts.pathname == "/panic/"){
    	var query = url_parts.query;
    	
    	//Send panic to user, bla bla bla
    	if(query['screen'] != undefined){
    		
    		if(query['screen'] == '*'){
    			console.log("Sending panic feeds to all screens");
				var i;
				for(i = 0; i < screens.length; i++)
				{
					screens[i].setChannel("panic");
					screens[i].sendChannel();
				}
    		}
    		else {
				console.log("Sending panic feeds to: " + query['screen']);
				var i;
				for(i = 0; i < screens.length; i++)
				{
					if(query['screen'] == screens[i].name)
						screens[i].setChannel("panic");
						screens[i].sendChannel();
				}
    		}
    	}
    	response.end("Panic sent to: " + query['screen']);
    }
    
    //Set template
    else if(url_parts.pathname == "/set/") {
    	var query = url_parts.query;
    	if(query['screen'] != undefined && query['channel'] != undefined) {
    		console.log("Sending " + query['channel'] + " to: " + query['screen']);
    		for(var i = 0; i < screens.length; i++) {
    			if(screens[i].name == query['screen'])
    				screens[i].setChannel(query['channel']);
    				screens[i].sendChannel();
    		}
    		response.end("Set template: " + query['channel'] + " to: " + query['screen']);
    	}
    }
});
server.listen(8081, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
	

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
			if(message.utf8Data.substring(0, 7) == "Connect")
			{
				var name = message.utf8Data.substring(9, message.utf8Data.length);
				var screen = new Screen(1, name, name, connection);
				screens.push(screen);
				console.log("Screen " + screen.name + " connected.");
				
				screen.sendChannel();
			}
        }
    });

    connection.on('close', function() {
        // close user connection
        removeConnection(connection);
    });
});

function prepareChannelFileForDelivery(connection, template) {
	var jsonObject = eval('(' + template + ')'); // TODO: Note to self, stop using eval!
	var mainContent = jsonObject.maincontent;
	var subContent = jsonObject.subcontent;
	var name = jsonObject.name;
	
	var mainFeed = "";
	var subFeed = "";
	
	var options = {
           host: 'localhost',   
           port: 80,   
           path: '/dbt/services/RSSFetcher.php?feeds=' + mainContent
      };
	var req = http.get(options, function(res) {  
	 	res.setEncoding('utf8');
		res.on('data', function(chunk) {  
		    mainFeed += chunk;
		    
		    
			}).on('end', function() {
				var options2 = {
			   		host: 'localhost',   
			   		port: 80,   
			   		path: '/dbt/services/RSSFetcher.php?feeds=' + subContent
		  		};
				var req2 = http.get(options2, function(res2) {  
				 	res2.setEncoding('utf8');
					res2.on('data', function(chunk) {
						subFeed += chunk;
				
						}).on('end', function() {
							var feed = '{' + '"name":"' + name + '","maincontent":' + mainFeed + ',"subcontent":' + subFeed + "}";
							connection.send(feed);
					}).on('error', function(e) {
						  console.log("Got error: " + e.message);
					});  
				}); 
	}).on('error', function(e) {
		  console.log("Got error: " + e.message);
	});
	});
	
}


function fetchRSS(sources) {
	var options = {
           host: 'localhost',   
           port: 80,   
           path: '/dbt/services/RSSFetcher.php?feeds=' + sources
      };
	 var req = http.get(options, function(res) {  
	 	res.setEncoding('utf8');
		res.on('data', function(chunk) {  
		     return chunk;   
		});   
	 }).on('error', function(e) {  
		  console.log("Got error: " + e.message);   
	 });
}

