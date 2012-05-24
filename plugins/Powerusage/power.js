$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		var rotval = (val/9000+1)%2;
		console.log(rotval);
		
		document.getElementById('disp').appendChild(document.createTextNode(val + 'W'))

		var c = document.getElementById("gauge");
		var ctx = c.getContext("2d");
		ctx.beginPath();
		ctx.arc(150,150,100,1*Math.PI,rotval*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "white";
		ctx.stroke();
	}
});


