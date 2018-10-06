
( function() {
  var width = 960,
      height = 600;

  var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

  var projection = d3.geo.albersUsa()
        .scale(1280)
        .translate([width/2, height/2]),
      path = d3.geo.path()
        .projection(projection);

    var stateIdMap = d3.map({});

    var q = d3.queue();
        q.defer(d3.json, "us.json")
        q.defer(d3.csv, "education.csv")
        q.defer(d3.csv, "education_details.csv")
        q.await(function (err, US, eduPct, details){


        var pctMap = eduPct.map(function(entry){
          return {
            id: entry.id,
            county: entry.name,
            percent: entry.percent_educated
          }
        });
/*
        pctMap.forEach(function(entry){
          console.log(entry.county, entry.percent);
        });
*/
        //console.log(eduPct);

        var detMap = details.map(function(entry){
          return {
            id: entry.id,
            professionals: entry.qualified_professionals,
            highSchool: entry.high_school,
            middleSchool: entry.middle_school_or_lower
          }
        });


        var color = d3.scale.threshold()
              .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
              .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);

        var quantize = d3.scale.quantize()
                .domain([0, 100])
                .range(d3.range(9).map(function(i) { return "q" + i + "-9-green"; }));

                svg.append("g")
                    .attr("class", "counties")
                  .selectAll("path")
                    .data(topojson.feature(US, US.objects.counties).features)
                  .enter().append("path")
                    .attr("d", path)
                    .data(pctMap)
                    .style("fill", function(d) { return color(d.percent); });

            // Legend Stuff
            var y = d3.scale.linear()
                .domain([0, 100])
                .range([0,300]);

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickValues(color.domain())
                .orient("right");

            var g = svg.append("g")
                .attr("class", "key")
                .attr("transform", "translate(920, 165)")
                .call(yAxis);
              g.selectAll("rect")
               .data(color.range().map(function(d, i) {
                   return {
                       y0: i ? y(color.domain()[i - 1]) : y.range()[0],
                       y1: i < color.domain().length ? y(color.domain()[i]) : y.range()[1],
                       z: d
                   };
               }))
               .enter().append("rect")
                   .attr("width", 8)
                   .attr("y", function(d) { return d.y0; })
                   .attr("height", function(d) { return d.y1 - d.y0; })
                   .style("fill", function(d) { return d.z; });


        });

})();
