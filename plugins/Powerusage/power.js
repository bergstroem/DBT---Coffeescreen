$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var power = parseFloat(msg);
		
		draw(power);
		document.getElementById('powertext').appendChild(document.createTextNode(power + 'W'))
	}
});


function draw(power){
	var maxval = 9000;
	var thickness = 20;	
	var rotval = (power/maxval+1)%2;
	var c = document.getElementById("gauge");
	var ctx = c.getContext("2d");
	
	ctx.font = "15pt Calibri";
	ctx.fillStyle = "white";
	ctx.fillText("0W", 0, 125);
	ctx.fillText(maxval+"W", 180, 125);
	
	/* Background part */
	ctx.beginPath();
	ctx.arc(110,110,100,1*Math.PI,0*Math.PI);
	ctx.lineWidth = thickness;
	ctx.strokeStyle = "gray";
	ctx.stroke();
	
	/* Green part */
	ctx.beginPath();
	ctx.arc(110,110,100,1*Math.PI,rotval*Math.PI);
	ctx.lineWidth = thickness;
	ctx.strokeStyle = "green";
	ctx.stroke();
	
	if(rotval > 1.5 || rotval == 0){
		/* Yellow part */
		ctx.beginPath();
		ctx.arc(110,110,100,1.5*Math.PI,rotval*Math.PI);
		ctx.lineWidth = thickness;
		ctx.strokeStyle = "yellow";
		ctx.stroke();
		
		if(rotval > 1.8 || rotval == 0){
			/* Red part */
		ctx.beginPath();
		ctx.arc(110,110,100,1.8*Math.PI,rotval*Math.PI);
		ctx.lineWidth = thickness;
		ctx.strokeStyle = "red";
		ctx.stroke();
		}
	}
}
