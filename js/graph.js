// Data for testing graphs
var d1 = [[1, 50], [2, 60], [3, 65], [4, 70], [5, 73]];
var d2 = [[1,20],[2,30],[3,35],[4,40],[5,55]];
var d3 = [d1,d2]

// Percentile data from WHO
var malesHeight = {"5%": [[0,46.8],[1,51.5],[2,55.1],[3,58.1],[4,60.5],[5,62.4],[6,64.1],[9,68.3],[12,71.8],[15,75],[18,77.8],[24,82.8]], "95%": [[0,53],[1,57.9],[2,61.7],[3,64.8],[4,67.3],[5,69.4],[6,71.1],[9,75.7],[12,79.7],[15,83.3],[18,86.7],[24,92.8]]};
var malesWeight = {"5%": [[0,2.6],[1,3.6],[2,4.5],[3,5.2],[4,5.8],[5,6.2],[6,6.6],[9,7.4],[12,8.1],[15,8.6],[18,9.1],[24,10.1]], "95%": [[0,4.2],[1,5.5],[2,6.8],[3,7.7],[4,8.4],[5,9],[6,9.5],[9,10.6],[12,11.5],[15,12.3],[18,13.1],[24,14.7]]};

$(document).ready(function () {

	// Create our graph from the data table and specify a container to put the graph in

	$('button').click(function(){
		var idx=$(this).data('index');
		createGraph('#user-data', '.chart', idx);
	})

	// Here be graphs
	function createGraph(data, container, type) {
		// Declare some common variables and container elements
		var bars = [];
		var figureContainer = $('<div id="figure"></div>');
		var graphContainer = $('<div class="graph"></div>');
		var barContainer = $('<div class="bars"></div>');
		var data = $(data);
		var container = $(container);
		var chartData;
		var graphType = type;
		var columnGroups;
		var dataSet;

		// Create table data object
		var tableData = {
			// Get heading data from table caption
			chartHeading: function() {
				var chartHeading = data.find('caption').text();
				return chartHeading;
			},
			// Sort data into groups based on number of columns
			columnGroups: function() {
				var columnGroups = [];
				// Get number of columns from row of table corresponding to requested data type
				var columns = document.getElementById("user-data").rows[id=graphType].cells.length;

				//Only use data from the specified row
				for (var i = 0; i < columns - 1; i++) {
					columnGroups[i] = [i];
					data.find("." + graphType).each(function() {
						columnGroups[i].push($(this).find('td').eq(i).text());
					});
				}
				return columnGroups;
			}
		}

		// Creating the array for graphing
		columnGroups = tableData.columnGroups();

		// Creating the data arrays for the graph
		// This is super clunky right now, may want some help to clean it up
		if (graphType == "Height") {
			dataSet = [
				{label: "My " + graphType, data: columnGroups, color:"rgb(0,0,0)", animator: {start: 100, steps: 100, duration: 2000, direction: "right"}},
				{label: "5th-95th percentile", id: "5%", data: malesHeight["5%"], lines: {show: true, lineWidth: 0, fill: 0}, points: {show: false}, color:"rgb(50,50,255)", hoverable: false},
				{id: "95%", data: malesHeight["95%"], lines: {show: true, lineWidth: 0, fill: 0.2}, points: {show: false}, color: "rgb(50,50,255)", fillBetween: "5%", hoverable: false}
			]
		}
		else if (graphType == "Weight") {
			dataSet = [
				{label: "My " + graphType, data: columnGroups, color:"rgb(0,0,0)", animator: {start: 100, steps: 100, duration: 2000, direction: "right"}},
				{label: "5th-95th percentile", id: "5%", data: malesWeight["5%"], lines: {show: true, lineWidth: 0, fill: 0}, points: {show: false}, color:"rgb(50,50,255)", hoverable: false},
				{id: "95%", data: malesWeight["95%"], lines: {show: true, lineWidth: 0, fill: 0.2}, points: {show: false}, color: "rgb(50,50,255)", fillBetween: "5%", hoverable: false}
			]
		}



		//Using Flot to plot the graph
		var plot = $.plotAnimator($("#placeholder"), dataSet, {
				series: {
					lines: { show: true },
					points: { show: true }
				},
				//Axes options
				xaxis: {
					tickDecimals: 0,
					tickLength: 0,
					/*axisLabel: 'Age in months',
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5
					/*ticks: 10,
					min: -2,
					max: 2,
					tickDecimals: 3*/
				},
				yaxis: {
					/*if (graphType == "Height") {
						tickFormatter: function (v) {
							return v + " cm";
						},
					}
					else if (graphType == "Weight") {
						tickFormatter: function (v) {
							return v + " kg";
						},
					}*/
					/*axisLabel: 'Height in cm',
					axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5*/
				},
				grid: {
					hoverable: true,
					clickable: true,
					backgroundColor: { colors: [ "#fff", "#eee" ] },
					borderWidth: {
						top: 1,
						right: 1,
						bottom: 2,
						left: 2
					}
				}
			});

			//Some CSS for the tooltip popup
			$("<div id='tooltip'></div>").css({
				position: "absolute",
				display: "none",
				border: "1px solid #fdd",
				padding: "2px",
				"background-color": "#fee",
				opacity: 0.80
			}).appendTo("body");

			//Creating the tooltip popup
			$("#placeholder").bind("plothover", function (event, pos, item) {


				if (item) {
					var x = item.datapoint[0].toFixed(0),
						y = item.datapoint[1].toFixed(2);

					$("#tooltip").html(y + "cm tall at " + x + " months")
						.css({top: item.pageY+5, left: item.pageX+5})
						.fadeIn(200);
				} else {
					$("#tooltip").hide();
				}
			});
	}
});
