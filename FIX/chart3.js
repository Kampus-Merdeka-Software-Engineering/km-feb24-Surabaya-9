document.addEventListener('DOMContentLoaded', function () {
    fetch('nyc_sales.json')
        .then(response => response.json())
        .then(data => {
            const neighborhoodCommercialUnits = data.reduce((acc, item) => {
                if (!acc[item.Neighborhood]) {
                    acc[item.Neighborhood] = 0;
                }
                acc[item.Neighborhood] += parseInt(item.Commercial_Unit);
                return acc;
            }, {});

            const neighborhoods = Object.keys(neighborhoodCommercialUnits);
            const commercialUnits = Object.values(neighborhoodCommercialUnits);

            const ctx = document.getElementById('barChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: neighborhoods,
                    datasets: [{
                        label: 'Total Commercial Units',
                        data: commercialUnits,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
});
