// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    var mdata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = mdata.filter(x => x.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    PANEL.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("div").attr("class", "metadata-item").text(`${key.toUpperCase()}: ${value}`);});
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;
    
    // Filter the samples for the object with the desired sample number
    var resultArray = samples.filter(x => x.id == sample);
    var result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build a Bubble Chart
    var bubbleTrace = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Portland'
      }
    }];

    // Render the Bubble Chart
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: { title: 'OTU ID' },
      hovermode: 'closest',
       colorscale: 'Portland'
    };
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barTrace = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'blue'
      }
    }];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 },
      paper_bgcolor: 'black',  
      plot_bgcolor: 'black'    
    };

        // Render the Bar Chart
    Plotly.newPlot("bar", barTrace, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var Field_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    Field_names.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);});

    // Get the first sample from the list
    var firstSample = Field_names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener

function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

//References for this project: Jeremiah Mergenthaler, Saad Nasir