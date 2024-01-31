const apiUrl = 'https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/stocks/get?id=65b956bda5fc62b5de7d59e7';

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
    const data = await fetchData();

    if (data) {

        
        document.getElementById('companyName').innerText = data.data.companyName;
        document.getElementById('price').innerText = data.data.sellingPrice.toFixed(2);
        document.getElementById('valuation').innerText = data.data.valuation.toFixed(2);
        const chartData = [{
            x: data.data.logs.map( key => key.createdAt ),
            y: data.data.logs.map( key => key.price ),
            type: 'line',
            mode: 'lines+markers',
            marker: {color: 'blue'},
        }];

        const layout = {
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

// Update the chart every 2 minutes
setInterval(updateChart, 1000);

// document.getElementById('refreshChart').addEventListener('click', function () {
   

//     updateChart();
// });

// Initial chart update
updateChart();
