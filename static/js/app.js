// Creating function for the data plots
function getPlot(id) {
  // Load data from json file
  d3.json("../data/samples.json").then((data)=> {

    var washing_freq = data.metadata.map(d => d.wfreq)

    // Filter sample values by ID
    var samples = data.samples.filter(s => s.id.toString() === id)[0];

    // Get the top 10
    var sampleValues = samples.sample_values.slice(0,10).reverse();

    // Get top 10 OTU ID's
    var OTU_top10 = samples.otu_ids.slice(0,10).reverse();

    // Change OTU ID's formats for plot
    var OTU_id = OTU_top10.map(d => "OTU " + d)

    // Get top 10 labels for plot
    var labels = samples.otu_labels.slice(0,10);


    //////////////////////////////////////////////////////////////////
    //BAR PLOT
    //////////////////////////////////////////////////////////////////


    // Create trace variable for bar plot
    var trace_bar = {
       x: sampleValues,
       y: OTU_id,
       text: labels,
       marker: {
         color: 'rgb(201,84,96)'
        },
       type: "bar",
       orientation: "h",
    };

    // Create layout variable to set layouts for plots
    var layout_bar = {
      title: "<b>Top 10 OTU</b>",
      "titlefont": {"size": 20},
      yaxis: {
        tickmode: "linear",
      },
      xaxis: {title: "Frequency"},
      margin: {
        l: 100,
        r: 20,
        t: 100,
        b: 30
      }
    };

    // Create data variable
    var data_bar = [trace_bar];

    // Create the bar plot
    Plotly.newPlot("bar", data_bar, layout_bar);


    //////////////////////////////////////////////////////////////////
    //BUBBLE PLOT
    //////////////////////////////////////////////////////////////////


    // Create trace variable for bubble plot
    var trace_bubble = {
      x: samples.otu_ids,
      y: samples.sample_values,
      mode: "markers",
      marker: {
        size: samples.sample_values,
        color: samples.otu_ids
      },
      text: samples.otu_labels
    };

    // Set the layout
    var layout_bubble = {
      title: "<b>Number of OTU</b>",
      "titlefont": {"size": 20,},
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Frequency"},
      height: 600,
      width: 1200
    };

    // Create data variable
    var data_bubble = [trace_bubble]; 

    // Create the bubble plot
    Plotly.newPlot("bubble", data_bubble, layout_bubble);


    //////////////////////////////////////////////////////////////////
    //GAUGE CHART
    //////////////////////////////////////////////////////////////////

    var data_gauge = [{
      domain: { x: [0,1], y: [0,1] },
      value: parseFloat(washing_freq),
      title: "<b>Belly Button Washing Frequency</b><br><i>Scrubs Per Week</i>",
      "titlefont": {"size": 20,},
      type: "indicator",
      mode: "gauge+number",
      gauge: { axis: { range: [null, 10] },
              steps: [
                { range: [0,2], color: 'rgb(230,230,230)' },
                { range: [2,4], color: 'rgb(242,219,202)' },
                { range: [4,6], color: 'rgb(228,144,127)' },
                { range: [6,8], color: 'rgb(214,113,111)' },
                { range: [8,10], color: 'rgb(201,84,96)' },
              ]}
    }
    ];

    var layout_gauge = {
      width: 700,
      height: 600,
      margin: {
        t:20,
        b:40,
        l: 0,
        r: 275 }
      };

    Plotly.newPlot("gauge", data_gauge, layout_gauge);

  });
}

// Create the function to get the necessary data

function getInfo(id) {

  // Load data from json file
  d3.json("../data/samples.json").then((data)=> {
  
    // Get the metadata info for the demographic panel
    var metadata = data.metadata;
    console.log(metadata)

    // Filter metadata info by ID
    var result = metadata.filter(meta => meta.id.toString() === id)[0];

    // Select demographic panel
    var demographic_info = d3.select("#sample-metadata");

    // Empty the demographic_info panel each time
    demographic_info.html("");

    // Get the necessary demographic data for the ID and append to panel
    Object.entries(result).forEach((key) => {
      demographic_info.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
    });
  });
}

// Create the function for the change event
function optionChanged(id) {
  getPlot(id);
  getInfo(id);
}

// Create the function for the initial data rendering
function init() {

  // Select dropdown menu
  var dropdown = d3.select("#selDataset");

  // Read the data
  d3.json("../data/samples.json").then((data)=> {

    // Get the ID data to dropdown menu
    data.names.forEach(function(name){
      dropdown.append("option").text(name).property("value");
    });

    // Call the functions to display the data and plots
    getPlot(data.names[0]);
    getInfo(data.names[0]);
  
  });
}

init();