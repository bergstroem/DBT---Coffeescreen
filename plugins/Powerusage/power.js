var c = document.getElementById("gauge");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.arc(100,75,50,0*Math.PI,1.5*Math.PI);
ctx.stroke();

$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		var rotval = 180*val/9000;
		
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


