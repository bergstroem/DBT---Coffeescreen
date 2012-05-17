var retries = 0;
var futureInformation = null;
var currentInformation = null;
var mainContentCounter = -1;
var mainContentProgressTimeout = null;
var staticText = null;

var connection;

var running = false;

var newimages = new Array();

var channel = "";

window.onload = init;

function init() {
	staticText = document.createTextNode("");
	document.getElementById('staticText').appendChild(staticText);
	connectToServer();
}

//Switch to next view
function switchMainInformation() {
	mainContentCounter++;
	if(mainContentCounter >= currentInformation.maincontent.posts.length) {
		mainContentCounter = 0;
	}

	console.log(mainContentCounter + ", " + currentInformation.maincontent.posts.length);

	//Här byts channel
	console.log("Switching...");
	//Extract article info
	var content = currentInformation.maincontent.posts[mainContentCounter].html;
	
	document.getElementById("mainContent").innerHTML = content;
	
	//Set next/prev text
	if(currentInformation.maincontent.posts.length > (mainContentCounter + 1))
		document.getElementById("nextText").innerHTML = currentInformation.maincontent.posts[mainContentCounter+1].title;
	else
		document.getElementById("nextText").innerHTML = "";
	if(mainContentCounter > 0)
		document.getElementById("prevText").innerHTML = currentInformation.maincontent.posts[mainContentCounter-1].title;
	else
		document.getElementById("prevText").innerHTML = "";
	
	//Preload images
	var images = document.getElementById("mainContent").getElementsByTagName("img");
	var urls = new Array();
	if(images.length > 0){
		for(var i = 0; i < images.length; i++){
			images[i].src = images[i].src.replace("%20", "").replace(" ", "");
			images[i].style.display = "block";
			images[i].style.margin = "0 auto";
			urls.push(images[i].src);
		}
	}
	
	if(urls.length > 0) {
		loader = preloadimages(urls).done(mainPostLoaded);
	} else {
		mainPostLoaded();
	}
	
	//Ask for new info when the cycle is done
	if(mainContentCounter+1 >= currentInformation.maincontent.posts.length) {
		//request new information
		console.log("Refreshing...");
		connection.send('Refresh');
	}
}

//What to do when all the images are loaded in a view
function mainPostLoaded() {
	//Adjust width of the post.											
	adjustPostWidth();
			
	//Temp. moved here
	console.log(mainContentCounter);
	var displaytime = currentInformation.maincontent.posts[mainContentCounter].displaytime;
	displaytime = parseFloat(displaytime)*1000;

	var totalTime = 100;

	if(displaytime==0){
		//Calculate time to display the view
		totalTime *= document.getElementById("mainContent").offsetHeight;
	}
	else{
		//Setup progress bar variables
		totalTime = displaytime;
	}


	console.log("Will display for " + (totalTime/1000) + "s");
	//Setup progress bar variables
	var startTime = new Date().getTime();
	//Setup display and scroll timers
	//mainContentSwitchingTimeout = setTimeout(switchMainInformation, totalTime);
	document.getElementById("pageWrapper").scrollTop = 0;
	document.getElementById("pageWrapper").scrollLeft = 0;
	document.getElementById('progressBar').style.width = 0;
	clearTimeout(mainContentProgressTimeout);
	stepContent(totalTime, startTime);
}

//One scrolling jump
function stepContent(totalTime, startTime) {
	var delay = 4000;
	var totalElapsedTime = new Date().getTime() - startTime;
	
	var progress = totalElapsedTime/(totalTime + 3*delay);

	if(totalElapsedTime >= delay) {
		var scrollProgress = (totalElapsedTime - delay)/totalTime;
		
		var width = document.getElementById("pageWrapper").scrollWidth;
		var height = document.getElementById("pageWrapper").scrollHeight - 
				document.getElementById("pageWrapper").clientHeight;

		document.getElementById("pageWrapper").scrollLeft = scrollProgress * width;
		document.getElementById("pageWrapper").scrollTop = scrollProgress * height;
	}

	document.getElementById('progressBar').style.width = Math.round(progress * window.innerWidth) + "px";

	if(progress < 1) {
		mainContentProgressTimeout = setTimeout(stepContent, 1000/30, totalTime, startTime);
	} else {
		switchMainInformation();
	}
}

function adjustPostWidth() {
	document.getElementById('mainContent').style.width = "";
	//Get mainContent and its child images
	var main = document.getElementById('mainContent');
	var childImages = document.getElementById('mainContent').getElementsByTagName('img');
	
	//First, if any image is larger than the parent divs width/1.5, than scale it up
	//and set the width of the parent to the new width
	var adjusted = false;
	for (var i = 0; i < childImages.length; i++) {
		
		//If the image isnt too small or too big, scale it.
		if(childImages[i].clientWidth > main.clientWidth/1.5 && childImages[i].clientWidth < main.clientWidth*1.5) {
			console.log("Scaling image from: " + childImages[i].clientWidth + ", to: " + (main.clientWidth - 100));
			adjusted = true;
			childImages[i].style.width = main.clientWidth - 100 + "px"; // -100 to get some margin
			main.style.width = childImages[i].clientWidth + "px";
			break;
		}
		
		//If too high, try scaling on height
		if(!adjusted) {
			if(childImages[i].clientHeight > main.clientHeight && childImages[i].clientHeight < main.clientHeight*1.5) {
				childImages[i].style.height = main.clientHeight - 100 + "px"; // -100 to get some margin
				adjusted = true;
			}
		}
	}
	if(!adjusted) {
		console.log("Scaling content");
		document.getElementById('mainContent').style.width = window.innerWidth - 100 + "px";
	}
	
}

//Image preloading magic!
function preloadimages(arr){
    window.newimages=[];
    var loadedimages=0
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
            postaction=f || postaction;
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
	if(getQueryVariable("host") != null){
		host = getQueryVariable("host");
	}
    connection = new WebSocket('ws://'+host+':18081');

    //When a connection opens
    connection.onopen = function () {
        // connection is opened and ready to use

        //Reset reconnection counter
        retries = 0;

		setConnectionStatus("Connected");
		
		//Read screen name from URL
        var name = getQueryVariable('name');
        channel = getQueryVariable('channel');

        if(name == null)
        	name = "default";

        name = name.replace("%20", " ");

        if(channel == null)
        	channel = name;

        channel = channel.replace("%20", " ");
        
        if(typeof name == "undefined")
        	name = "default";
        else {
        	if(typeof channel == "undefined")
        		channel = name;
        }
        
        
        console.log("Name: " + name + ", Channel: " + channel);
        
        //Send a connection message to the server
		connection.send('Connect: ' + name + ";" + channel);
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
        console.log("Got message");
        try {
        	//Extract data from JSON string
            var json = JSON.parse(message.data);

            if(currentInformation == null || json.name != channel) {
				currentInformation = json;
				mainContentCounter = -1;
				futureInformation = null;
            
            	channel = json.name;
            	
            	//Force immediate change if panic feed
				if(!running || json.name == "panic"){
					switchMainInformation();
					running = true;
				}
            } else {
            	futureInformation = json;
            }
			
			staticText.data = json.static;
			
			console.log("Feed name: " + json.name);
        } catch (e) {
        	console.log(e.message);
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
	//document.getElementById("topBarRight").innerHTML = statusText;
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

	return null;
}


//Physical button integration

function moveRight() {
	if(mainContentCounter >= currentInformation.maincontent.posts.length && futureInformation != null) {
		mainContentCounter = -1;
		currentInformation = futureInformation;
		futureInformation = null;

		forceSwitch();
	} else if(mainContentCounter < currentInformation.maincontent.posts.length) {
		forceSwitch();
	}
}

function moveLeft() {
	if(mainContentCounter > 0) {
		mainContentCounter -= 2;
		forceSwitch();
	}
}

function forceSwitch() {
		for(var i = newimages.length; i--;)
			newimages[i].onload = function() {};
		newimages = new Array();

		switchMainInformation();
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 37:
            moveLeft();
            break;
        case 39:
            moveRight();
            break;
    }
};
