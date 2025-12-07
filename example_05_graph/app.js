var all_data  = {
    nodes: [
        { name: "Italy", inhabitants: 58.5},
        { name: "France", inhabitants: 68.2},
        { name: "Germany", inhabitants: 83.2},
        { name: "Sweeden", inhabitants: 10.5},
        { name: "Denmark", inhabitants: 5.8},
        { name: "Ireland", inhabitants: 5.0},
        { name: "Iceland", inhabitants: 0.37},
        { name: "Holland", inhabitants: 17.5}
    ],
    links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 0, target: 4 },
        { source: 1, target: 5 },
        { source: 2, target: 5 },
        { source: 2, target: 5 },
        { source: 3, target: 4 },
        { source: 3, target: 5 },
        { source: 4, target: 6 },
        { source: 5, target: 7 },

    ]
};

var graph_view_width = 600;
var graph_view_height = 300;

var simulation = d3.forceSimulation(all_data.nodes)
    .force("charge", d3.forceManyBody().strength(-400))
    .force("link", d3.forceLink(all_data.links))
    .force("center", d3.forceCenter()
        .x(graph_view_width / 2)
        .y(graph_view_height / 2));

var scale_radius = d3.scaleLog()
                     .domain([d3.min(all_data.nodes, function(d){return d.inhabitants;}), d3.max(all_data.nodes, function(d){return d.inhabitants;})])
                     .range([2,10]);

var svg = d3.select("#graph_view")
            .append('svg')
            .attr('width',graph_view_width)
            .attr('height', graph_view_height);

var lines = svg.selectAll("line")
               .data(all_data.links)
               .enter()
               .append("line")
               .style("stroke", "black")
               .style("stroke-width", 2);

var nodes = svg.selectAll("circle")
               .data(all_data.nodes)
               .enter()
               .append("circle")
               .attr( "r", function(d){return scale_radius(d.inhabitants);})
               .style( "fill", "red");

nodes.append("title")
     .text(function(d){ return d.name;});

simulation.on('tick', function(){
    lines.attr('x1', function(d) {return d.source.x;})
         .attr('y1', function(d) {return d.source.y;})
         .attr('x2', function(d) {return d.target.x;})
         .attr('y2', function(d) {return d.target.y;});

    nodes.attr('cx', function(d) {return d.x;})
         .attr('cy', function(d) {return d.y;});
});
