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
	var rotval = (val/9000+1)%2;
	var c = document.getElementById("gauge");
	var ctx = c.getContext("2d");
	if(power > 3000){
		/* Green part */
		ctx.beginPath();
		ctx.arc(150,150,100,1*Math.PI,1.3*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "green";
		ctx.stroke();
		
		/* Yellow part */
		ctx.beginPath();
		ctx.arc(150,150,100,1.3*Math.PI,1.5*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "yellow";
		ctx.stroke();
		
		/* Red part */
		ctx.beginPath();
		ctx.arc(150,150,100,1.5*Math.PI,rotval*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "red";
		ctx.stroke();
	}
	else if(power > 2000){
		/* Green part */
		ctx.beginPath();
		ctx.arc(150,150,100,1*Math.PI,1.3*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "green";
		ctx.stroke();
		
		/* Yellow part */
		ctx.beginPath();
		ctx.arc(150,150,100,1.3*Math.PI,rotval*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "yellow";
		ctx.stroke();
	}
	else{
		/* Green part */
		ctx.beginPath();
		ctx.arc(150,150,100,1*Math.PI,rotval*Math.PI);
		ctx.lineWidth = 15;
		ctx.strokeStyle = "green";
		ctx.stroke();
	}
}
