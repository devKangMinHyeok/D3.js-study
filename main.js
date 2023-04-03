// Set up margin and width/height
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG element
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Read data from CSV file
d3.csv("data.csv").then((data) => {
  // Convert data types as necessary
  data.forEach((d) => {
    d.date = d3.timeParse("%Y-%m-%d")(d.date);
    d.value = +d.value;
  });

  // Create x and y scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height, 0]);

  // Create x and y axes
  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().scale(yScale);

  // Add x and y axes to SVG
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);
  svg.append("g").attr("class", "y-axis").call(yAxis);

  // Create line generator function
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  // Add line to SVG
  svg.append("path").datum(data).attr("class", "line").attr("d", line);
});
