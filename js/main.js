$(document).ready(function() {

	$("#season").change(function () {
        var val = $(this).val();
        if (val == "2017") {
            $("#player").html("<option value='Russell_Westbrook_Stats_2017'>Russell Westbrook</option><option value='James_Harden_Stats_2017'>James Harden</option><option value='Kawhi_Leonard_Stats_2017'>Kawhi Leonard</option><option value='LeBron_James_Stats_2017'>LeBron James</option><option value='Isaiah_Thomas_Stats_2017'>Isaiah Thomas</option><option value='Stephen_Curry_Stats_2017'>Stephen Curry</option><option value='John_Wall_Stats_2017'>John Wall</option><option value='Giannis_Antetokounmpo_Stats_2017'>Giannis Antetokounmpo</option><option value='Anthony_Davis_Stats_2017'>Anthony Davis</option><option value='Kevin_Durant_Stats_2017'>Kevin Durant</option><option value='DeMar_DeRozan_Stats_2017'>DeMar DeRozan</option>");
        } else if (val == "2016") {
            $("#player").html("<option value='Stephen_Curry_Stats_2016'>Stephen Curry</option><option value='Kawhi_Leonard_Stats_2016'>Kawhi Leonard</option><option value='LeBron_James_Stats_2016'>LeBron James</option><option value='Russell_Westbrook_Stats_2016'>Russell Westbrook</option><option value='Kevin_Durant_Stats_2016'>Kevin Durant</option><option value='Chris_Paul_Stats_2016'>Chris Paul</option><option value='Draymond_Green_Stats_2016'>Draymond Green</option><option value='Damian_Lillard_Stats_2016'>Damian Lillard</option><option value='James_Harden_Stats_2016'>James Harden</option><option value='Kyle_Lowry_Stats_2016'>Kyle Lowry</option>");
        } else if (val == "2015") {
            $("#player").html("<option value='Stephen_Curry_Stats_2015'>Stephen Curry</option><option value='James_Harden_Stats_2015'>James Harden</option><option value='LeBron_James_Stats_2015'>LeBron James</option><option value='Russell_Westbrook_Stats_2015'>Russell Westbrook</option><option value='Anthony_Davis_Stats_2015'>Anthony Davis</option><option value='Chris_Paul_Stats_2015'>Chris Paul</option><option value='LaMarcus_Aldridge_Stats_2015'>LaMarcus Aldridge</option><option value='Marc_Gasol_Stats_2015'>Marc Gasol</option><option value='Blake_Griffin_Stats_2015'>Blake Griffin</option><option value='Tim_Duncan_Stats_2015'>Tim Duncan</option><option value='Kawhi_Leonard_Stats_2015'>Kawhi Leonard</option><option value='Klay_Thompson_Stats_2015'>Klay Thompson</option>");
        }
    });
	
	/* Change graph on drop down selection */
	$("#season").on("change", drawGraph);
	$("#player").on("change", drawGraph);
	$("#stat").on("change", drawGraph);

	// set the dimensions and margins of the graph
	var margin = {top: 20, right: 20, bottom: 50, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;


	// set the ranges
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the player line
	var valueline = d3.line()
	    .x(function(d) { return x(d.Game); })
	    .y(function(d) { return y(d.Stat_G); });

	//define the MVP average line
	var valuelineMVP = d3.line()
	    .x(function(d) { return x(d.Game); })
	    .y(function(d) { return y(d.mean); });

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
		playerYear = ($("#player")[0].value) //This is file 
		statUnderStudy = ($("#stat")[0].value) //Column in file

		// Get the data 
		d3.csv("Data Store/"+seasonYear+'/'+playerYear+".csv", function(error, data) {
				if (error) throw error;
			  	// format the PLAYER data
			  	data.forEach(function(d) {
			    	d.Game = parseInt(d.Game);
			      	d.Stat_G = parseFloat(d[statUnderStudy]);
			  	});

			// Get the MVP data 
			d3.csv("Data Store/MVPAverage/MVPAvgStats.csv", function(error, dataMVP) {
					if (error) throw error;
				  	// format the MVP data
				  	dataMVP.forEach(function(d) {
				    	d.Game = parseInt(d.Game);
				      	d.mean = parseFloat(d[statUnderStudy]); //Square brackets allow the passing of variables
				  	});

				// Scale the domain of the data
				x.domain(d3.extent(data, function(d) { return d.Game; }));

				//Scale the range of data using max value of PLAYER and MVP data
				var playerMaxValue = d3.max(data, function(d){
				  	return d.Stat_G
				})
				var mvpMaxValue = d3.max(dataMVP, function(d){
					return d.mean
				})
				var maxPoints = [playerMaxValue,mvpMaxValue]

			 	y.domain([0, Math.max.apply(Math,maxPoints)])

			 	//Drawing 

				svg.selectAll(".line").remove()
				svg.selectAll(".mvpline").remove()

				// Add the valueline path MVP.
				var mvpPath = svg.append("path")
					.data([dataMVP])
				    .attr("class", "mvpline")
				    .attr("d", valuelineMVP);

				// Add the valueline path PLAYER.
				var path = svg.append("path")
				    .data([data])
				    .attr("class", "line")
				    .attr("d", valueline);

				svg.selectAll(".xaxis").remove()

				// Add the X Axis
				svg.append("g")
				    .attr("transform", "translate(0," + height + ")")
				    .attr("class", "xaxis")
				    .transition().duration(500)
				    .call(d3.axisBottom(x).ticks(25, "s"));
				

				svg.selectAll(".yaxis").remove()

				// Add the Y Axis
				svg.append("g")
				  	.attr("class", "yaxis")
				  	.transition().duration(500)
				    .call(d3.axisLeft(y).ticks(10,"s"))

				//Add Text for Y axis
				svg.append("text")
				    .attr("transform", "rotate(-90)")
				    .attr("y", 0 - margin.left)
				    .attr("x",0 - (height / 2))
				    .attr("dy", "1em")
				    .style("text-anchor", "middle")
				    .text("Values");     

				// text label for the x axis
				svg.append("text")             
			      	.attr("transform",
			        	"translate(" + (width/2) + " ," + 
			                (height + margin.top + 20) + ")")
			      	.style("text-anchor", "middle")
			      	.text("Game");
				
			    //Get Path lengths for line transition
				var totalLength = path.node().getTotalLength();
				var totalLengthMVP = mvpPath.node().getTotalLength();
				
				//Transitions for paths on graph using length of path and duration    
			    path
			      	.attr("stroke-dasharray", totalLength + " " + totalLength)
			      	.attr("stroke-dashoffset", totalLength)
			      	.transition()
			        .duration(4000)
			        .ease(d3.easeLinear)
			        .attr("stroke-dashoffset", 0);

			    mvpPath
			      	.attr("stroke-dasharray", totalLengthMVP + " " + totalLengthMVP)
			      	.attr("stroke-dashoffset", totalLengthMVP)
			      	.transition()
			        .duration(4000)
			        .ease(d3.easeLinear)
			        .attr("stroke-dashoffset", 0);

			});
		});
	}
})
