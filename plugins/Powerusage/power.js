console.log("haihai");
console.log(google);
google.setOnLoadCallback(drawChart);
google.
google.load('visualization', '1', {packages:['gauge']});
console.log(google);

setTimeout(function(){drawChart();},1000); 

function drawChart() {
	console.log("baibai");
	var data = google.visualization.arrayToDataTable([
		['Label', 'Value'],
		['Memory', 80],
		['CPU', 55],
		['Network', 68]
	]);

	var options = {
		width: 400, height: 120,
		redFrom: 90, redTo: 100,
		yellowFrom:75, yellowTo: 90,
		minorTicks: 5	
	};

	var chart = new google.visualization.Gauge(document.getElementById('disp'));
	chart.draw(data, options);
}
/*
$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		
		disp.appendChild(document.createTextNode(val + 'W'))
		drawChart();
	}
});*/


