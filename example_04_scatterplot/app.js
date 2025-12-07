var data  = [
                [ 450, 300 ],
                [ 210, 240 ],
                [ 520, 430 ],
                [ 130, 60 ],
                [ 350, 250 ],
                [ 100, 80 ],
            ];

// The SVG Element
var scatterplot_width     =   600;
var scatterplot_height    =   300;
var scatterplot_padding   =   40;
var svg             =   d3.select( '#scatterplot' )
    .append( 'svg' )
    .attr( 'width', scatterplot_width )
    .attr( 'height', scatterplot_height );

var scale_x = d3.scaleLinear()
                .domain([0,d3.max(data, function(d){ return d[0]})])    // max with accesor function
                .range([scatterplot_padding, scatterplot_width - 2*scatterplot_padding]);
var scale_y = d3.scaleLinear([0,d3.max(data, function(d){ return d[1]})])
                .range([scatterplot_height - scatterplot_padding, scatterplot_padding]);

// we need axis lines as long as the plot
var axis_x = d3.axisBottom( scale_x);
svg.append('g')
   .attr('class', 'x-axis')
   .attr('transform', 'translate(0,' + (scatterplot_height - scatterplot_padding )+ ')')
   .call( axis_x);

var axis_y = d3.axisLeft(scale_y)
               .ticks(5);
svg.append('g')
   .attr('class', 'y-axis')
   .attr('transform', 'translate(' + scatterplot_padding + ',0)')
   .call(axis_y);
