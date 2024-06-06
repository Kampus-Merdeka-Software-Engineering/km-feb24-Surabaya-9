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
        alert('No data found matching the filter value.');
    }
});