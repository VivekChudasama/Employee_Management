const API = {
    employees: 'http://localhost:3001/employees',
    roles: 'http://localhost:3001/roles'
};

let allRoles = [];
let allEmployees = [];
let editRoleId = null;

async function apiCall(url, method = 'GET', bodyContent = null) {
    try {
        const fetchOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // If we are sending data (POST/PUT), attach it as a JSON string
        if (bodyContent !== null) {
            fetchOptions.body = JSON.stringify(bodyContent);
        }

        const response = await fetch(url, fetchOptions);
        const jsonResponse = await response.json();

        if (!response.ok) {
            handleBackendErrors(jsonResponse);
            return { ok: false, data: jsonResponse };
        }

        return { ok: true, data: jsonResponse.data };

    } catch (networkError) {
        console.error(`API Error (${url}):`, networkError);
        showToast('Could not connect to the server.', 'danger');
        return { ok: false, error: networkError };
    }
}

async function fetchRolesData() {
    const response = await apiCall(API.roles);
    if (response.ok) {
        allRoles = response.data || [];
    }
}

async function fetchEmployeesData() {
    const response = await apiCall(API.employees);
    if (response.ok) {
        allEmployees = response.data || [];
    }
}

// Alerts & Confirms modal
function confirmUI(title, message, visualType = 'warning') {
    return new Promise((resolve) => {
        const modalElement = document.getElementById('confirmModal');

        if (!modalElement) {
            const result = confirm(message);
            resolve(result);
            return;
        }

        const modal = new bootstrap.Modal(modalElement);

        // Fill HTML components with provided text
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;

        const iconElement = document.getElementById('confirmIcon');
        iconElement.className = `bi bi-exclamation-circle text-${visualType}`;

        // Get Add/Yes button
        const oldActionButton = document.getElementById('confirmActionBtn');

        const newActionButton = oldActionButton.cloneNode(true);
        oldActionButton.replaceWith(newActionButton);

        newActionButton.onclick = () => {
            modal.hide();
            resolve(true);
        };

        modalElement.addEventListener('hidden.bs.modal', () => {
            resolve(false);
        });

        modal.show();
    });
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    let iconName = 'exclamation-circle';

    if (type === 'success') {
        iconName = 'check-circle';
    } else if (type === 'danger') {
        iconName = 'x-circle';
    }

    // Create the toast box component
    const toastElement = document.createElement('div');
    toastElement.className = `alert alert-${type} d-flex align-items-center shadow-lg fade show toast-custom`;
    toastElement.innerHTML = `
        <i class="bi bi-${iconName} fs-4 me-3"></i>
        <div class="flex-grow-1">${message}</div>
        <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(toastElement);

    setTimeout(() => {
        toastElement.classList.remove('show');
        setTimeout(() => {
            toastElement.remove();
        }, 500);
    }, 4000);
}

// Employee Form Dropdown
function populateDepartments(selectedId = null) {
    const selectElement = document.getElementById('department_id');
    if (!selectElement) return;

    selectElement.innerHTML = '<option class="dropdown-item" value="">Select Department</option>';

    // Track unique departments using a Map
    const seenDepartments = new Map();

    for (let i = 0; i < allRoles.length; i++) {
        const currentRole = allRoles[i];
        if (currentRole.department) {
            const deptId = currentRole.department.id;
            const deptName = currentRole.department.departmentName;

            if (!seenDepartments.has(deptId)) {
                seenDepartments.set(deptId, deptName);
            }
        }
    }

    seenDepartments.forEach((name, id) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;

        // Select it if it matches the editing employee
        if (String(id) === String(selectedId)) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

function populateStatusDropdown(selectedStatus = null) {
    const statusSelect = document.getElementById('status');
    if (!statusSelect) return;

    statusSelect.innerHTML = '<option  value="">Select Status</option>';

    const statuses = allEmployees.map(emp => emp.status);
    const validStatuses = statuses.filter(status => status !== null && status !== undefined);


    let uniqueStatuses = [...new Set([...validStatuses])];

    // Add them to the Dropdown
    uniqueStatuses.forEach(status => {
        const option = document.createElement('option');
        option.innerHTML = status;
        if (status === selectedStatus) {
            option.selected = true;
        }
        statusSelect.appendChild(option);
    });
}

function populateRoles(departmentId = null, selectedRoleId = null) {
    const dropdownMenu = document.getElementById('roleDropdownMenu');
    const dropdownButton = document.getElementById('roleDropdownBtn');

    if (!dropdownMenu || !dropdownButton) return;

    dropdownMenu.innerHTML = '';

    // Cannot select a role without picking a department first
    if (!departmentId) {
        const emptyMessage = '<li><span class="dropdown-item text-muted text-center py-3">Select a department first</span></li>';
        dropdownMenu.innerHTML = emptyMessage;
        dropdownButton.disabled = true;
        return;
    }

    dropdownButton.disabled = false;

    // Find all roles belonging to chosen department
    const rolesInDepartment = allRoles.filter((role) => {
        return String(role.department?.id) === String(departmentId);
    });

    if (rolesInDepartment.length === 0) {
        dropdownMenu.innerHTML = '<li><span class="dropdown-item text-muted text-center py-3">No roles in this department</span></li>';
    } else {
        rolesInDepartment.forEach((role) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a class="dropdown-item d-flex justify-content-between align-items-center role-option py-2 px-3"
                   href="#" data-id="${role.id}" data-salary="${role.salary}" data-name="${role.role}">
                    <div class="d-flex flex-column">
                        <span class="fw-bold">${role.role}</span>
                        <small class="text-muted">$${role.salary}</small>
                    </div>
                    <div class="d-flex gap-2 ms-2 action-btns">
                        <button type="button" class="btn btn-sm btn-outline-warning role-edit-btn border-0 shadow-sm" data-id="${role.id}" data-name="${role.role}" data-salary="${role.salary}"><i class="bi bi-pencil-fill"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-danger role-delete-btn border-0 shadow-sm" data-id="${role.id}"><i class="bi bi-trash-fill"></i></button>
                    </div>
                </a>
            `;
            dropdownMenu.appendChild(listItem);

            // If editing an existing user, highlight their existing role 
            if (selectedRoleId && String(role.id) === String(selectedRoleId)) {
                updateRolePickerSelection(role.role, role.id, role.salary);
            }
        });
    }

    // Always append the "Add New Role" button at the bottom of the dropdown
    const footerDivider = document.createElement('li');
    footerDivider.innerHTML = `
        <hr class="dropdown-divider">
        <button type="button" class="dropdown-item text-custom-primary text-center py-2" id="addRoleInDropdownBtn">
            <i class="bi bi-plus-circle-fill me-1"></i> Add New Role
        </button>
    `;
    dropdownMenu.appendChild(footerDivider);

    // Attach listener for opening the popup Modal
    document.getElementById('addRoleInDropdownBtn').onclick = () => {
        openRoleModal();
    };
}

// Event Listeners & DOM Adjustment
function updateRolePickerSelection(name, id, salary) {
    const button = document.getElementById('roleDropdownBtn');
    const hiddenInput = document.getElementById('role_id');
    const salaryDisplay = document.getElementById('salary_display');

    if (button) button.textContent = name || 'Select a role';
    if (hiddenInput) hiddenInput.value = id || '';

    if (salaryDisplay) {
        if (salary) {
            salaryDisplay.value = `$${salary}`;
        } else {
            salaryDisplay.value = '';
        }
    }
}

function setupRoleDropdown() {
    const dropdownMenu = document.getElementById('roleDropdownMenu');
    if (!dropdownMenu) return;

    // Use event delegation to handle clicks inside the Dropdown
    dropdownMenu.addEventListener('click', async (event) => {
        const clickedOptionItem = event.target.closest('.role-option');
        const clickedEditButton = event.target.closest('.role-edit-btn');
        const clickedDeleteButton = event.target.closest('.role-delete-btn');

        // Did they click Edit Role?
        if (clickedEditButton) {
            openRoleModal(clickedEditButton.dataset);
            return;
        }

        // Did they click Delete Role?
        if (clickedDeleteButton) {
            deleteRole(clickedDeleteButton.dataset.id);
            return;
        }

        // Did they click to Select a role? (But not near action buttons)
        const clickedActionArea = event.target.closest('.action-btns');
        if (clickedOptionItem && !clickedActionArea) {

            const name = clickedOptionItem.dataset.name;
            const id = clickedOptionItem.dataset.id;
            const salary = clickedOptionItem.dataset.salary;

            updateRolePickerSelection(name, id, salary);

            // Re-validate parent form to unlock Submit Button
            const parentFormElement = clickedOptionItem.closest('form');
            if (parentFormElement) {
                validateForm(parentFormElement.id, '#submitBtn');
            }
        }
    });
}

function openRoleModal(roleData = null) {
    const departmentDropdown = document.getElementById('department_id');
    const departmentId = departmentDropdown ? departmentDropdown.value : null;

    if (!departmentId) {
        showToast('Select a department first!', 'warning');
        return;
    }

    const modalDOM = document.getElementById('roleModal');
    const modal = new bootstrap.Modal(modalDOM);

    // Access all Role Form fields
    const modalTitle = document.getElementById('roleModalLabel');
    const nameInput = document.getElementById('newRoleName');
    const salaryInput = document.getElementById('newRoleSalary');
    const saveButton = document.getElementById('saveRoleBtn');

    if (roleData !== null) {
        // Populating for UPDATE
        editRoleId = roleData.id;
        modalTitle.textContent = 'Edit Role';
        nameInput.value = roleData.name;
        salaryInput.value = roleData.salary;
        saveButton.textContent = 'Update Role';
    } else {
        // Clearing for ADD
        editRoleId = null;
        modalTitle.textContent = 'Add New Role';
        nameInput.value = '';
        salaryInput.value = '';
        saveButton.textContent = 'Add Role';
    }

    // Clear any previous red error outlines
    nameInput.classList.remove('is-invalid');
    salaryInput.classList.remove('is-invalid');

    modal.show();
}

async function deleteRole(roleIdToDelete) {
    // Block if any employees has this Role
    const safelyAssignedEmployees = allEmployees.filter((employee) => {
        return String(employee.role_id) === String(roleIdToDelete);
    });

    if (safelyAssignedEmployees.length > 0) {
        showToast('This role cannot be deleted because it is currently assigned to one or more employees.', 'danger');
        return;
    } else {
        const isUserAgreed = await confirmUI('Delete Role', 'Are you sure you want to delete this role?', 'danger');
        if (!isUserAgreed) return;
    }

    const apiResponse = await apiCall(`${API.roles}/${roleIdToDelete}`, 'DELETE');
    if (apiResponse.ok) {
        showToast('Role deleted!', 'success');

        const departmentDropdown = document.getElementById('department_id');
        const currentDeptId = departmentDropdown ? departmentDropdown.value : null;

        await fetchRolesData();
        populateDepartments(currentDeptId);
        populateRoles(currentDeptId);
    }
}

function setupDepartmentFilter() {
    const departmentDropdown = document.getElementById('department_id');
    if (!departmentDropdown) return;

    departmentDropdown.addEventListener('change', (event) => {
        const newlySelectedDeptId = event.target.value;

        updateRolePickerSelection(null, null, null);

        populateRoles(newlySelectedDeptId);

        const parentFormElement = event.target.closest('form');
        if (parentFormElement) {
            validateForm(parentFormElement.id, '#submitBtn');
        }
    });
}

function setupAddRole() {
    const saveRoleButton = document.getElementById('saveRoleBtn');
    const openRoleButton = document.getElementById('openRoleModalBtn');

    if (openRoleButton) {
        openRoleButton.onclick = () => openRoleModal();
    }

    if (!saveRoleButton) return;

    // Attach logic to submit the Mini Form inside the Role Modal
    saveRoleButton.onclick = async () => {
        // Frontend rules validation
        const validationResult = validateAddRole();
        if (!validationResult.valid) {
            return;
        }

        const newRoleName = document.getElementById('newRoleName').value.trim();
        const newRoleSalary = Number(document.getElementById('newRoleSalary').value.trim());
        const departmentId = Number(document.getElementById('department_id').value);

        //Prevent duplicating role names manually
        const isDuplicateRoleName = allRoles.some((role) => {
            const hasSameName = role.role.toLowerCase() === newRoleName.toLowerCase();
            const isInSameDept = String(role.department_id) === String(departmentId);
            const isNotItself = String(role.id) !== String(editRoleId);

            return hasSameName && isInSameDept && isNotItself;
        });

        if (isDuplicateRoleName) {
            showToast('The role name you have entered already exists.', 'warning');
        }

        const willUpdateExistingRole = !!editRoleId;
        const actionLabel = willUpdateExistingRole ? 'Update' : 'Add';
        const targetApiEndpoint = willUpdateExistingRole ? `${API.roles}/${editRoleId}` : `${API.roles}/add-role`;
        const methodType = willUpdateExistingRole ? 'PUT' : 'POST';

        const rolePayload = {
            role: newRoleName,
            salary: newRoleSalary,
            department_id: departmentId
        };

        if (willUpdateExistingRole) {
            const isUserAgreed = await confirmUI('Add Role', 'Are you sure you want to update this role', 'warning')
            if (!isUserAgreed) return
        }
        else {
            const isUserAgreed = await confirmUI('Add Role', 'Are you sure you want to Add this role', 'info')
            if (!isUserAgreed) return
        }

        const apiResponse = await apiCall(targetApiEndpoint, methodType, rolePayload);

        if (apiResponse.ok) {
            showToast(`Role ${actionLabel.toLowerCase()}ed!`, 'success');

            const modalDOM = document.getElementById('roleModal');
            const boostrapModalInstance = bootstrap.Modal.getInstance(modalDOM);
            if (boostrapModalInstance) {
                boostrapModalInstance.hide();
            }

            // Refresh lists from the server
            await fetchRolesData();
            populateDepartments(departmentId);
            populateRoles(departmentId);
        }
    };
}


