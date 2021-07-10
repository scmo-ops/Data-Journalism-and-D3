// @TODO: YOUR CODE HERE!

// Def the margins with the window size

var svgWidth = window.innerWidth/1.7;
var svgHeight = window.innerHeight/1.2;

// step 2: define margins and set up initial parameters
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;
var chosenXAxis = 'In poverty (%)';  // axis name 1
var chosenXAxis1 = 'Age (Median)';
var chosenYAxis ='Obese(%)';
var chosenYAxis1 = 'Smokes(%)'; 

///////// THIS UPDATS X AXIS AND X  -SCALE /////////

// Updating x-scale var upon click on axis label

function xScale(hData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(hData, d => d[chosenXAxis]) * 0.8,
        d3.max(hData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
    
    return xLinearScale;
    
}

// Update xAxis var upon clikc on axis label

function renderYAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    return xAxis;
}

///////// THIS UPDATS Y AXIS AND Y-SCALE /////////

// Updating y-scale var upon click on axis label

function yScale(hData, chosenYAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(hData, d => d[chosenYAxis]) * 0.8,
        d3.max(hData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]); //might go wrong
    
    return xLinearScale;
}

// Update yAxis var upon clikc on axis label

function renderYAxes(newYScale, yAxis) {
    var SideAxis = d3.axisBottom(newYScale);
    yAxis.transition()
    .duration(1000)
    .call(SideAxis);
    return yAxis;
}


// Funtion that updates the circles gruop with a transition
// to new circles including the y-axis ¬¬

function renderCircles(circleG, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circleG.transition()
    .duration(1000)
    .attr('cx', d => newXScale(d[chosenXAxis]))
    .attr('cy', d => newYScale(d[chosenYAxis]));
    return circleG;
}

// Tooltip circles for the x and y axis

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    // x axis
    if (chosenXAxis === 'In poverty (%)') {
        var xlabel = 'In poverty (%)';
    }
    else if (chosenXAxis === 'Age (Median)'){
        var xlabel = 'Age (Median)';
    }
    else {
        var xlabel = 'Household (income)';
    }
    // y axis
    if (chosenYAxis === 'Obese(%)') {
        var ylabel = 'Obese(%)';
    }
    else if (chosenXAxis === 'Smokes(%)'){
        var ylabel = 'Smokes(%)';
    }
    else {
        var ylabel = 'Lacks Healthcare (%)';
    }

    // The actual tooltip

    var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([80, -60])
    .html(function(d) {
        if (chosenXAxis === "Age (Median)") {
            // Display Age
            return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
            } else if (chosenXAxis !== "In poverty (%)" && chosenXAxis !== "Age (Median)") {
            // Display Income
            return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
            } else {
            // Display Poverty's percentage
            return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
            }      
    });

    circlesGroup.call(toolTip);

    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data, this);
    })
    .on('mouseout', function(data) {
        toolTip.hide(data);
    });
    textGroup
    .on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });

    return circlesGroup;

}

// Read csv file and run the graphs
function makeResponsive() {
    var svgArea = d3.select("#scatter").select('svg');
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    var svg= d3.select('#scatter')
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
    
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, 
        ${margin.top})`);
    d3.csv('../data/data.csv').then(function(demoData, err) {
        if (err) throw err;
        // Parse data.
        demoData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = data.obesity;
    });

    ///// SET THE CHART DATA FOR X AND Y //////
    
    // linear scales
    var xLinearScale = xScale(demoData, chosenXAxis, width);
    var yLinearScale = yScale(demoData, chosenYAxis, height);

    // Funtions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var sideAxis = d3.axisLeft(yLinearScale);

    //Append the y axis
    var yAxis = chartGroup.append('g')
    .call(sideAxis);

    //Append the x axis
    var xAxis = chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

    // Circle data binding
    var circlesGroup = chartGroup.sellectAll('circle')
    .data(demoData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d[chosenXAxis]))
    .attr('cy', d => yLinearScale(d[chosenYAxis]))
    .attr('r', 15)
    .classed('stateCircle', true);


}
    
// step 5: set up the scales


// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);