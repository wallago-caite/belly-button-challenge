// Function to build the metadata panel
// uses d3.json() t o fetch data from sample file, extracts metadata fild 
// selects the HTML element where the metadata is clears the content in the panle. 
// appends new data, and the webpage gets updated with the info for the sample selected
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    var mdata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = mdata.filter(x => x.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Clear any existing metadata
    PANEL.html("");

    // Append new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("div").attr("class", "metadata-item").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build both charts
// on input sample, output is a bubble and bar chart.  
// uses plotly, a JS-native, python-native plotting system
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(x => x.id == sample);
    var result = resultArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Define consistent layout options
    var layoutOptions = {
      paper_bgcolor: '#2c3e50',  // Slate theme background
      plot_bgcolor: '#34495e',   // Slightly different plot area color
      font: { color: '#ecf0f1' }, // Light text for dark background
      hoverlabel: { bgcolor: '#34495e', font: { color: '#ecf0f1' } }, // Consistent hover label styling
      margin: { t: 30, l: 150 }
    };

    // Bubble Chart
    var bubbleTrace = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Autumn'
      }
    }];
    var bubbleLayout = Object.assign({
      title: 'Bacteria Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: { title: 'OTU ID' },
      hovermode: 'closest'
    }, layoutOptions);
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    // Bar Chart
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barTrace = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'red'
      }
    }];
    var barLayout = Object.assign({
      title: "Top 10 Bacteria Cultures Found"
    }, layoutOptions);
    Plotly.newPlot("bar", barTrace, barLayout);
  });
}

// Function to run on page load
// suggestion from KK, SN in project-- have a default-loaded function
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    var fieldNames = data.names;

    // Select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Populate the dropdown options
    fieldNames.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Build initial charts and metadata panel with the first sample
    var firstSample = fieldNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel for the selected sample
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

//Resources Kevin Khan, Kourt Bailey(TA), ChatGPT 4.0