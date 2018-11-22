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

var mainTitle = "Post-natal Health checks for newborns";

createCategoryChart(data, mainTitle);



 function createCategoryChart(visData, titleText) {
   d3.csv("./data.csv", function(data) {
     data = data.filter(function(d){
       return (d['Category type'] != 'Punjab')
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

   icons.append("div")
       .attr("class", "svg-contain")
       .append("svg")
       .attr("class", "woman-icon")
       .attr("width", 64)
       .attr("height", 64)
       .attr("viewBox", function(d, i ){ // "0 0 64 64"
         return 0 + " " + 0 + " " + 31.8 + " " + 31.8;
       })
       .append("path")
       .attr("d", "M16.211,8.913c2.38,0,4.308-1.996,4.308-4.454C20.519,1.996,18.591,0,16.211,0c-2.382,0-4.314,1.996-4.314,4.459C11.897,6.917,13.829,8.913,16.211,8.913z")

   //d3.select("body")
   svg.selectAll(".woman-icon")
       .append("path")
       // .attr("d", "M53.402 52.363c-1.757 0.504-3.553-0.383-4.020-1.991l-6.006-20.976-2.931-0.004 9.604 33.468h-35.78l9.604-33.468-2.935 0.004-6.009 20.976c-0.46 1.609-2.258 2.495-4.013 1.991-1.759-0.504-2.868-2.042-2.278-4.051l6.181-21.52c2.469-8.603 9.668-8.333 9.668-8.333h15.344c0 0 7.2-0.27 9.671 8.333l6.176 21.52c0.589 2.009-0.52 3.547-2.277 4.051zM32.206 33.291c-5.319 0-9.63 4.309-9.63 9.627 0 4.832 3.56 8.835 8.203 9.524v2.641h-2.897v2.883h2.897v2.894h2.882v-2.894h2.895v-2.883h-2.895v-2.645c4.632-0.7 8.172-4.698 8.172-9.52 0-5.318-4.307-9.627-9.626-9.627zM32.157 49.506c-3.71 0-6.716-3.008-6.716-6.718 0-3.708 3.006-6.718 6.716-6.718 3.713 0 6.717 3.010 6.717 6.718 0.001 3.71-3.005 6.718-6.717 6.718z")
       .attr("d", "M23.855,12.692c-0.214-0.65-1.436-2.621-4.752-2.639l-6.491,0.017c-3.219-0.18-4.504,1.722-4.705,2.565    c0,0-2.174,6.941-1.801,8.549c0.231,0.998,1.963,2.219,3.807,3.127l-2.456,7.483h17.318l-2.389-7.745    c1.646-0.871,3.092-1.958,3.301-2.865C26.065,19.557,23.855,12.692,23.855,12.692z M13.307,20.341    c-0.301,0.134-0.634,0.211-0.983,0.211c-1.354,0-2.45-1.114-2.45-2.487s1.097-2.486,2.45-2.486c1.329,0,2.421,1.076,2.457,2.418    c0.422-0.303,0.854-0.445,1.178-0.504c0,0.002,0,0.004,0,0.007c0.487-0.093,0.865,0,0.865,0c1.634,0.362,5.245,1.964,5.245,1.964    s-1.938,2.4-5.458,2.385c-0.092,0-0.182-0.002-0.267-0.006h-0.001c-0.324-0.008-0.615-0.029-0.877-0.061    C13.804,21.586,13.328,20.966,13.307,20.341z")

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
         return d.value + "%";
       })
 }




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// min max has been hard coded, get this from the data itself
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
