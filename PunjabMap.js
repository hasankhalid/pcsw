// paprameters for Punjab map
let width = 145, height = 175;
let projection = d3.geoMercator()
    .center([89.70, 24.80])
    .scale([150 * 9]);

// defining the paths for the maps
let path = d3.geoPath().projection(projection);

// color scale for the choropleth map
let scaleCol = d3.scaleLinear()
  .domain([0, 100])
  .range(["white", "green"]);


// defining the map svg with the class "map_in_a_box"
let svg = d3.selectAll(".mapContain")
            .append('svg')
            .style("width", '360px')
            .style("height", '434px')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .classed("map_in_a_box", "true");

// queueing async shit
d3.queue()
   .defer(d3.csv, 'testInteract.csv')
   .defer(d3.json, 'PunjabDist.topojson')
   .await(drawPunjabChor)

function getValue(dataset, district){
  return +(dataset.filter(d => d.Category == district)[0].Value);
}

function getRound(n, nDigits = 1){
  return Math.round(n * (10**nDigits)) / (10**nDigits)
}

let filtData

function drawPunjabChor(error, testdata, topology){
  // get data for a particular indicator and filter just districts
  console.log(JSON.stringify(testdata));
  filtData = testdata.filter(d => d.IndicatorCode == 2.4 & d[["Category type"]] == "Districts");

  // draw the paths for Punjab
  svg.selectAll("path")
        .data(topojson.feature(topology,
          topology.objects.PunjabDist).features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("opacity", 1)
        .style("stroke", "grey")
        .style("stroke-width", .1)
        .style('fill', d => {
           let District = districtMappingObj[[d.properties.districts]];
           return scaleCol(getValue(filtData, District));
        })
        .on('mouseover', function(d, i){
          let selection = d3.select(this);
          selection.raise()
          selection.style('stroke', 'black')
                  .style("stroke-width", .6)
                  .append('title')
                  .text(d => {
                    let District = districtMappingObj[[d.properties.districts]]
                    return `${District} ${getRound(getValue(filtData ,District))}`
                  })
        })
        .on('mouseout', function(d, i){
          d3.select(this)
            .style('stroke-width', .1)
            .style('stroke', 'grey')
          d3.select(this).select('title').remove();
        })
}


function updatePunjab(indicatorCode){
  d3.queue()
     .defer(d3.csv, 'testInteract.csv')
     .await(updatePunjabChor);

  function updatePunjabChor(error, updatedData){
    filtData = testdata.filter(d => d.IndicatorCode == indicatorCode & d[["Category type"]] == "Districts");
    svg.selectAll("path")
      .transition()
      .style('fill', d => {
         let District = districtMappingObj[[d.properties.districts]];
         console.log(District)
         console.log(+(filtData.filter(d => d.Category == District)[0].Value));
         return scaleCol(getValue(filtData, District));
      })

  }

}
