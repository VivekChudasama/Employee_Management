const employeeId = new URLSearchParams(window.location.search).get('id');

if (!employeeId) {
    showToast('No employee ID provided. Redirecting…', 'danger');
    setTimeout(() => { window.location.href = './employees_list.html'; }, 2000);
}

// Pre-fill form with existing employee data 
const loadEmployee = async () => {
    try {
        const res = await fetch(`${BASE_EMPLOYEES_API}/${employeeId}`);
        if (!res.ok) throw new Error('Employee not found');
        const emp = (await res.json()).data;

        document.getElementById('employeeId').value = emp.id;
        document.getElementById('name').value = emp.name || '';
        document.getElementById('email').value = emp.email || '';
        document.getElementById('status').value = emp.status || 'active';
        document.getElementById('joining_date').value = emp.joining_date?.split('T')[0] || '';

        populateDepartments(emp.role?.department?.id);
        populateRoles(emp.role?.department?.id, emp.role?.id);
    } catch (err) {
        console.error('Load Employee Error:', err);
        showToast('Could not load employee data.', 'danger');
    }
};

//  Submit: update employee
const setupEditEmployeeForm = () => {
    const form = document.getElementById('editEmployeeForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        // Bootstrap validates all visible required fields
        const bootstrapOk = form.checkValidity();
        form.classList.add('was-validated');

        const roleError = RULES.role_id(document.getElementById('role_id')?.value);
        if (roleError) showToast(roleError, 'warning');

        if (!bootstrapOk || roleError) return;

        const formData = Object.fromEntries(new FormData(form));
        const empId = formData.employeeId || employeeId;
        delete formData.employeeId;
        formData.role_id = Number(formData.role_id);

        try {
            const res = await fetch(`${BASE_EMPLOYEES_API}/${empId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const json = await res.json();

            if (res.ok) {
                showToast('Employee updated successfully!', 'success');
                form.classList.remove('was-validated');
                setTimeout(() => { window.location.href = './employees_list.html'; }, 1500);
            } else {
                handleBackendErrors(json);
            }
        } catch {
            showToast('Could not connect to the server. Please try again.', 'danger');
        }
    });
};


const init = async () => {
    if (!employeeId) return;
    await fetchRoles();
    await loadEmployee();
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupEditEmployeeForm();
};

init();
