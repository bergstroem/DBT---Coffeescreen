var disp = document.getElementById("disp");

$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		/*
		google.load('visualization', '1', {packages:['gauge']});
		google.setOnLoadCallBack(drawChart);
		function drawChart(){
			var data = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Power', 80]
			]);
			var options = {
				width: 400, height: 120,
				redFrom: 90, redTo: 100,
				yellowFrom:75, yellowTo:90,
				minorTicks:5
			};
			
			var chart = new google.visualization.Gauge(disp);
			chart.draw(data, options);
		}*/
		disp.appendChild(document.createTextNode(val + 'W'))
	}
});


