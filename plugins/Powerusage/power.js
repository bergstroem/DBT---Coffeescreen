$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var power = parseFloat(msg);
		
		draw(power);
		document.getElementById('disp').appendChild(document.createTextNode(power + 'W'))
	}
});


function draw(power){
	var maxval = 9000;
	var thickness = 20;
	var rotval = (power/maxval+1)%2;
	var c = document.getElementById("gauge");
	var ctx = c.getContext("2d");
	
	context.font = "1em Calibri";
	context.fillText("0W", 200, 100);
	context.fillText(maxval+"W", 50, 100);
	
	/* Background part */
	ctx.beginPath();
	ctx.arc(150,150,100,1*Math.PI,0*Math.PI);
	ctx.lineWidth = thickness;
	ctx.strokeStyle = "gray";
	ctx.stroke();
	
	/* Green part */
	ctx.beginPath();
	ctx.arc(150,150,100,1*Math.PI,rotval*Math.PI);
	ctx.lineWidth = thickness;
	ctx.strokeStyle = "green";
	ctx.stroke();
	
	if(rotval > 1.5 || rotval == 0){
		/* Yellow part */
		ctx.beginPath();
		ctx.arc(150,150,100,1.5*Math.PI,rotval*Math.PI);
		ctx.lineWidth = thickness;
		ctx.strokeStyle = "yellow";
		ctx.stroke();
		
		if(rotval > 1.8 || rotval == 0){
			/* Red part */
		ctx.beginPath();
		ctx.arc(150,150,100,1.8*Math.PI,rotval*Math.PI);
		ctx.lineWidth = thickness;
		ctx.strokeStyle = "red";
		ctx.stroke();
		}
	}
}
