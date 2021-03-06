var possibleSeasonsLists = ["#season1","#season2","#season3","#season4"]
var possiblePlayersLists = ["#player1","#player2","#player3","#player4"]
var possibleDiv = ["#1player","#2player","#3player","#4player"]

$(document).ready(function() {

	jQuery('.tabs .nav-tabs a').on('click', function(e)  {
	        var currentAttrValue = jQuery(this).attr('href');
			if(currentAttrValue == "#tab1"){
				drawGraph()
			}
			else
				drawScatterplot()

	        // Show/Hide Tabs
	        jQuery('.tabs ' + currentAttrValue).fadeIn(500).siblings().hide();
	 
	        // Change/remove current tab to active
	        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
	 
	        e.preventDefault();
	    });

	d3.text("Data Store/LastDataAccess.txt", function(error, data) {
		d3.select("#dateAccessed").text(data);
	})
	/* Handle Disabling of dropdown menu logic */
	$(function() {
        $("#season1").change(function() {
            if ($(this).val() != "null") {
                $("#player1").prop("disabled", false);
            }
        });
         $("#season2").change(function() {
            if ($(this).val() != "null") {
                $("#player2").prop("disabled", false);
            }
        });
          $("#season3").change(function() {
            if ($(this).val() != "null") {
                $("#player3").prop("disabled", false);
            }
        });
           $("#season4").change(function() {
            if ($(this).val() != "null") {
                $("#player4").prop("disabled", false);
            }
        });
    });
	
	/* Case statement to dynamically alter player drop down values */
	$("#season, #season1, #season2, #season3, #season4").change(function () {
        var val = $(this).val();
        var player = "#player"
        switch(this.id) {
            case "season1":
                player = "#player1"
                break;
            case "season2":
                player = "#player2"
                break;
            case "season3":
                player = "#player3"
                break;
            case "season4":
                player = "#player4"
                break;                  
            default:
                player = "#player"
        }
        if (val == "2018"){
        	$(player).html("<option value='Kyrie_Irving_Stats_2018'>BOS - Kyrie Irving</option><option value='LeBron_James_Stats_2018'>CLE - LeBron James</option><option value='Nikola_Jokic_Stats_2018'>DEN - Nikola Jokic</option><option value='Gary_Harris_Stats_2018'>DEN - Gary Harris</option><option value='Kevin_Durant_Stats_2018'>GSW - Kevin Durant</option><option value='Stephen_Curry_Stats_2018'>GSW - Stephen Curry</option><option value='Klay_Thompson_Stats_2018'>GSW - Klay Thompson</option><option value='Draymond_Green_Stats_2018'>GSW - Draymond Green</option><option value='James_Harden_Stats_2018'>HOU - James Harden</option><option value='Chris_Paul_Stats_2018'>HOU - Chris Paul</option><option value='Victor_Oladipo_Stats_2018'>IND - Victor Oladipo</option><option value='Lou_Williams_Stats_2018'>LAC - Lou Williams</option><option value='Blake_Griffin_Stats_2018'>LAC - Blake Griffin</option><option value='Brandon_Ingram_Stats_2018'>LAL - Brandon Ingram</option><option value='Giannis_Antetokounmpo_Stats_2018'>MIL - Giannis Antetokounmpo</option><option value='Karl-Anthony_Towns_Stats_2018'>MIN - Karl-Anthony Towns</option><option value='Jimmy_Butler_Stats_2018'>MIN - Jimmy Butler</option><option value='Anthony_Davis_Stats_2018'>NOP - Anthony Davis</option><option value='DeMarcus_Cousins_Stats_2018'>NOP - DeMarcus Cousins</option><option value='Kristaps_Porzingis_Stats_2018'>NYK - Kristaps Porzingis</option><option value='Russell_Westbrook_Stats_2018'>OKC - Russell Westbrook</option><option value='Paul_George_Stats_2018'>OKC - Paul George</option><option value='Joel_Embiid_Stats_2018'>PHI - Joel Embiid</option><option value='Ben_Simmons_Stats_2018'>PHI - Ben Simmons</option><option value='Devin_Booker_Stats_2018'>PHX - Devin Booker</option><option value='Damian_Lillard_Stats_2018'>POR - Damian Lillard</option><option value='Bogdan_Bogdanovic_Stats_2018'>SAC - Bogdan Bogdanovic</option><option value='DeMar_DeRozan_Stats_2018'>TOR - DeMar DeRozan</option><option value='Kyle_Lowry_Stats_2018'>TOR - Kyle Lowry</option><option value='Donovan_Mitchell_Stats_2018'>UTA - Donovan Mitchell</option><option value='Bradley_Beal_Stats_2018'>WAS - Bradley Beal</option>");
        }else if (val == "2017") {
            $(player).html("<option value='Isaiah_Thomas_Stats_2017'>BOS - Isaiah Thomas</option><option value='Jimmy_Butler_Stats_2017'>CHI - Jimmy Butler</option><option value='Kyrie_Irving_Stats_2017'>CLE - Kyrie Irving</option><option value='LeBron_James_Stats_2017'>CLE - LeBron James</option><option value='Nikola_Jokic_Stats_2017'>DEN - Nikola Jokic</option><option value='Stephen_Curry_Stats_2017'>GSW - Stephen Curry</option><option value='Kevin_Durant_Stats_2017'>GSW - Kevin Durant</option><option value='Draymond_Green_Stats_2017'>GSW - Draymond Green</option><option value='Klay_Thompson_Stats_2017'>GSW - Klay Thompson</option><option value='James_Harden_Stats_2017'>HOU - James Harden</option><option value='Paul_George_Stats_2017'>IND - Paul George</option><option value='Chris_Paul_Stats_2017'>LAC - Chris Paul</option><option value='Giannis_Antetokounmpo_Stats_2017'>MIL - Giannis Antetokounmpo</option><option value='DeMarcus_Cousins_Stats_2017'>NOP - DeMarcus Cousins</option><option value='Anthony_Davis_Stats_2017'>NOP - Anthony Davis</option><option value='Russell_Westbrook_Stats_2017'>OKC - Russell Westbrook &#9734</option><option value='Damian_Lillard_Stats_2017'>POR - Damian Lillard</option><option value='Kawhi_Leonard_Stats_2017'>SAS - Kawhi Leonard</option><option value='DeMar_DeRozan_Stats_2017'>TOR - DeMar DeRozan</option><option value='Kyle_Lowry_Stats_2017'>TOR - Kyle Lowry</option><option value='John_Wall_Stats_2017'>WAS - John Wall</option>");
        } else if (val == "2016") {
            $(player).html("<option value='Kyrie_Irving_Stats_2016'>CLE - Kyrie Irving</option><option value='LeBron_James_Stats_2016'>CLE - LeBron James</option><option value='Stephen_Curry_Stats_2016'>GSW - Stephen Curry &#9734</option><option value='Draymond_Green_Stats_2016'>GSW - Draymond Green</option><option value='Klay_Thompson_Stats_2016'>GSW - Klay Thompson</option><option value='James_Harden_Stats_2016'>HOU - James Harden</option><option value='Paul_George_Stats_2016'>IND - Paul George</option><option value='DeAndre_Jordan_Stats_2016'>LAC - DeAndre Jordan</option><option value='Chris_Paul_Stats_2016'>LAC - Chris Paul</option><option value='Anthony_Davis_Stats_2016'>NOP - Anthony Davis</option><option value='Russell_Westbrook_Stats_2016'>OKC - Russell Westbrook</option><option value='Kevin_Durant_Stats_2016'>OKC - Kevin Durant</option><option value='Damian_Lillard_Stats_2016'>POR - Damian Lillard</option><option value='Kawhi_Leonard_Stats_2016'>SAS - Kawhi Leonard</option><option value='DeMar_DeRozan_Stats_2016'>TOR - DeMar DeRozan</option><option value='Kyle_Lowry_Stats_2016'>TOR - Kyle Lowry</option>");
        } else if (val == "2015") {
            $(player).html("<option value='Jimmy_Butler_Stats_2015'>CHI - Jimmy Butler</option><option value='LeBron_James_Stats_2015'>CLE - LeBron James</option><option value='Stephen_Curry_Stats_2015'>GSW - Stephen Curry &#9734</option><option value='Klay_Thompson_Stats_2015'>GSW - Klay Thompson</option><option value='James_Harden_Stats_2015'>HOU - James Harden</option><option value='Chris_Paul_Stats_2015'>LAC - Chris Paul</option><option value='Blake_Griffin_Stats_2015'>LAC - Blake Griffin</option><option value='Marc_Gasol_Stats_2015'>MEM - Marc Gasol</option><option value='Anthony_Davis_Stats_2015'>NOP - Anthony Davis</option><option value='Carmelo_Anthony_Stats_2015'>NYK - Carmelo Anthony</option><option value='Kevin_Durant_Stats_2015'>OKC - Kevin Durant</option><option value='Russell_Westbrook_Stats_2015'>OKC - Russell Westbrook</option><option value='LaMarcus_Aldridge_Stats_2015'>POR - LaMarcus Aldridge</option><option value='Tim_Duncan_Stats_2015'>SAS - Tim Duncan</option><option value='Kawhi_Leonard_Stats_2015'>SAS - Kawhi Leonard</option>");
        }
    });
	/* Copy select options from first drop down to all clones */
	possibleSeasonsLists.forEach(function(season){
		$('#season option').clone().appendTo(season);
		//$(season+' option:selected').removeAttr('selected');
		$(season).append('<option selected disabled hidden value=null>-- Select Season --</option>')
	})
	possiblePlayersLists.forEach(function(player){
		$('#player option').clone().appendTo(player);
		//$(player+' option:selected').removeAttr('selected');
		$(player).append('<option selected disabled hidden value=null>-- Select Season --</option>')
	})

	drawGraph();
	drawScatterplot();
	
	/* Change graph on drop down selection */
	$("#season").on("change", drawGraph);
	$("#player").on("change", drawGraph);
	$("#stat").on("change", drawGraph);
	$("#refineMVP").on("change",drawGraph)
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
	var margin = {top: 20, right: 310, bottom: 50, left: 50},
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
	        .ticks(12)
	}

	// gridlines in y axis function
	function make_y_gridlines() {		
	    return d3.axisLeft(y)
	        .ticks(12)
	}
	$(".addPlayer").click(function (){
		idx = parseInt($(this).attr('id')[0])
		$(possibleDiv[idx]).show();
		if (idx == 0){
			$("#"+idx+"_add").css('visibility','hidden');
		}
		else{
			$("#"+idx+"_add").hide()
		}
	})
	$(".removePlayer").click(function (){
		idx = parseInt($(this).attr('id'))
		//console.log(idx)
		seasonToRemove = ($("#season"+idx)[0].value)
		playerToRemove = ($("#player"+idx)[0].value)

		$('#player'+idx).append('<option selected disabled hidden value=null>-- Select Season --</option>')

		$('#player'+idx).prop("disabled", true);
		$('#season'+idx+' option').prop('selected', function() {
		       return this.defaultSelected;
		});
		//$(possibleDiv[idx-1]).hide();

		lineID = (playerToRemove.replace("_Stats_",""))
		lineID = lineID.replace("_","")

		//svg.selectAll("#"+lineID).remove()

		drawGraph()

	})

	function drawGraph(){
		seasonYear = ($("#season1")[0].value) //This is folder name
		playerYear = ($("#player")[0].value) //This is file 
		statUnderStudy = ($("#stat")[0].value) //Column in file
		statLabel = ($('#stat option:selected').text())
		var mvpLineType = $("#refineMVP")[0].value
		var filesToLoad = ["Data Store/MVPAverage/"+mvpLineType+".csv"]
		var selectionDict = {
			"player":[($("#season")[0].value),($("#player")[0].value)],
			"1player":[($("#season1")[0].value),($("#player1")[0].value)],
			"2player":[($("#season2")[0].value),($("#player2")[0].value)],
			"3player":[($("#season3")[0].value),($("#player3")[0].value)],
			"4player":[($("#season4")[0].value),($("#player4")[0].value)]
		}
		for (var key in selectionDict){
			if (selectionDict[key][0] != "null" && selectionDict[key][1] != "null"){
				if ($.inArray("Data Store/"+selectionDict[key][0]+"/"+selectionDict[key][1]+".csv",filesToLoad) == -1){
					filesToLoad.push("Data Store/"+selectionDict[key][0]+"/"+selectionDict[key][1]+".csv")

				}
			}
		}
		
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
			var colors = ['#FFD700','steelblue','#d62728','purple','orange','darkgreen']
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
				playerMinValue = playerMinValue - (playerMinValue*0.1);
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
		    	//console.log(newID)
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
			    .call(d3.axisBottom(x).ticks(30, "s"));
			
			svg.selectAll(".yaxis").remove()

			// Add the Y Axis
			svg.append("g")
			  	.attr("class", "yaxis")
			  	.transition().duration(500)
			    .call(d3.axisLeft(y).ticks(12,"s").tickFormat(d3.format("")))

			svg.selectAll(".axisLabel").remove()

			//Add Text for Y axis
			svg.append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("class","axisLabel")
			    .attr("y", 0 - margin.left)
			    .attr("x",0 - (height / 2))
			    .attr("dy", "1em")
			    .style("text-anchor", "middle")
			    .text(statLabel);     

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
              .attr('font-family',"Lucida Bright")
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
			    .call(d3.axisLeft(y).ticks(10,"s").tickFormat(d3.format("")))

			
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
			     if(d.Name == "Average MVP - Past 30 Years"){
			     	return 10
			     }else{return 8}
			 	})
			    .attr("cx", function(d) { return x(d.x_stat); })
			    .attr("cy", function(d) { return y(d.y_stat); })

			    .attr("fill", function(d,i) {
			     if(d.Name == "Average MVP - Past 30 Years"){
			     	return "#FFD700"
			     }
			     return color(i); 
			 	} )
			 	.style('stroke', function(d,i) {
			     if(d.Name == "Average MVP - Past 30 Years"){
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
