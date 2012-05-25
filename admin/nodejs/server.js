var WebSocketServer = require('websocket').server;

var http = require('http');
var url = require('url');
var fs = require('fs');
var ch = require('./channel.js');

var isPanicMode = false;

function Screen(id, name, channel, connection) {
	this.id = id;
	this.name = name;
	this.channel = channel;
	this.connection = connection;
	this.isPanic = false;
	
	this.setChannel = function(newChannel) {
		channel = newChannel;
	}
	
	this.sendPanicSignal = function(doPanic) {
		if(doPanic)
			connection.send("Panic");
		else
			connection.send("Unpanic");
	}
	
	this.sendChannel = function() {
		fs.readFile(__dirname + "/../../channels/" + channel + ".json", 'utf8', function (err, data) {
			if (err) {
				console.log("Looking for default");
				fs.readFile(__dirname + "/../../channels/default.json", 'utf8', function (err, data) {
					if(err) {
						//Send no data
						connection.send("No data available");
					}
					else ch.prepareChannelFileForDelivery(connection, data);
			
				});
			}
			else ch.prepareChannelFileForDelivery(connection, data);
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



var server = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
    
    var url_parts = url.parse(request.url, true);
    
    //List all connected screens
    if(url_parts.pathname == '/listscreens' || url_parts.pathname == '/listscreens/'){
    	var connectedScreens = "";
    
		for(i = 0; i < screens.length; i++) {
			connectedScreens += screens[i].name + "," + screens[i].channel + "," + screens[i].isPanic + ";";
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
				//Panic to all users, also users that connect later, 
				//thus set panicMode to true.
				isPanicMode = true;

    			console.log("Sending panic feeds to all screens");
				var i;
				for(i = 0; i < screens.length; i++)
				{
					screens[i].sendPanicSignal(true);
				}
    		}
    		else {
				console.log("Sending panic feeds to: " + query['screen']);
				var i;
				for(i = 0; i < screens.length; i++)
				{
					if(query['screen'] == screens[i].name)
						screens[i].isPanic = true;
						screens[i].sendPanicSignal(true);
				}
    		}
    	}
    	response.end("Panic sent to: " + query['screen']);
    }

	else if(url_parts.pathname == "/unPanic" || url_parts.pathname == "/unPanic/") {
		var query = url_parts.query;
		//Send panic to user, bla bla bla
    	if(query['screen'] != undefined){
    		
    		if(query['screen'] == '*'){
				isPanicMode = false;
				for(i = 0; i < screens.length; i++)
				{
					screens[i].sendPanicSignal(false);
				}
				response.end("Set panic mode to false");
    		}
    		else {
				console.log("Sending unpanic feeds to: " + query['screen']);
				response.end("Sending unpanic feeds to: " + query['screen']);
				var i;
				for(i = 0; i < screens.length; i++)
				{
					if(query['screen'] == screens[i].name)
						screens[i].isPanic = false;
						screens[i].sendPanicSignal(false);
				}
    		}
    	}
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

	else if(url_parts.pathname == "/isPanic/" || url_parts.pathname == "/isPanic") {
		response.end(isPanicMode.toString());
	}
});
server.listen(18081, function() { });

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
				var data = message.utf8Data.substring(9, message.utf8Data.length);
				var name = data.split(";")[0];
				var channel = data.split(";")[1];
				var screen = new Screen(1, name, channel, connection);
				screens.push(screen);
				console.log("Screen " + screen.name + " connected.");
				
				screen.sendChannel();
			}
			
			if(message.utf8Data.substring(0, 7) == "Refresh")
			{				
				var screen = getScreen(connection);
				
				screen.sendChannel();
			}
        }
    });

    connection.on('close', function() {
        // close user connection
        removeConnection(connection);
    });
});


 

