$(document).ready(function() {

	$("#season").change(function () {
        var val = $(this).val();
        if (val == "2017") {
            $("#player").html("<option value='Russell_Westbrook_Stats_2017'>Russell Westbrook</option><option value='James_Harden_Stats_2017'>James Harden</option>");
        } else if (val == "2016") {
            $("#player").html("<option value='Steph_Curry_Stats_2016'>Steph Curry</option><option value='Kawhi_Leonard_Stats_2016'>Kawhi Leonard</option>");
        } else if (val == "2015") {
            $("#player").html("<option value='LeBron_James_Stats_2015'>LeBron James</option>");
        }
    });

	$("#season").on("change", drawGraph);
	$("#player").on("change", drawGraph);

	// set the dimensions and margins of the graph
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;


	// set the ranges
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the line
	var valueline = d3.line()
	    .x(function(d) { return x(d.Game); })
	    .y(function(d) { return y(d.PTS_G); });

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("#comparisonGraph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

function drawGraph(){
	seasonYear = ($("#season")[0].value) //This is folder name
	playerYear = ($("#player")[0].value) //This is file name
	// Get the data
	d3.csv("Data Store/"+seasonYear+'/'+playerYear+".csv", function(error, data) {
	  if (error) throw error;

	  // format the data
	  data.forEach(function(d) {
	      d.Game = parseInt(d.Game);
	      d.PTS_G = parseFloat(d.PTS_G);
	  });

	  // Scale the range of the data
	  x.domain(d3.extent(data, function(d) { return d.Game; }));
	  y.domain([0, d3.max(data, function(d) { return d.PTS_G; })]);

	  // Add the valueline path.
	  svg.append("path")
	      .data([data])
	      .attr("class", "line")
	      .attr("d", valueline);

	  // Add the X Axis
	  svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  // Add the Y Axis
	  svg.append("g")
	      .call(d3.axisLeft(y));

	    svg.append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0 - margin.left)
	      .attr("x",0 - (height / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Values");   
	    

	});
 
}
})
