var filesToLoad = ["Data Store/MVPAverage/MVPAvgStats.csv"]//,"Data Store/"+seasonYear+'/'+playerYear+".csv"]
var seasonLists = ["#season"]
var playerLists = ["#player"]
var possibleSeasonsLists = ["#season2","#season3","#season4","#season5"]
var possiblePlayersLists = ["#player2","#player3","#player4","#player5"]
var possibleDiv = ["#2player","#3player","#4player","#5player"]
$(document).ready(function() {

	jQuery('.tabs .tab-links a').on('click', function(e)  {
	        var currentAttrValue = jQuery(this).attr('href');
	 
	        // Show/Hide Tabs
	        jQuery('.tabs ' + currentAttrValue).fadeIn(500).siblings().hide();
	 
	        // Change/remove current tab to active
	        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
	 
	        e.preventDefault();
	    });

	/* Tabs switching logic */
	/*
	$('ul.tabs li').tabs({ active: 1 });
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})
	*/

	$("#season, #season2, #season3, #season4, #season5").change(function () {
        var val = $(this).val();
        var player = "#player"
        switch(this.id) {
            case "season2":
                player = "#player2"
                break;
            case "season3":
                player = "#player3"
                break;
            case "season4":
                player = "#player4"
                break;
            case "season5":
                player = "#player5"
                break;                  
            default:
                player = "#player"
        }
        if (val == "2018"){
        	$(player).html("<option value='LeBron_James_Stats_2018'>LeBron James</option><option value='James_Harden_Stats_2018'>James Harden</option><option value='Giannis_Antetokounmpo_Stats_2018'>Giannis Antetokounmpo</option><option value='Kevin_Durant_Stats_2018'>Kevin Durant</option><option value='Kyrie_Irving_Stats_2018'>Kyrie Irving</option><option value='Stephen_Curry_Stats_2018'>Stephen Curry</option><option value='Russell_Westbrook_Stats_2018'>Russell Westbrook</option><option value='DeMar_DeRozan_Stats_2018'>DeMar DeRozan</option><option value='Anthony_Davis_Stats_2018'>Anthony Davis</option><option value='Kyle_Lowry_Stats_2018'>Kyle Lowry</option><option value='Karl-Anthony_Towns_Stats_2018'>Karl-Anthony Towns</option><option value='Nikola_Jokic_Stats_2018'>Nikola Jokic</option>");
        }else if (val == "2017") {
            $(player).html("<option value='Russell_Westbrook_Stats_2017'>Russell Westbrook</option><option value='James_Harden_Stats_2017'>James Harden</option><option value='Kawhi_Leonard_Stats_2017'>Kawhi Leonard</option><option value='LeBron_James_Stats_2017'>LeBron James</option><option value='Isaiah_Thomas_Stats_2017'>Isaiah Thomas</option><option value='Stephen_Curry_Stats_2017'>Stephen Curry</option><option value='John_Wall_Stats_2017'>John Wall</option><option value='Giannis_Antetokounmpo_Stats_2017'>Giannis Antetokounmpo</option><option value='Anthony_Davis_Stats_2017'>Anthony Davis</option><option value='Kevin_Durant_Stats_2017'>Kevin Durant</option><option value='DeMar_DeRozan_Stats_2017'>DeMar DeRozan</option>");
        } else if (val == "2016") {
            $(player).html("<option value='Stephen_Curry_Stats_2016'>Stephen Curry</option><option value='Kawhi_Leonard_Stats_2016'>Kawhi Leonard</option><option value='LeBron_James_Stats_2016'>LeBron James</option><option value='Russell_Westbrook_Stats_2016'>Russell Westbrook</option><option value='Kevin_Durant_Stats_2016'>Kevin Durant</option><option value='Chris_Paul_Stats_2016'>Chris Paul</option><option value='Draymond_Green_Stats_2016'>Draymond Green</option><option value='Damian_Lillard_Stats_2016'>Damian Lillard</option><option value='James_Harden_Stats_2016'>James Harden</option><option value='Kyle_Lowry_Stats_2016'>Kyle Lowry</option>");
        } else if (val == "2015") {
            $(player).html("<option value='Stephen_Curry_Stats_2015'>Stephen Curry</option><option value='James_Harden_Stats_2015'>James Harden</option><option value='LeBron_James_Stats_2015'>LeBron James</option><option value='Russell_Westbrook_Stats_2015'>Russell Westbrook</option><option value='Anthony_Davis_Stats_2015'>Anthony Davis</option><option value='Chris_Paul_Stats_2015'>Chris Paul</option><option value='LaMarcus_Aldridge_Stats_2015'>LaMarcus Aldridge</option><option value='Marc_Gasol_Stats_2015'>Marc Gasol</option><option value='Blake_Griffin_Stats_2015'>Blake Griffin</option><option value='Tim_Duncan_Stats_2015'>Tim Duncan</option><option value='Kawhi_Leonard_Stats_2015'>Kawhi Leonard</option><option value='Klay_Thompson_Stats_2015'>Klay Thompson</option>");
        }
    });
	/* Copy select options from first drop down to all clones */
	possibleSeasonsLists.forEach(function(season){
		$('#season option').clone().appendTo(season);
	})
	possiblePlayersLists.forEach(function(player){
		$('#player option').clone().appendTo(player);
	})

	drawGraph();
	drawScatterplot();
	
	/* Change graph on drop down selection */
	$("#season").on("change", drawGraph);
	$("#player").on("change", drawGraph);
	$("#stat").on("change", drawGraph);
	/* Change graph on drop down selection */
	possibleSeasonsLists.forEach(function(season){
		$(season).on("change", drawGraph);
	})
	possiblePlayersLists.forEach(function(player){
		$(player).on("change", drawGraph);
	})

	$("#seasonAdv").on("change", drawScatterplot);
	$("#statAdv").on("change", drawScatterplot);

	// set the dimensions and margins of the graph
	var margin = {top: 20, right: 220, bottom: 50, left: 50},
	    width = 1200 - margin.left - margin.right,
	    height = 600 - margin.top - margin.bottom;


	// set the ranges
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// Define the div for the tooltip
	var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);

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

	var scatterPlot = d3.select("#pointGraph").append("svg")
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
	$(".addPlayer").click(function (){
		idx = parseInt($(this).attr('id'))
		$(possibleDiv[idx]).show();
		seasonLists.push(possibleSeasonsLists[idx])
		playerLists.push(possiblePlayersLists[idx])

		drawGraph()
	})
	$(".removePlayer").click(function (){
		idx = parseInt($(this).attr('id'))
		console.log(idx)
		$(possibleDiv[idx-1]).hide();
		seasonLists.splice(idx,1)
		playerLists.splice(idx,1)

		filesToLoad.splice(idx+1,1)

		drawGraph()

	})

	function drawGraph(){
		seasonYear = ($("#season")[0].value) //This is folder name
		playerYear = ($("#player")[0].value) //This is file 
		statUnderStudy = ($("#stat")[0].value) //Column in file
		seasonLists.forEach(function(listId,idx){
			//Create list of csv files that need to be loaded
			if ($.inArray("Data Store/"+($(seasonLists[idx])[0].value)+'/'+($(playerLists[idx])[0].value)+".csv", filesToLoad) == -1)
			{
			  filesToLoad[idx+1]=("Data Store/"+($(seasonLists[idx])[0].value)+'/'+($(playerLists[idx])[0].value)+".csv")
			}
		})

		
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
			var dataSetsToMerge = []
			var mergedData = []

			//Cast string to int for data points
			csvDataSets.forEach(function(csvDataSet){

				csvDataSet.forEach(function(d) {
			    	d.Game = parseInt(d.Game);
			      	d.Stat_G = parseFloat(d[statUnderStudy]);
		  		});
			})
			//Get an array of all data set to use
			csvDataSets.forEach(function(set){
				dataSetsToMerge.push(set)
			})
			//Merge the CSV data 
			mergedData = (d3.merge(dataSetsToMerge));
			
			//Create a d3 nest based on Name key in dataset
			var dataGroup = d3.nest()
				.key(function(d){
					return d.Name;
				})
				.entries(mergedData)		  		
			
			//Colors  to use for lines
			var colors = ['#FFD700','steelblue','darkgreen','purple','DarkRed','orange']
			var legendRectSize = 15;                                  // NEW
			var legendSpacing = 4;                                    // NEW
		  		
		  	// Scale the domain of the data
			x.domain(d3.extent(mergedData, function(d) { return d.Game; }));
			//y.domain(d3.extent(mergedData, function(d) { return d.Stat_G; }));
			var playerMaxValue = d3.max(mergedData, function(d){
				return d.Stat_G
			})
			var playerMinValue = d3.min(mergedData,function(d){
				return d.Stat_G
			})
			if (playerMinValue != 0){
				playerMinValue = playerMinValue - (playerMinValue*0.15);
			}
			//15% buffer at top/bottom of graph
			y.domain([playerMinValue,playerMaxValue+(0.1*playerMaxValue)])

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
		    	var newID =(d.key).replace(/\s/g, '');
		    	console.log(newID)
		        svg.append("path")
	            .attr("class", "line")
	            .attr("id",newID)
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


			svg.selectAll(".axisLabel").remove()

			//Add Text for Y axis
			svg.append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("class","axisLabel")
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
		      	.attr("class","axisLabel")
		      	.style("text-anchor", "middle")
		      	.text("Game");

		    /*  Create Legend  */
		    svg.selectAll(".legend").remove()
		    var legend = svg.selectAll('.legend')                     
				.data(dataGroup)                                   
				.enter()                                                
				.append('g')                                            
				.attr('class', 'legend')                                
				.attr('transform', function(d, i) {                     
					var height = legendRectSize + legendSpacing;          
					//var offset =  height * dataGroup.length / 2;     
					var horz = width + legendRectSize;                       
					//var vert = i * height - offset+25
					var vert = i * height +25                       
					return 'translate(' + horz + ',' + vert + ')';        
				});                                                     

			//Get legend rect colors from line color
            legend.append('rect')                                     
              .attr('width', legendRectSize)                         
              .attr('height', legendRectSize)
              .attr('fill',function(d,i){
              	return colors[i];
              })                         
              .style('stroke', "black");                                

            //Get legend text from nest 
            legend.append('text')                                     // NEW
              .attr('x', legendRectSize + legendSpacing)              // NEW
              .attr('y', legendRectSize - legendSpacing)              // NEW
              .text(function(d) {
              	return d.key;
               });            

              				svg.selectAll(".mouse-per-line").remove()
            			    //Add mouse over effects
            			    var mouseG = svg.append("g")
                  				.attr("class", "mouse-over-effects");

                  			var linesOnGraph = document.getElementsByClassName('line');
                  			mouseG.append("path") // this is the black vertical line to follow mouse
            					.attr("class", "mouse-line")
            					.style("stroke", "black")
            					.style("stroke-width", "1px")
            					.style("opacity", "0");

            			    var mousePerLine = mouseG.selectAll('.mouse-per-line')
            					.data(dataGroup)
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
            							.style("opacity", "0.7");
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
        					                end = linesOnGraph[i].getTotalLength(),
        					                target = null;
            					            
            					            while (true){
            									target = Math.floor((beginning + end) / 2);
            									pos = linesOnGraph[i].getPointAtLength(target);
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

	function drawScatterplot(){
		seasonYearAdv = ($("#seasonAdv")[0].value) //This is folder name
		statUnderStudyAdv = ($("#statAdv")[0].value) 

		console.log(statUnderStudyAdv)
		xStatLabel = (statUnderStudyAdv.substring(0,statUnderStudyAdv.indexOf("_")))
		yStatLabel = (statUnderStudyAdv.substring(statUnderStudyAdv.indexOf("_")+1))

		var scatterPlotFiles = ["Data Store/MVPAverage/MVPAvgSingleAdvStats.csv","Data Store/SingleStats/"+seasonYearAdv+"/AdvStatPoints.csv"]
		var color = d3.scaleOrdinal(d3.schemeCategory20);


		//Create queue for loading multiple csv files
		var queue = d3.queue();

		// start loading
		scatterPlotFiles.forEach(function(filename){
			queue.defer(d3.csv,filename);
		})
		//Join load
		queue.awaitAll(function(error,csvDataSets){
			if(error) throw error;

			//Array to hold merged csv data
			var dataSetsToMerge = []
			var mergedData = []

			//Cast string to int for data points
			csvDataSets.forEach(function(csvDataSet){

				csvDataSet.forEach(function(d) {
			    	d.x_stat = parseFloat(d[xStatLabel]);
			      	d.y_stat = parseFloat(d[yStatLabel]);
		  		});
			})
			//Get an array of all data set to use
			csvDataSets.forEach(function(set){
				dataSetsToMerge.push(set)
			})
			//Merge the CSV data 
			mergedData = (d3.merge(dataSetsToMerge));
			//Create a d3 nest based on Name key in dataset
			var dataGroup = d3.nest()
				.key(function(d){
					return d.Name;
				})
				.entries(mergedData)		  		


			x.domain(d3.extent(mergedData, function(d) { return d.x_stat; }));	
			y.domain(d3.extent(mergedData, function(d) { return d.y_stat; }));	

			//Refresh grid
			scatterPlot.selectAll(".grid").remove()

			// add the X gridlines
			scatterPlot.append("g")			
				.attr("class", "grid")
				.attr("transform", "translate(0," + height + ")")
				.call(make_x_gridlines()
					.tickSize(-height)
					.tickFormat("")
				)

			// add the Y gridlines
			scatterPlot.append("g")			
				.attr("class", "grid")
				.call(make_y_gridlines()
					.tickSize(-width)
					.tickFormat("")
			)

			scatterPlot.selectAll(".circle").remove()
			
			scatterPlot.selectAll(".xaxis").remove()
			// Add the X Axis
			scatterPlot.append("g")
			    .attr("transform", "translate(0," + height + ")")
			    .attr("class", "xaxis")
			    .transition().duration(500)
			    .call(d3.axisBottom(x).ticks(10, "s"));
			

			scatterPlot.selectAll(".yaxis").remove()

			// Add the Y Axis
			scatterPlot.append("g")
			  	.attr("class", "yaxis")
			  	.transition().duration(500)
			    .call(d3.axisLeft(y).ticks(10,"s"))

			
			scatterPlot.selectAll(".axisLabel").remove()

			//Add Text for Y axis
			scatterPlot.append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("class","axisLabel")
			    .attr("y", 0 - margin.left)
			    .attr("x",0 - (height / 2))
			    .attr("dy", "1em")
			    .style("text-anchor", "middle")
			    .text(yStatLabel);     

			// text label for the x axis
			scatterPlot.append("text")             
		      	.attr("transform",
		        	"translate(" + (width/2) + " ," + 
		                (height + margin.top + 20) + ")")
		      	.attr("class","axisLabel")
		      	.style("text-anchor", "middle")
		      	.text(xStatLabel);

			var dot = scatterPlot.selectAll(".circle")
			  .data(mergedData)
			  .enter().append("circle")
			    .attr("class", "circle")
        		.transition()
        		.duration(800)
			    .attr("r", function(d,i) {
			     if(d.Name == "Average MVP"){
			     	return 10
			     }else{return 8}
			 	})
			    .attr("cx", function(d) { return x(d.x_stat); })
			    .attr("cy", function(d) { return y(d.y_stat); })

			    .attr("fill", function(d,i) {
			     if(d.Name == "Average MVP"){
			     	return "#FFD700"
			     }
			     return color(i); 
			 	} )
			 	.style('stroke', function(d,i) {
			     if(d.Name == "Average MVP"){
			     	return "yellow"
			     }} )

			 	scatterPlot.selectAll(".circle")
			    	.on("mouseover", function(d) {	
			                div.transition()		
			                    .duration(200)		
			                    .style("opacity", .9);		
			                div	.html(d.Name+ "<br/>"+yStatLabel+": "+(d.y_stat) + "<br/>"+xStatLabel+": " + d.x_stat)	
			                    .style("left", (d3.event.pageX) + "px")		
			                    .style("top", (d3.event.pageY - 28) + "px");	
			                })					
			            .on("mouseout", function(d) {		
			                div.transition()		
			                    .duration(500)		
			                    .style("opacity", 0);	
			            });

			    //dot.transition()
			    //.duration(1000)


		})
		
	}
})
