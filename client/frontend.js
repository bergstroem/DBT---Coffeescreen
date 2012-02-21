var retries = 0;
var currentInformation = null;
var mainContentCounter = 0;
var mainContentProgressTimeout = null;

var running = false;

window.onload = init;

function init() {
	connectToServer();
}

function switchMainInformation() {
	var title = currentInformation.maincontent.posts[mainContentCounter].title;
	var date = currentInformation.maincontent.posts[mainContentCounter].date;
	var content = currentInformation.maincontent.posts[mainContentCounter].content;
	document.getElementById("mainContent").innerHTML =
			"<h1>" + title + "</h1>" +
			"<p>" + date + "</p>" +
			"<p>" + content + "</p>";
			
	var images = document.getElementById("mainContent").getElementsByTagName("img");
	var urls = new Array();
	if(images.length > 0){
		for(var i = 0; i < images.length; i++){
			urls.push(images[i].src);
		}
	}
	preloadimages(urls).done(mainPostLoaded);
	
	if(++mainContentCounter >= currentInformation.maincontent.posts.length) {
		mainContentCounter = 0;
		//TODO: request new information
	}
}

function mainPostLoaded() {
	var displayTime = 100;
	displayTime *= document.getElementById("mainContent").offsetHeight;
	console.debug("Will display for " + (displayTime/1000) + "s");
	setTimeout(switchMainInformation, displayTime);
	document.getElementById("pageWrapper").scrollTop = 0;
	clearTimeout(mainContentProgressTimeout);
	scrollMainContent(Math.ceil(displayTime/document.getElementById("pageWrapper").scrollHeight));
}

function scrollMainContent(stepTime) {
	document.getElementById("pageWrapper").scrollTop += 1;
	if(document.getElementById("pageWrapper").scrollTop <
			document.getElementById("pageWrapper").scrollHeight) {
		mainContentProgressTimeout = setTimeout(scrollMainContent, stepTime, stepTime);
	}
}

function preloadimages(arr){
    var newimages=[], loadedimages=0
    var postaction=function(){}
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){
            postaction()
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
        newimages[i].onload=function(){
            imageloadpost()
        }
        newimages[i].onerror=function(){
            imageloadpost()
        }
    }
    return { //return blank object with done() method
        done:function(f){
            postaction=f || postaction
        }
    }
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
			if(!running){
				switchMainInformation();
				running = true;
			}
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
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
