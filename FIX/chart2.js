fetch('nyc_sales.json')
  .then(response => response.json())
  .then(salesData => {
    var totalBorough = {};

    salesData.forEach(function(item) {
        if (!totalBorough[item.Building_Category]) {
            totalBorough[item.Building_Category] = 0;
        }
        totalBorough[item.Building_Category] += parseInt(item.Borough);
    });

    var labels = Object.keys(totalBorough);
    var data = Object.values(totalBorough);

    var ctx = document.getElementById('doughnut').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Borough',
                data: data,
                backgroundColor: [
                    'rgba(173, 216, 230, 1)',
                    'rgba(135, 206, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderColor: [
                    'rgba(173, 216, 230, 1)',
                    'rgba(135, 206, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
  })
  .catch(error => console.error('Error fetching data:', error));
