// add your JavaScript/D3 to this file

// set the dimensions and margins of the graph
const w = 800;
const h = 400;

var margin = {top: 30, right: 50, bottom: 50, left: 50},
    innerWidth = w - margin.left - margin.right;
    innerHeight = h - margin.top - margin.bottom;

// add svg
var svg = d3.select("div#plot")
  .append("svg")
    .attr("width", innerWidth + margin.left + margin.right)
    .attr("height", innerHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate (${margin.left}, ${margin.top})`);

svg.append("circle")
  .attr("cx", 40)
  .attr("cy", -20)
  .attr("r", 6)
  .style("fill", "lightgrey")

svg.append("circle").
  attr("cx", 140).
  attr("cy", -20).
  attr("r", 6).
  style("fill", "#98c9f4")

svg.append("text").attr("x", 50).attr("y", -15).text("Weekday").style("font-size", "15px")

svg.append("text").attr("x", 150).attr("y", -15).text("Weekend").style("font-size", "15px")

// add data
d3.csv("https://raw.githubusercontent.com/suyeonju101/PracticeD3/main/numtripbyday.csv").then(function(d) {
    // add x-axis
    var xScale = d3.scaleBand()
      .domain(d.map(d => d.day))
      .range([0, innerWidth])
      .padding([0.2])

    svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate (0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0));

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .attr("x", 350)
      .attr("y", innerHeight + 40)
      .text("Date (in November, 2014)");

   // add y-axis
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(d.map(d => d.num_trip))])
      .range([innerHeight, 0]);

    svg.append("g")
      .attr("class", "yAxis")
      .call(d3.axisLeft(yScale));

    svg.append("text")
      .attr("class", "y label")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (innerHeight / 2))
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Count (thousands)");

    // add color scales
    var color1 = d3.scaleOrdinal()
      .domain(d.map(d => d.day))
      .range(['#98c9f4', '#98c9f4', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey',
      '#98c9f4', '#98c9f4', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey',
      '#98c9f4', '#98c9f4', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey',
      '#98c9f4', '#98c9f4', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey', 'lightgrey',
      '#98c9f4', '#98c9f4'])

    var color2 = d3.scaleOrdinal()
      .domain(d.map(d => d.day))
      .range(['#437c90', '#437c90', 'grey', 'grey', 'grey', 'grey', 'grey',
      '#437c90', '#437c90', 'grey', 'grey', 'grey', 'grey', 'grey',
      '#437c90', '#437c90', 'grey', 'grey', 'grey', 'grey', 'grey',
      '#437c90', '#437c90', 'grey', 'grey', 'grey', 'grey', 'grey',
      '#437c90', '#437c90'])

    // source cited: https://observablehq.com/@bsaienko/animated-bar-chart-with-tooltip.
    // source cited: https://d3-graph-gallery.com/graph/barplot_stacked_hover.html.
    tooltip = d3.select("div#plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('background', 'rgba(0,0,0,0.6)')
      .style('z-index', '10')
      .style("border", "solid")
      .style("padding", "10px")
      .style('border-radius', '4px')
      .style("border-width", "1px")
      .style('color', '#fff')


    var mouseover = function(d) {
      tooltip
          .html(`Number of trips: ${d3.select(this).data().map(d=>d.num_trip)} K
          <br><br> Minimum tip: ${d3.select(this).data().map(d=>d.min_tip)} % <br>
          Median tip: ${d3.select(this).data().map(d=>d.med_tip)} % <br>
          Maximum tip: ${d3.select(this).data().map(d=>d.max_tip)} %`)
          .style("opacity", 1);
          d3.select(this).transition().attr('fill',  d => color2(d.day));
    }
    var mousemove = function(event, d) {
      var [x, y] = d3.pointer(event);
      tooltip
        .style('top', y + 550 + 'px')
        .style('left', x + 120 +'px');
    }

    var mouseleave = function() {
      tooltip
        .style("opacity", 0);
      d3.select(this).transition().attr('fill', d => color1(d.day));
    }

    svg.append("g")
      .selectAll("g")
      .data(d)
      .enter().append("rect")
        .attr("id", (d,i) => i)
        .attr("x", d => xScale(d.day))
        .attr("y", d => yScale(d.num_trip))
        .attr("height", d => innerHeight - yScale(d.num_trip))
        .attr("width", xScale.bandwidth())
        .attr("fill", d => color1(d.day))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

  })
