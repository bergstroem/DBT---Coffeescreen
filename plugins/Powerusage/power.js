console.log("haihai");
google.load('visualization', '1.0', {packages:['corechart']});
google.setOnLoadCallback(drawChart);

function drawChart() {
	console.log("baibai");
	var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
	/*var data = google.visualization.arrayToDataTable([
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
	chart.draw(data, options);*/
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


