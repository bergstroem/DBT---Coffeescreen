var retries = 0;
var currentInformation = null;
var mainContentCounter = 0;
var mainContentProgressTimeout = null;
var mainContentSwitchingTimeout = null;

var running = false;

window.onload = init;

function init() {
	connectToServer();
}

//Switch to next view
function switchMainInformation() {
	//Här byts channel
	console.debug("Switching...");
	//Extract article info
	var content = currentInformation.maincontent.posts[mainContentCounter].html;
	var displaytime = currentInformation.maincontent.posts[mainContentCounter].displaytime;
	displaytime = parseFloat(displaytime);
	document.getElementById("mainContent").innerHTML = content;
			
	//Preload images
	var images = document.getElementById("mainContent").getElementsByTagName("img");
	var urls = new Array();
	if(images.length > 0){
		for(var i = 0; i < images.length; i++){
			images[i].src = images[i].src.replace("%20", "").replace(" ", "")
			urls.push(images[i].src);
		}
	}
	
	if(urls.length > 0) {
		preloadimages(urls).done(mainPostLoaded);
	} else {
		mainPostLoaded();
	}
	
	//Ask for new info when the cycle is done
	if(++mainContentCounter >= currentInformation.maincontent.posts.length) {
		mainContentCounter = 0;
		//TODO: request new information
	}
}

//What to do when all the images are loaded in a view
function mainPostLoaded(displaytime) {
	if(displaytime!=0){
		//Calculate time to display the view
		var displaytime = 100;
		displaytime *= document.getElementById("mainContent").offsetHeight;
		console.debug("Will display for " + (displayTime/1000) + "s");
		//Setup display and scroll timers
		mainContentSwitchingTimeout = setTimeout(switchMainInformation, displaytime);
		document.getElementById("pageWrapper").scrollTop = 0;
		clearTimeout(mainContentProgressTimeout);
		scrollMainContent(Math.ceil(displaytime/document.getElementById("pageWrapper").scrollHeight));
	}
	else{
		//Setup display and scroll timers
		mainContentSwitchingTimeout = setTimeout(switchMainInformation, displaytime);
		document.getElementById("pageWrapper").scrollTop = 0;
		clearTimeout(mainContentProgressTimeout);
		scrollMainContent(Math.ceil(displaytime/document.getElementById("pageWrapper").scrollHeight));
	}
}

//One scrolling jump
function scrollMainContent(stepTime) {
	document.getElementById("pageWrapper").scrollTop += 1;
	if(document.getElementById("pageWrapper").scrollTop <
			document.getElementById("pageWrapper").scrollHeight) {
		mainContentProgressTimeout = setTimeout(scrollMainContent, stepTime, stepTime);
	}
}

//Image preloading magic!
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

//Do connecting stuff
function connectToServer () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

	console.log("Connecting to server...");
	setConnectionStatus("Connecting...");
	var host = window.location.host;
    var connection = new WebSocket('ws://'+host+':8081');

    //When a connection opens
    connection.onopen = function () {
        // connection is opened and ready to use

        //Reset reconnection counter
        retries = 0;

		setConnectionStatus("Connected");
		
		//Read screen name from URL
        var name = getQueryVariable('name');
        if(typeof name == "undefined")
        	name = "default";
        console.log("Name: " + name);
        
        //Send a connection message to the server
		connection.send('Connect: ' + name);
    };

    //When something goes wrong
    connection.onerror = function (error) {
    	if(typeof error.data != "undefined")
        	console.error("Error data: " + error.data);
    };
    
    //When a connection closes
    connection.onclose = function(close) {
    	console.log("The connection closed.");
		setConnectionStatus("Disconnected");
    	reconnect();
    }

    //When a message arrives from the server
    connection.onmessage = function (message) {
        // try to decode json (I assume that each messagse from server is json)
        console.debug("Got message");
        try {
        	//Extract data from JSON string
            var json = JSON.parse(message.data);
			currentInformation = json;
			mainContentCounter = 0;
			
			console.debug("Feed name: " + json.name);
			
			//Force immediate change if panic feed
			if(!running || json.name == "panic"){
				clearTimeout(mainContentSwitchingTimeout);
				switchMainInformation();
				running = true;
			}
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
    };
};

//Reconnection loop
function reconnect() {
	var cooldown = 1000;
	if(retries > 5) {
		cooldown *= 30;
	}
	
	//Gives up after 10 attempts to reconnect
	//TODO: Change this to infinite attempts?
	if(retries < 10) {
		console.log("Will reconnect in " + (cooldown/1000) + "s.");
		setTimeout(connectToServer, cooldown);
		retries++;
	}
}

//Display connection status on the screen
function setConnectionStatus(statusText) {
	document.getElementById("topBarRight").innerHTML = statusText;
}

//Get variables from the URL
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
