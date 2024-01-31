let stockOptions = [];
let stockPrice = 0;
async function populateStockOptions() {
    try {
        
        const stockDetails = `https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/stocks/getAllStocks`;
        const response = await fetch(stockDetails);
        const data = await response.json();
        stockOptions = data.data;
        console.log(stockOptions)
        } catch (error) {
        console.error(`Error fetching stock details`, error);
        
    }

    const stockSelection = document.getElementById('stockSelection');
    
    stockOptions.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock._id;
        option.textContent = `${stock.companyName}`;
        stockSelection.appendChild(option);
    });
}


async function fetchTeamDetails(teamId) {
    try {
        
        const teamDetailsEndpoint = `https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/teams/get?id=${teamId}`;
        const response = await fetch(teamDetailsEndpoint);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching team details for Team ID ${teamId}:`, error);
        return {};
    }
}

// Function to update team details and available balance
async function updateTeamDetailsAndBalance() {
    const teamId = document.getElementById('teamId').value;
    console.log(typeof teamId)
    // Fetch team details
    const teamDetails = await fetchTeamDetails(teamId);
    console.log(teamDetails.teamId)

    // Update team details in the UI
    // document.getElementById('teamId').textContent = teamDetails.teamId || 'N/A';
    document.getElementById('teamName').textContent = teamDetails.teamName || 'N/A';
    document.getElementById('availableBalance').textContent = teamDetails.currentBalance.toFixed(2) || '0.00';
}

// Function to calculate the total trade amount
// function calculateTotalTradeAmount() {
//     const stockId = document.getElementById('stockSelection').value;
//      fetchLatestStockPrices(stockId).then(price => stockPrice = price)
//     console.log(stockPrice);
//     const quantity = parseInt(document.getElementById('quantity').value, 10) || 0;
//     const totalTradeAmount = (quantity * stockPrice).toFixed(2);
//     document.getElementById('totalTradeAmount').textContent = totalTradeAmount;
// }

// Event listener for the Calculate Amount button
//document.getElementById('calculateAmountButton').addEventListener('click', calculateTotalTradeAmount);


// async function fetchLatestStockPrices(id) {
//     try {
//         const pricesApiUrl = `https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/stocks/get?id=${id}`;
    
//         const response = await fetch(pricesApiUrl);
//         const data = await response.json();

//         // Update global stockPrices variable
//         return data.data.sellingPrice;

//         //console.log('Latest stock prices:', stockPrices);
//     } catch (error) {
//         console.error('Error fetching stock prices:', error);
//     }
// }



// Global variable to store the broker ID after login
let brokerId = null;

// Function to handle broker login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const loginApiUrl = 'https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/brokers/auth';

        const response = await fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const responseData = await response.json();
        console.log(responseData)

        if (responseData.statusCode === 200) {
            // Login successful, store broker ID
            brokerId = responseData.data;

            // Hide the login section and show the broker interface section
            document.getElementById('brokerLoginForm').classList.add('hidden');
            document.getElementById('brokerForm').classList.remove('hidden');

            // Fetch latest stock prices (assuming this function is defined in your app)
            // fetchLatestStockPrices();
        } else {
            // Handle login failure
            alert(`Login failed. ${responseData.error}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. An unexpected error occurred.');
    }
}

// Function to handle placing an order
async function placeOrder() {
    const teamId = document.getElementById('teamId').value;
    const stockSelection = document.getElementById('stockSelection');
    const orderType = document.getElementById('orderType').value;

    const quantity = document.getElementById('quantity').value;

    // Perform error handling (add your own validation logic)
    if (!teamId || !quantity || isNaN(quantity) || quantity <= 0) {
        alert('Please enter valid values for Team ID and Quantity.');
        return;
    }

    const stockid = stockSelection.value;
   // const price = calculatePrice(quantity, stockSymbol);

    try {
    
        const orderApiUrl = 'https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/transactions/add';

        const response = await fetch(orderApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                brokerId: brokerId,
                teamId: teamId,
                stockId: stockid,
                numberOfStocks: parseInt(quantity),
                type: orderType,
            }),
        });

        const responseData = await response.json();
        console.log(responseData)

        if (responseData.statusCode === 200) {
            // Order placed successfully
            alert(`Order placed!\nTeam ID: ${teamId}\nStock: ${stockid}\nQuantity: ${quantity}\n`);
        } else {
            // Handle specific error cases
            if (responseData.statusCode === 410) {
                alert(`Failed to place order. Error: ${responseData.message}`);
            } else if (responseData.statusCode === 411) {
                alert('Failed to place order. Insufficient quantity of stocks available  to sell ');
            } 
            else if (responseData.statusCode === 409) {
                alert('Failed to place order. Insufficient quantity of stocks available to buy');
            }
            else {
                // Handle other generic errors
                alert(`Failed to place order. Error: ${responseData.message}`);
            }
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. An unexpected error occurred.');
    }
}





// Function to clear the form
function clearForm() {
    document.getElementById('teamId').value = '';
    document.getElementById('stockSelection').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('price').value = '';
}
document.getElementById('loginBtn').addEventListener('click', login);
// Event listener for the Place Order button
document.getElementById('placeOrder').addEventListener('click', placeOrder);

// Event listener for the Clear Form button
//document.getElementById('calculate').addEventListener('click', calculateTotalTradeAmount);

document.getElementById("getDetails").addEventListener('click', updateTeamDetailsAndBalance );
// setInterval(fetchLatestStockPrices, 300000);
// fetchLatestStockPrices();

//  setInterval(fetchLatestStockPrices, 300000);
//  fetchLatestStockPrices();

// Populate stock options on page load
populateStockOptions();
