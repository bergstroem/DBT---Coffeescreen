$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		document.getElementById('disp').appendChild(document.createTextNode(val + 'W'))
	}
});