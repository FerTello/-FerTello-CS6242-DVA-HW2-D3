( function() {
  var width = 1100,
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

          svg.append("text")
              .attr("x", width / 2 )
              .attr("y", 50 )
              .attr("font-size", "20px")
              .text("EDUCATION STATISTICS");


        var pctMap = eduPct.map(function(entry){
          return {
            id: entry.id,
            county: entry.name,
            percent: entry.percent_educated
          }
        });

        var detMap = details.map(function(entry){
          return {
            id: entry.id,
            professionals: entry.qualified_professionals,
            highSchool: entry.high_school,
            middleSchool: entry.middle_school_or_lower
          }
        });

        function join(lookupTable, mainTable, lookupKey, mainKey, select) {
        var l = lookupTable.length,
          m = mainTable.length,
          lookupIndex = [],
          output = [];
        for (var i = 0; i < l; i++) { // loop through l items
          var row = lookupTable[i];
          lookupIndex[row[lookupKey]] = row; // create an index for lookup table
        }
        for (var j = 0; j < m; j++) { // loop through m items
          var y = mainTable[j];
          var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
          output.push(select(y, x)); // select only the columns you need
        }
        return output;
        };

        var result = join(detMap, pctMap, "id", "id", function(i, j) {
          return {
            id: i.id,
            county: i.county,
            percent: i.percent,
            professionals: j.professionals,
            highSchool: j.highSchool,
            middleSchool: j.middleSchool
          };
        });

        var color = d3.scale.threshold()
              .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
              .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);

        var quantize = d3.scale.quantize()
                .domain([0, 100])
                .range(d3.range(9).map(function(i) { return "q" + i + "-9-green"; }));

        var county = svg.append("g")
                    .attr("class", "counties")
                  .selectAll("path")
                    .data(topojson.feature(US, US.objects.counties).features)
                  .enter().append("path")
                    .attr("d", path)
                    .data(result)
                    .style("fill", function(d) { return color(d.percent); })
                    .on("mouseover", function(d){

                      var xPosition = d3.mouse(this)[0] + 20;
                      var yPosition = d3.mouse(this)[1] + 20;

                 var tblock = svg.append("text")
                              .attr("id", "tooltip")
                              .attr("x", xPosition)
                              .attr("y", yPosition)
                              .attr("text-anchor", "middle")
                              .attr("font-family", "sans-serif")
                              .attr("font-size", "11px")
                              .attr("font-weight", "normal")
                              .attr("fill", "black")
                              .text("County name: " + d.county)
                            .append("tspan")
                              .attr('x', xPosition)
                              .attr('dy', 15)
                              .text("Educated people: " + d.percent + "%" )
                            .append("tspan")
                              .attr('x', xPosition)
                              .attr('dy', 15)
                              .text("Qualified graduates: " + d.professionals )
                            .append("tspan")
                              .attr('x', xPosition)
                              .attr('dy', 15)
                              .text("High School graduates: " + d.highSchool )
                            .append("tspan")
                              .attr('x', xPosition)
                              .attr('dy', 15)
                              .text("Middle school or lower graduates: " + d.middleSchool );

                      d3.select(this)
                        .style("fill", "#509e2f");
                    })
                    .on("mouseout", function(d) {
                      d3.select("#tooltip").remove();

                      d3.select(this)
                        .transition()
                        .duration(250)
                        .style("fill", function(d) { return color(d.percent); })

                      });

            var formatPercent = d3.format("0.0%");
            var tickLabels = ['0','10%','20%','30%','40%','50%','60%','70%','80%','90%']

            // Legend Stuff
            var y = d3.scale.linear()
                .domain([0, 100])
                .range([0,300]);

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickValues(color.domain())
                .orient("right")
                .tickFormat(function(d,i){ return tickLabels[i] });

            var g = svg.append("g")
                .attr("class", "key")
                .attr("transform", "translate(1000, 165)")
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
