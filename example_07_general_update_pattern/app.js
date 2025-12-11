var state = {
    current : "default"
}
var data = [0,1,2,3];

function init() {

}

var data_selection = [];
var dom_elemets_not_in_use = [];
// events
d3.select("#update_button").on('click', function(){
    if (state.current == "default") {
        d3.select("#elements")
          .selectAll("p")
          .data(data)
          .enter()
          .append("p")
          .attr("id", function(d){return "p_" + d;});
        state.current = "created";
    } else if (state.current == "created") {

        data_selection = d3.select("#elements").selectAll("p").data(data);
        state.current = "inited";
    } else if (state.current == "inited") {
        data = [4,5,6,7,8];
        data_selection = d3.select("#elements")
          .selectAll("p")
          .data(data);
        data_selection.enter()
                      .append("p")
                      .attr("id", function(d) { return "p_"+d;});
        state.current = "extended";
    } else if (state.current == "extended") {
        // n.i.y
        state.current = "updated";
    } else if (state.current == "updated") {
        dom_elemets_not_in_use = data_selection.exit();
        state.current = "finish";
    }
});
