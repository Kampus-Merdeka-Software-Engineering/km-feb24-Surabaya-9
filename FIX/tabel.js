document.addEventListener("DOMContentLoaded", () => {
    const entriesSelect = document.getElementById("entries-select");
    const tableBody = document.querySelector("#data-table tbody");
    let allData = [];
    let currentSortColumn = -1;
    let currentSortOrder = 'asc';
  
    // Fetch data from JSON file
    fetch('nyc_sales.json')
      .then(response => response.json())
      .then(data => {
        allData = data;
        displayData(15);  // Default display
      })
      .catch(error => console.error('Error loading data:', error));
  
    // Function to display data
    function displayData(entries) {
      tableBody.innerHTML = '';  // Clear current data
  
      const limitedData = allData.slice(0, entries);
      limitedData.forEach(item => {
        const row = document.createElement("tr");
  
        for (const key in item) {
          const cell = document.createElement("td");
          cell.textContent = item[key];
          row.appendChild(cell);
        }
  
        tableBody.appendChild(row);
      });
    }
  
    // Event listener for dropdown change
    entriesSelect.addEventListener("change", (event) => {
      const entries = parseInt(event.target.value);
      displayData(entries);
    });
  
    // Function to sort data
    function sortData(column, order) {
      allData.sort((a, b) => {
        if (a[column] < b[column]) {
          return order === 'asc' ? -1 : 1;
        }
        if (a[column] > b[column]) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  
    // Function to update sort icons
    function updateSortIcons(columnIndex) {
      document.querySelectorAll('.sort-icon').forEach((icon, index) => {
        if (index === columnIndex) {
          icon.classList.remove('asc', 'desc');
          icon.classList.add(currentSortOrder);
        } else {
          icon.classList.remove('asc', 'desc');
        }
      });
    }
  
    // Global function to be called on th click
    window.sortTable = (columnIndex) => {
      const columns = [
        "Borough", "Neighborhood", "Building_Category", "Building_Class",
        "Address", "Residential_Unit", "Commercial_Unit", "Total_Unit",
        "Year_Build", "Sale_Price", "Sale_Date"
      ];
      const column = columns[columnIndex];
  
      if (currentSortColumn === columnIndex) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortColumn = columnIndex;
        currentSortOrder = 'asc';
      }
      
      sortData(column, currentSortOrder);
      updateSortIcons(columnIndex);
      displayData(parseInt(entriesSelect.value));
    };
  });
  