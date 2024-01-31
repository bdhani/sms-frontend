const newsApiUrl = 'https://stock-market-simulator-qn698.ondigitalocean.app/news';

// Function to fetch news data from the API
async function fetchNews() {
    try {
        const response = await fetch(newsApiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        return null;
    }
}

// Function to update the news section
async function updateNews() {
    const newsSection = document.getElementById('newsSection');
    const refreshButton = document.getElementById('refreshNews');
    
    const newsData = await fetchNews();

    if (newsData) {
        // Clear existing news cards
        newsSection.innerHTML = '';

        // Update news cards
        newsData.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'bg-white p-4 rounded-md shadow-md';

            const timeElement = document.createElement('div');
            timeElement.className = 'text-gray-500 mb-2';
            timeElement.textContent = news.time;
            newsCard.appendChild(timeElement);

            const titleElement = document.createElement('h3');
            titleElement.className = 'text-xl font-bold mb-2';
            titleElement.textContent = news.title;
            newsCard.appendChild(titleElement);

            const textElement = document.createElement('p');
            textElement.className = 'text-gray-600';
            textElement.textContent = news.text;
            newsCard.appendChild(textElement);

            newsSection.appendChild(newsCard);
        });

        // Highlight the most recent news
        const firstNewsCard = newsSection.firstChild;
        if (firstNewsCard) {
            firstNewsCard.classList.add('bg-yellow-200');
        }
    }

    // Enable the refresh button after updating news
    refreshButton.disabled = false;
}

// Event listener for the refresh button
// document.getElementById('refreshNews').addEventListener('click', function () {
//     // Disable the refresh button during the update
//     this.disabled = true;

//     // Update the news section
//     updateNews();
// });

// Initial news update
updateNews();
