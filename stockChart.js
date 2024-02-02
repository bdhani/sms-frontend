let apiUrl = '';
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
    const stockId = getURLParameter('id');
    apiUrl = `https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/stocks/get?id=${stockId}`;
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
                            count: 1,
                            label: '1 min',
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

function getURLParameter(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}
// Update the chart 
setInterval(updateChart, 3000);

// document.getElementById('refreshChart').addEventListener('click', function () {
   

//     updateChart();
// });

// Initial chart update
createChart();

