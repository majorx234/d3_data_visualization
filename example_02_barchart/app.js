var data = [5,9,21,17,10,3,26,9,15];

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
                .domain(d3.range(data.length)) // better idex than array
                .range([0,barchart_width]);
svg.selectAll('rect')
   .data(data)
   .enter()       // for elements in data
   .append('rect')
   .attr('x', function(d, i){  // d is index of data array
       return i*(barchart_width /  data.length);
    })
   .attr( 'y', function(d){
       return barchart_height - d*5;
   })
   .attr( 'width', (barchart_width/data.length) - barchart_padding)
   .attr( 'height', function(d){ return 5*d;})
   .attr('fill', 'grey'); // bars are gey

svg.selectAll('text')
   .data(data)
   .enter()
   .append('text')
   .text(function(d){return d;}) // number in the array of data
   .attr( 'x', function (d,i){
       return i* (barchart_width/data.length) +
                 (barchart_width/data.length - barchart_padding) / 2
    })
   .attr( 'y', function(d){
        return barchart_height - (d*5 - barchart_text_size );
   })
   .attr( 'font-size', barchart_text_size)
   .attr( 'fill', 'black')
   .attr( 'text-anchor', 'middle');
