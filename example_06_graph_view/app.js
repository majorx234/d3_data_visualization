//import "./console_component.js";
function create_console() {
    let footer_tag = document.getElementById("footer");
    let consol_component_tag = document.createElement("console-component");
    consol_component_tag.setAttribute("id","console");
    footer_tag.append(consol_component_tag);
}
function log_print(text) {
    let json_data = { msg : text };
    document.getElementById("console").print = JSON.stringify(json_data);
}
create_console();
// global Variables:
// max nodes
var MAX_NODES = 100;
var graph_view_width = 800, graph_view_height = 600;

// TODO: put stuff into class
// var to hold svg element
var graph_svg;
// stores id of last klicked element
var last_node;

var graph_data  = {
    nodes : [],
    links : []
};
var graph_elem = {
    circles : [],
    lines : []
}


// menu click on svg to add node
var svgMenu = [
    {
        title: 'Add a node',
        action: function (e, d) {
            svg_add_node.call(e, d);
            last_node = null;
        }
    },
];

// menu on node
var nodeMenu = [
    {
        title: 'Remove this node',
        action: function (e, d) {
            svg_remove_node.call(e, d);
        }
    },
    {
        title: 'Add/remove edge',
        action: function(e, d, i) {
            last_node = d.id;
        }
    },
];

function load_graph (node_input, link_input) {
    graph_svg.selectAll("*").remove();
    graph_data.nodes = [];
    graph_data.links = [];
    last_node = null;
    for (var i = 0; i < node_input.length; i++)
        add_node({ id: node_input[i] });
    for (i = 0; i < link_input.length; i++)
        add_link(link_input[i][0], link_input[i][1]);
    update();
    setCounter(0);
    setCounterColor("black");
}

function sort_nodes () {
    return graph_data.nodes.map(function (n) {
        return n.id;
    }).sort(function (a, b) {
        return a - b;
    });
}

// search node by id
function find_node (id) {
    var i;
    for (i = 0; i < graph_data.nodes.length; i++)
        if (graph_data.nodes[i].id === id)
        return graph_data.nodes[i];
    return null;
}

function add_node (node) {
    last_node = null;
    if (graph_data.nodes.length >= MAX_NODES) {
        log_print("max nodes reached");
        return null;
    }
    log_print("add node: x,y:" + node.x + " , " + node.y);
    graph_data.nodes.push(node);
    var g = graph_svg.append("g")
        .datum(node)
        .on("click", node_click)
        .on("contextmenu", d3.contextMenu(nodeMenu))
        .style("font-size", "small")
        .call(d3.drag()
        .on('start', dragStart)
        .on('drag', dragging)
        .on('end', dragEnd)
        );

        function dragStart(event,d){
            d3.select(this)
              .select('circle')
              .attr("r",12)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("class", "node");
        }

        function dragging(event,d){
            var mouse = d3.pointer(event, graph_svg.node());
            var mouse_x = mouse[0];
            var mouse_y = mouse[1];

            // TODO avoid manual drawing DOM elements
            // better update date and use update() function
            d3.select(this)
              .select('circle')
              .attr("cx", mouse_x)
              .attr("cy", mouse_y);

            d3.select(this)
            .select('text')
            .attr("x", mouse_x - box.width/2)
            .attr("y", mouse_y + box.height/2);
            log_print("drag node: x,y:" + mouse_x + " , " + mouse_y);
        }

        function dragEnd(event,d){
            d3.select(this)
            .select('circle')
            .attr("r", (node.id < 10 ? 8 : 4) + Math.sqrt(box.width*box.width,   box.height*box.height) / 2)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("class", "node");
        }
    // TODO: manual drawing should be avoided -> sue declarativ syntax instead
    var text = g.append("text")
        .text(node.id);
    var box = text.node().getBBox();
    text.attr("x", node.x - box.width/2)
        .attr("y", node.y + box.height/2);
    box = text.node().getBBox();
    var circle = g.insert("circle", ":last-child")
        .attr("cx", box.x + box.width / 2)
        .attr("cy", box.y + box.height / 2)
        .attr("r", (node.id < 10 ? 8 : 4) + Math.sqrt(box.width*box.width,   box.height*box.height) / 2)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("class", "node");
    graph_elem.circles.push(circle);
    return g;
}

function remove_node(d, element) {
    last_node = null;

    var id = d.id;
    log_print("id: " + id)
    graph_data.links = graph_data.links.filter(function (link) {
        return link.source.id != id && link.target.id != id;
    });
    graph_data.nodes = graph_data.nodes.filter(function (node) {
        return node.id != id;
    });
    graph_svg.selectAll("line").filter(function (d) {
        return d.source.id == id || d.target.id == id ? this : null;
    }).remove();
    // remove 'g' element parent of (text/circle)
    d3.select(element.parentElement).remove();
    update();
}

function add_link (from_id, to_id) {
    from = find_node(from_id);
    to = find_node(to_id);
    if (from && to) {
        var link = { source: from, target: to };
        graph_data.links.push(link);
        // TODO: should be drawn manual
        // just need to add data
        g = graph_svg.append("g")
                     .datum(link)
                     .style("font-size", "small");
        var line = g.append("line")
                    .datum(link)
                    .style("stroke", "black")
                    .style("stroke-width", 2)
                    .attr('x1', link.source.x)
                    .attr('y1', link.source.y)
                    .attr('x2', link.target.x)
         .          attr('y2', link.target.y);
         graph_elem.lines.push(line);
    }
}

function remove_link (from, to) {
    graph_data.links = graph_data.links.filter(function (link) {
        return !((link.source.id == from && link.target.id == to) || (link.source.id == to && link.target.id == from));
    });
    graph_svg.selectAll("line").filter(function (d) {
        return ((d.source.id == from && d.target.id == to) || (d.source.id == from && d.target.id == to)) ? this : null;
    }).remove();
}

function draw () {
    graph_svg.selectAll("g")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
    });
    graph_svg.selectAll("line")
        .attr("x1", function (d) { return d.source.x; } )
        .attr("y1", function (d) { return d.source.y; } )
        .attr("x2", function (d) { return d.target.x; } )
        .attr("y2", function (d) { return d.target.y; } );
    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

function update () {
    // graph_layout.nodes(graph_data.nodes).links(graph_data.links).start();
}

// clicks on node
function node_click (d) {
    let id = d.target.__data__.id
    if (last_node && id != last_node) {
        var old_length = graph_data.links.length;
        remove_link(id, last_node);
        if (old_length == graph_data.links.length)
            add_link(id, last_node);
        update();
    }
    last_node = id;
}

function svg_add_node(event) {
    last_node = null;
    var mouse = d3.pointer(event, event.target);
    // find the smallest index not used
    var indices = sort_nodes();
    for (var i = 0, id = 1; i < indices.length; i++, id++)
        if (indices[i] != id)
            break;
    var n = add_node({
    x: mouse[0],
    y: mouse[1],
    id: id,
    });
    if (n) {
        update();
    }
}

function svg_remove_node(event) {
    let data = event.target.__data__;
    remove_node(data, event.target);
}

// TODO: move create function
graph_svg = d3.select("#graph")
    .append("svg")
    .attr("width", graph_view_width)
    .attr("height", graph_view_height)
    .on("contextmenu", d3.contextMenu(svgMenu));

/*
var simulation = d3.forceSimulation(graph_data.nodes)
    .force("charge", d3.forceManyBody().strength(-400))
    .force("link", d3.forceLink(graph_data.links))
    .force("center", d3.forceCenter()
        .x(graph_view_width / 2)
        .y(graph_view_height / 2));

simulation.on('tick', function(){
    var lines = d3.select("#graph").selectAll("line");
    lines.attr('x1', function(d) {return d.source.x;})
         .attr('y1', function(d) {return d.source.y;})
         .attr('x2', function(d) {return d.target.x;})
         .attr('y2', function(d) {return d.target.y;});

    var circles = d3.select("#graph").selectAll("circle");
    circles.attr('cx', function(d) {return d.x;})
           .attr('cy', function(d) {return d.y;});
});
*/
