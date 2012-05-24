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
	var rotval = (power/9000+1)%2;
	var c = document.getElementById("gauge");
	var ctx = c.getContext("2d");
	
	/* Background part */
	ctx.beginPath();
	ctx.arc(150,150,100,1*Math.PI,0*Math.PI);
	ctx.lineWidth = 15;
	ctx.strokeStyle = "gray";
	ctx.stroke();
	
	/* Green part */
	ctx.beginPath();
	ctx.arc(150,150,100,1*Math.PI,rotval*Math.PI);
	ctx.lineWidth = 15;
	ctx.strokeStyle = "green";
	ctx.stroke();
	
	if(rotval > 1.5 || rotval == 0){
		/* Yellow part */
		ctx.beginPath();
		ctx.arc(150,150,100,1.5*Math.PI,rotval*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "yellow";
		ctx.stroke();
		
		if(rotval > 1.8 || rotval == 0){
			/* Red part */
		ctx.beginPath();
		ctx.arc(150,150,100,1.8*Math.PI,rotval*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "red";
		ctx.stroke();
		}
	}
}
