function mapHistogram(id_string, data, property){

    // format d3 numbers
    var formatCount = d3.format(",.0f");

    // Define SVG sizes
    d3.select(id_string).selectAll("*").remove();

    var svg = d3.select(id_string);

    var margin = {top: 20, right: 0, bottom: 20, left: 0},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set the ranges
    var x = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .rangeRound([0, width]);

    //set the parameters of the historgram
    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(40))
        (data);

    //console.log(bins);
    //console.log(x.ticks(40));

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    //var formatX = d3.format('.2s')
    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(5, ".0s")
        .tickSize(4, 0);

    // var bar = g.selectAll(".bar")
    //   .data(bins)
    //   .enter().append("g")
    //     .attr("class", "bar")
    //     .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    // bar.append("rect")
    //     .attr("x", 0.5)
    //     .attr("width", function(d) { return x(d.x1) - x(d.x0) - 0.5;})
    //     .attr("height", function(d) { return height - y(d.length); });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    d3.selectAll("g.axis g.tick line")
        .attr("y2", function(d){
            if ( (Math.log(d)/Math.log(10))%1 == 0 )
                return 4;
            else
                return 0;
        });

    var curve = d3.line()
        .x(function(d) { return x(d.x0) + (x(d.x1) - x(d.x0))/2;})
        .y(function(d) { return y(d.length); })
        .curve(d3.curveCatmullRom.alpha(0.5));


    var area = d3.area()
        .defined(curve.defined())
        .x(curve.x())
        .y1(curve.y())
        .y0(y(0))
        .curve(d3.curveCatmullRom.alpha(0.5));
        
    g.append("path")
        .datum(bins)
        .attr("class", "histo-outline")
        .attr("d", function(d){ return curve(d);});
    g.append("path")
        .datum(bins)
        .attr("class", "histo-fill")
        .attr("d", area);

    //Redraw the line for selected feature
    if (data == popList){
        d3.select(".histo-line-pop").remove();
        d3.select(".histo-line-text-pop").remove();
        var xSelected = x(property);
        g.append("line")
            .attr("class", "histo-line-pop")
            .style("stroke", dataColor)
            .attr("x1", xSelected)
            .attr("y1", 0)
            .attr("x2", xSelected)
            .attr("y2", svg.attr("height") - margin.bottom - margin.top);
        g.append("circle")
            .attr("cx", xSelected)
            .attr("class", "histo-line-text-pop")
            .style("fill", dataColor)
            .attr("cy", 0)
            .attr("r", 2); 
        g.append("text")
            .attr("class", "histo-line-text-pop")
            .attr("x", xSelected)
            .attr("y", -5)
            .style("fill", dataColor)
            .style("text-anchor","middle")
            .text(selectedPop.toFixed());

    } else{
        d3.select(".histo-line-score").remove();
        d3.select(".histo-line-text-score").remove();
        var xSelected = x(property);
        g.append("line")
            .attr("class", "histo-line-score")
            .style("stroke", dataColor)
            .attr("x1", xSelected)
            .attr("y1", 0)
            .attr("x2", xSelected)
            .attr("y2", svg.attr("height") - margin.bottom - margin.top);
        g.append("circle")
            .attr("cx", xSelected)
            .style("fill", dataColor)
            .attr("class", "histo-line-text-pop")
            .attr("cy", 0)
            .attr("r", 2); 
        g.append("text")
            .attr("class", "histo-line-text-score")
            .attr("x", xSelected)
            .attr("y", -5)
            .style("fill", dataColor)
            .style("text-anchor","middle")
            .text(property.toFixed(2));
    }
}
