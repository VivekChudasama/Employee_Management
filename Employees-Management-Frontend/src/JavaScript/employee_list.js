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
    if (filters.maxSalary !== '') queryParams.set('max_salary', filters.maxSalary);

    return `${API.employees}?${queryParams.toString()}`;
}

// Fetch the employees list from the backend and then rendering
async function fetchEmployeesForList() {
    // PREVENT bad API calls from triggering backend Toast errors
    if (filters.minSalary !== '' && filters.maxSalary !== '') {
        const minVal = parseFloat(filters.minSalary);
        const maxVal = parseFloat(filters.maxSalary);
        if (!isNaN(minVal) && !isNaN(maxVal) && maxVal < minVal) return;
    }
    if ((filters.minSalary !== '' && parseFloat(filters.minSalary) < 0) ||
        (filters.maxSalary !== '' && parseFloat(filters.maxSalary) < 0)) {
        return;
    }

    const url = buildEmployeesApiUrl();
    const { ok, data } = await apiCall(url);

    if (ok) {
        // Render newest employees first by strictly sorting by ID descending
        const sortedData = [...data].sort((a, b) => Number(b.id) - Number(a.id));
        renderEmployees(sortedData);

        const isAnyFilterActive = filters.search !== '' || filters.status !== '' || filters.department !== '' || filters.minSalary !== '' || filters.maxSalary !== '';
        if (!isAnyFilterActive) {
            populateStatusFilter(sortedData);
        }
    }
}

function populateStatusFilter(employeesList) {
    const statusMenu = document.getElementById('getEmpStatus');
    if (!statusMenu) return;

    const statuses = [...new Set(employeesList.map(emp => emp.status))];

    statusMenu.innerHTML = '<li><a class="dropdown-item dropdown-element active-filter fw-bold text-custom-primary" href="#" data-value="">All Statuses</a></li><li><hr class="dropdown-divider"></li>' +
        statuses.map(status => `<li><a class="dropdown-item dropdown-element" href="#" data-value="${status}">${status}</a></li>`).join('');
}

function populateDeptFilter() {
    const departmentMenu = document.getElementById('getEmpDepartment');
    if (!departmentMenu) return;

    const seenDepartments = new Map();
    allRoles.forEach(r => r.department && seenDepartments.set(r.department.id, r.department.departmentName));

    departmentMenu.innerHTML = '<li><a class="dropdown-item dropdown-element active-filter fw-bold text-custom-primary" href="#" data-value="">All Departments</a></li><li><hr class="dropdown-divider"></li>' +
        Array.from(seenDepartments.entries()).map(([id, name]) => `<li><a class="dropdown-item dropdown-element" href="#" data-value="${id}">${name}</a></li>`).join('');
}

function renderEmployees(employees) {
    const tableBody = document.getElementById('employeeTableBody');
    const noEmployeesMessage = document.getElementById('noEmployeesMessage');
    const employeeTable = document.getElementById('sorting');

    if (!tableBody) return;

    // Dispose old tooltips if any before clearing
    const existingTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    existingTooltips.forEach(el => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(el);
        if (tooltipInstance) {
            tooltipInstance.dispose();
        }
    });

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

    let rowsHtml = '';

    employees.forEach(employee => {
        const rawDate = employee.joining_date ? new Date(employee.joining_date) : null;
        const joiningDate = rawDate && !isNaN(rawDate) ? rawDate.toLocaleDateString('en-CA') : '—';
        const badgeClass = employee.status === 'active' ? 'bg-success' : 'bg-secondary';

        rowsHtml += `
        <tr class="emp-table-row">
            <td class="emp-table-td ps-4 text-dark" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip"
                data-bs-placement="top" title="${employee.name}">${employee.name}</td>
            <td class="emp-table-td" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip"
                data-bs-placement="top" title="${employee.email}">${employee.email}</td>
            <td class="emp-table-td">${employee.role.department.departmentName}</td>
            <td class="emp-table-td" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip"
                data-bs-placement="top" title="${employee.role.role}">${employee.role.role}</td>
            <td class="emp-table-td">$${employee.salary}</td>
            <td class="emp-table-td emp-table-td-center">${joiningDate}</td>
            <td class="emp-table-td">
                <span class="badge rounded-pill px-3 py-2 fw-normal text-white text-capitalize ${badgeClass}">${employee.status}</span>
            </td>
            <td class="emp-table-td emp-table-td-center">
                <div class="d-flex justify-content-center gap-1">
                    <a href="edit_employee.html?id=${employee.id}" class="btn btn-custom-primary btn-sm rounded-pill"><i class="bi bi-pencil-square"></i></a>
                    <button class="btn btn-outline-danger btn-sm rounded-pill delete-btn" data-id="${employee.id}" data-name="${employee.name}"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>`;
    });

    tableBody.innerHTML = rowsHtml;

    // Initialize new tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Request backend to delete an employee
async function handleEmployeeDelete(employeeId, employeeName) {
    const displayName = employeeName || 'this employee';
    const isConfirmed = await confirmUI('Delete Employee', `Are you sure you want to delete "${displayName}"? This cannot be undone.`, 'danger');
    if (!isConfirmed) return;

    // Call the delete API
    const { ok } = await apiCall(`${API.employees}/${employeeId}`, 'DELETE');
    if (ok) {
        showToast('Employee deleted!', 'success');
        fetchEmployeesForList();
    }
}

// Event Listener Assignments when page is loaded
document.addEventListener('DOMContentLoaded', async () => {

    await fetchRolesData();
    populateDeptFilter();

    function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const fetchDebounced = debounce(fetchEmployeesForList, 300);

    function attachInputFilter(elementId, filterKey) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('input', (event) => {
                filters[filterKey] = event.target.value.trim();

                const minEl = document.getElementById('min_salary');
                const maxEl = document.getElementById('max_salary');
                if (minEl && maxEl) {
                    const minStr = minEl.value;
                    const maxStr = maxEl.value;
                    const minVal = minStr;
                    const maxVal = maxStr;

                    let hasError = false;

                    if (minStr && minVal < 0) {
                        showFieldError('min_salary', 'Please enter Positive valid number');
                        hasError = true;
                    } else {
                        clearFieldError('min_salary');
                    }

                    if (maxStr && maxVal < 0) {
                        showFieldError('max_salary', 'Please enter Positive valid number');
                        hasError = true;
                    } else if (minStr && maxStr && !isNaN(minVal) && !isNaN(maxVal) && maxVal <= minVal) {
                        showFieldError('max_salary', 'maximum salary must be greater than the minimum salary.');
                        hasError = true;
                    } else {
                        clearFieldError('max_salary');
                    }

                    if (hasError) return;
                }

                fetchDebounced();
            });
        }
    }

    // add filters
    attachInputFilter('searchInput', 'search');
    attachInputFilter('min_salary', 'minSalary');
    attachInputFilter('max_salary', 'maxSalary');

    // Reusable Dropdown Filter Setup
    function setupDropdownFilter(menuId, filterKey, defaultText) {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.addEventListener('click', (event) => {
                const dropdownItem = event.target.closest('.dropdown-item');
                if (!dropdownItem) return;

                event.preventDefault();
                filters[filterKey] = dropdownItem.dataset.value;

                menu.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('fw-bold', 'text-custom-primary'));
                dropdownItem.classList.add('fw-bold', 'text-custom-primary');

                const btn = event.target.closest('.dropdown')?.querySelector('.dropdown-btn');
                if (btn) {
                    btn.textContent = filters[filterKey] ? dropdownItem.textContent : defaultText;
                    btn.classList.remove('fw-bold'); // strictly ensure button is never bold
                }

                fetchEmployeesForList();
            });
        }
    }

    setupDropdownFilter('getEmpStatus', 'status', 'Status');
    setupDropdownFilter('getEmpDepartment', 'department', 'Department');

    // Attach Delete button 
    const tableBody = document.getElementById('employeeTableBody');
    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('.delete-btn');
            if (deleteButton) {
                handleEmployeeDelete(deleteButton.dataset.id, deleteButton.dataset.name);
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

    const iconMapping = { 4: 'sortIcon', 5: 'sortDateIcon' };
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

    const parseValue = text => {
        if (text === '—') return 0;
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return new Date(text).getTime();
        const num = Number(text);
        return isNaN(num) ? text.toLowerCase() : num;
    };

    // Perform standard array sorting
    tableRows.sort((rowA, rowB) => {
        const textA = rowA.cells[columnIndex].textContent.trim().replace(/[$,]/g, '');
        const textB = rowB.cells[columnIndex].textContent.trim().replace(/[$,]/g, '');

        const valueA = parseValue(textA);
        const valueB = parseValue(textB);

        if (valueA === valueB) return 0;
        const diff = valueA > valueB ? 1 : -1;
        return newDirection === 'asc' ? diff : -diff;
    });

    tableElement.tBodies[0].append(...tableRows);
}