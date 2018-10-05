
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

/*
  var percentage = d3.map({});
    var educated = d3.map({});
*/
    var q = d3.queue();
        q.defer(d3.json, "us.json")
        q.defer(d3.csv, "data/state-population.csv")
        q.defer(d3.csv, "education.csv")
        q.defer(d3.csv, "education_details.csv")
        q.await(function (err, US, percentage, educated){

          //console.log(population);
        //  console.log(percentage);
          //console.log(educated);
/*
          var edu_prof = svg.append("g")
                  .attr("class", "edu_prof")
                  .selectAll("g")
                  .data(percentage)
                  .enter()
                  .append("g");
*/
          var states = svg.append("g")
                  .attr("class", "states")
                  .selectAll("g")
                  .data(topojson.feature(US, US.objects.states).features)
                  .enter()
                  .append("g");
/*
              populations = prepare.populations(populations);

          var quantize = d3.scale.quantize()
                  .domain(d3.extent(_.values(percentage)))
                  .range(d3.range(9).map(function(i) { return "q" + i + "-9-green"; }));
*/
              states.append("path")
                  .attr("d", path);

              states.append("path")
                  .datum(topojson.mesh(US, US.objects.states,
                                      function(a,b){ return a !== b; } ))
                  .attr("class", "borders")
                  .attr("d", path);

              states.append("text")
                  .text( function(d){ return stateIdMap.get(d.id) || d.id; })
                  .attr({
                    x: function(d){ return path.centroid(d)[0] || 0; },
                    y: function(d){ return path.centroid(d)[1] || 0; }
                  });
        })

})();
