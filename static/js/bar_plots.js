// Part 1
var trace1 = {
  x: ['NOCHE BUENA',
  'NATIVITAS',
  'GENERAL PEDRO MA ANAYA',
  'TLACOQUEMECATL',
  'NAPOLES',
  'MIXCOAC',
  'NARVARTE PONIENTE',
  'SAN PEDRO DE LOS PINOS',
  'ALAMOS',
  'INDEPENDENCIA'],
  y: [126.51,
    93.88,
    63.04,
    57.16,
    47.58,
    36.64,
    35.45,
    32.43,
    29.74,
    29.09],
  type: "bar",
  responsive: true,
  orientation: 'v',
  marker: {
    color: 'rgb(25,99,161)'
  }
};

var data = [trace1];

var layout = {
  //title: "'Bar' Chart"
};

Plotly.newPlot("plot", data, layout);


// // Part 2 - Adding attributes
// var trace1 = {
//   x: ["beer", "wine", "martini", "margarita",
//       "ice tea", "rum & coke", "mai tai", "gin & tonic"],
//   y: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
//   type: "bar"
// };

// var data = [trace1];

// var layout = {
//   title: "'Bar' Chart",
//   xaxis: { title: "Drinks"},
//   yaxis: { title: "% of Drinks Ordered"}
// };

// Plotly.newPlot("plot", data, layout);


// // Part 3 - Line Chart
// var trace1 = {
//   x: ["beer", "wine", "martini", "margarita",
//       "ice tea", "rum & coke", "mai tai", "gin & tonic"],
//   y: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
//   type: "line"
// };

// var data = [trace1];

// var layout = {
//   title: "'Bar' Chart",
// };

// Plotly.newPlot("plot", data, layout);

// // Part 4 - Broken Pie Chart
// var trace1 = {
//   x: ["beer", "wine", "martini", "margarita",
//       "ice tea", "rum & coke", "mai tai", "gin & tonic"],
//   y: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
//   type: "pie"
// };

// var data = [trace1];

// var layout = {
//   title: "'Bar' Chart",
// };

// Plotly.newPlot("plot", data, layout);


// // Part 5 - Working Pie Chart
// var trace1 = {
//   labels: ["beer", "wine", "martini", "margarita",
//       "ice tea", "rum & coke", "mai tai", "gin & tonic"],
//   values: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
//   type: 'pie'
// };

// var data = [trace1];

// var layout = {
//   title: "'Bar' Chart",
// };

// Plotly.newPlot("plot", data, layout);

