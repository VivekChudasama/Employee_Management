const BASE_API = 'http://localhost:3001/employees';

const fetchEmployees = async (search = '') => {
    try {
        const res = await fetch(`${BASE_API}?search=${encodeURIComponent(search)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const jsonResponse = await res.json();
        const data = jsonResponse.data || [];
        renderEmployees(data);
        getStatus(data);
    } catch (err) {
        console.error('Fetch Error:', err);
    }
};

const getStatus = (employeeStatus) => {
    const empStatus = document.getElementById('getEmpStatus');
    if (!empStatus || !employeeStatus) return;

    empStatus.innerHTML = '';

    const statuses = [...new Set(employeeStatus.map(emp => emp.status))];

    statuses.forEach(status => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" href="#">${status}</a>`;
        empStatus.appendChild(li);
    });
}

const renderEmployees = (employees) => {
    const employeesList = document.getElementById('employeeTableBody');
    const noEmployees = document.getElementById('noEmployeesMessage');
    const table = document.getElementById('sorting');

    employeesList.innerHTML = '';

    if (!employees) {
        noEmployees.style.display = 'block';
        table.style.display = 'none';
        return;
    }

    noEmployees.style.display = 'none';
    table.style.display = 'table';

    employees.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${emp.id}</td>
            <td class="ps-4 text-dark fw-bold">${emp.name}</td>
            <td>${emp.email}</td>
             <td>${emp.role?.department?.departmentName || 'N/A'}</td>
            <td>${emp.role?.role || 'N/A'}</td>
            <td>$${emp.role?.salary || '0'}</td>
            <td>
                <span class="badge rounded-pill px-3 py-2 fw-normal ${emp.status === 'active' ? 'bg-success text-white' : 'bg-secondary text-white'}">
                    ${emp.status}
                </span>
            </td>
            <td class="d-flex flex-row justify-content-center align-items-center text-center pe-4">
                <a href="edit_employee.html?id=${emp.id}" class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm me-2 mb-2">Edit</a>
                <button class="btn btn-outline-danger btn-sm rounded-pill  shadow-sm delete-btn me-2 mb-2" data-id="${emp.id}">Delete</button>
            </td>
        `;
        employeesList.appendChild(tr);
    });

    //  delete event
    employeesList.onclick = (e) => {
        if (e.target.classList.contains('delete-btn')) {
            deleteEmployee(e.target.dataset.id);
        }
    };
};

const deleteEmployee = async (id) => {
    try {
        const res = await fetch(`${BASE_API}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) fetchEmployees(document.getElementById('searchInput').value);
        else alert('Delete failed');
    } catch (err) {
        console.error('Delete Error:', err);
    }
};

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.oninput = (e) => fetchEmployees(e.target.value);
}

// featch employees
fetchEmployees();

function sortTable(n) {
    let table;
    table = document.getElementById("sorting");
    var rows, i, x, y, count = 0;
    var switching = true;

    // Order is set as ascending
    var direction = "ascending";

    while (switching) {
        switching = false;
        var rows = table.rows;

        //Loop to go through all rows
        for (i = 1; i < (rows.length - 1); i++) {
            var Switch = false;

            // elements that need to be compared
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            // Check the direction of order
            if (direction == "ascending") {

                // Check if 2 rows need to be switched
                if (x.innerHTML.toLowerCase() >
                    y.innerHTML.toLowerCase()) {

                    // If yes, mark Switch as needed 
                    // and break loop
                    Switch = true;
                    break;
                }
            } else if (direction == "descending") {

                // Check direction
                if (x.innerHTML.toLowerCase() <
                    y.innerHTML.toLowerCase()) {

                    // If yes, mark Switch as needed
                    // and break loop
                    Switch = true;
                    break;
                }
            }
        }
        if (Switch) {

            // Function to switch rows and mark 
            // switch as completed
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

            // Increase count for each switch
            count++;
        } else {

            // Run while loop again for descending order
            if (count == 0 && direction == "ascending") {
                direction = "descending";
                switching = true;
            }
        }
    }
}

function animation() {        document.getElementById("stroke1").classList.toggle("resize1");								
											document.getElementById("stroke2").classList.toggle("bounce");
        document.getElementById("stroke3").classList.toggle("resize2");
    }

    //with help from https://codepen.io/chriscoyier/pen/EyRroJ

    var element = document.getElementById("sort");
    element.addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("tap-circle").classList.remove("click-animation");
      void element.offsetWidth;
      document.getElementById("tap-circle").classList.add("click-animation");
    }, false);