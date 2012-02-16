var retries = 0;

window.onload = connectToServer;

function connectToServer () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

	console.log("Connecting to server...");
	setConnectionStatus("Connecting...");
    var connection = new WebSocket('ws://localhost:8080');

    connection.onopen = function () {
        // connection is opened and ready to use
        retries = 0;
		setConnectionStatus("Connected");
		
        var name = getQueryVariable('name');
        if(typeof name == "undefined")
        	name = "default";
        console.log("Name: " + name);
        
        
		connection.send('SetName: ' + name);
    };

    connection.onerror = function (error) {
    	if(typeof error.data != "undefined")
        	console.error("Error data: " + error.data);
    };
    
    connection.onclose = function(close) {
    	console.log("The connection closed.");
		setConnectionStatus("Disconnected");
    	reconnect();
    }

    connection.onmessage = function (message) {
        // try to decode json (I assume that each messagse from server is json)
        /*try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }*/
        // handle incoming message
		console.log(message.data);
		document.getElementById("contentWrapper").innerHTML = "<p>" + message.data + "</p>";
    };
};

function reconnect() {
	var cooldown = 1000;
	if(retries > 5) {
		cooldown *= 30;
	}
	
    console.log("Will reconnect in " + (cooldown/1000) + "s.");
	setTimeout(connectToServer, cooldown);
	retries++;
}

function setConnectionStatus(statusText) {
	document.getElementById("topBarRight").innerHTML = statusText;
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
}
