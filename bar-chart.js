function createBar(svgSelector){
			var margin = {top: 50, right: 100, bottom: 10, left: 150},
			    width = 800 - margin.right - margin.left,
			    height = 600 - margin.top - margin.bottom;

			var format = d3.format(".1%");

			var x = d3.scaleLinear()
			    .range([0, width]);

			var y = d3.scaleBand()
			    .rangeRound([0, height])
			    .padding(0.15);

			var xAxis = d3.axisTop()
			    .scale(x)
			    //.tickSize(-height - margin.bottom)
			    .tickFormat((d) => d + '%');

			var svg = d3.select(svgSelector)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0, -22)");

			svg.append("g")
			    .attr("class", "y axis")
			  .append("line")
			    .attr("class", "domain")
			    .attr("y2", height);

			/*d3.csv('interactiveDummy.csv')
			.then(function(data){
				globalData = data;

				//update menus

			});*/

			function getMaxDomainVal(arr){

				var max = parseFloat(d3.max(arr, function(d){return d.Value}));

				if (100 - max < 20){
					return 100;
				}else if(100 - max < 50){
					return max + 20;
				}else{
					return max + 40;
				}

			}

			var colors = ['#C5CAE9','#9FA8DA','#7986CB','#5C6BC0','#3F51B5','#3949AB','#303F9F','#283593','#1A237E'].reverse();

			function draw(data,cType,category){

				data = data
					.filter((d) =>d['Category type'] === cType)
					//.filter((d) =>d.Category === category);

				var domainArr = data.map(function(d) { return d.Category; });

				for(var i = domainArr.length; i < 10; i++){
					domainArr.push(i);
				}

				y.domain(domainArr);

				x.domain([0,getMaxDomainVal(data)]);

				var bar = svg.selectAll(".bar")
			      .data(data, function(d) { return d.Category; });

			    var barEnter = bar
			    	.enter()
			    	.insert("g")
				      .attr("class", "bar")
				      .attr("transform", function(d) { return "translate(0," + (y(d.Category) + 200) + ")"; })
				      .style("fill-opacity", 0);

				barEnter.append("rect")
			      .attr("width", function(d){return x(d.Value)})
			      .attr("height", y.bandwidth())
			      .attr('rx', 5);
			      //.attr('fill', 'url(#lgrad)')
			      /*.attr('fill', function(d,i){
			      	return colors[i];
			      })*/

			    barEnter.append("text")
			      .attr("class", "label")
			      .attr("x", -10)
			      .attr("y", y.bandwidth() / 2)
			      .attr("dy", ".35em")
			      .attr("text-anchor", "end")
			      .text(function(d) { return d.Category; });

			    barEnter.append("text")
			      	.attr("class", "value")
			      	.attr("x", function(d) { return x(d.Value) - 15; })
			      	.attr("y", y.bandwidth() / 2)
			      	.attr("dy", ".35em")
			      	.attr("text-anchor", "end");

			    var barUpdate = bar.merge(barEnter);
			    barUpdate
			    	.transition()
			    	.duration(750)
			      	.attr("transform", function(d) { return "translate(0," + (d.y0 = y(d.Category)) + ")"; })
			      	.style("fill-opacity", 1);

			  	barUpdate.select("rect")
			      	.attr("width", function(d) { return x(d.Value); })
							.style("fill", "#1E88E5");

			  	barUpdate.select(".value")
			      	.attr("x", function(d) { return x(d.Value) - 15; })
			      	.text(function(d) { return d.Value + '%'; })
			      	.attr('fill', '#fff');

			    var barExit = bar.exit();
				barExit.transition()
					.duration(750)
					.attr("transform", function(d) { return "translate(0," + (d.y0 + height) + ")"; })
					.style("fill-opacity", 0)
					.remove();

				d3.transition(svg)
					.select(".x.axis")
					.duration(750)
	      			.call(xAxis);
			}

			return draw;
		}
