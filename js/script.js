document.addEventListener("DOMContentLoaded", () => {
    async function renderCharts() {
        try {
            // Fetch data
            const response = await fetch('nyc_sales.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            // Filter data for May and August
            const filteredDataMay = data.filter(item => new Date(item.Sale_Date).getMonth() === 4); // Mei
            const filteredDataAugust = data.filter(item => new Date(item.Sale_Date).getMonth() === 7); // Agustus
            renderFactor(filteredDataMay, filteredDataAugust);

            // Filter data for the year 2017
            const filteredData = data.filter(item => new Date(item.Sale_Date).getFullYear() === 2017);

            // Calculate average sales price per month 
            const salesByMonth = {};
            filteredData.forEach(item => {
                const saleDate = new Date(item.Sale_Date);
                const month = saleDate.toLocaleString('default', { month: 'short' });

                if (!salesByMonth[month]) {
                    salesByMonth[month] = { total: 0, count: 0 };
                }
                salesByMonth[month].total += parseFloat(item.Sale_Price);
                salesByMonth[month].count += 1;
            });
            const monthlyAverages = Object.keys(salesByMonth).map(month => ({
                month, 
                average: salesByMonth[month].total / salesByMonth[month].count})).sort((a, b) => new Date(`1 ${a.month} 2017`) - new Date(`1 ${b.month} 2017`));
            const labels = monthlyAverages.map(item => item.month);
            const averagePrices = monthlyAverages.map(item => item.average);
            
            // Chart 2: Borough Distribution
            const boroughMayAugust = data.filter(item => {
                const saleDate = new Date(item.Sale_Date);
                const saleYear = saleDate.getFullYear();
                const saleMonth = saleDate.getMonth() + 1;
                return saleYear === 2017 && saleMonth >= 5 && saleMonth <= 8;
            });
            const boroughSales = {};
            boroughMayAugust.forEach(item => {
                if (!boroughSales[item.Borough]) {
                    boroughSales[item.Borough] = 0;
                }
                boroughSales[item.Borough] += parseInt(item.Sale_Price);
            });
            const boroughLabels = Object.keys(boroughSales);
            const boroughData = Object.values(boroughSales);

            // Chart 3: Total Sales in Building Category of Borough 5 (Bar Chart)
            const buildingData = data.filter(item => item.Borough === "5");
            const buildingSales = {};
            buildingData.forEach(item => {
                if (!buildingSales[item.Building_Category]) {
                    buildingSales[item.Building_Category] = 0;
                }
                buildingSales[item.Building_Category] += parseInt(item.Sale_Price);
            });
            const buildingLabels = Object.keys(buildingSales);
            const buildingValues = Object.values(buildingSales);

            // Chart 4: Top Neighborhoods by Commercial Unit Type
            const topNeighborhoods = ["EAST ELMHURST", "NEW SPRINGVILLE", "MIDTOWN WEST", "FINANCIAL", "BOROUGH PARK"];
            const neighborhoodCommercial = topNeighborhoods.reduce((acc, neighborhood) => {
                acc[neighborhood] = data.filter(item => item.Neighborhood === neighborhood).reduce((sum, item) => sum + parseInt(item.Commercial_Unit, 10), 0);
                return acc;
            }, {});

            // Chart 5: Top Building Classes by Neighborhood
            const buildingCategories = [
                '01 ONE FAMILY DWELLINGS',
                '02 TWO FAMILY DWELLINGS',
                '03 THREE FAMILY DWELLINGS',
                '22 STORE BUILDINGS',
                '13 CONDOS - ELEVATOR APARTMENTS'
            ];
            const neighborhoodCount = buildingCategories.reduce((acc, category) => {
                acc[category] = new Set(data.filter(item => item.Building_Category === category).map(item => item.Neighborhood));
                return acc;
            }, {});

            // chart 6,7,8: May to August sales decline analysis.
            function renderFactor(dataMay, dataAugust) {
                renderSalesFactor('chart6', dataMay, dataAugust, 'Borough', 'Total Sales by Borough');
                renderSalesFactor('chart7', dataMay, dataAugust, 'Neighborhood', 'Total Sales by Neighborhood');
                renderSalesFactor('chart8', dataMay, dataAugust, 'Building_Category', 'Total Sales by Building Category');
            }

            function calculateSalesByCategory(data, category) {
                return data.reduce((salesByCategory, item) => {
                    const categoryValue = item[category];
                    salesByCategory[categoryValue] = (salesByCategory[categoryValue] || 0) + parseInt(item.Sale_Price);
                    return salesByCategory;
                }, {});
            }
            
            function renderSalesFactor(canvasId, dataMay, dataAugust, category, title) {
                const salesByCategoryMay = calculateSalesByCategory(dataMay, category);
                const salesByCategoryAugust = calculateSalesByCategory(dataAugust, category);
                const allCategories = new Set([...Object.keys(salesByCategoryMay), ...Object.keys(salesByCategoryAugust)]);
                const labels = Array.from(allCategories);
                const dataMayValues = labels.map(label => salesByCategoryMay[label] || 0);
                const dataAugustValues = labels.map(label => salesByCategoryAugust[label] || 0);
            
                // Calculate the absolute differences
                const differences = labels.map((label, index) => Math.abs(dataMayValues[index] - dataAugustValues[index]));
            
                // Sort the data by differences to get top 10 with largest differences
                const sortedIndices = [...labels.keys()].sort((a, b) => differences[b] - differences[a]);
                const top10Indices = sortedIndices.slice(0, 10);
                const top10Labels = top10Indices.map(i => labels[i]);
                const top10DataMayValues = top10Indices.map(i => dataMayValues[i]);
                const top10DataAugustValues = top10Indices.map(i => dataAugustValues[i]);
                const chartData = {
                    labels: top10Labels,
                    datasets: [{
                        label: 'May',
                        data: top10DataMayValues,
                        backgroundColor: 'blue',
                        borderWidth: 1
                    }, {
                        label: 'August',
                        data: top10DataAugustValues,
                        backgroundColor: 'red',
                        borderWidth: 1
                    }]
                };
            
                const chartOptions = {
                    responsive: true,
                    indexAxis: 'y',
                    scales: {
                        x: { beginAtZero: true }
                    }
                };
            
                const canvas = document.getElementById(canvasId);
                const ctx = canvas.getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: chartOptions
                });
            }

            // Render Charts
            renderSalesTrends(labels, averagePrices);
            renderBorough(boroughLabels, boroughData);
            renderBuilding(buildingLabels, buildingValues);
            renderCommercialUnits(neighborhoodCommercial);
            renderBuildingClass(neighborhoodCount);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    renderCharts();
});

function renderSalesTrends(labels, averagePrices) {
    new Chart(document.getElementById('lineChart').getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Average Sales Price',
                data: averagePrices,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 1000000 
                }
            }
        }
    });
}

function renderBorough(labels, data) {
    new Chart(document.getElementById('barChart1').getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Total Sales',
                data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: { 
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderBuilding(labels, data) {
    const sortedData = labels.map((label, index) => ({ label, data: data[index] })).sort((a, b) => a.data - b.data);
    const bottom10Labels = sortedData.slice(0, 10).map(item => item.label); 
    const bottom10Data = sortedData.slice(0, 10).map(item => item.data); 
    new Chart(document.getElementById('barChart3').getContext('2d'), {
        type: 'bar',
        data: {
            labels: bottom10Labels,
            datasets: [{
                label: 'Total Sales',
                data: bottom10Data, 
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: { x: { beginAtZero: true } },
            responsive: true
        }
    });
}


function renderCommercialUnits(neighborhoodCommercial) {
    new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: Object.keys(neighborhoodCommercial),
            datasets: [{
                label: 'Total Commercial Units',
                data: Object.values(neighborhoodCommercial),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            responsive: true
        }
    });
}

function renderBuildingClass(neighborhoodCount) {
    const labels = Object.keys(neighborhoodCount);
    const counts = Object.values(neighborhoodCount).map(set => set.size);
    new Chart(document.getElementById('barChart2').getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Neighborhoods Sold',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: { x: { beginAtZero: true } },
            responsive: true
        }
    });
}
