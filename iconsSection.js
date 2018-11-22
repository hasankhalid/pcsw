var data = [
  {
    categoryData: [{category: "Lowest", value: 71.8},{category: "Second", value: 85.3},{category: "Middle", value: 88.8},{category: "Fourth", value: 93.0},{category: "Highest", value: 96.3}],
    title: "Across Wealth Quintile",
    className: "WQTL"
  },
  {
    categoryData: [{category: "Preschool", value: 80.8}, {category: "Primary", value: 89.0}, {category: "Middle", value: 91.5}, {category: "Matric", value: 93.8},{category: "Higher", value: 96.4}],
    title: "Across Mother's education",
    className: "MOTH_EDUC"
  }
];

var mainTitle = "";

var drawBarChart = createBar('#bar-chart');
createCategoryChart(data, mainTitle);



 function createCategoryChart(visData, titleText) {
   d3.csv("./testInteract.csv", function(data) {
     globalData = data;
     drawBarChart(data, 'Age ', 'Age')
     data = data.filter(function(d) {
       return (d['IndicatorCode'] === '2.4')
     })
     data = data.filter(function(d){
       return (d['Category type'] != 'Punjab')
    })
    data = data.filter(function(d){
      return (d['Category type'] != 'Districts')
   })
     console.log(data);
     gdata= data;
     var fixedData = {};
     for(var i  = 0; i < data.length; i++){
       var d = data[i];

       if(!fixedData[d['Category type']]){
         fixedData[d['Category type']] = {
           title : d['Category type'],
           className : 'abc'
         }
       }

       var addedObj = fixedData[d['Category type']];
       addedObj.categoryData = addedObj.categoryData || [];
       addedObj.categoryData.push({
         category : d.Category,
         value : d.Value
       })
     }

     fixedData = Object.values(fixedData);
     for (count = 0; count < fixedData.length; count++){
       plot(fixedData[count].categoryData, fixedData[count].title, fixedData[count].className);
     }
   })



   // defining the chart/ title div
   var title_text = titleText;

   var title = d3.select(".categoryVisContain")
                 .append("div")
                 .attr("id", "title")
                 title.append("text")
                 .text(title_text)
                 .style("font-size", "17px");
 }

 function plot(data, category_label, class_name){
   var sizeScale = d3.scaleLinear()
                     .domain([50, 100])
                     .range([0.425, 0.85]);

   var svg = d3.select(".categoryVisContain")
               .append("div")
               .classed("whole-strip", true)
               .classed(class_name, true);

   var disagg_type = svg.append("div")
                         .classed("dissagg-type", true)
                         .classed(class_name, true)
                         //.style("display", "flex")
                         .style("align-items", "center")
                         .style("font-size", "14px")
                         .style("font-weight", "600")
                         .style("padding-top", "12px")
                         .style("color", '#616161')
                         .style("width","313px");

   // adding text to the disagg type
   disagg_type.append("text")
               .text(category_label);



   // parent block within div (contains the pictograms and associated data)
   var parent = svg.append("div")
                     .classed("parent-block", true)
                     .classed(class_name, true)
                     .style("display", "flex")
                     .style("align-items","center")
                     .style("justify-content","flex-start");


   var icons = parent.selectAll(".icon-data")
                     .data(data)
                     .enter()
                     .append("div")
                     .attr("class", "icon-data")

   icons.append("div")
         .classed("label-contain", true)
         //.style("text-align", "center")
         //.style("padding-top", "2px")
         .style("text-align", "center")
         .append("text")
         .text(function(d, i){
           return d.category;
         })
         .style("font-size", "0.8em")
         .style('color', '#616161');

   var svgWidth;

   console.log(category_label);

   if (category_label === "Wealth Quantiles") {
     svgWidth = 60;
   }
   else if (category_label === "Area of residence") {
     svgWidth = 78;
   }
   else if (category_label === "Marital Status") {
     svgWidth = 68;
   }
   else if (category_label === "Employment Status") {
     svgWidth = 72;
   }
   else if (category_label === "Disability") {
     svgWidth = 105;
   }
   else if (category_label === "Marital Status") {
     svgWidth = 155;
     console.log('Hello');
   }
   else {
     svgWidth = 55;
   }


   icons.append("div")
       .attr("class", "svg-contain")
       .append("svg")
       .attr("class", "woman-icon")
       .attr("width", svgWidth)
       .attr("height", 64)
       .attr("viewBox", function(d, i ){ // "0 0 64 64"
         return 0 + " " + 0 + " " + 481.119 + " " + 481.119;
       })
       .append("path")
       .attr("d", "M80.13,89.836c6.763,3.805,64.945,31.734,64.945,31.734s-0.016,30.356-0.016,38.571     c0,105.197-43.24,115.07-31.602,123.201c2.563,1.789,33.903,2.949,73.783,3.484c14.103,9.342,32.798,15.057,53.318,15.133     c20.521-0.076,39.216-5.791,53.318-15.133c39.88-0.535,71.221-1.695,73.782-3.484c11.641-8.131-31.6-18.004-31.6-123.201     c0-8.215-0.016-38.57-0.016-38.57s26.062-12.512,45.329-21.928v44.448c-3.342,1.97-5.689,5.452-5.689,9.603     c0,3.674,1.864,6.788,4.583,8.846c0,0-4.832,27.166-6.395,35.154c-1.563,7.988,27.559,6.387,26.247,0     c-1.311-6.387-6.394-35.154-6.394-35.154c2.719-2.058,4.585-5.172,4.585-8.846c0-4.15-2.339-7.633-5.679-9.603V94.104     c4.084-2.029,7.104-3.563,8.355-4.268c6.763-3.807,7.763-9.605-1.862-14.318C360.155,56.442,260.8,7.817,250.976,3.131     C246.877,1.178,243.474,0.268,240.56,0c-2.914,0.268-6.318,1.178-10.416,3.131c-9.824,4.686-109.18,53.311-148.151,72.387     C72.368,80.231,73.368,86.03,80.13,89.836z")

   //d3.select("body")
   svg.selectAll(".woman-icon")
       .append("path")
       // .attr("d", "M53.402 52.363c-1.757 0.504-3.553-0.383-4.020-1.991l-6.006-20.976-2.931-0.004 9.604 33.468h-35.78l9.604-33.468-2.935 0.004-6.009 20.976c-0.46 1.609-2.258 2.495-4.013 1.991-1.759-0.504-2.868-2.042-2.278-4.051l6.181-21.52c2.469-8.603 9.668-8.333 9.668-8.333h15.344c0 0 7.2-0.27 9.671 8.333l6.176 21.52c0.589 2.009-0.52 3.547-2.277 4.051zM32.206 33.291c-5.319 0-9.63 4.309-9.63 9.627 0 4.832 3.56 8.835 8.203 9.524v2.641h-2.897v2.883h2.897v2.894h2.882v-2.894h2.895v-2.883h-2.895v-2.645c4.632-0.7 8.172-4.698 8.172-9.52 0-5.318-4.307-9.627-9.626-9.627zM32.157 49.506c-3.71 0-6.716-3.008-6.716-6.718 0-3.708 3.006-6.718 6.716-6.718 3.713 0 6.717 3.010 6.717 6.718 0.001 3.71-3.005 6.718-6.717 6.718z")
       .attr("d", "M353.227,343.084c-15.685-5.656-42.989-21.961-47.666-24.477c-1.213-0.705-2.616-1.117-4.121-1.117     c-3.282,0-6.105,1.928-7.423,4.715c-12.888,21.572-36.735,84.145-53.457,85.754c-16.722-1.609-40.57-64.182-53.457-85.754     c-1.316-2.787-4.14-4.715-7.423-4.715c-1.504,0-2.908,0.412-4.121,1.117c-4.677,2.516-31.981,18.82-47.666,24.477     c-52.65,18.984-76.33,38.346-76.33,51.547c0,13.188,0,86.488,0,86.488H240.56h188.997c0,0,0-73.301,0-86.488     C429.557,381.43,405.877,362.069,353.227,343.084z")

   //d3.select("body")
   svg.selectAll(".icon-data")
       .selectAll(".woman-icon")
       .attr("transform", function(d, i){
         //return "translate(" + 64*i + "," + (64 - sizeScale(d.value) * 64)/2 + ")" + "scale(" + sizeScale(d.value) + ")" ;
         return "translate(" + 64*i + ",0)" + "scale(" + sizeScale(d.value) + ")" ;
       });

   //d3.select("body")
   svg.selectAll(".icon-data")
       .append("div")
       .classed("text-contain", true)
       .style("text-align", "center")
       .style("padding-top", "2px")
       .append("text")
       .text(function(d, i){
         return Math.round(d.value * 100) / 100 + "%";
       })
       .style('color', '#616161');
 }




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// min max has been hard coded, get this from the data itself
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
