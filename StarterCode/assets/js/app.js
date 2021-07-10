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

var chosenXAxis = 'In poverty (%)';  // axis name 1
var chosenXAxis1 = 'Age (Median)'
var chosenYAxis ='Obese(%)'
var chosenYAxis1 = 'Smokes(%)' 

// Updating x-scale var upon click on axis label

function xScale(hData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(hData, d => d[chosenXAxis]) * 0.8,
        d3.max(hData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
    
    return xLinearScale;
    
}

// Update xAxis var upon clikc on axis label

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;
}

// Funtion that updates the circles gruop with a transition
// to new circles

function renderCircles(circleG, newXScale, chosenXAxis) {
    circlesGroup.transition()
    .duration(1000)
    .attr('cx', d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}

// Tooltip circles
function updateToolTip(chosenXAxis, circlesGroup) {
    var label;
    if (chosenXAxis === 'In poverty (%)') {
        label = 'In poverty (%)';
    }
    else if (chosenXAxis === 'Age (Median)'){
        label = 'Age (Median)';
    }
    else {
        label = 'Household (income)';
    }

    var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data);
    })
    .on('mouse')


}
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