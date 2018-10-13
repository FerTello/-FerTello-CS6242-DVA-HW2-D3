<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Learning D3</title>
	<link rel="stylesheet" href="main.css">
	<script  type="text/javascript" src="../../lib/d3.v3.min.js"></script>
</head>
<body>
<!--Place all DOM elements here -->
<script>
var dataset = [
	{city: 'San Antonio', population_2012: 1383505, growth: {year_2013:25405, year_2014:26644 , year_2015:28593 , year_2016:23591 , year_2017:24208}},
	{city: 'New York', population_2012: 8383504, growth: {year_2013:75138 , year_2014:62493 , year_2015:61324 , year_2016:32967 , year_2017:7272}},
	{city: 'Chicago', population_2012: 2717989, growth: {year_2013:6493 , year_2014:2051 , year_2015:-1379 , year_2016:-4879 , year_2017:-3825}},
	{city: 'Los Angeles', population_2012: 3859267, growth:{year_2013:32516 , year_2014:30885 , year_2015:30791 , year_2016:27657 , year_2017:18643}},
	{city: 'Phoenix', population_2012: 1495880, growth: {year_2013:25302 , year_2014:26547 , year_2015:27310 , year_2016:27003 , year_2017:24036}}
];

var pctPopChange = [];

var pctGrowth = [];
dataset.forEach(function(entry, i){
	pctGrowth[i] = {
		city: entry.city,
		tot_2013: 100*entry.growth.year_2013/entry.population_2012,
		tot_2014: 100*entry.growth.year_2014/(entry.population_2012 + entry.growth.year_2013),
		tot_2015: 100*entry.growth.year_2015/(entry.population_2012 + entry.growth.year_2013 + entry.growth.year_2014),
		tot_2016: 100*entry.growth.year_2016/(entry.population_2012 + entry.growth.year_2013 + entry.growth.year_2014 + entry.growth.year_2015),
		tot_2017: 100*entry.growth.year_2017/(entry.population_2012 + entry.growth.year_2013 + entry.growth.year_2014 + entry.growth.year_2015 + entry.growth.year_2016)
	}
})
console.log(pctGrowth)

var pctGrowthSA = [];
	pctGrowthSA = [
		{ year: 2013, pct: pctGrowth[0].tot_2013 },
		{ year: 2014, pct: pctGrowth[0].tot_2014 },
		{ year: 2015, pct: pctGrowth[0].tot_2015 },
		{ year: 2016, pct: pctGrowth[0].tot_2016 },
		{ year: 2017, pct: pctGrowth[0].tot_2017 }
	]
console.log(pctGrowthSA)

var pctGrowthNY = [];
	pctGrowthNY = [
		{ year: 2013, pct: pctGrowth[1].tot_2013 },
		{ year: 2014, pct: pctGrowth[1].tot_2014 },
		{ year: 2015, pct: pctGrowth[1].tot_2015 },
		{ year: 2016, pct: pctGrowth[1].tot_2016 },
		{ year: 2017, pct: pctGrowth[1].tot_2017 }
	]
console.log(pctGrowthNY)

var pctGrowthCH = [];
	pctGrowthCH = [
		{ year: 2013, pct: pctGrowth[2].tot_2013 },
		{ year: 2014, pct: pctGrowth[2].tot_2014 },
		{ year: 2015, pct: pctGrowth[2].tot_2015 },
		{ year: 2016, pct: pctGrowth[2].tot_2016 },
		{ year: 2017, pct: pctGrowth[2].tot_2017 }
	]
console.log(pctGrowthCH)

var pctGrowthLA = [];
	pctGrowthLA = [
		{ year: 2013, pct: pctGrowth[3].tot_2013 },
		{ year: 2014, pct: pctGrowth[3].tot_2014 },
		{ year: 2015, pct: pctGrowth[3].tot_2015 },
		{ year: 2016, pct: pctGrowth[3].tot_2016 },
		{ year: 2017, pct: pctGrowth[3].tot_2017 }
	]
console.log(pctGrowthLA)

var pctGrowthPH = [];
	pctGrowthPH = [
		{ year: 2013, pct: pctGrowth[4].tot_2013 },
		{ year: 2014, pct: pctGrowth[4].tot_2014 },
		{ year: 2015, pct: pctGrowth[4].tot_2015 },
		{ year: 2016, pct: pctGrowth[4].tot_2016 },
		{ year: 2017, pct: pctGrowth[4].tot_2017 }
	]
console.log(pctGrowthPH)


var w = 250;
var h = 150;
var margin = {
	top: 15,
	bottom: 30,
	left: 35,
	right: 15
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
			.attr("id", "chart")
			.attr("width", w)
			.attr("height", h);
var chart = svg.append("g")
			.classed("display", true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//*****************************SAN ANTONIO

var y = d3.scale.linear()
		.domain([1.5, d3.max(pctGrowthSA, function(entry){
			return entry.pct;
		})])
		.range([height,0]);

var x = d3.scale.ordinal()
		.domain(pctGrowthSA.map(function(entry){
			return entry.year;
		}))
		.rangeBands([0, width]);


var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(5);
var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5);

			var line = d3.svg.line()
						.x(function(d){
							return x(d.year);
						})
						.y(function(d){
							return y(d.value);
						});

			function plot(args){
				this.append("g")
					.classed("x axis", true)
					.attr("transform", "translate(0," + height + ")")
					.call(args.axis.x);
				this.append("g")
					.classed("y axis", true)
					.attr("transform", "translate(0,0)")
					.call(args.axis.y);
				//enter()
				this.selectAll(".trendline")
					.data([args.data])
					.enter()
						.append("path")
						.classed("trendline", true);
				this.selectAll(".point")
					.data(args.data)
					.enter()
						.append("circle")
						.classed("point", true)
						.attr("r", 2);
				//update
				this.selectAll(".trendline")
					.attr("d", function(d){
						return line(d);
					})
				this.selectAll(".point")
					.attr("cx", function(d){
						return x(d.year)+20;
					})
					.attr("cy", function(d){
						return y(d.pct);
					})
				//exit()
				this.selectAll(".trendline")
					.data([args.data])
					.exit()
					.remove();
				this.selectAll(".point")
					.data(args.data)
					.exit()
					.remove();
			}
			plot.call(chart, {
				data: pctGrowthSA,
				axis: {
					x: xAxis,
					y: yAxis
				}
			})


</script>
</body>
</html>
