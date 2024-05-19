document.getElementById('filterButton').addEventListener('click', function() {
    var filterValue = document.getElementById('filterInput').value.toLowerCase();
    var table = document.getElementById('salesTable');
    var rows = table.getElementsByTagName('tr');

    for (var i = 1; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName('td')[10]; // Kolom 11 (Sale Date)
        if (cell) {
            var cellValue = cell.textContent || cell.innerText;
            if (cellValue.toLowerCase().indexOf(filterValue) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
});