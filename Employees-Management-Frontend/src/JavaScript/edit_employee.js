// Get employee ID from URL
const employeeId = new URLSearchParams(window.location.search).get('id');

if (!employeeId) {
    showToast('No employee ID provided. Redirecting…', 'danger');
    setTimeout(() => { window.location.href = './employees_list.html'; }, 2000);
}

// ── Load employee data and pre-fill the form ──
const loadEmployee = async () => {
    try {
        const res = await fetch(`${BASE_EMPLOYEES_API}/${employeeId}`);
        if (!res.ok) throw new Error('Employee not found');
        const emp = (await res.json()).data;

        document.getElementById('employeeId').value = emp.id;
        document.getElementById('name').value = emp.name || '';
        document.getElementById('email').value = emp.email || '';
        document.getElementById('status').value = emp.status || 'active';
        if (emp.joining_date) {
            document.getElementById('joining_date').value = emp.joining_date.split('T')[0];
        }

        const deptId = emp.role?.department?.id || null;
        const roleId = emp.role?.id || null;
        populateDepartments(deptId);
        populateRoles(deptId, roleId);
    } catch (err) {
        console.error('Load Employee Error:', err);
        showToast('Could not load employee data.', 'danger');
    }
};

// ── Edit selected role (quick-edit card) ──────
const setupEditRole = () => {
    const editRoleBtn = document.getElementById('editRoleBtn');
    if (!editRoleBtn) return;

    editRoleBtn.addEventListener('click', async () => {
        const roleId = document.getElementById('role_id')?.value;
        const roleName = document.getElementById('editRoleName')?.value.trim();
        const roleSalary = document.getElementById('editRoleSalary')?.value.trim();
        const deptId = document.getElementById('department_id')?.value;

        if (!roleId) { showToast('Select a role to edit first.', 'warning'); return; }
        if (!roleName || !roleSalary || !deptId) { showToast('Fill Role Name, Salary, and Department.', 'warning'); return; }

        try {
            const res = await fetch(`${BASE_ROLES_API}/${roleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: roleName, salary: Number(roleSalary), department_id: Number(deptId) })
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.message || 'Failed to update role.', 'danger'); return; }

            showToast('Role updated!', 'success');
            document.getElementById('editRoleName').value = '';
            document.getElementById('editRoleSalary').value = '';

            await fetchRoles();
            populateDepartments(deptId);
            populateRoles(deptId, roleId);
        } catch (err) {
            console.error('Edit Role Error:', err);
            showToast('An error occurred while updating the role.', 'danger');
        }
    });
};

// ── Auto-fill edit-role inputs on role select ──
const setupRoleSelectionSync = () => {
    const roleMenu = document.getElementById('roleDropdownMenu');
    if (!roleMenu) return;
    roleMenu.addEventListener('click', e => {
        const item = e.target.closest('.role-option');
        if (!item) return;
        const editRoleName = document.getElementById('editRoleName');
        const editRoleSalary = document.getElementById('editRoleSalary');
        if (editRoleName) editRoleName.value = item.dataset.name || '';
        if (editRoleSalary) editRoleSalary.value = item.dataset.salary || '';
    });
};

// ── Update employee (PUT) ──────────────────────
const setupEditEmployeeForm = () => {
    const form = document.getElementById('editEmployeeForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

        const roleId = document.getElementById('role_id')?.value;
        if (!roleId) { showToast('Please select an employee role.', 'warning'); return; }

        const formData = Object.fromEntries(new FormData(form).entries());
        const empId = formData.employeeId || employeeId;
        delete formData.employeeId;
        formData.role_id = Number(formData.role_id);

        try {
            const res = await fetch(`${BASE_EMPLOYEES_API}/${empId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                showToast('Employee updated successfully!', 'success');
                setTimeout(() => { window.location.href = './employees_list.html'; }, 1500);
            } else {
                showToast(data.message || 'Failed to update employee.', 'danger');
            }
        } catch (err) {
            console.error('Edit Employee Error:', err);
            showToast('An error occurred while updating the employee.', 'danger');
        }
    });
};

// ── Init ───────────────────────────────────────
const init = async () => {
    if (!employeeId) return;
    await fetchRoles();
    await loadEmployee();
    setupDepartmentFilter();
    setupAddRole();
    setupEditRole();
    setupRoleSelectionSync();
    setupEditEmployeeForm();
};

init();
