document.addEventListener("DOMContentLoaded", () => {
  const entriesSelect = document.getElementById("entries-select");
  const tableBody = document.querySelector("#data-table tbody");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");
  const filterInput = document.getElementById("filterInput");
  const filterButton = document.getElementById("filterButton");
  const warningMessage = document.getElementById("warningMessage");

  let allData = [];
  let filteredData = [];
  let currentPage = 1;
  let entriesPerPage = parseInt(entriesSelect.value);
  let currentSortColumn = -1;
  let currentSortOrder = 'asc';

  // Fetch data from JSON file
  fetch('nyc_sales.json')
    .then(response => response.json())
    .then(data => {
      allData = data;
      filteredData = allData;
      updateTable();
    })
    .catch(error => console.error('Error loading data:', error));

  // Function to display data
  function displayData(page, entries) {
    tableBody.innerHTML = '';
    const start = (page - 1) * entries;
    const end = start + entries;
    const paginatedData = filteredData.slice(start, end);

    paginatedData.forEach(item => {
      const row = document.createElement("tr");

      const keys = ["Borough", "Neighborhood", "Building_Category", "Address", "Total_Unit", "Year_Build", "Sale_Price", "Sale_Date"];
      keys.forEach(key => {
        const cell = document.createElement("td");
        cell.textContent = item[key];
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });
  }

  function updateTable() {
    entriesPerPage = parseInt(entriesSelect.value);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    displayData(currentPage, entriesPerPage);
    pageInfo.textContent = `Showing ${((currentPage - 1) * entriesPerPage) + 1} to ${Math.min(currentPage * entriesPerPage, filteredData.length)} of ${filteredData.length} entries`;

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  }

  // Event listener for dropdown change
  entriesSelect.addEventListener("change", () => {
    currentPage = 1;
    updateTable();
  });

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
    }
  });

  nextPageButton.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateTable();
    }
  });

  // Function to sort data
  function sortData(column, order) {
    filteredData.sort((a, b) => {
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
    const columns = ["Borough", "Neighborhood", "Building_Category", "Address", "Total_Unit", "Year_Build", "Sale_Price", "Sale_Date"];
    const column = columns[columnIndex];

    if (currentSortColumn === columnIndex) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = columnIndex;
      currentSortOrder = 'asc';
    }
    
    sortData(column, currentSortOrder);
    updateSortIcons(columnIndex);
    updateTable();
  };

  // Function to filter data
  function filterData(query) {
    filteredData = allData.filter(item => {
      return Object.values(item).some(value => value.toString().toLowerCase().includes(query.toLowerCase()));
    });
    currentPage = 1;
    updateTable();
  }

  // Event listener for filter button
  filterButton.addEventListener("click", () => {
    const query = filterInput.value;
    if (query) {
      filterData(query);
      warningMessage.style.display = 'none';
    } else {
      warningMessage.textContent = "Please enter a valid filter query.";
      warningMessage.style.display = 'block';
    }
  });
});

document.getElementById('filterButton').addEventListener('click', function() {
  var input = document.getElementById('filterInput').value;
  var filterValue = input.toLowerCase();
  var table = document.getElementById('data-table');
  var rows = table.getElementsByTagName('tr');
  var columns = table.rows[0].getElementsByTagName('th').length;
  var matchFound = false;

  for (var i = 1; i < rows.length; i++) {
      var display = false;
      for (var j = 0; j < columns; j++) {
          var cell = rows[i].getElementsByTagName('td')[j];
          if (cell) {
              var cellValue = cell.textContent || cell.innerText;
              if (cellValue.toLowerCase().indexOf(filterValue) > -1) {
                  display = true;
                  matchFound = true;
                  break;
              }
          }
      }
      if (display) {
          rows[i].style.display = "";
      } else {
          rows[i].style.display = "none";
      }
  }

  if (!matchFound) {
      alert('No data found matching the filter value. Please entry with data type of String or Number or Date with format (yyyy-mm-dd)!');
  }
});
