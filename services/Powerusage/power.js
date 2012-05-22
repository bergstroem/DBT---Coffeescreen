$.ajax({
	type: 'POST',
	url: '../services/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		document.getElementById('disp').appendChild(document.createTextNode(val + 'W'))
	}
});