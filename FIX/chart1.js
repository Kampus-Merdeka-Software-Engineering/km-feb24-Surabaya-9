async function fetchData() {
    try {
        const response = await fetch('nyc_sales.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error: ', error);
    }
}

function processData(data) {
    const salesByDate = {};

    data.forEach(item => {
        const saleDate = new Date(item.Sale_Date).toLocaleDateString();
        const salePrice = parseInt(item.Sale_Price);
        
        if (salesByDate[saleDate]) {
            salesByDate[saleDate] += salePrice;
        } else {
            salesByDate[saleDate] = salePrice;
        }
    });

    const labels = Object.keys(salesByDate);
    const salePrices = Object.values(salesByDate);

    return { labels, salePrices };
}

async function renderChart() {
    const data = await fetchData();
    if (!data) {
        console.error('No data found');
        return;
    }
    const { labels, salePrices } = processData(data);

    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Sales Price',
                data: salePrices,
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

renderChart();
