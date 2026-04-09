const API_BASE = 'http://localhost:3001/employees';

const fetchEmployees = async (search = '') => {
    try {
        const res = await fetch(`${API_BASE}?ajax=true&search=${encodeURIComponent(search)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        renderEmployees(data);
        getStatus(data);
    } catch (err) {
        console.error('Fetch Error:', err);
    }
};

const getStatus = async (employeeStatus) => {
    const empStatus = document.getElementById('getEmpStatus');

    await employeeStatus.forEach(emp => {
        const li = document.createElement('li');
        li.innerHTML = `
        <li>${emp.status}</li>
        `
    })

    empStatus.appendChild(li);
}

getStatus()

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
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.role?.role || 'N/A'}</td>
            <td>${emp.role?.department?.departmentName || 'N/A'}</td>
            <td>$${emp.role?.salary || '0'}</td>
            <td>
                <span class="badge ${emp.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                    ${emp.status}
                </span>
            </td>
            <td>
                <a href="edit_employee.html?id=${emp.id}" class="btn btn-primary btn-sm">Edit</a>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${emp.id}">Delete</button>
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
        const res = await fetch(`${API_BASE}/delete-employee`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: id })
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
