// @TODO: YOUR CODE HERE!

// Def the margins with the window size

var svgWidth = 900;
var svgHeight = 360;

// step 2: define margins and set up initial parameters
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// step 3: importing the data and run everything
var pizzasEatenByMonth = [15, 5, 25, 18, 12, 22, 0, 4, 15, 10, 21, 2];

// step 4: append svg and group 
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "hair_length";  // axis name

// step 5: set up the scales
var xScale = d3.scaleLinear()
  .domain([0, pizzasEatenByMonth.length])
  .range([0, width]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(pizzasEatenByMonth)])
  .range([height, 0]);

// line generator
var line = d3.line()
  .x((d, i) => xScale(i))
  .y(d => yScale(d));

// create path
chartGroup.append("path")
  .attr("d", line(pizzasEatenByMonth))
  .attr("fill", "none")
  .attr("stroke", "green");

// append circles to data points
var circlesGroup = chartGroup.selectAll("circle")
  .data(pizzasEatenByMonth)
  .enter()
  .append("circle")
  .attr("r", "10")
  .attr("fill", "red");

// Event listeners with transitions
circlesGroup.on("mouseover", function() {
  d3.select(this)
    .transition()
    .duration(1000)
    .attr("r", 20)
    .attr("fill", "lightblue");
})
  .on("mouseout", function() {
    d3.select(this)
      .transition()
      .duration(1000)
      .attr("r", 10)
      .attr("fill", "red");
  });

// transition on page load
chartGroup.selectAll("circle")
  .transition()
  .duration(1000)
  .attr("cx", (d, i) => xScale(i))
  .attr("cy", d => yScale(d));