const BASE_EMPLOYEES_API = 'http://localhost:3001/employees';
const BASE_ROLES_API = 'http://localhost:3001/roles';

let allRoles = [];
let editRoleId = null;

// Fetch all roles 
const fetchRoles = async () => {
    try {
        const res = await fetch(BASE_ROLES_API);
        if (!res.ok) throw new Error('Failed to fetch roles');
        allRoles = (await res.json()).data || [];
    } catch (err) {
        console.error('Fetch Roles Error:', err);
        allRoles = [];
    }
};

//departments dropdown from roles 
const populateDepartments = (selectedDeptId = null) => {
    const select = document.getElementById('department_id');
    if (!select) return;

    select.innerHTML = '<option value="">-- Select Department --</option>';

    const seen = new Map();
    allRoles.forEach(r => {
        const d = r.department;
        if (d && !seen.has(d.id)) seen.set(d.id, d.departmentName);
    });

    seen.forEach((name, id) => {
        const opt = Object.assign(document.createElement('option'), {
            value: id, textContent: name,
            selected: String(id) === String(selectedDeptId)
        });
        select.appendChild(opt);
    });
};

// roles dropdown 
const populateRoles = (departmentId = null, selectedRoleId = null) => {
    const menu = document.getElementById('roleDropdownMenu');
    const btn = document.getElementById('roleDropdownBtn');
    const input = document.getElementById('role_id');
    const salary = document.getElementById('salary_display');
    if (!menu) return;

    menu.innerHTML = '';

    const list = departmentId
        ? allRoles.filter(r => String(r.department?.id) === String(departmentId))
        : allRoles;

    if (!list.length) {
        menu.innerHTML = '<li><span class="dropdown-item text-muted">No roles available</span></li>';
        return;
    }

    list.forEach(role => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a class="dropdown-item d-flex justify-content-between align-items-center role-option"
               href="#" data-id="${role.id}" data-salary="${role.salary}" data-name="${role.role}">
                <span>${role.role}</span>
                <div class="d-flex align-items-center gap-1 ms-2">
                    <span class="badge" style="background:var(--secondary-grey)">$${role.salary}</span>
                    <button class="btn btn-sm btn-outline-warning py-0 px-1 role-edit-btn"
                        data-id="${role.id}" data-name="${role.role}" data-salary="${role.salary}"
                        type="button" title="Edit role">
                        <i class="bi bi-pencil-fill" style="font-size:10px"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger py-0 px-1 role-delete-btn"
                        data-id="${role.id}" type="button" title="Delete role">
                        <i class="bi bi-trash-fill" style="font-size:10px"></i>
                    </button>
                </div>
            </a>`;
        menu.appendChild(li);

        // Pre-select in edit form
        if (selectedRoleId && String(role.id) === String(selectedRoleId)) {
            btn.textContent = role.role;
            input.value = role.id;
            salary.value = `$${role.salary}`;
        }
    });
};

const setupRoleDropdown = () => {
    const menu = document.getElementById('roleDropdownMenu');
    if (!menu) return;

    menu.addEventListener('click', async e => {
        const editBtn = e.target.closest('.role-edit-btn');
        const deleteBtn = e.target.closest('.role-delete-btn');
        const item = e.target.closest('.role-option');

        if (editBtn) {
            e.preventDefault();
            e.stopPropagation();
            enterEditRoleMode(editBtn.dataset);
            return;
        }

        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();
            await deleteRole(deleteBtn.dataset.id);
            return;
        }

        if (item) {
            e.preventDefault();
            const btn = document.getElementById('roleDropdownBtn');
            const input = document.getElementById('role_id');
            const salary = document.getElementById('salary_display');
            btn.textContent = item.dataset.name;
            input.value = item.dataset.id;
            salary.value = `$${item.dataset.salary}`;
        }
    });
};

// role edit mode 
const enterEditRoleMode = ({ id, name, salary }) => {
    editRoleId = id;

    const nameEl = document.getElementById('newRoleName');
    const salaryEl = document.getElementById('newRoleSalary');
    const label = document.getElementById('roleCardLabel');
    const cancelBtn = document.getElementById('cancelEditRole');
    const saveBtnTx = document.querySelector('#saveRoleBtn .role-btn-text');

    if (nameEl) nameEl.value = name;
    if (salaryEl) salaryEl.value = salary;
    if (label) label.textContent = 'Edit Role';
    if (cancelBtn) cancelBtn.classList.remove('d-none');
    if (saveBtnTx) saveBtnTx.textContent = 'Update';

    nameEl?.focus();
};

const exitEditRoleMode = () => {
    editRoleId = null;

    const nameEl = document.getElementById('newRoleName');
    const salaryEl = document.getElementById('newRoleSalary');
    const label = document.getElementById('roleCardLabel');
    const cancelBtn = document.getElementById('cancelEditRole');
    const saveBtnTx = document.querySelector('#saveRoleBtn .role-btn-text');

    if (nameEl) { nameEl.value = ''; clearFieldError('newRoleName'); }
    if (salaryEl) { salaryEl.value = ''; clearFieldError('newRoleSalary'); }
    if (label) label.textContent = 'Quick Add Role';
    if (cancelBtn) cancelBtn.classList.add('d-none');
    if (saveBtnTx) saveBtnTx.textContent = 'Add Role';
};

// Delete a role
const deleteRole = async (id) => {
    if (!confirm('Delete this role? Employees assigned to it may be affected.')) return;
    try {
        const res = await fetch(`${BASE_ROLES_API}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) { showToast(data.message || 'Failed to delete role.', 'danger'); return; }

        showToast('Role deleted!', 'success');
        const deptId = document.getElementById('department_id')?.value || null;
        await fetchRoles();
        populateDepartments(deptId);
        populateRoles(deptId);
    } catch {
        showToast('Could not connect to the server.', 'danger');
    }
};

// Reset role picker
const resetRolePicker = () => {
    const btn = document.getElementById('roleDropdownBtn');
    const input = document.getElementById('role_id');
    const salary = document.getElementById('salary_display');
    if (btn) btn.textContent = 'Select a role';
    if (input) input.value = '';
    if (salary) salary.value = '';
};

//  Department wise roles 
const setupDepartmentFilter = () => {
    document.getElementById('department_id')?.addEventListener('change', e => {
        resetRolePicker();
        exitEditRoleMode();
        populateRoles(e.target.value || null);
    });
};

// Save (Add or Update) role card 
const setupAddRole = () => {
    const btn = document.getElementById('saveRoleBtn');
    if (!btn) return;

    // Cancel edit button
    document.getElementById('cancelEditRole')?.addEventListener('click', exitEditRoleMode);

    btn.addEventListener('click', async () => {
        const { valid } = validateAddRole();
        if (!valid) { showToast('Please fix the role fields.', 'warning'); return; }

        const roleName = document.getElementById('newRoleName').value.trim();
        const salary = Number(document.getElementById('newRoleSalary').value.trim());
        const deptId = Number(document.getElementById('department_id').value);

        if (editRoleId) {
            // UPDATE existing role
            try {
                const res = await fetch(`${BASE_ROLES_API}/${editRoleId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: roleName, salary, department_id: deptId })
                });
                const data = await res.json();
                if (!res.ok) { handleBackendErrors(data); return; }

                showToast('Role updated!', 'success');
                exitEditRoleMode();
                await fetchRoles();
                populateDepartments(deptId);
                populateRoles(deptId || null);
            } catch {
                showToast('Could not connect to the server.', 'danger');
            }
        } else {
            // ADD new role 
            try {
                const res = await fetch(`${BASE_ROLES_API}/add-role`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: roleName, salary, department_id: deptId })
                });
                const data = await res.json();
                if (!res.ok) { handleBackendErrors(data); return; }

                showToast('Role added!', 'success');
                document.getElementById('newRoleName').value = '';
                document.getElementById('newRoleSalary').value = '';
                clearFieldError('newRoleName');
                clearFieldError('newRoleSalary');
                await fetchRoles();
                populateDepartments(deptId);
                populateRoles(deptId || null);
            } catch {
                showToast('Could not connect to the server.', 'danger');
            }
        }
    });
};

// Toast notification
const showToast = (message, type = 'success') => {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = Object.assign(document.createElement('div'), { id: 'toastContainer' });
        container.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show shadow`;
    toast.style.minWidth = '280px';
    toast.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
};
