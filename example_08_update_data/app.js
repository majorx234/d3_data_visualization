var data_year = [1750, 1775, 1800, 1825, 1850, 1875, 1900];

var city_population_data = [
  {"london":[676000, 710000, 861000, 1335000, 2320000, 4241000, 6480000]},
  {"Lisabon":[130000, 219000, 237000, 258000, 262000, 243000, 363000]},
  {"Berlin": [113000, 136000, 172000, 222000, 446000, 1045000, 2707000]},
  {"Madrid": [110000, 132000, 182000, 201000, 216000, 373000, 539000]},
  {"Paris": [556000, 600000, 547000, 855000, 1314000, 2250000, 3330000]},
  {"Amsterdam": [219000, 209000, 195000, 196000, 225000, 289000, 510000]},
  {"Rom": [146000, 148000, 142000, 125000, 158000, 251000, 438000]},
  {"Istanbul": [625000, 600000, 570000, 675000, 785000, 873000, 900000]},
  {"Moskow": [146000, 177000, 248000, 257000, 373000, 600000, 1120000]}
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
var axis_x_scale = d3.scaleLinear().domain([100000, 7000000]).range([0,width]);
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

d3.select("#update_button").on('click', function(){

});
