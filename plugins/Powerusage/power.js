var disp = document.getElementById("disp");

$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		
		disp.appendChild(document.createTextNode(val + 'W'))
	}
});


