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
				
				// EXPERIMENT
				data.push(dataMVP);
				console.log(data.length)
				data = [].concat.apply([],data);
				console.log(data)

				// Scale the domain of the data
				x.domain(d3.extent(data, function(d) { return d.Game; }));

				//Scale the range of data using max value of PLAYER and MVP data
				var playerMaxValue = d3.max(data, function(d){
				  	return d.Stat_G
				})
				var mvpMaxValue = d3.max(dataMVP, function(d){
					return d.mean
				})
				var maxPoints = [playerMaxValue+(0.1*playerMaxValue),mvpMaxValue+(0.1*mvpMaxValue)]

			 	y.domain([0, Math.max.apply(Math,maxPoints)])

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

				//Add Legend	
				svg.selectAll(".legend").remove();
					
				var legend = svg.selectAll('.legend')
					.data(playerYear)
					.enter()
					.append('g')
					.attr('class', 'legend');

				legend.append('rect')
					.attr('x', width + 10)
					.attr('y', height - 400)
					.attr('width', 8)
					.attr('height', 8)
					.style('fill', "blue");

				legend.append('rect')
					.attr('x', width + 10)
					.attr('y', height - 370)
					.attr('width', 8)
					.attr('height', 8)
					.style('fill', "#FFD700");

				legend.append('text')
					.attr('x', width + 25)
					.attr('y', height - 392)
					.style("font-size", "15px")
					.style("font-weight",200)
					.text($("#player option:selected").text())

				legend.append('text')
					.attr('x', width + 25)
					.attr('y', height - 362)
					.style("font-size", "15px")
					.style("font-weight",200)
					.text("30 Previous MVP's Average")
			 	
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
				
			    //Add mouse over effects
			    var mouseG = svg.append("g")
      				.attr("class", "mouse-over-effects");

      			var linesOnGraph = d3.selectAll(".line, .mvpline")
      			console.log(linesOnGraph)
			

      			mouseG.append("path") // this is the black vertical line to follow mouse
					.attr("class", "mouse-line")
					.style("stroke", "black")
					.style("stroke-width", "1px")
					.style("opacity", "0");

			    var mousePerLine = mouseG.selectAll('.mouse-per-line')
					.data([data,dataMVP])
					.enter()
					.append("g")
					.attr("class", "mouse-per-line");

			    mousePerLine.append("circle")
					.attr("r", 4)
					.style("stroke", "black")
					.style("fill", "none")
					.style("stroke-width", "1px")
					.style("opacity", "0");

			    mousePerLine.append("text")
			     	.attr("transform", "translate(9,3)");

				mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
					.attr('width', width) // can't catch mouse events on a g element
					.attr('height', height)
					.attr('fill', 'none')
					.attr('pointer-events', 'all')
					.on('mouseout', function() { // on mouse out hide line, circles and text
						d3.select(".mouse-line")
							.style("opacity", "0");
						d3.selectAll(".mouse-per-line circle")
          					.style("opacity", "0");
        				d3.selectAll(".mouse-per-line text")
          					.style("opacity", "0");
					})
					.on('mouseover', function() { // on mouse in show line, circles and text
						d3.select(".mouse-line")
							.style("opacity", "1");
					    d3.selectAll(".mouse-per-line circle")
          					.style("opacity", "1");
        				d3.selectAll(".mouse-per-line text")
          					.style("opacity", "0.9");
					})
					.on('mousemove', function() { // mouse moving over canvas
				        var mouse = d3.mouse(this);
				        d3.select(".mouse-line")
				          .attr("d", function() {
				            var d = "M" + mouse[0] + "," + height;
				            d += " " + mouse[0] + "," + 0;
				            return d;
				          });

				        // position the circle and text
				    	d3.selectAll(".mouse-per-line")
          					.attr("transform", function(d, i) {

				            var xGame = x.invert(mouse[0]),
				                bisect = d3.bisector(function(d) {
				                	return d.Game; }).right;
				                //idx = bisect(10, xGame);
					            var beginning = 0,
					                end = path.node().getTotalLength(),
					                //end = linesOnGraph._groups[0][i].pathLength,
					                target = null;
					            while (true){
									target = Math.floor((beginning + end) / 2);
									pos = path.node().getPointAtLength(target);
									//pos = linesOnGraph._groups[0][i].node().getPointAtLength(target);
									if ((target === end || target === beginning) && pos.x !== mouse[0]) {
										break;
									}
									if (pos.x > mouse[0])      end = target;
									else if (pos.x < mouse[0]) beginning = target;
									else break; //position found
									}
            
					            d3.select(this).select('text')
					            	.text(y.invert(pos.y).toFixed(2));

					              
					            return "translate(" + mouse[0] + "," + pos.y +")";
					        });
					});


			    //Get Path lengths for line transition
				var totalLength = path.node().getTotalLength();
				var totalLengthMVP = mvpPath.node().getTotalLength();
				
				//Transitions for paths on graph using length of path and duration    
			    path
			      	.attr("stroke-dasharray", totalLength + " " + totalLength)
			      	.attr("stroke-dashoffset", totalLength)
			      	.transition()
			        .duration(3500)
			        .ease(d3.easeLinear)
			        .attr("stroke-dashoffset", 0);

			    mvpPath
			      	.attr("stroke-dasharray", totalLengthMVP + " " + totalLengthMVP)
			      	.attr("stroke-dashoffset", totalLengthMVP)
			      	.transition()
			        .duration(3500)
			        .ease(d3.easeLinear)
			        .attr("stroke-dashoffset", 0);

			});
		});
	}
})
