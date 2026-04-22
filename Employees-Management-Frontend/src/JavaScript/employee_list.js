const filters = {
    search: '',
    status: '',
    department: '',
    minSalary: '',
    maxSalary: ''
};

// build the backend API URL with necessary query parameters
function buildEmployeesApiUrl() {
    const queryParams = new URLSearchParams();
    
    if (filters.search !== '') queryParams.set('search', filters.search);
    if (filters.status !== '') queryParams.set('status', filters.status);
    if (filters.department !== '') queryParams.set('department_id', filters.department);
    if (filters.minSalary !== '') queryParams.set('min_salary', filters.minSalary);
    if (filters.maxSalary !== '') queryParams.set('maxSalary', filters.maxSalary);
    
    return `${API.employees}?${queryParams.toString()}`;
}

// Fetches the employees list from the backend and then rendering
async function fetchEmployeesForList() {
    const url = buildEmployeesApiUrl();
    const { ok, data } = await apiCall(url);
    
    if (ok) {
        renderEmployees(data);
        populateStatusFilter(data);
        populateDeptFilter(data);
    }
}

function populateStatusFilter(employeesList) {
    const statusMenu = document.getElementById('getEmpStatus');
    if (!statusMenu) return;
    
    // Clear the menu and set a default "All Statuses" option
    statusMenu.innerHTML = '<li><a class="dropdown-item active-filter" href="#" data-value="">All Statuses</a></li><li><hr class="dropdown-divider"></li>';
    
    // Add all statuses into an array
    const rawStatuses = employeesList.map(emp => emp.status);
    
    const statuses = [...new Set(rawStatuses)];
    
    //Create an HTML option for each status
    statuses.forEach(status => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a class="dropdown-item" href="#" data-value="${status}">${status}</a>`;
        statusMenu.appendChild(listItem);
    });
}

function populateDeptFilter(employeesList) {
    const departmentMenu = document.getElementById('getEmpDepartment');
    if (!departmentMenu) return;
    
    departmentMenu.innerHTML = '<li><a class="dropdown-item active-filter" href="#" data-value="">All Departments</a></li><li><hr class="dropdown-divider"></li>';
    
    // Map to keep track of departments we've already seen
    const uniqueDepartments = new Map();
    
    // Check each employee and their role to find departments
    employeesList.forEach(employee => {
        const hasDepartment = employee.role && employee.role.department;
        if (hasDepartment) {
            const deptId = employee.role.department.id;
            const deptName = employee.role.department.departmentName;
            uniqueDepartments.set(deptId, deptName);
        }
    });
    
    // Render the options
    uniqueDepartments.forEach((departmentName, departmentId) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a class="dropdown-item" href="#" data-value="${departmentId}">${departmentName}</a>`;
        departmentMenu.appendChild(listItem);
    });
}

function renderEmployees(employees) {
    const tableBody = document.getElementById('employeeTableBody');
    const noEmployeesMessage = document.getElementById('noEmployeesMessage');
    const employeeTable = document.getElementById('sorting');
    
    if (!tableBody) return;

    tableBody.innerHTML = ''; 
    
    const hasEmployees = employees.length > 0;
    
    if (hasEmployees) {
        noEmployeesMessage?.classList.add('d-none');
        employeeTable?.classList.remove('d-none');
    } else {
        noEmployeesMessage?.classList.remove('d-none');
        employeeTable?.classList.add('d-none');
        return;
    }

    employees.forEach(employee => {
        const departmentName = employee.role?.department?.departmentName || '—';
        const roleName = employee.role?.role || '—';
        const salary = employee.role?.salary || 0;
        
        // change the date formate of sql
        const rawDate = new Date(employee.joining_date);
        const joiningDate = isNaN(rawDate) ? '—' : rawDate.toLocaleDateString('en-CA');
        
        // Define badge color based on status
        const isStatusActive = employee.status === 'active';
        const badgeClass = isStatusActive ? 'bg-success' : 'bg-secondary';

        const tableRow = document.createElement('tr');
        tableRow.className = 'emp-table-row';
        tableRow.innerHTML = `
            <td class="emp-table-td">${employee.id}</td>
            <td class="emp-table-td ps-4 fw-bold text-dark">${employee.name}</td>
            <td class="emp-table-td">${employee.email}</td>
            <td class="emp-table-td">${departmentName}</td>
            <td class="emp-table-td">${roleName}</td>
            <td class="emp-table-td">$${salary}</td>
            <td class="emp-table-td emp-table-td-center">${joiningDate}</td>
            <td class="emp-table-td">
                <span class="badge rounded-pill px-3 py-2 fw-normal text-white ${badgeClass}">${employee.status}</span>
            </td>
            <td class="emp-table-td emp-table-td-center">
                <div class="d-flex justify-content-center gap-1">
                    <a href="edit_employee.html?id=${employee.id}" class="btn btn-custom-primary btn-sm rounded-pill"><i class="bi bi-pencil-square"></i></a>
                    <button class="btn btn-outline-danger btn-sm rounded-pill delete-btn" data-id="${employee.id}"><i class="bi bi-trash"></i></button>
                </div>
            </td>`;
            
        tableBody.appendChild(tableRow);
    });
}

// Request backend to delete an employee
async function handleEmployeeDelete(employeeId) {
    const isConfirmed = await confirmUI('Delete Employee', 'Are you sure? This cannot be undone.', 'danger');
    if (!isConfirmed) return;
    
    // Call the delete API
    const { ok } = await apiCall(`${API.employees}/${employeeId}`, 'DELETE');
    if (ok) {
        showToast('Employee deleted!', 'success');
        // Refresh the list
        fetchEmployeesForList();
    }
}

// Event Listener Assignments when page is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    function attachInputFilter(elementId, filterKey) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('input', (event) => {
                filters[filterKey] = event.target.value.trim();
                fetchEmployeesForList();
            });
        }
    }

    // add filters
    attachInputFilter('searchInput', 'search');
    attachInputFilter('minInput', 'minSalary');
    attachInputFilter('maxInput', 'maxSalary');

    // Dropdown Menu (Status)
    const statusMenu = document.getElementById('getEmpStatus');
    if (statusMenu) {
        statusMenu.addEventListener('click', (event) => {
            const dropdownItem = event.target.closest('.dropdown-item');
            if (!dropdownItem) return;
            
            event.preventDefault();
            filters.status = dropdownItem.dataset.value;
            
            const btn = event.target.closest('.dropdown')?.querySelector('.dropdown-btn');
            if (btn) btn.textContent = filters.status ? dropdownItem.textContent : 'Status';
            
            fetchEmployeesForList();
        });
    }

    // Dropdown Menu (Department)
    const deptMenu = document.getElementById('getEmpDepartment');
    if (deptMenu) {
        deptMenu.addEventListener('click', (event) => {
            const dropdownItem = event.target.closest('.dropdown-item');
            if (!dropdownItem) return;
            
            event.preventDefault();
            filters.department = dropdownItem.dataset.value;
            
            const btn = event.target.closest('.dropdown')?.querySelector('.dropdown-btn');
            if (btn) btn.textContent = filters.department ? dropdownItem.textContent : 'Department';
            
            fetchEmployeesForList();
        });
    }

    // Attach Delete button 
    const tableBody = document.getElementById('employeeTableBody');
    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('.delete-btn');
            if (deleteButton) {
                handleEmployeeDelete(deleteButton.dataset.id);
            }
        });
    }

    fetchEmployeesForList();
});

// Table Sorting function (Dates and Salary)
const sortState = {};
function sortTable(columnIndex) {
    const tableElement = document.getElementById('sorting');
    
    // Toggle the ascending vs descending state
    const currentDirection = sortState[columnIndex];
    const newDirection = (currentDirection === 'asc') ? 'desc' : 'asc';
    sortState[columnIndex] = newDirection;

    const iconMapping = { 5: 'sortIcon', 6: 'sortDateIcon' };
    for (const [col, elementId] of Object.entries(iconMapping)) {
        const container = document.getElementById(elementId);
        if (container) {
            // Remove sort directions but keep base classes
            container.classList.remove('asc', 'desc');
            const icon = container.querySelector('i');
            if (icon) icon.className = 'bi bi-arrow-down-up sort-arrow';
        }
    }

    // Make the currently selected column actively show correct arrow
    const activeContainer = document.getElementById(iconMapping[columnIndex]);
    if (activeContainer) {
        activeContainer.classList.add(newDirection);
        const icon = activeContainer.querySelector('i');
        if (icon) {
            icon.className = `bi bi-arrow-${newDirection === 'asc' ? 'up' : 'down'} sort-arrow`;
        }
    }

    const tableRows = Array.from(tableElement.rows).slice(1);
    
    // Perform standard array sorting
    tableRows.sort((rowA, rowB) => {
        // Remove the internl text and remove $ symbols
        let textA = rowA.cells[columnIndex].textContent.trim().replace(/[$,]/g, '');
        let textB = rowB.cells[columnIndex].textContent.trim().replace(/[$,]/g, '');
        
        let valueA;
        if (/^\d{4}-\d{2}-\d{2}$/.test(textA)) {
            valueA = new Date(textA);
        } else if (isNaN(Number(textA))) {
            valueA = textA.toLowerCase();
        } else {
            valueA = Number(textA);
        }

        let valueB;
        if (/^\d{4}-\d{2}-\d{2}$/.test(textB)) {
            valueB = new Date(textB);
        } else if (isNaN(Number(textB))) {
            valueB = textB.toLowerCase();
        } else {
            valueB = Number(textB);
        }

        // Apply correct directional checking
        if (newDirection === 'asc') {
            return (valueA > valueB) ? 1 : -1;
        } else {
            return (valueA < valueB) ? 1 : -1;
        }
    });

    // Write the sorted rows in HTML DOM
    tableRows.forEach(row => {
        tableElement.tBodies[0].appendChild(row);
    });
}