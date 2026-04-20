const BASE_API = 'http://localhost:3001/employees';

//  Active filters
const filters = {
    search: '',
    status: '',
    department: '',
    minSalary: '',
    maxSalary: ''
};

//  Build URL with all active filters
const buildUrl = () => {
    const p = new URLSearchParams();
    if (filters.search) p.set('search', filters.search);
    if (filters.status) p.set('status', filters.status);
    if (filters.department) p.set('department_id', filters.department);
    if (filters.minSalary) p.set('min_salary', filters.minSalary);
    if (filters.maxSalary) p.set('max_salary', filters.maxSalary);
    return `${BASE_API}?${p.toString()}`;
};

//  Fetch and render
const fetchEmployees = async () => {
    try {
        const res = await fetch(buildUrl());
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = (await res.json()).data || [];
        renderEmployees(data);
        populateStatusFilter(data);
        populateDeptFilter(data);
    } catch (err) {
        console.error('Fetch Error:', err);
    }
};

//  Populate Status filter dropdown
const populateStatusFilter = (employees) => {
    const menu = document.getElementById('getEmpStatus');
    if (!menu) return;

    menu.innerHTML = '<li><a class="dropdown-item active-filter" href="#" data-value="">All Statuses</a></li><li><hr class="dropdown-divider"></li>';

    const unique = [...new Set(employees.map(e => e.status).filter(Boolean))];
    unique.forEach(status => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" href="#" data-value="${status}">${status}</a>`;
        menu.appendChild(li);
    });
};

//  Populate Department filter dropdown
const populateDeptFilter = (employees) => {
    const menu = document.getElementById('getEmpDepartment');
    if (!menu) return;

    menu.innerHTML = '<li><a class="dropdown-item active-filter" href="#" data-value="">All Departments</a></li><li><hr class="dropdown-divider"></li>';

    const empDepartment = new Map();
    employees.forEach(e => {
        const dept = e.role?.department;
        if (dept && !empDepartment.has(dept.id)) empDepartment.set(dept.id, dept.departmentName);
    });

    empDepartment.forEach((name, id) => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" href="#" data-value="${id}">${name}</a>`;
        menu.appendChild(li);
    });
};

//  Render table rows
const renderEmployees = (employees) => {
    const tbody = document.getElementById('employeeTableBody');
    const noMsg = document.getElementById('noEmployeesMessage');
    const table = document.getElementById('sorting');

    tbody.innerHTML = '';

    if (!employees.length) {
        noMsg.classList.remove('d-none');
        table.classList.add('d-none');
        return;
    }

    noMsg.classList.add('d-none');
    table.classList.remove('d-none');

    employees.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'emp-table-row';

        const formattedDate = new Date(emp.joining_date).toLocaleDateString('en-CA');
        const statusClass = emp.status === 'active' ? 'bg-success' : 'bg-secondary';

        tr.innerHTML = `
            <td class="emp-table-td">${emp.id}</td>
            <td class="emp-table-td ps-4 fw-bold text-dark">${emp.name}</td>
            <td class="emp-table-td">${emp.email}</td>
            <td class="emp-table-td">${emp.role?.department?.departmentName || '—'}</td>
            <td class="emp-table-td">${emp.role?.role || '—'}</td>
            <td class="emp-table-td">$${emp.role?.salary || 0}</td>
            <td class="emp-table-td emp-table-td-center">${formattedDate}</td>
            <td class="emp-table-td">
                <span class="badge rounded-pill px-3 py-2 fw-normal ${statusClass} text-white">
                    ${emp.status}
                </span>
            </td>
            <td class="emp-table-td emp-table-td-center">
                <div class="d-flex justify-content-center align-items-center gap-1">
                    <a href="edit_employee.html?id=${emp.id}"
                        class="btn btn-primary btn-sm rounded-pill">
                        <i class="bi bi-pencil-square"></i>
                    </a>
                    <button class="btn btn-outline-danger btn-sm rounded-pill delete-btn"
                        data-id="${emp.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

//  Delete
const deleteEmployee = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
        const res = await fetch(`${BASE_API}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchEmployees() ;
        else alert('Delete failed. Please try again.');
    } catch (err) {
        console.error('Delete Error:', err);
    }
};

//  Event listeners
document.addEventListener('DOMContentLoaded', () => {

    // Search
    document.getElementById('searchInput')?.addEventListener('input', e => {
        filters.search = e.target.value.trim();
        fetchEmployees();
    });

    // Salary range
    document.getElementById('minInput')?.addEventListener('input', e => {
        filters.minSalary = e.target.value.trim();
        fetchEmployees();
    });
    document.getElementById('maxInput')?.addEventListener('input', e => {
        filters.maxSalary = e.target.value.trim();
        fetchEmployees();
    });

    // Status filter
    document.getElementById('getEmpStatus')?.addEventListener('click', e => {
        const item = e.target.closest('.dropdown-item');
        if (!item) return;
        e.preventDefault();
        filters.status = item.dataset.value;

        // Update button label to show selected status
        const btn = document.querySelectorAll('.filter-bar-dropdown .status-dropdown-btn')[0];
            if (btn) btn.textContent = item.dataset.value ? item.textContent : 'Status'
        fetchEmployees();
    });

    // Department filter 
    document.getElementById('getEmpDepartment')?.addEventListener('click', e => {
        const item = e.target.closest('.dropdown-item');
        if (!item) return;
        e.preventDefault();
        filters.department = item.dataset.value;

        // Update the button label to show selected department name
        const btn = document.querySelectorAll('.filter-bar-dropdown .dropdown-btn')[0];
        if (btn) btn.textContent = item.dataset.value ? item.textContent : 'Department';
        fetchEmployees();
    });

    // Delete
    document.getElementById('employeeTableBody')?.addEventListener('click', e => {
        const btn = e.target.closest('.delete-btn');
        if (btn) deleteEmployee(btn.dataset.id);
    });

    // Initial load
    fetchEmployees();
});

// ── Sort
const sortState = {};

function sortTable(colIndex) {
    const table = document.getElementById('sorting');

    const colConfig = {
        5: { spanId: 'sortIcon', iId: 'sortIconI' },
        6: { spanId: 'sortDateIcon', iId: 'sortDateIconI' }
    };

    const direction = sortState[colIndex] === 'asc' ? 'desc' : 'asc';
    sortState[colIndex] = direction;

    // Reset all icons
    Object.values(colConfig).forEach(({ spanId, iId }) => {
        document.getElementById(spanId)?.classList.remove('asc', 'desc');
        const ic = document.getElementById(iId);
        if (ic) ic.className = 'bi bi-arrow-down-up sort-arrow';
    });

    // Activate the clicked column's icon
    const cfg = colConfig[colIndex];
    if (cfg) {
        document.getElementById(cfg.spanId)?.classList.add(direction);
        const ic = document.getElementById(cfg.iId);
        if (ic) ic.className = `bi bi-arrow-${direction === 'asc' ? 'up' : 'down'} sort-arrow`;
    }

    // Bubble sort
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    let swapped = true;

    while (swapped) {
        swapped = false;
        const rows = table.rows;
        for (let i = 1; i < rows.length - 1; i++) {
            const a = rows[i].cells[colIndex]?.textContent.trim().replace(/[$,]/g, '') || '';
            const b = rows[i + 1].cells[colIndex]?.textContent.trim().replace(/[$,]/g, '') || '';

            const aVal = dateRe.test(a) ? new Date(a).getTime()
                : isNaN(+a) ? a.toLowerCase()
                    : +a;
            const bVal = dateRe.test(b) ? new Date(b).getTime()
                : isNaN(+b) ? b.toLowerCase()
                    : +b;

            if (direction === 'asc' ? aVal > bVal : aVal < bVal) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                swapped = true;
                break;
            }
        }
    }
}