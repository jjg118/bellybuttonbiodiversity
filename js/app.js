function buildMetaData(sample){
    d3.json("samples.json").then((data) => { 
    var metadata = data.metadata;
    var resultArrary = metadata.filter (sampleobject => sampleobject.id == sample);
    var result = resultArrary[0];
    var panel= d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
}

function buildChart(sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;
        var layout = {
            title: "bacteria samples",
            margin: {t:0},
            xaxis: {title:"otu_ids"},
            margin: {t:30},
        };
        var data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
    ];
    Plotly.newPlot("bubble",data,layout);
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
var bar_data = [{
    y: yticks,
    x: sample_values.slice(0,10).reverse(),
    text: otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
}];
var bar_layout = {
    title: "bacteria found",
    margin: {t:30,l:150}
};
Plotly.newPlot("bar",bar_data,bar_layout);
    });
}
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildChart(firstSample);
      buildMetaData(firstSample);
    });
  }
function optionChanged(newSample){
    buildChart(newSample);
    buildMetaData(newSample);
}
init();


