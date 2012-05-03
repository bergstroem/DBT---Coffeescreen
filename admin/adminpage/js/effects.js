$(document).ready(function(){
	var st = window.location.href;
	var loc = st.substr(st.lastIndexOf("/")+1);	
	
	if(loc == "index.php" || loc == ""){
		document.getElementById("screens").className = "menuitem currentMenuItem";
	}
	else if(loc == "adminchannel.php"){
		document.getElementById("channels").className = "menuitem currentMenuItem";
	}
	else if(loc == "adminfeed.php"){
		document.getElementById("feeds").className = "menuitem currentMenuItem";
	}
});