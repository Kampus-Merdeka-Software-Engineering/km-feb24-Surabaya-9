fetch('nyc_sales.json')
    .then(response => response.json())
    .then(data => {
        const neighborhoodCount = data.reduce((acc, item) => {
            if (!acc[item.Building_Category]) {
                acc[item.Building_Category] = new Set();
            }
            acc[item.Building_Category].add(item.Neighborhood);
            return acc;
        }, {});

        const labels = Object.keys(neighborhoodCount);
        const counts = labels.map(category => neighborhoodCount[category].size);

        var ctx = document.getElementById('barChart2').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Neighborhoods Sold',
                    data: counts,
                    backgroundColor: [
                        'rgba(0, 0, 255, 1)'
                    ],
                    borderColor: [
                        'rgba(0, 0, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the data:', error);
    });
