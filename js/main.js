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
	drawGraph();
	
	/* Change graph on drop down selection */
	$("#season").on("change", drawGraph);
	$("#player").on("change", drawGraph);
	$("#stat").on("change", drawGraph);

	// set the dimensions and margins of the graph
	var margin = {top: 20, right: 200, bottom: 50, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;


	// set the ranges
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the player line
	var valueline = d3.line()
	    .x(function(d) { return x(d.Game); })
	    .y(function(d) { return y(d.Stat_G); });

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("#comparisonGraph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	// gridlines in x axis function
	function make_x_gridlines() {		
	    return d3.axisBottom(x)
	        .ticks(10)
	}

	// gridlines in y axis function
	function make_y_gridlines() {		
	    return d3.axisLeft(y)
	        .ticks(10)
	}

	function drawGraph(){
		seasonYear = ($("#season")[0].value) //This is folder name
		playerYear = ($("#player")[0].value) //This is file 
		statUnderStudy = ($("#stat")[0].value) //Column in file

		//Create list of csv files that need to be loaded
		var filesToLoad = ["Data Store/MVPAverage/MVPAvgStats.csv","Data Store/"+seasonYear+'/'+playerYear+".csv"]
		//Create queue for loading multiple csv files
		var queue = d3.queue();

		// start loading
		filesToLoad.forEach(function(filename){
			queue.defer(d3.csv,filename);
		})
		//Join load
		queue.awaitAll(function(error,csvDataSets){
			if(error) throw error;

			//Array to hold merged csv data
			var mergedData = []

			//Cast string to int for data points
			csvDataSets.forEach(function(csvDataSet){

				csvDataSet.forEach(function(d) {
			    	d.Game = parseInt(d.Game);
			      	d.Stat_G = parseFloat(d[statUnderStudy]);
		  		});
			})

			//Merge the CSV data ****************** MAKE MORE GENERAL LATER  *****************************
			mergedData = (d3.merge([csvDataSets[0], csvDataSets[1]]));
			
			//Create a d3 nest based on Name key in dataset
			var dataGroup = d3.nest()
				.key(function(d){
					return d.Name;
				})
				.entries(mergedData)		  		
			
			//Colors  to use for lines
			var colors = ['#FFD700','steelblue','purple']
	
		  		
		  	// Scale the domain of the data
			x.domain(d3.extent(mergedData, function(d) { return d.Game; }));
			y.domain(d3.extent(mergedData, function(d) { return d.Stat_G; }));

			//Refresh grid
			svg.selectAll(".grid").remove()

			// add the X gridlines
			svg.append("g")			
				.attr("class", "grid")
				.attr("transform", "translate(0," + height + ")")
				.call(make_x_gridlines()
					.tickSize(-height)
					.tickFormat("")
				)

			// add the Y gridlines
			svg.append("g")			
				.attr("class", "grid")
				.call(make_y_gridlines()
					.tickSize(-width)
					.tickFormat("")
			)

			svg.selectAll(".line").remove()

			svg.selectAll(".xaxis").remove()

			// Loop through each symbol / key and draw line
		    dataGroup.forEach(function(d,index) {
		        svg.append("path")
		            .attr("class", "line")
		            .style("stroke", colors[index])
		            .attr("d", valueline(d.values));

		    });


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

		    //Transition of lines
			      	
		    svg.selectAll(".line").nodes().forEach(function(d){
		    	
		    	d3.select(d)
		    	  	.attr("stroke-dasharray", d.getTotalLength() + " " + d.getTotalLength())
		    	  	.attr("stroke-dashoffset", d.getTotalLength())
		    	  	.transition()
		    	    .duration(3000)
		    	    .ease(d3.easeLinear)
		    	    .attr("stroke-dashoffset", 0);
		    })
			
		})
	}
})
