const filters = { search: '', status: '', department: '', minSalary: '', maxSalary: '' };

const buildUrl = () => {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.set('search', filters.search);
    if (filters.status) queryParams.set('status', filters.status);
    if (filters.department) queryParams.set('department_id', filters.department);
    if (filters.minSalary) queryParams.set('min_salary', filters.minSalary);
    if (filters.maxSalary) queryParams.set('max_salary', filters.maxSalary);
    return `${API.employees}?${queryParams.toString()}`;
};

const fetchEmployeesForList = async () => {
    const { ok, data } = await apiCall(buildUrl());
    if (ok) {
        renderEmployees(data);
        populateStatusFilter(data);
        populateDeptFilter(data);
    }
};

const populateStatusFilter = (employees) => {
    const statusMenu = document.getElementById('getEmpStatus');
    if (!statusMenu) return;
    statusMenu.innerHTML = '<li><a class="dropdown-item active-filter" href="#" data-value="">All Statuses</a></li><li><hr class="dropdown-divider"></li>';
    [...new Set(employees.map(employee => employee.status).filter(Boolean))].forEach(status => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a class="dropdown-item" href="#" data-value="${status}">${status}</a>`;
        statusMenu.appendChild(listItem);
    });
};

const populateDeptFilter = (employees) => {
    const departmentMenu = document.getElementById('getEmpDepartment');
    if (!departmentMenu) return;
    departmentMenu.innerHTML = '<li><a class="dropdown-item active-filter" href="#" data-value="">All Departments</a></li><li><hr class="dropdown-divider"></li>';
    const uniqueDepartments = new Map();
    employees.forEach(employee => {
        if (employee.role?.department) {
            uniqueDepartments.set(employee.role.department.id, employee.role.department.departmentName);
        }
    });
    uniqueDepartments.forEach((departmentName, departmentId) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a class="dropdown-item" href="#" data-value="${departmentId}">${departmentName}</a>`;
        departmentMenu.appendChild(listItem);
    });
};

const renderEmployees = (employees) => {
    const tableBody = document.getElementById('employeeTableBody');
    const noEmployeesMessage = document.getElementById('noEmployeesMessage');
    const employeeTable = document.getElementById('sorting');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const hasEmployees = employees.length > 0;
    noEmployeesMessage?.classList.toggle('d-none', hasEmployees);
    employeeTable?.classList.toggle('d-none', !hasEmployees);

    employees.forEach(employee => {
        const tableRow = document.createElement('tr');
        tableRow.className = 'emp-table-row';
        tableRow.innerHTML = `
            <td class="emp-table-td">${employee.id}</td>
            <td class="emp-table-td ps-4 fw-bold text-dark">${employee.name}</td>
            <td class="emp-table-td">${employee.email}</td>
            <td class="emp-table-td">${employee.role?.department?.departmentName || '—'}</td>
            <td class="emp-table-td">${employee.role?.role || '—'}</td>
            <td class="emp-table-td">$${employee.role?.salary || 0}</td>
            <td class="emp-table-td emp-table-td-center">${new Date(employee.joining_date).toLocaleDateString('en-CA')}</td>
            <td class="emp-table-td">
                <span class="badge rounded-pill px-3 py-2 fw-normal ${employee.status === 'active' ? 'bg-success' : 'bg-secondary'} text-white">${employee.status}</span>
            </td>
            <td class="emp-table-td emp-table-td-center">
                <div class="d-flex justify-content-center gap-1">
                    <a href="edit_employee.html?id=${employee.id}" class="btn btn-primary btn-sm rounded-pill"><i class="bi bi-pencil-square"></i></a>
                    <button class="btn btn-outline-danger btn-sm rounded-pill delete-btn" data-id="${employee.id}"><i class="bi bi-trash"></i></button>
                </div>
            </td>`;
        tableBody.appendChild(tableRow);
    });
};

const handleEmployeeDelete = async (employeeId) => {
    if (await confirmUI('Delete Employee', 'Are you sure? This cannot be undone.', 'danger')) {
        const { ok } = await apiCall(`${API.employees}/${employeeId}`, 'DELETE');
        if (ok) {
            showToast('Employee deleted!', 'success');
            fetchEmployeesForList();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const listen = (elementId, eventName, callback) => document.getElementById(elementId)?.addEventListener(eventName, callback);

    listen('searchInput', 'input', event => { filters.search = event.target.value.trim(); fetchEmployeesForList(); });
    listen('minInput', 'input', event => { filters.minSalary = event.target.value.trim(); fetchEmployeesForList(); });
    listen('maxInput', 'input', event => { filters.maxSalary = event.target.value.trim(); fetchEmployeesForList(); });

    ['getEmpStatus', 'getEmpDepartment'].forEach(elementId => {
        listen(elementId, 'click', event => {
            const dropdownItem = event.target.closest('.dropdown-item');
            if (!dropdownItem) return;
            event.preventDefault();
            const filterKey = elementId === 'getEmpStatus' ? 'status' : 'department';
            filters[filterKey] = dropdownItem.dataset.value;
            const dropdownButton = event.target.closest('.dropdown')?.querySelector('.dropdown-btn');
            if (dropdownButton) {
                dropdownButton.textContent = dropdownItem.dataset.value ? dropdownItem.textContent : (filterKey === 'status' ? 'Status' : 'Department');
            }
            fetchEmployeesForList();
        });
    });

    listen('employeeTableBody', 'click', event => {
        const deleteButton = event.target.closest('.delete-btn');
        if (deleteButton) handleEmployeeDelete(deleteButton.dataset.id);
    });

    fetchEmployeesForList();
});

// Sort by date and salary
const sortState = {};
function sortTable(columnIndex) {
    const tableElement = document.getElementById('sorting');
    const sortDirection = sortState[columnIndex] === 'asc' ? 'desc' : 'asc';
    sortState[columnIndex] = sortDirection;

    // Reset and Update Icons
    const iconMapping = { 5: 'sortIcon', 6: 'sortDateIcon' };
    Object.values(iconMapping).forEach(elementId => {
        const iconContainer = document.getElementById(elementId);
        const iconElement = iconContainer?.querySelector('i');
        if (iconContainer) iconContainer.className = '';
        if (iconElement) iconElement.className = 'bi bi-arrow-down-up sort-arrow';
    });

    const activeIconContainer = document.getElementById(iconMapping[columnIndex]);
    if (activeIconContainer) {
        activeIconContainer.className = sortDirection;
        const iconElement = activeIconContainer.querySelector('i');
        if (iconElement) iconElement.className = `bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} sort-arrow`;
    }

    const tableRows = [...tableElement.rows].slice(1);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    tableRows.sort((rowA, rowB) => {
        const textA = rowA.cells[columnIndex].textContent.trim().replace(/[$,]/g, '');
        const textB = rowB.cells[columnIndex].textContent.trim().replace(/[$,]/g, '');
        
        const valueA = dateRegex.test(textA) ? new Date(textA) : isNaN(textA) ? textA.toLowerCase() : +textA;
        const valueB = dateRegex.test(textB) ? new Date(textB) : isNaN(textB) ? textB.toLowerCase() : +textB;

        return sortDirection === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });

    tableRows.forEach(row => tableElement.tBodies[0].appendChild(row));
}