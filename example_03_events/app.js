var all_data = [5,9,21,17,10,3,26,9,15,22,11];

// SVG properties
var barchart_width = 600;
var barchart_height = 300;
var barchart_padding = 5;
var barchart_text_size = 20;
var svg = d3.select("#barchart")
            .append('svg')
            .attr('width', barchart_width)
            .attr('height', barchart_height);

init_data(all_data);


function init_data(data) {
    // create scales
    var scale_x = d3.scaleBand()
                .domain(d3.range(data.length)) // better index than array
                .range([0,barchart_width]);
    var scale_y = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, barchart_height]);

    svg.selectAll('rect')
        .data(data)
        .enter()       // join data with 'rect' elements
        .append('rect') // create missing elements (for elements in data)
        .attr('x', function(d, i){  // d is index of data array
            return scale_x(i) + barchart_padding/2;
            })
        .attr( 'y', function(d){
            return barchart_height - scale_y(d);
        })
        .attr( 'width', scale_x.bandwidth() - barchart_padding)
        .attr( 'height', function(d){ return scale_y(d);})
        .attr('fill', 'grey'); // bars are gey

    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(function(d){return d;}) // number in the array of data
        .attr( 'x', function (d,i){
            return scale_x(i) +
                        (scale_x.bandwidth() + barchart_padding/2) / 2
            })
        .attr( 'y', function(d){
                return barchart_height - (scale_y(d) - barchart_text_size );
        })
        .attr( 'font-size', barchart_text_size)
        .attr( 'fill', 'black')
        .attr( 'text-anchor', 'middle');
}

function add_data(data) {
    // create scales
    var scale_x = d3.scaleBand()
                .domain(d3.range(data.length)) // better index than array
                .range([0,barchart_width]);
    var scale_y = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, barchart_height]);

    const selected_elements = svg.selectAll('rect')
        .data(data);

    selected_elements.enter()
        .append('rect')
        .merge(selected_elements) // merge with old data join
        .attr('x', function(d, i){
            return scale_x(i) + barchart_padding/2;
            })
        .attr( 'y', function(d){
            return barchart_height - scale_y(d);
        })
        .attr( 'width', scale_x.bandwidth() - barchart_padding)
        .attr( 'height', function(d){ return scale_y(d);})
        .attr('fill', 'grey'); // bars are gey

    const selected_text_elements = svg.selectAll('text')
        .data(data);

    selected_text_elements.enter()
        .append('text')
        .merge(selected_text_elements) // merge with old data join
        .text(function(d){return d;}) // number in the array of data
        .attr( 'x', function (d,i){
            return scale_x(i) +
                        (scale_x.bandwidth() + barchart_padding/2) / 2
            })
        .attr( 'y', function(d){
                return barchart_height - (scale_y(d) - barchart_text_size );
        })
        .attr( 'font-size', barchart_text_size)
        .attr( 'fill', 'black')
        .attr( 'text-anchor', 'middle');
}


function reverse_data(data) {
    // create scales
    data.reverse();
    var scale_x = d3.scaleBand()
                .domain(d3.range(data.length)) // better index than array
                .range([0,barchart_width]);
    var scale_y = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, barchart_height]);

    svg.selectAll('rect')
        .data(data)
        .attr('x', function(d, i){
            return scale_x(i) + barchart_padding/2;
            })
        .attr( 'y', function(d){
            return barchart_height - scale_y(d);
        })
        .attr( 'width', scale_x.bandwidth() - barchart_padding)
        .attr( 'height', function(d){ return scale_y(d);})
        .attr('fill', 'grey'); // bars are gey

    svg.selectAll('text')
        .data(data)
        .attr( 'x', function (d,i){
            return scale_x(i) +
                        (scale_x.bandwidth() + barchart_padding/2) / 2
            })
        .attr( 'y', function(d){
                return barchart_height - (scale_y(d) - barchart_text_size );
        })
        .attr( 'font-size', barchart_text_size)
        .attr( 'fill', 'black')
        .attr( 'text-anchor', 'middle');
}

// events
d3.select("#addbutton").on('click', function(){
    const input_value = d3.select('#input').property('value');
    all_data.push(parseInt(input_value));
    add_data(all_data);
});

d3.select("#reversebutton").on('click', function(){
    reverse_data(all_data);
});
