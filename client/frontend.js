var retries = 0;
var currentInformation = null;
var mainContentCounter = 0;

window.onload = init;

function init() {
	connectToServer();
	switchMainInformation();
}

function switchMainInformation() {
	var displayTime = 1000;
	if(currentInformation != null) {
		var title = currentInformation.maincontent.posts[mainContentCounter].title;
		var date = currentInformation.maincontent.posts[mainContentCounter].date;
		var content = currentInformation.maincontent.posts[mainContentCounter].content;
		document.getElementById("mainContent").innerHTML =
				"<h1>" + title + "</h1>" +
				"<p>" + date + "</p>" +
				"<p>" + content + "</p>";
		if(++mainContentCounter >= currentInformation.maincontent.posts.length) {
			mainContentCounter = 0;
			//TODO: request new information
		}
	}
	
	setTimeout(switchMainInformation, displayTime);
}

function connectToServer () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

	console.log("Connecting to server...");
	setConnectionStatus("Connecting...");
	var host = window.location.host;
    var connection = new WebSocket('ws://'+host+':8081');

    connection.onopen = function () {
        // connection is opened and ready to use
        retries = 0;
		setConnectionStatus("Connected");
		
        var name = getQueryVariable('name');
        if(typeof name == "undefined")
        	name = "default";
        console.log("Name: " + name);
        
        
		connection.send('Connect: ' + name);
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
        try {
            var json = JSON.parse(message.data);
			currentInformation = json;
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
		console.log(message.data);
    };
};

function reconnect() {
	var cooldown = 1000;
	if(retries > 5) {
		cooldown *= 30;
	}
	
	if(retries < 10) {
		console.log("Will reconnect in " + (cooldown/1000) + "s.");
		setTimeout(connectToServer, cooldown);
		retries++;
	}
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
