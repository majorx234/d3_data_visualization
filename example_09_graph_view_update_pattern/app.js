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

// stores pos of selection rectangle
var pos_select_start = {
    x: 0.0,
    y: 0.0
};
var pos_select_end = {
    x: 0.0,
    y: 0.0
};

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
    // TODO: use just node g-elemets (avoid line g-elements)
    var g = graph_svg.selectAll("g")
                     .data(graph_data.nodes, (d, i) => {return d.id;})
                     .enter()
                     .append("g");

    g.attr("id", function(d) {
              return d.id;
         })
     .on("click", node_click)
     .on("contextmenu", d3.contextMenu(nodeMenu))
     .call(d3.drag().on('start', dragStart)
                    .on('drag', dragging)
                    .on('end', dragEnd));
    // drag functions
    // TODO: rework
    function dragStart(event, d){
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
        let id = d3.select(this).node().id;
        let node = find_node( parseInt(id));
        node.x = mouse_x;
        node.y = mouse_y;

        update();
        log_print("drag node: x,y:" + mouse_x + " , " + mouse_y);
    }

    function dragEnd(event,d){
        d3.select(this)
          .select('circle')
          .attr("r", 10)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("class", "node");
    }
    // draw node:
    g.append("circle", ":last-child").attr("cx", function(d,i){
                                      return d.x;
                                  })
                      .attr("cy", function(d,i){
                                      return d.y;
                                  })
                      .attr("r", 10)
                      .attr("fill", "white")
                      .attr("stroke", "black")
                      .attr("class", "node");
    var text = g.append("text")
                .text(function(d,i){ return d.id;});
    var box = text.node().getBBox();
    text.attr("x", (d,i) => { return d.x - box.width/2;})
        .attr("y", (d,i) => { return d.y + box.height/3;});
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
        // TODO: put line in g-element (to add text in future)
        var line = graph_svg.selectAll("line")
                            .data(graph_data.links)
                            .enter()
                            .insert("line", ":first-child");

        line.style("stroke", "black")
            .style("stroke-width", 2)
            .attr('x1', (d,i) => { return d.source.x;})
            .attr('y1', (d,i) => { return d.source.y;})
            .attr('x2', (d,i) => { return d.target.x;})
            .attr('y2', (d,i) => { return d.target.y;});
    }
    draw();
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
    // update data
    // lines
    var line = graph_svg.selectAll("line");

    line.style("stroke", "black")
    .style("stroke-width", 2)
    .attr('x1', (d,i) => { return d.source.x;})
    .attr('y1', (d,i) => { return d.source.y;})
    .attr('x2', (d,i) => { return d.target.x;})
    .attr('y2', (d,i) => { return d.target.y;});

    // nodes
    var g = graph_svg.selectAll("g");
    g.select("circle")
     .attr("cx", function(d,i){ return d.x;})
     .attr("cy", function(d,i){ return d.y;})
     .attr("r", 10)
     .attr("fill", "white")
     .attr("stroke", "black")
     .attr("class", "node");
    var text = g.select("text");
    var box = text.node().getBBox();
    text.attr("x", (d,i) => { return d.x - box.width/2;})
        .attr("y", (d,i) => { return d.y + box.height/3;});

}

function update () {
    var line = graph_svg.selectAll("line")
                        .data(graph_data.links);

    line.style("stroke", "black")
    .style("stroke-width", 2)
    .attr('x1', (d,i) => { return d.source.x;})
    .attr('y1', (d,i) => { return d.source.y;})
    .attr('x2', (d,i) => { return d.target.x;})
    .attr('y2', (d,i) => { return d.target.y;});

    // nodes
    var g = graph_svg.selectAll("g")
                     .data(graph_data.nodes, (d, i) => {return d.id;})
    g.select("circle")
     .attr("cx", function(d,i){ return d.x;})
     .attr("cy", function(d,i){ return d.y;})
     .attr("r", 10)
     .attr("fill", "white")
     .attr("stroke", "black")
     .attr("class", "node");
    var text = g.select("text");
    var box = text.node().getBBox();
    text.attr("x", (d,i) => { return d.x - box.width/2;})
        .attr("y", (d,i) => { return d.y + box.height/3;});
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
    var mouse = d3.pointer(event, graph_svg.node());
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
              .append("svg");
graph_svg.attr("width", graph_view_width)
         .attr("height", graph_view_height)
         .on("contextmenu", d3.contextMenu(svgMenu));
graph_svg.call(d3.drag().on('start', drag_select_start)
                    .on('drag', dragging_select)
                    .on('end', drag_select_end));

// drag functions to select elements
// TODO: rework
function drag_select_start(event, d){
    var mouse = d3.pointer(event, graph_svg.node());
    var mouse_x = mouse[0];
    var mouse_y = mouse[1];
    pos_select_start = {x:mouse_x, y:mouse_y};
    graph_svg.selectAll("rect")
             .data([{x:pos_select_start.x,
                      y:pos_select_start.y,
                      width:pos_select_end.x - pos_select_start.x,
                      height:pos_select_end.y - pos_select_start.y
                    }])
             .enter()
             .append("rect")
             .attr("x", function(d, i) { return d.x })
             .attr("y", function(d, i) { return d.y })
             .attr("width", function(d, i) { return d.width })
             .attr("height", function(d, i) { return d.height })
             .attr('stroke', 'black')
             .style("fill", "none");
}

function dragging_select(event,d){
    var mouse = d3.pointer(event, graph_svg.node());
    var mouse_x = mouse[0];
    var mouse_y = mouse[1];
    pos_select_end = {x:mouse_x,y:mouse_y};
    graph_svg.selectAll("rect")
             .data([{x:pos_select_start.x,
                      y:pos_select_start.y,
                      width:pos_select_end.x - pos_select_start.x,
                      height:pos_select_end.y - pos_select_start.y
                     }])
             .attr("x", function(d, i) { return d.x })
             .attr("y", function(d, i) { return d.y })
             .attr("width", function(d, i) { return d.width })
             .attr("height", function(d, i) { return d.height })
             .attr('stroke', 'black')
             .style("fill", "none");
    log_print("dragging select node: x,y:" + mouse_x + " , " + mouse_y);
}

function drag_select_end(event,d){
    var mouse = d3.pointer(event, graph_svg.node());
    var mouse_x = mouse[0];
    var mouse_y = mouse[1];
    pos_select_end = {x:mouse_x, y:mouse_y};

    graph_svg.selectAll("rect")
             .data([{x:pos_select_start.x,
                      y:pos_select_start.y,
                      width:pos_select_end.x - pos_select_start.x,
                      height:pos_select_end.y - pos_select_start.y
                     }])
             .attr("x", function(d, i) { return d.x })
             .attr("y", function(d, i) { return d.y })
             .attr("width", function(d, i) { return d.width })
             .attr("height", function(d, i) { return d.height })
             .attr('stroke', 'red')
             .style("fill", "none");
    log_print("drag select end: x,y:" + mouse_x + " , " + mouse_y);
}
