const API = {
    employees: 'http://localhost:3001/employees',
    roles: 'http://localhost:3001/roles'
};

let allRoles = [];
let allEmployees = [];
let editRoleId = null;

/**
 * Common API fetch 
 */
const apiCall = async (url, method = 'GET', body = null) => {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(body && { body: JSON.stringify(body) })
        };
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            handleBackendErrors(data);
            return { ok: false, data };
        }
        return { ok: true, data: data.data };
    } catch (error) {
        console.error(`API Error (${url}):`, error);
        showToast('Could not connect to the server.', 'danger');
        return { ok: false, error: error };
    }
};

/**
 * Data Fetching
 */
const fetchRolesData = async () => {
    const { ok, data } = await apiCall(API.roles);
    if (ok) allRoles = data || [];
};

const fetchEmployeesData = async () => {
    const { ok, data } = await apiCall(API.employees);
    if (ok) allEmployees = data || [];
};

/**
 * UI Confirmation & Toasts
 */
const confirmUI = (title, message, type = 'warning') => {
    return new Promise((resolve) => {
        const modalElement = document.getElementById('confirmModal');
        if (!modalElement) return resolve(confirm(message));

        const modal = new bootstrap.Modal(modalElement);
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmIcon').className = `bi bi-exclamation-circle text-${type}`;

        const actionButton = document.getElementById('confirmActionBtn');
        const clearAndResolve = (value) => {
            actionButton.replaceWith(actionButton.cloneNode(true));
            modal.hide();
            resolve(value);
        };

        document.getElementById('confirmActionBtn').onclick = () => clearAndResolve(true);
        modalElement.addEventListener('hidden.bs.modal', () => resolve(false), { once: true });
        modal.show();
    });
};

const showToast = (message, type = 'success') => {
    let container = document.getElementById('toastContainer') || Object.assign(document.createElement('div'), { id: 'toastContainer' });
    if (!container.parentElement) {
        container.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:12px;';
        document.body.appendChild(container);
    }

    const iconName = type === 'success' ? 'check-circle' : type === 'danger' ? 'x-circle' : 'exclamation-circle';
    const backgroundColor = type === 'success' ? '#198754' : type === 'danger' ? '#dc3545' : '#ffc107';

    const toastElement = document.createElement('div');
    toastElement.className = `alert alert-${type} d-flex align-items-center shadow-lg border-0 fade show`;
    toastElement.style.cssText = `min-width:300px; border-left: 5px solid rgba(0,0,0,0.2) !important; color:#fff; background: ${backgroundColor}`;
    toastElement.innerHTML = `
        <i class="bi bi-${iconName} fs-4 me-3"></i>
        <div class="flex-grow-1">${message}</div>
        <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="alert"></button>`;

    container.appendChild(toastElement);
    setTimeout(() => {
        toastElement.classList.remove('show');
        setTimeout(() => toastElement.remove(), 500);
    }, 4000);
};

/**
 * Dropdown & Role Management
 */
const populateDepartments = (selectedId = null) => {
    const selectElement = document.getElementById('department_id');
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="">Select Department</option>';
    const seenDepartments = new Map();
    allRoles.forEach(role => role.department && !seenDepartments.has(role.department.id) && seenDepartments.set(role.department.id, role.department.departmentName));

    seenDepartments.forEach((name, id) => {
        selectElement.appendChild(Object.assign(document.createElement('option'), {
            value: id, textContent: name, selected: String(id) === String(selectedId)
        }));
    });
};

const populateRoles = (departmentId = null, selectedRoleId = null) => {
    const dropdownMenu = document.getElementById('roleDropdownMenu');
    const dropdownButton = document.getElementById('roleDropdownBtn');
    if (!dropdownMenu || !dropdownButton) return;

    dropdownMenu.innerHTML = '';
    if (!departmentId) {
        dropdownMenu.innerHTML = '<li><span class="dropdown-item text-muted text-center py-3">Select a department first</span></li>';
        dropdownButton.disabled = true;
        return;
    }

    dropdownButton.disabled = false;
    const rolesInDepartment = allRoles.filter(role => String(role.department?.id) === String(departmentId));

    if (!rolesInDepartment.length) {
        dropdownMenu.innerHTML = '<li><span class="dropdown-item text-muted text-center py-3">No roles in this department</span></li>';
    } else {
        rolesInDepartment.forEach(role => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a class="dropdown-item d-flex justify-content-between align-items-center role-option py-2 px-3"
                   href="#" data-id="${role.id}" data-salary="${role.salary}" data-name="${role.role}">
                    <div class="d-flex flex-column"><span class="fw-bold">${role.role}</span><small class="text-muted">$${role.salary}</small></div>
                    <div class="d-flex gap-2 ms-2 action-btns">
                        <button class="btn btn-sm btn-outline-warning role-edit-btn border-0 shadow-sm" data-id="${role.id}" data-name="${role.role}" data-salary="${role.salary}"><i class="bi bi-pencil-fill"></i></button>
                        <button class="btn btn-sm btn-outline-danger role-delete-btn border-0 shadow-sm" data-id="${role.id}"><i class="bi bi-trash-fill"></i></button>
                    </div>
                </a>`;
            dropdownMenu.appendChild(listItem);
            if (selectedRoleId && String(role.id) === String(selectedRoleId)) {
                updateRolePickerSelection(role.role, role.id, role.salary);
            }
        });
    }

    const footerDivider = document.createElement('li');
    footerDivider.innerHTML = '<hr class="dropdown-divider"><button class="dropdown-item text-primary text-center py-2" id="addRoleInDropdownBtn"><i class="bi bi-plus-circle-fill me-1"></i> Add New Role</button>';
    dropdownMenu.appendChild(footerDivider);
    document.getElementById('addRoleInDropdownBtn').onclick = () => openRoleModal();
};

const updateRolePickerSelection = (name, id, salary) => {
    const button = document.getElementById('roleDropdownBtn');
    const hiddenInput = document.getElementById('role_id');
    const salaryDisplay = document.getElementById('salary_display');
    if (button) button.textContent = name || 'Select a role';
    if (hiddenInput) hiddenInput.value = id || '';
    if (salaryDisplay) salaryDisplay.value = salary ? `$${salary}` : '';
};

const setupRoleDropdown = () => {
    document.getElementById('roleDropdownMenu')?.addEventListener('click', async (event) => {
        const optionItem = event.target.closest('.role-option');
        const editButton = event.target.closest('.role-edit-btn');
        const deleteButton = event.target.closest('.role-delete-btn');

        if (editButton) return openRoleModal(editButton.dataset);
        if (deleteButton) return deleteRole(deleteButton.dataset.id);
        if (optionItem && !event.target.closest('.action-btns')) {
            updateRolePickerSelection(optionItem.dataset.name, optionItem.dataset.id, optionItem.dataset.salary);
            const formElement = optionItem.closest('form');
            if (formElement) validateForm(formElement.id, '#submitBtn');
        }
    });
};

const openRoleModal = (roleData = null) => {
    const departmentId = document.getElementById('department_id')?.value;
    if (!departmentId) return showToast('Select a department first!', 'warning');

    const modal = new bootstrap.Modal(document.getElementById('roleModal'));
    const modalTitle = document.getElementById('roleModalLabel');
    const nameInput = document.getElementById('newRoleName');
    const salaryInput = document.getElementById('newRoleSalary');
    const saveButton = document.getElementById('saveRoleBtn');

    if (roleData) {
        editRoleId = roleData.id;
        modalTitle.textContent = 'Edit Role';
        nameInput.value = roleData.name;
        salaryInput.value = roleData.salary;
        saveButton.textContent = 'Update Role';
    } else {
        editRoleId = null;
        modalTitle.textContent = 'Add New Role';
        nameInput.value = '';
        salaryInput.value = '';
        saveButton.textContent = 'Add Role';
    }
    [nameInput, salaryInput].forEach(inputElement => inputElement.classList.remove('is-invalid'));
    modal.show();
};

const deleteRole = async (id) => {
    const confirmed = await confirmUI('Delete Role', 'Are you sure? This affects assigned employees.', 'danger');
    if (!confirmed) return;

    const { ok } = await apiCall(`${API.roles}/${id}`, 'DELETE');
    if (ok) {
        showToast('Role deleted!', 'success');
        const deptId = document.getElementById('department_id')?.value;
        await fetchRolesData();
        populateDepartments(deptId);
        populateRoles(deptId);
    }
};

const setupDepartmentFilter = () => {
    document.getElementById('department_id')?.addEventListener('change', (event) => {
        updateRolePickerSelection();
        populateRoles(event.target.value);
        const formElement = event.target.closest('form');
        if (formElement) validateForm(formElement.id, '#submitBtn');
    });
};

const setupAddRole = () => {
    const saveButton = document.getElementById('saveRoleBtn');
    const openButton = document.getElementById('openRoleModalBtn');
    if (openButton) openButton.onclick = openRoleModal;
    if (!saveButton) return;

    saveButton.onclick = async () => {
        const { valid } = validateAddRole();
        if (!valid) return;

        const roleName = document.getElementById('newRoleName').value.trim();
        const roleSalary = Number(document.getElementById('newRoleSalary').value.trim());
        const departmentId = Number(document.getElementById('department_id').value);

        const isDuplicate = allRoles.some(role => role.role.toLowerCase() === roleName.toLowerCase() && String(role.id) !== String(editRoleId) && String(role.department_id) === String(departmentId));
        if (isDuplicate) {
            showToast(`The role name you have entered already exists.` , 'warning')
        } 

        const actionName = editRoleId ? 'Update' : 'Add';
        if (!(await confirmUI(`${actionName} Role`, `Confirm ${actionName.toLowerCase()}?`))) return;

        const targetUrl = editRoleId ? `${API.roles}/${editRoleId}` : `${API.roles}/add-role`;
        const { ok } = await apiCall(targetUrl, editRoleId ? 'PUT' : 'POST', { role: roleName, salary: roleSalary, department_id: departmentId });

        if (ok) {
            showToast(`Role ${actionName.toLowerCase()}ed!`, 'success');
            bootstrap.Modal.getInstance(document.getElementById('roleModal')).hide();
            await fetchRolesData();
            populateDepartments(departmentId);
            populateRoles(departmentId);
        }
    };
};


