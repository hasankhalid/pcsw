async function initMapCreator(){

	async function getAllData(){
		var res = await Promise.all([
				d3.csv('ISAPSKohat1718.csv'),
				d3.csv('UCLocs.csv'),
				d3.json('Kohat.geojson'),
				d3.json('KohatTehsils.geojson')
			]);

		return {
			indicatorData : res[0],
			ucLocs : res[1],
			kohatGeoJSON : res[2],
			kohatTehsilsGeoJSON : res[3]
		};
	}

	function fixData(indicatorData, ucLocs){
		/*var ucObj = {};
		indicatorData.forEach((d)=>{ucObj[d['UC Name']] = d;});*/

		var ucLocsObj = {};
		ucLocs.forEach((d)=>{ucLocsObj[d['UC Name']] = d});

		indicatorData.forEach((d)=>{
			d.loc = [ucLocsObj[d['UC Name']].X,ucLocsObj[d['UC Name']].Y];
		});

		return indicatorData;
	}

	var mapData = await getAllData();

	//remove duplicates and add xy coordinates to indicator data

	console.log(mapData);
	mapData.indicators = Object.keys(mapData.indicatorData[0]);

	//remove non-indicators
	mapData.indicators.splice(mapData.indicators.indexOf('UC Name'),1);
	mapData.indicators.splice(mapData.indicators.indexOf('Tehsil'),1);
	mapData.indicators.splice(mapData.indicators.indexOf('District'),1);
	mapData.indicators.splice(mapData.indicators.indexOf('Year'),1);

	mapData.indicatorData = fixData(mapData.indicatorData, mapData.ucLocs);
	mapData.indicatorData2018 = mapData.indicatorData.filter((d)=>d.Year === '2018');
	mapData.indicatorData2017 = mapData.indicatorData.filter((d)=>d.Year === '2017');


	//var geoGenerator;

	//ucLocs;
	var bosNames = {"Attock":"Attock","Bahawalnagar":"Bahawalnagar","Bahawalpur":"Bahawalpur","Bhakkar":"Bhakkar","Chakwal":"Chakwal","Chiniot":"Chiniot","Dera Ghazi Khan":"DG Khan","Faisalabad":"Faisalabad","Gujranwala":"Gujranwala","Gujrat":"Gujrat","Hafizabad":"Hafizabad","Jhang":"Jhang","Jhelum":"Jhelum","Kasur":"Kasur","Khanewal":"Khanewal","Khushab":"Khushab","Lahore":"Lahore","Layyah":"Layyah","Lodhran":"Lodhran","Mandi Bahauddin":"Mandi Bahauddin","Mianwali":"Mianwali","Multan":"Multan","Muzaffargarh":"Muzaffargarh","Nankana Sahib":"Nankana Sahib","Narowal":"Narowal","Okara":"Okara","Pakpattan":"Pakpattan","Rahim Yar Khan":"RY Khan","Rajanpur":"Rajanpur","Rawalpindi":"Rawalpindi","Sahiwal":"Sahiwal","Sargodha":"Sargodha","Sheikhupura":"Sheikhupura","Sialkot":"Sialkot","Toba Tek Singh":"TT Singh","Vehari":"Vehari"};

	async function createMap(selector, indicatorData, geoJSON, scaleArr, cIndicator, rIndicator){

		//remove duplicates
		//punjabOutline = await d3.json('Kohat.geojson');

		/*data.features.forEach((d)=>{
			d.properties.districts = bosNames[d.properties.districts];
		});*/

		//create punjab map
		var projection = d3.geoMercator().
			fitExtent([[0, 0], [700, 700]], geoJSON);

		var geoGenerator = d3.geoPath()
			.projection(projection);

		var svg = d3.select(selector)
				.attr('viewBox', '0 0 800 800');

		//create outline
		/*var oProjection = d3.geoMercator().
			fitExtent([[0, 0], [700, 700]], punjabOutline);

		var oGeoGenerator = d3.geoPath()
			.projection(oProjection);

		/*var gOutline = svg.append('g')
				.attr('class', 'g-outline')
			.selectAll('path')
		    .data(punjabOutline.features)
		    .enter()
		    .append('path')
		    	.attr('d', oGeoGenerator);*/


		var gMap = svg
			.append('g')
			.attr('class', 'g-map')
			.style('fill', '#757575');

		/*gMap.selectAll('path')
		    .data(data.features)
		    .enter()
		    .append('path')
		    	.attr('d', geoGenerator)
		    	.attr('stroke-dasharray', function(){
		    		return `${this.getTotalLength()},${this.getTotalLength()}`;
		    	})
		    	.attr('stroke-dashoffset', function(){
		    		return this.getTotalLength();
		    	});*/


		await new Promise(function(resolve){
			gMap.selectAll('path')
			    .data(geoJSON.features)
			    .enter()
			    .append('path')
			    	.attr('d', geoGenerator)
			    	.attr('stroke-dasharray', function(){
			    		return `${this.getTotalLength()},${this.getTotalLength()}`;
			    	})
			    	.attr('stroke-dashoffset', function(){
			    		return this.getTotalLength();
			    	})
		    .transition()
		    	.duration(500)
		    	.attr('stroke-dashoffset', 0)
		    	.call(allTransitionEnd, resolve);
		});
		//create circles
		//var centroids = getCentroids(gMap);

		indicatorData.forEach((d)=>{
			d.centroid = getCentroid(d.loc, geoGenerator);
		});

		var gCircles = svg.append('g')
				.attr('class', 'g-circles');

		//circle Scale
		createCircles(gCircles, indicatorData, cIndicator, rIndicator, scaleArr);
	}

	function allTransitionEnd(transition, callback) {
	    if (typeof callback !== "function") throw new Error("Wrong callback in endall");
	    if (transition.size() === 0) { callback() }
	    var n = 0;
	    transition
	        .each(function() { ++n; })
	        .on("end", function() {
	         	if (!--n) callback();
	     	});
	 }

	var currentIdicators = {};

	async function createCircles(g, indicatorData, rIndicator, cIndicator, scaleArr){

		currentIdicators.cIndicator = cIndicator;
		currentIdicators.rIndicator = rIndicator;

		await new Promise(function(resolve){
			g.selectAll('circle')
			.transition()
			.duration(300)
			.delay((d,i)=>i * 5 * Math.random())
			.style('opacity', 0)
			.attr('radius', 0)
			.call(allTransitionEnd, resolve)
			.remove();
		});

		var rScale = d3.scaleSqrt().domain([
				0,
				parseFloat(d3.max(scaleArr,(d)=>parseFloat(d[rIndicator])))
			]).range([0,20]);

		var colorScale = d3.scaleLinear().domain([
				parseFloat(d3.min(scaleArr,(d)=>parseFloat(d[cIndicator]))),
				parseFloat(d3.max(scaleArr,(d)=>parseFloat(d[cIndicator])))
			])
    		.range(['#FFFFFF', '#D4E157']);


		forceSim(indicatorData, rScale, rIndicator);

		g
			.selectAll('circle')
			.data(indicatorData)
			.enter()
			.append('circle')
			.each((d,i) =>{d.id = i;})
			.attr('cx', (d)=>parseFloat(d.x))
			.attr('cy', (d)=>parseFloat(d.y))
			.attr('r', 0)
			.on('mouseover', function(d){
				addDistrictHighlight.call(this,d, g);
			})
			.on('mouseout', function(d){
				removeDistrictHighlight(d,g);
				removeTooltip(d);
			})
			.on('mousemove', function(d){
				createTooltip(d, d3.event);
			})
			.attr('fill', (d)=>colorScale(d[cIndicator]))
			.style('opacity', 0)
			.transition()
			.duration(500)
			.delay((d,i)=>i * 5 * Math.random())
			.style('opacity', 0.7)
			.attr('r', function(d){
				var r = rScale(d[rIndicator]);
				d.originalRadius = r;
				return r;
			});
	}

	function addDistrictHighlight(d, circleG){

		var selectedCircle = this;

		/*d3.selectAll('.g-map').selectAll('path').filter((e)=>e.properties.districts === d.District).transition().duration(400).attr('stroke-dashoffset',0);*/

		circleG.selectAll('.g-circles circle')
			.filter((d)=>!d.filtered)
			.transition()
			.duration(300)
			.attr('r', function(d){
				return this === selectedCircle ? d.originalRadius * 1.2: d.originalRadius * 0.9;
			})
			.style('opacity', function(d){
				return this === selectedCircle ? 0.8: 0.4;
			});
	}

	function removeDistrictHighlight(d, circleG){
		/*d3.selectAll('.g-map').selectAll('path').filter((e)=>e.properties.districts === d.District).transition().duration(400).attr('stroke-dashoffset',function(){return this.getTotalLength()});*/

		circleG.selectAll('.g-circles circle')
			.filter((d)=>!d.filtered)
			.transition()
			.duration(300)
			.attr('r', function(d){
				return d.originalRadius;
			})
			.style('opacity', 0.7);
	}

	function getCentroid(coords, geoGenerator){
		var geoJsonPoint = {
		    type: "Point",
		    coordinates: coords,
		};

		return geoGenerator.centroid(geoJsonPoint);
	}

	function forceSim(a,scale,sInd){
		var simulation = d3.forceSimulation(a)
		  //.force('charge', d3.forceManyBody().strength(s))
		  .force('x', d3.forceX(function(d){
			return d.centroid[0]}))
			.force('y', d3.forceY(function(d){
			return d.centroid[1]}))
		  .force('collision', d3.forceCollide().radius(function(d) {
		    return scale(d[sInd]) + 2;
		  }))
		  .stop();

		  for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
		    	simulation.tick();
		  }
	}

	var filterIndicators = {};

	function addCircleFilter(indicator, indicatorData,minVal, maxVal){
		minVal = minVal || parseFloat(d3.min(indicatorData, (d)=>d[indicator]));
		maxVal = maxVal || parseFloat(d3.max(indicatorData, (d)=>d[indicator]));

		filterIndicators[indicator] = [minVal, maxVal];

		d3.selectAll('.g-circles circle')
			.filter((d)=>!d.filtered && parseFloat(d[indicator]) >= minVal && parseFloat(d[indicator]) <= maxVal)
			.each((d)=>{
				d.filtered = true;
			})
			.transition()
			.duration(400)
			.delay((d,i)=> i * 5 * Math.random())
			.attr('r', 0)
			.style('opacity', 0);
	}

	function removeCircleFilter(indicator){

		if(Object.keys(filterIndicators).length === 0){
			return;
		}

		if(!filterIndicators[indicator]){
			return;
		}

		var filtered = d3.selectAll('.g-circles circle')
			.filter((d)=>d.filtered);

		filtered = unfilterSelection(filtered, indicator);

		filtered.each((d)=>{
				d.filtered  = false;
			})
			.transition()
			.duration(400)
			.delay((d,i)=> i * 5 * Math.random())
			.attr('r', (d)=>d.originalRadius)
			.style('opacity', 0.7);
	}

	function unfilterSelection(selection, indicator){

		selection = selection.filter((d)=>parseFloat(d[indicator]) >= filterIndicators[indicator][0] && parseFloat(d[indicator]) <= filterIndicators[indicator][1]);

		delete filterIndicators[indicator];

		for(var i in filterIndicators){
			var filterConditions = filterIndicators[i];
			selection = selection.filter((d)=>!(parseFloat(d[i]) >= filterConditions[0] && parseFloat(d[i]) <= filterConditions[1]));
		}

		return selection;
	}

	function createTooltip(d, event){
		window.ev = event;
		var tooltipElement = document.getElementById('circles-tooltip' + d.id);
		if(!tooltipElement){

			var tooltip = d3.select('body')
				.append('div')
					.attr('id', 'circles-tooltip' + d.id)
					.classed('c-tooltip', true)
					.style('opacity', 0);

			tooltip.append('div')
					.classed('c-tooltip-header', true)
					.html(`<h1 style="font-size: 16px; margin-bottom: 0px; font-weight: 400;">Union Council : ${d['UC Name']}</h1>`);

			tooltip.append('div')
					.classed('c-tooltip-body', true)
					.html(`<div class="indicatorTool"><span class="indicatorHeading">${currentIdicators.rIndicator}</span><span class="indicatorValue"> ${d[currentIdicators.rIndicator]}</span></div><div class="indicatorTool"><span class="indicatorHeading">${currentIdicators.cIndicator}</span><span class="indicatorValue"> ${d[currentIdicators.cIndicator]}</span></div>`);

			var finalPos = getToolTipPosition(event, tooltip.node());

			tooltip.style('left', finalPos[0] + 'px')
					.style('top', finalPos[1] + 'px');

			tooltip.transition()
					.duration(300)
					.style('opacity', 1);
		}else{
			var finalPos = getToolTipPosition(event, tooltipElement);

			tooltipElement.style.left = finalPos[0] + 'px';
			tooltipElement.style.top = finalPos[1] + 'px';
		}
	}

	function getToolTipPosition(event, tooltip){
		var x = event.clientX,
			y = event.clientY,
			windowWidth = window.innerWidth,
			windowHeight = window.innerHeight,
			elemWidth = tooltip.offsetWidth,
			elemHeight = tooltip.offsetHeight,
			offset = 20;

		var finalX, finalY;

		if(x + elemWidth  + offset < windowWidth){
			finalX = x + offset;
		}else{
			finalX = x - elemWidth - offset;
		}

		if(y + elemHeight  + offset < windowHeight){
			finalY = y + offset;
		}else{
			finalY = y - elemHeight - offset;
		}

		return [finalX, finalY];
	}

	function removeTooltip(d){
		var tooltip = document.getElementById('circles-tooltip' + d.id);

		if(tooltip){
			d3.select(tooltip)
				.transition()
				.duration(100)
				.style('opacity', 0)
				.remove();
		}
	}

	return {
		createMap : createMap,
		createCircles : function(svgSelector, indicatorData, rIndicator, cIndicator, scaleArr){
			var g = d3.select(svgSelector + ' .g-circles');
			return createCircles(g, indicatorData, rIndicator, cIndicator, scaleArr)
		},
		mapData : mapData
	};
}
