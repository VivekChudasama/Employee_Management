const API_BASE = 'http://localhost:3001/employees';

const fetchEmployees = async (search = '') => {
    try {
        const res = await fetch(`${API_BASE}?search=${encodeURIComponent(search)}`);
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
            <td>${emp.role?.role || 'N/A'}</td>
            <td>${emp.role?.department?.departmentName || 'N/A'}</td>
            <td>$${emp.role?.salary || '0'}</td>
            <td>
                <span class="badge rounded-pill px-3 py-2 fw-normal ${emp.status === 'active' ? 'bg-success text-white' : 'bg-secondary bg-opacity-25 text-secondary'}">
                    ${emp.status}
                </span>
            </td>
            <td class="text-center pe-4">
                <a href="edit_employee.html?id=${emp.id}" class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm me-2">Edit</a>
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3 shadow-sm delete-btn" data-id="${emp.id}">Delete</button>
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
        const res = await fetch(`${API_BASE}/${id}`, {
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
