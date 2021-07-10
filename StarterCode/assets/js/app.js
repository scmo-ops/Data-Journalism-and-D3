// @TODO: YOUR CODE HERE!
// Make the program responsive
function makeResponsive() {

    // Def the margins with the window size

var svgWidth = window.innerWidth/1.7;
var svgHeight = window.innerHeight/1.2;

// step 2: define margins and set up initial parameters
var margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 100
  };

var height = svgHeight - margin.top - margin.bottom;
var witdh = svgWidth - margin.left - margin.right;
var currentXaxis = 'poverty';
var currentYaxis ='healthcare'; 

///////// THIS UPDATS X AXIS AND X  -SCALE /////////

// Updating x-scale var upon click on axis label

function xScale(data, currentXaxis, width) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[currentXaxis]) * .8,
            d3.max(data, d => d[currentXaxis]) * 1.1])
        .range([0, width]);
    return xLinearScale;

}

// Update xAxis var upon clikc on axis label

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    return xAxis;
}
// Update y label var upon click on axis label
function yScale(data, currentYaxis, height) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[currentYaxis]) * .8,
            d3.max(data, d => d[currentYaxis]) * 1.2])
        .range([height, 0]);
    return yLinearScale;
}
// Update yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// Funtion that updates the circles gruop with a transition
// to new circles including the y-axis ¬¬

function renderCircles(circlesG, newXScale, newYScale, currentXaxis, currentYaxis) {
    circlesG.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[currentXaxis]))
        .attr('cy', d => newYScale(d[currentYaxis]));
    return circlesG;
}
// Updates circle text
function renderText(circlesTGroup, newXScale, newYScale, currentXaxis, currentYaxis) {
    circlesTGroup.transition()
        .duration(1000)
        .attr('x', d => newXScale(d[currentXaxis]))
        .attr('y', d => newYScale(d[currentYaxis]));
    return circlesTGroup;
}

// Tooltip circles for the x and y axis
function updateToolTip(currentXaxis, currentYaxis, circlesG, textGroup) {

    // X axis.

    if (currentXaxis === 'poverty') {
        var xlabel = 'Poverty: ';
    } 
    else if (currentXaxis === 'income') {
        var xlabel = 'Median Income: '
    } 
    else {
        var xlabel = 'Age: '
    }

    // Y axis.
    if (currentYaxis === 'healthcare') {
        var ylabel = 'Lacks Healthcare: ';
    } 
    else if (currentYaxis === 'smokes') {
        var ylabel = 'Smokers: '
    } 
    else {
        var ylabel = 'Obesity: '
    }

    // Tooltip using D3
    var toolTip = d3.tip()
        .offset([120, -60])   ///// maaaaaybeee
        .attr('class', 'd3-tip')
        .html(function(d) {
            if (currentXaxis === 'age') {
                // Display Age
                return (`${d.state}<hr>${xlabel} ${d[currentXaxis]}<br>${ylabel}${d[currentYaxis]}%`);
                } 
                else if (currentXaxis !== 'poverty' && currentXaxis !== 'age') {
                // Display Income 
                return (`${d.state}<hr>${xlabel}$${d[currentXaxis]}<br>${ylabel}${d[currentYaxis]}%`);
                } 
                else {
                // Display Poverty's %
                return (`${d.state}<hr>${xlabel}${d[currentXaxis]}%<br>${ylabel}${d[currentYaxis]}%`);
                }      
        });

    circlesG.call(toolTip);
    
    circlesG.on('mouseover', function(data) {
            toolTip.show(data, this);
        })
        .on('mouseout', function(data) {
            toolTip.hide(data);
        });
    textGroup.on('mouseover', function(data) {
            toolTip.show(data, this);
        })
        .on('mouseout', function(data) {
            toolTip.hide(data);
        });
    return circlesG;
}
    var svgArea = d3.select('#scatter').select('svg');
    // Clear SVG.
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    
    var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

    // Basic append

    var chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    d3.csv('assets/data/data.csv').then(function(demoData, err) {
        if (err) throw err;

        // Data parsing
        demoData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.obesity = data.obesity;
            data.smokes = +data.smokes;
            
        });

        // Linear scales.
        var xLinearScale = xScale(demoData, currentXaxis, witdh);
        var yLinearScale = yScale(demoData, currentYaxis, height);

        // Axises' funtions.
        var bottomAxis =d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        var xAxis = chartGroup
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

        var yAxis = chartGroup
        .append('g')
        .call(leftAxis);

        var circlesG = chartGroup
        .selectAll('circle')
        .data(demoData);
        var elemEnter = circlesG.enter();

        // This creates the circles with a text

        var circle = elemEnter.append('circle')
        .attr('cx', d => xLinearScale(d[currentXaxis]))
        .attr('cy', d => yLinearScale(d[currentYaxis]))
        .attr('r', 15)
        .classed('stateCircle', true);
        var circlesT = elemEnter.append('text')            
        .attr('x', d => xLinearScale(d[currentXaxis]))
        .attr('y', d => yLinearScale(d[currentYaxis]))
        .attr('dy', '.35em') 
        .text(d => d.abbr)
        .classed('stateText', true);

        var circlesG = updateToolTip(currentXaxis, currentYaxis, circle, circlesT);

        // Labels for x chart data

        var xLabelsGroup = chartGroup.append('g')
            .attr('transform', `translate(${witdh / 2}, ${height + 20})`);
        var povertyLabel = xLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('In Poverty (%)');
        var ageLabel = xLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'age')
        .classed('inactive', true)
        .text('Age (Median)');
        var incomeLabel = xLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'income')
        .classed('inactive', true)
        .text('Household Income (Median)');

        // Chart y labels

        var yLabelsGroup = chartGroup.append('g')
        .attr('transform', 'rotate(-90)');
        var healthcareLabel = yLabelsGroup.append('text')
        .attr('x', 0 - (height / 2))
        .attr('y', 40 - margin.left)
        .attr('dy', '1em')
        .attr('value', 'healthcare')
        .classed('active', true)
        .text('Lacks Healthcare (%)');
        var smokesLabel = yLabelsGroup.append('text')
        .attr('x', 0 - (height / 2))
        .attr('y', 20 - margin.left)
        .attr('dy', '1em')
        .attr('value', 'smokes')
        .classed('inactive', true)
        .text('Smokes (%)');
        var obeseLabel = yLabelsGroup.append('text')
        .attr('x', 0 - (height / 2))
        .attr('y', 0 - margin.left)
        .attr('dy', '1em')
        .attr('value', 'obesity')
        .classed('inactive', true)
        .text('Obese (%)');

        // X labels listener

        xLabelsGroup.selectAll('text')
            .on('click', function() {
                currentXaxis = d3.select(this).attr('value');
                xLinearScale = xScale(demoData, currentXaxis, witdh);
                xAxis = renderXAxes(xLinearScale, xAxis);

                // Switch between charts

                if (currentXaxis === 'poverty') {
                    povertyLabel.classed('active', true).classed('inactive', false);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', false).classed('inactive', true);
                } else if (currentXaxis === 'age') {
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', true).classed('inactive', false);
                    incomeLabel.classed('active', false).classed('inactive', true);
                } else {
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', false).classed('inactive', true)
                    incomeLabel.classed('active', true).classed('inactive', false);
                }

                // Update circle values
                circle = renderCircles(circlesG, xLinearScale, yLinearScale, currentXaxis, currentYaxis);
                // Update tool tips
                circlesG = updateToolTip(currentXaxis, currentYaxis, circle, circlesT);
                // Update circle text 
                circlesT = renderText(circlesT, xLinearScale, yLinearScale, currentXaxis, currentYaxis);
            });
        // Y Labels listeners.
        yLabelsGroup.selectAll('text')
            .on('click', function() {
                // Grab selected label.
                currentYaxis = d3.select(this).attr('value');
                // Update yLinearScale.
                yLinearScale = yScale(demoData, currentYaxis, height);
                // Update yAxis.
                yAxis = renderYAxes(yLinearScale, yAxis);

                // Changes classes to change bold text.
                if (currentYaxis === 'healthcare') {
                    healthcareLabel.classed('active', true).classed('inactive', false);
                    smokesLabel.classed('active', false).classed('inactive', true);
                    obeseLabel.classed('active', false).classed('inactive', true);
                } else if (currentYaxis === 'smokes'){
                    healthcareLabel.classed('active', false).classed('inactive', true);
                    smokesLabel.classed('active', true).classed('inactive', false);
                    obeseLabel.classed('active', false).classed('inactive', true);
                } else {
                    healthcareLabel.classed('active', false).classed('inactive', true);
                    smokesLabel.classed('active', false).classed('inactive', true);
                    obeseLabel.classed('active', true).classed('inactive', false);
                }
                // Update circles value
                circle = renderCircles(circlesG, xLinearScale, yLinearScale, currentXaxis, currentYaxis);
                // Update circles text
                circlesT = renderText(circlesT, xLinearScale, yLinearScale, currentXaxis, currentYaxis);
                // Update tooltip
                circlesG = updateToolTip(currentXaxis, currentYaxis, circle, circlesT);
            });
    }).catch(function(err) {
        console.log(err);
    });
}
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on('resize', makeResponsive);