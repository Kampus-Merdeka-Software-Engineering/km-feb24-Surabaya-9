document.getElementById('filterButton').addEventListener('click', function() {
    var input = document.getElementById('filterInput').value;
    var filterValue = input.toLowerCase();
    var table = document.getElementById('salesTable');
    var rows = table.getElementsByTagName('tr');
    var warningMessage = document.getElementById('warningMessage');
    var datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (datePattern.test(input)) {
        warningMessage.style.display = 'none';
        for (var i = 1; i < rows.length; i++) {
            var cell = rows[i].getElementsByTagName('td')[0];
            if (cell) {
                var cellValue = cell.textContent || cell.innerText;
                if (cellValue.toLowerCase().indexOf(filterValue) > -1) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }
    } else {
        alert('Please enter a date in the format DD/MM/YYYY.');
    }

    for (var i = 1; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName('td')[10]; 
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
