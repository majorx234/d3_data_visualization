var data = [5,9,21,17,10,3,26,9,15,22,11];

// SVG properties
var barchart_width = 600;
var barchart_height = 300;
var barchart_padding = 5;
var barchart_text_size = 20;
var svg = d3.select("#barchart")
            .append('svg')
            .attr('width', barchart_width)
            .attr('height', barchart_height);

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
