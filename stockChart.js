const apiUrl = 'https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/stocks/get?id=65b956bda5fc62b5de7d59e7';
let chartData =[];
let chartUpdate = {};
let layout = {};
async function fetchData() {
    try {
        const response = await fetch(apiUrl);

        const data = await response.json();
        console.log(data);
      return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


// async function updateChart() {

//     const data = await fetchData();

//     chartData = [{
//         x: data.data.logs.map( key => key.createdAt ),
//         y: data.data.logs.map( key => key.price ),
//         type: 'line',
//         mode: 'lines+markers',
//         marker: {color: 'blue'},
//     }];
//     console.log(chartData)
//      Plotly.update('stockPriceChart', chartData, layout);

// }

async function updateChart() {
    const newData = await fetchData();
    let len = newData.data.logs.length;
    let tim = newData.data.logs[len-1].createdAt;
    let price = newData.data.logs[len-1].price;

    if (newData) {

        // Extend the existing chart traces with new data
        Plotly.extendTraces('stockPriceChart', {
            x: [[tim]],
            y: [[price]],
        },[0]); 
        document.getElementById('companyName').innerText = newData.data.companyName;
        document.getElementById('price').innerText = newData.data.sellingPrice.toFixed(2);
        document.getElementById('valuation').innerText = newData.data.valuation.toFixed(2);
    }
}

async function createChart() {
    const data = await fetchData();

    if (data) {

        
        document.getElementById('companyName').innerText = data.data.companyName;
        document.getElementById('price').innerText = data.data.sellingPrice.toFixed(2);
        document.getElementById('valuation').innerText = data.data.valuation.toFixed(2);
         chartData = [{
            x: data.data.logs.map( key => key.createdAt ),
            y: data.data.logs.map( key => key.price ),
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'blue'},
        }];

         layout = {
            title: 'Stock Price vs Time',
            xaxis: {
                title: 'Time',
                rangeselector: {
                    buttons: [
                        {
                            count: 1,
                            label: '1 sec',
                            step: 'second',
                            stepmode: 'backward',
                        },
                        {
                            count: 30,
                            label: '30 mins',
                            step: 'minute',
                            stepmode: 'backward',
                        },
                        {
                            count: 1,
                            label: '1 hr',
                            step: 'hour',
                            stepmode: 'backward',
                        },
                        {
                            count: 1,
                            label: '1 day',
                            step: 'day',
                            stepmode: 'backward',
                        },
                        {
                            label: 'All',
                            step: 'all',
                        },
                    ],
                },
                type: 'date',
            },
            yaxis: {
                title: 'Stock Price',
            },
        };

        Plotly.newPlot('stockPriceChart', chartData, layout);
    }
}
async function updateData() {

    const data = await fetchData();

    if (data) {

        
        document.getElementById('companyName').innerText = data.data.companyName;
        document.getElementById('price').innerText = data.data.sellingPrice.toFixed(2);
        document.getElementById('valuation').innerText = data.data.valuation.toFixed(2);
         updateData = {
            x: data.data.logs.map( key => key.createdAt ),
            y: data.data.logs.map( key => key.price ),
            type: 'line',
            mode: 'lines+markers',
            marker: {color: 'blue'},
        };

         layout = {
            title: 'Stock Price vs Time',
            xaxis: {
                title: 'Time',
                rangeselector: {
                    buttons: [
                        {
                            count: 1,
                            label: '1 sec',
                            step: 'second',
                            stepmode: 'backward',
                        },
                        {
                            count: 30,
                            label: '30 mins',
                            step: 'minute',
                            stepmode: 'backward',
                        },
                        {
                            count: 1,
                            label: '1 hr',
                            step: 'hour',
                            stepmode: 'backward',
                        },
                        {
                            count: 1,
                            label: '1 day',
                            step: 'day',
                            stepmode: 'backward',
                        },
                        {
                            label: 'All',
                            step: 'all',
                        },
                    ],
                },
                type: 'date',
            },
            yaxis: {
                title: 'Stock Price',
            },
        };

    }
}
// Update the chart 
setInterval(updateChart, 1000);

// document.getElementById('refreshChart').addEventListener('click', function () {
   

//     updateChart();
// });

// Initial chart update
createChart();

