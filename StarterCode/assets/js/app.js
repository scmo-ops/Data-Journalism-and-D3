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
var chosenXAxis = 'poverty';
var chosenYAxis ='healthcare'; 

///////// THIS UPDATS X AXIS AND X  -SCALE /////////

// Updating x-scale var upon click on axis label

function xScale(data, chosenXAxis, width) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .8,
            d3.max(data, d => d[chosenXAxis]) * 1.1])
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
function yScale(data, chosenYAxis, height) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * .8,
            d3.max(data, d => d[chosenYAxis]) * 1.2])
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

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
// Updates circle text
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circletextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return circletextGroup;
}

// Tooltip circles for the x and y axis
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    // X axis.

    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    } 
    else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    } 
    else {
        var xlabel = "Age: "
    }

    // Y axis.
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    } 
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers: "
    } 
    else {
        var ylabel = "Obesity: "
    }

    // Tooltip using D3
    var toolTip = d3.tip()
        .offset([120, -60])   ///// maaaaaybeee
        .attr("class", "d3-tip")
        .html(function(d) {
            if (chosenXAxis === "age") {
                // Display Age
                return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                } 
                else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
                // Display Income 
                return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                } 
                else {
                // Display Poverty's %
                return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
                }      
        });

    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

// Make the program responsive
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
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    d3.csv('assets/data/data.csv').then(function(demoData, err) {
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

    // Append x axis.
    var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    // Append y axis.
    var yAxis = chartGroup.append("g")
    .call(sideAxis);
    // Set data used for circles.
    var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData);
    // Bind data.
    var elemEnter = circlesGroup.enter();
    // Create circles.
    var circle = elemEnter.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed("stateCircle", true);
    // Create circle text.
    var circleText = elemEnter.append("text")            
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", ".35em") 
    .text(d => d.abbr)
    .classed("stateText", true);
    //tool tip update
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);

    /////  LABELS, AND LABEL GROUPS FOR THE X AND Y AXIS /////

    // X axis

    var xLabelGroup= chartGroup.append('g')
    .attr('transform', `translate(${width / 2}, ${height + 20})`);
    var povertyLabel = xLabelGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'In poverty (%)') // uuuh sure
    .classed('active', true)
    .text('In poverty (%)');
    var ageLabel = xLabelGroup.append('text')
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'Age (Median)') // uuuh sure
    .classed('inactive', true)
    .text('Age (Median)');
    var incomeLabel = xLabelGroup.append('text')
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'Household (income)') // uuuh sure
    .classed('inactive', true)
    .text('Household (income)');

    // Y axis

    var yLabelgroup = chartGroup.append('g')
    .attr('transform', 'rotate(-90)');
    var healthcareLabel = yLabelgroup.append('text')
    .attr('x', 0 - (height/2))
    .attr('y', 40 -margin.left)
    .attr('dy', '1em')
    .attr('value', 'Lacks Healthcare (%)')
    .classed('inactive', true)
    .text('Lacks Healthcare (%)');
    var hsmokesLabel = yLabelgroup.append('text')
    .attr('x', 0 - (height/2))
    .attr('y', 20 -margin.left)
    .attr('dy', '1em')
    .attr('value', 'Smokes (%)')
    .classed('inactive', true)
    .text('Smokes (%)');
    var obeseLabel = yLabelgroup.append('text')
    .attr('x', 0 - (height/2))
    .attr('y', 0 -margin.left)
    .attr('dy', '1em')
    .attr('value', 'Obese (%)')
    .classed('active', true)
    .text('Obese (%)');

    ////// EVENT LISTENERS /////
    
    // Listeners for x labels
    xLabelGroup.selectAll("text")
            .on("click", function() {
                // Grab selected label.
                chosenXAxis = d3.select(this).attr("value");
                // Update xLinearScale.
                xLinearScale = xScale(demoData, chosenXAxis, width);
                // Render xAxis.
                xAxis = renderXAxes(xLinearScale, xAxis);
                // Switch active/inactive labels.
        if (chosenXAxis === "In poverty (%)") {
            povertyLabel.classed("active", true).classed("inactive", false);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", false).classed("inactive", true);

        } else if (chosenXAxis === "Age (Median)") {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", true).classed("inactive", false);
            incomeLabel.classed("active", false).classed("inactive", true);
        } else {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", false).classed("inactive", true)
            incomeLabel.classed("active", true).classed("inactive", false);
        }
        circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
        circleText=renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    });
    
    // Listeners for y labels
    yLabelgroup.sellectAll('text').on('click', function() {
        chosenYAxis = d3.select(this).attr('value');
        yLinearScale = yScale(demoData, chosenYAxis, height);
        yAxis = renderYAxes(yLinearScale, yAxis);
        if (chosenYAxis === "Lacks Healthcare (%)") {
            healthcareLabel.classed("active", true).classed("inactive", false);
            hsmokesLabel.classed("active", false).classed("inactive", true);
            obeseLabel.classed("active", false).classed("inactive", true);

        } else if (chosenXAxis === "Smokes (%)") {
            healthcareLabel.classed("active", false).classed("inactive", true);
            hsmokesLabel.classed("active", true).classed("inactive", false);
            obeseLabel.classed("active", false).classed("inactive", true);
        } else {
            healthcareLabel.classed("active", false).classed("inactive", true);
            hsmokesLabel.classed("active", false).classed("inactive", true)
            obeseLabel.classed("active", true).classed("inactive", false);
        }
        circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
        circleText=renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    });






 }).catch(function(err) {
     console.log(err);
 });

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);