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
    try {
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
    catch (err) {
        console.error('Fetch Error:', err);
    }
}


const getDepartment = (employeeDepartment) => {
    try {
        const empDepartments = document.getElementById('getEmpDepartment');
        if (!empDepartments || !employeeDepartment) return;

        empDepartments.innerHTML = '';
        
        const departments = [...new Set(employeeDepartment.map(emp => emp.role?.department?.departmentName || 'N/A'))];

        departments.forEach(department => {
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="#">${department}</a>`;
            empDepartments.appendChild(li)
        });
    }
    catch (err) {
        console.log(err)
    }
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
            <td class="d-flex flex-row justify-content-center align-items-center text-center">
                <a href="edit_employee.html?id=${emp.id}" class="btn btn-primary btn-sm rounded-pill shadow-sm me-2 mb-2"><i class="bi bi-pencil-square"></i></a>
                <button class="btn btn-outline-danger btn-sm rounded-pill shadow-sm delete-btn me-2 mb-2" data-id="${emp.id}"><i class="bi bi-trash"></i></button>
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

const filterStatus = document.getElementById('getEmpStatus');
if (filterStatus) {
    filterStatus.onclick = (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            fetchEmployees(document.getElementById('searchInput').value);
        }
    };
}

const filterDepartment = document.getElementById('getEmpDepartment');
if (filterDepartment) {
    filterDepartment.onclick = (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            fetchEmployees(document.getElementById('searchInput').value);
        }
    };
}

// featch employees
fetchEmployees();

function sortTable(n) {
    const table = document.getElementById("sorting");
    const sortIcon = document.getElementById("sortIcon");
    let rows, i, x, y, shouldSwitch, switchcount = 0;
    let switching = true;
    let direction = "asc";

    // Reset status of icons if we had multiple sortable columns (future proofing)
    sortIcon.classList.remove("asc", "desc");

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            // Clean values for numeric comparison (remove $, commas, etc)
            let xContent = x.textContent.replace(/[$,]/g, "");
            let yContent = y.textContent.replace(/[$,]/g, "");

            let xVal = isNaN(parseFloat(xContent)) ? xContent.toLowerCase() : parseFloat(xContent);
            let yVal = isNaN(parseFloat(yContent)) ? yContent.toLowerCase() : parseFloat(yContent);

            if (direction === "asc") {
                if (xVal > yVal) {
                    shouldSwitch = true;
                    break;
                }
            } else if (direction === "desc") {
                if (xVal < yVal) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && direction === "asc") {
                direction = "desc";
                switching = true;
            }
        }
    }

    // Update the UI to show current sort direction
    sortIcon.classList.add(direction);

    const iconEl = document.getElementById("sortIconI");
    if (direction === "asc") {
        iconEl.className = "bi bi-arrow-up";
    } else {
        iconEl.className = "bi bi-arrow-down";
    }
}