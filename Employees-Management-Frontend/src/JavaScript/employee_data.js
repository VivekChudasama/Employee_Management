const API = {
    employees: 'http://localhost:3001/employees',
    roles: 'http://localhost:3001/roles'
};

let allRoles = [];
let allEmployees = [];
let editRoleId = null;
let originalRoleData = null;

function isEmailDuplicate(email, excludeEmployeeId = null) {
    const enteredEmail = email.trim().toLowerCase();
    return allEmployees.some(emp =>
        emp.email.toLowerCase() === enteredEmail &&
        String(emp.id) !== String(excludeEmployeeId)
    );
}

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
    allRoles = (await apiCall(API.roles)).data || [];
}

async function fetchEmployeesData() {
    allEmployees = (await apiCall(API.employees)).data || [];
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
    toastElement.className = `alert alert-${type} d-flex align-items-center shadow-lg fade show custom-toast`;
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

// Button loading 
function setBtnLoading(btn, loadingText) {
    if (!btn) return;
    btn._originalHTML = btn.innerHTML;
    btn._wasDisabled = btn.disabled;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>${loadingText}`;
}

function resetBtnLoading(btn) {
    if (!btn || !btn._originalHTML) return;
    btn.innerHTML = btn._originalHTML;
    btn.disabled = btn._wasDisabled || false;
}

function updateDropdownUI(btnId, inputId, defaultText, value, label) {
    const btn = document.getElementById(btnId);
    const hiddenInput = document.getElementById(inputId);
    if (btn) btn.textContent = label || defaultText;
    if (hiddenInput) {
        hiddenInput.value = value || '';
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function revalidateParentForm(element) {
    const parentForm = element.closest('form');
    if (parentForm && typeof validateForm === 'function') {
        validateForm(parentForm.id, '#submitBtn');
    }
}

// Employee Form Dropdown
function updateDepartmentSelection(name, id) {
    updateDropdownUI('departmentDropdownBtn', 'department_id', 'Select Department', id, name);
    populateRoles(id, null);
}

function updateStatusSelection(status) {
    updateDropdownUI('statusDropdownBtn', 'status', 'Select Status', status, status);
}

function populateDepartments(selectedId = null) {
    const dropdownMenu = document.getElementById('departmentDropdownMenu');
    if (!dropdownMenu) return;

    const seenDepartments = new Map();
    allRoles.forEach(r => r.department && seenDepartments.set(r.department.id, r.department.departmentName));

    const optionsHtml = Array.from(seenDepartments.entries()).map(([id, name]) => {
        const isActive = String(id) === String(selectedId);
        if (isActive) updateDepartmentSelection(name, id);
        return `<li><a class="dropdown-item dropdown-element department-option py-2 px-3 ${isActive ? 'fw-bold text-custom-primary' : ''}" href="#" data-id="${id}" data-name="${name}">${name}</a></li>`;
    }).join('');

    dropdownMenu.innerHTML = `<li><a class="dropdown-item dropdown-element text-muted department-option py-2 px-3 ${!selectedId ? 'fw-bold text-custom-primary' : ''}" href="#" data-id="" data-name="Select Department">Select Department</a></li>` + optionsHtml;
}

function populateStatusDropdown(selectedStatus = null) {
    const dropdownMenu = document.getElementById('statusDropdownMenu');
    if (!dropdownMenu) return;

    const uniqueStatuses = [...new Set(['active', 'inactive', ...allEmployees.map(emp => emp.status).filter(Boolean)])];

    const optionsHtml = uniqueStatuses.map(status => {
        const isActive = status === selectedStatus;
        if (isActive) updateStatusSelection(status);
        return `<li><a class="dropdown-item dropdown-element status-option py-2 px-3 ${isActive ? 'fw-bold text-custom-primary' : ''}" href="#" data-status="${status}">${status}</a></li>`;
    }).join('');

    dropdownMenu.innerHTML = `<li><a class="dropdown-item dropdown-element text-muted status-option py-2 px-3 ${!selectedStatus ? 'fw-bold text-custom-primary' : ''}" href="#" data-status="">Select Status</a></li>` + optionsHtml;
}

function populateRoles(departmentId = null, selectedRoleId = null) {
    const dropdownMenu = document.getElementById('roleDropdownMenu');
    const dropdownButton = document.getElementById('roleDropdownBtn');
    if (!dropdownMenu || !dropdownButton) return;

    if (!departmentId) {
        dropdownMenu.innerHTML = '<li><span class="dropdown-item dropdown-element text-muted text-center py-3">Select a department first</span></li>';
        dropdownButton.disabled = true;
        dropdownButton.textContent = 'Select department first';
        return;
    }

    dropdownButton.disabled = false;
    dropdownButton.textContent = 'Select a role';
    const rolesInDepartment = allRoles.filter(role => String(role.department?.id) === String(departmentId));

    let html = rolesInDepartment.length === 0
        ? '<li><span class="dropdown-item dropdown-element text-muted text-center py-3">No roles in this department</span></li>'
        : rolesInDepartment.map(role => {
            const isActive = selectedRoleId && String(role.id) === String(selectedRoleId);
            if (isActive) updateRolePickerSelection(role.role, role.id);
            return `
                <li>
                    <a class="dropdown-item dropdown-element d-flex justify-content-between align-items-center role-option py-2 px-3 ${isActive ? 'fw-bold text-custom-primary' : ''}" href="#" data-id="${role.id}" data-name="${role.role}">
                        <span class="role-name-text">${role.role}</span>
                        <div class="d-flex gap-2 ms-2 action-btns">
                            <button type="button" class="btn btn-sm btn-outline-warning role-edit-btn border-0" data-id="${role.id}" data-name="${role.role}"><i class="bi bi-pencil-fill"></i></button>
                            <button type="button" class="btn btn-sm btn-outline-danger role-delete-btn border-0" data-id="${role.id}"><i class="bi bi-trash-fill"></i></button>
                        </div>
                    </a>
                </li>`;
        }).join('');

    dropdownMenu.innerHTML = html + `
        <li><hr class="dropdown-divider"></li>
        <li><button type="button" class="dropdown-item dropdown-element text-custom-primary text-center py-2" id="addRoleInDropdownBtn">
            <i class="bi bi-plus-circle-fill me-1"></i> Add New Role
        </button></li>`;
}

function updateRolePickerSelection(name, id) {
    const button = document.getElementById('roleDropdownBtn');
    const hiddenInput = document.getElementById('role_id');

    if (button) button.textContent = name || 'Select a role';

    if (hiddenInput) {
        hiddenInput.value = id || '';
        if (id) revalidateParentForm(hiddenInput);
    }

    toggleSalaryField(!!id);
}

function setupRoleDropdown() {
    const dropdownMenu = document.getElementById('roleDropdownMenu');
    if (!dropdownMenu) return;

    // event to handle clicks inside the Dropdown
    dropdownMenu.addEventListener('click', async (event) => {
        const clickedOptionItem = event.target.closest('.role-option');
        const clickedEditButton = event.target.closest('.role-edit-btn');
        const clickedDeleteButton = event.target.closest('.role-delete-btn');
        const clickedAddRoleButton = event.target.closest('#addRoleInDropdownBtn');

        // click Add New Role button?
        if (clickedAddRoleButton) {
            event.preventDefault();
            openRoleModal();
            return;
        }

        // click Edit Role?
        if (clickedEditButton) {
            event.preventDefault();
            openRoleModal(clickedEditButton.dataset);
            return;
        }

        // click Delete Role?
        if (clickedDeleteButton) {
            event.preventDefault();
            deleteRole(clickedDeleteButton.dataset.id);
            return;
        }

        // click to Select a role?
        const clickedActionArea = event.target.closest('.action-btns');
        if (clickedOptionItem && !clickedActionArea) {
            event.preventDefault();

            dropdownMenu.querySelectorAll('.role-option').forEach(item => item.classList.remove('fw-bold', 'text-custom-primary'));
            clickedOptionItem.classList.add('fw-bold', 'text-custom-primary');

            const name = clickedOptionItem.dataset.name;
            const id = clickedOptionItem.dataset.id;

            updateRolePickerSelection(name, id);

            // Re-validate form to unlock Submit Button
            revalidateParentForm(clickedOptionItem);
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
    const saveButton = document.getElementById('saveRoleBtn');

    if (roleData !== null) {
        // Populating for UPDATE ROLE
        editRoleId = roleData.id;
        originalRoleData = { name: roleData.name };
        modalTitle.textContent = 'Edit Role';
        nameInput.value = roleData.name;
        saveButton.textContent = 'Update Role';
    } else {
        // Clearing for ADD ROLE
        editRoleId = null;
        originalRoleData = null;
        modalTitle.textContent = 'Add Role';
        nameInput.value = '';
        saveButton.textContent = 'Add Role';
    }

    // Clear any previous error 
    nameInput.classList.remove('is-invalid');

    modal.show();
}

async function deleteRole(roleIdToDelete) {
    // Block if any employees has this Role
    const isAssigned = allEmployees.some(employee => String(employee.role_id) === String(roleIdToDelete));

    if (isAssigned) {
        showToast('This role cannot be deleted because it is currently assigned to one or more employees.', 'danger');
        return;
    }

    const roleToDelete = allRoles.find(r => String(r.id) === String(roleIdToDelete));
    const roleName = roleToDelete ? roleToDelete.role :'';

    const isUserAgreed = await confirmUI('Delete Role', `Are you sure you want to delete Role: "${roleName}" ? This cannot be undone.`, 'danger');
    if (!isUserAgreed) return;

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

function toggleSalaryField(isEnabled) {
    const salaryInput = document.getElementById('salary');
    if (!salaryInput) return;

    if (isEnabled) {
        salaryInput.disabled = false;
        salaryInput.placeholder = 'Enter employee salary';
    } else {
        salaryInput.disabled = true;
        salaryInput.value = '';
        salaryInput.placeholder = 'Select a role first';
        salaryInput.classList.remove('is-invalid', 'is-valid');
    }
}

function setupDepartmentFilter() {
    document.addEventListener('click', (event) => {
        // Department Dropdown
        const deptOption = event.target.closest('.department-option');
        if (deptOption) {
            event.preventDefault();

            const menu = deptOption.closest('.dropdown-menu');
            if (menu) menu.querySelectorAll('.department-option').forEach(item => item.classList.remove('fw-bold', 'text-custom-primary'));
            deptOption.classList.add('fw-bold', 'text-custom-primary');

            const id = deptOption.dataset.id;
            updateDepartmentSelection(deptOption.dataset.name, id);

            updateRolePickerSelection(null, null);
            populateRoles(id);

            revalidateParentForm(deptOption);
        }

        // Status Dropdown
        const statusOption = event.target.closest('.status-option');
        if (statusOption) {
            event.preventDefault();

            const menu = statusOption.closest('.dropdown-menu');
            if (menu) menu.querySelectorAll('.status-option').forEach(item => item.classList.remove('fw-bold', 'text-custom-primary'));
            statusOption.classList.add('fw-bold', 'text-custom-primary');

            updateStatusSelection(statusOption.dataset.status);
            revalidateParentForm(statusOption);
        }
    });
}

function setupAddRole() {
    const saveRoleButton = document.getElementById('saveRoleBtn');
    const openRoleButton = document.getElementById('openRoleModalBtn');
    const newRoleNameInput = document.getElementById('newRoleName');

    if (openRoleButton) {
        openRoleButton.onclick = () => openRoleModal();
    }

    // Add input event listener to newRoleName for validation
    if (newRoleNameInput && !newRoleNameInput.dataset.inputListenerAdded) {
        newRoleNameInput.addEventListener('input', () => {
            const roleNameValue = newRoleNameInput.value || '';
            const errorMessage = RULES.roleName(roleNameValue);
            if (errorMessage) {
                showFieldError('newRoleName', errorMessage);
            } else {
                clearFieldError('newRoleName');
            }
        });
        newRoleNameInput.dataset.inputListenerAdded = 'true';
    }

    if (!saveRoleButton) return;

    // submit the Form inside the Role Modal
    saveRoleButton.onclick = async () => {
        // Frontend rules validation
        const validationResult = validateAddRole();
        if (!validationResult.valid) {
            return;
        }

        const newRoleName = document.getElementById('newRoleName').value.trim();
        const departmentId = Number(document.getElementById('department_id').value);

        //Prevent duplicating role names 
        const isDuplicateRoleName = allRoles.some(role =>
            role.role.toLowerCase() === newRoleName.toLowerCase() &&
            String(role.department_id) === String(departmentId) &&
            String(role.id) !== String(editRoleId)
        );

        if (isDuplicateRoleName) {
            showToast('The role name you have entered already exists.', 'warning');
            return;
        }

        const willUpdateExistingRole = !!editRoleId;

        if (willUpdateExistingRole) {
            if (originalRoleData &&
                newRoleName === originalRoleData.name) {
                showToast('No changes were made.', 'warning');
                return;
            }
        }
        const actionLabel = willUpdateExistingRole ? 'Update' : 'Add';
        const targetApiEndpoint = willUpdateExistingRole ? `${API.roles}/${editRoleId}` : `${API.roles}/add-role`;
        const methodType = willUpdateExistingRole ? 'PUT' : 'POST';

        const rolePayload = {
            role: newRoleName,
            department_id: departmentId
        };

        setBtnLoading(saveRoleButton, `${actionLabel === 'Update' ? 'Updating' : 'Adding'}`);

        const apiResponse = await apiCall(targetApiEndpoint, methodType, rolePayload);

        resetBtnLoading(saveRoleButton);

        if (apiResponse.ok) {
            showToast(`Role ${willUpdateExistingRole ? 'updated' : 'added'} successfully!`, 'success');

            const modalDOM = document.getElementById('roleModal');
            const boostrapModalInstance = bootstrap.Modal.getInstance(modalDOM);
            if (boostrapModalInstance) {
                boostrapModalInstance.hide();
            }

            await fetchRolesData();
            populateDepartments(departmentId);
            populateRoles(departmentId);
        }
    };
}
