function extractColumn(arr, column) {
    return arr.map(x => x[column])
}

var data_year = [1750, 1775, 1800, 1825, 1850, 1875, 1900];

var city_population_data = [
  {name: "London",population:[676000, 710000, 861000, 1335000, 2320000, 4241000, 6480000]},
  {name: "Lisabon", population:[130000, 219000, 237000, 258000, 262000, 243000, 363000]},
  {name: "Berlin", population:[113000, 136000, 172000, 222000, 446000, 1045000, 2707000]},
  {name: "Madrid", population:[110000, 132000, 182000, 201000, 216000, 373000, 539000]},
  {name: "Paris", population:[556000, 600000, 547000, 855000, 1314000, 2250000, 3330000]},
  {name: "Amsterdam", population:[219000, 209000, 195000, 196000, 225000, 289000, 510000]},
  {name: "Rom", population:[146000, 148000, 142000, 125000, 158000, 251000, 438000]},
  {name: "Istanbul", population:[625000, 600000, 570000, 675000, 785000, 873000, 900000]},
  {name: "Moskow", population:[146000, 177000, 248000, 257000, 373000, 600000, 1120000]}
];

var svg_city_rank_plot = d3.select("#city_rank")
                           .append("svg")
                           .attr("width",400)
                           .attr("height",400);
var margin = {top: 50, right: 50, button: 50, left:50};
var width  = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.button;

var svg_city_rank_scatter_plot = svg_city_rank_plot.append("g")
                                                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var axis_x_scale = d3.scaleLinear().domain([0, 7000000]).range([0,width]);
var axis_y_scale = d3.scaleLinear().domain([0,10]).range([0, height]);

var axis_x = d3.axisTop(axis_x_scale).tickFormat(function (d) {
      if ((d / 1000000) >= 1) {
        d = d / 1000000 + "M";
      } else if ((d / 1000) >= 1) {
        d = d / 1000 + "K";
      }
      return d;
    });
svg_city_rank_plot.append('g')
                  .attr('class', 'x-axis')
                  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                  .call( axis_x);

var axis_y = d3.axisLeft(axis_y_scale)
               .ticks(9);
svg_city_rank_plot.append('g')
                  .attr('class', 'y-axis')
                  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                  .call(axis_y);

var inited = 0;
var state = 0;
var circles;

function init(){
    if(inited == 1) return;
    circles = svg_city_rank_scatter_plot.append("g")
                                        .attr("class","scatter-circles")
                                        .selectAll("circle")
                                        .data(city_population_data.map(data => ({name:data.name, population:data.population[state]})))
                                        .enter()
                                        .append("circle");
    var circles_attributes = circles.attr("cx", function(d,i){ return axis_x_scale(d.population);})
                                    .attr("cy", function(d,i) { return axis_y_scale(i+1);})
                                    .attr( 'fill', 'grey' )
                                    .attr("r",5);
    var text = svg_city_rank_scatter_plot.append("g")
                                         .attr("class", "city-names")
                                         .selectAll("text")
                                         .data(city_population_data.map(data => ({name:data.name, population:data.population[state]})))
                                         .enter()
                                         .append("text");
    var text_attributes = text.attr("x", function(d,i){ return axis_x_scale(d.population) + 5;})
                              .attr("y", function(d,i) { return axis_y_scale(i+1) + 5;})
                              .text(function(d,i){ return d.name;})
                              .style("fill", "red");
    state = 1;
    inited = 1;
}

function update(){
    circles = svg_city_rank_scatter_plot.selectAll("circle")
                                        .data(city_population_data.map(data => ({name:data.name, population:data.population[state]})));
    var circles_attributes = circles.transition()
                                    .duration(1000)
                                    .attr("cx", function(d,i){ return axis_x_scale(d.population);})
                                    .attr("cy", function(d,i) { return axis_y_scale(i+1);})
                                    .attr( 'fill', 'grey' )
                                    .attr("r",5);
    var text = svg_city_rank_scatter_plot.selectAll("text")
                                         .data(city_population_data.map(data => ({name:data.name, population:data.population[state]})));
    var text_attributes = text.transition()
                              .duration(1000)
                              .attr("x", function(d,i){ return axis_x_scale(d.population) + 5;})
                              .attr("y", function(d,i) { return axis_y_scale(i+1) + 5;})
                              .text(function(d,i){ return d.name;})
                              .style("fill", "red");
    state++;
    if( state == 7) state = 0;
}

d3.select("#update_button").on('click', init);

var intervalId = setInterval(function() {
    if(inited == 1) update();
}, 1000);
