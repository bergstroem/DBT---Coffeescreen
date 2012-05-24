var disp = document.getElementById("disp");
google.load('visualization', '1', {packages:['gauge']});
google.setOnLoadCallBack(drawChart);

$.ajax({
	type: 'POST',
	url: '../plugins/Powerusage/powerusage.php',
	data: '',
	success: function(msg){
		var val = parseFloat(msg);
		document.getElementById('disp').appendChild(document.createTextNode(val + 'W'))
	}
});

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
	
	var chart = new google.visualization.Gauge(document.getElementById('disp'));
	chart.draw(data, options);
}
