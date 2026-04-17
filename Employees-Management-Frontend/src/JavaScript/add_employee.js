const setupAddEmployeeForm = () => {
    const form = document.getElementById('addEmployeeForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

        const roleId = document.getElementById('role_id')?.value;
        if (!roleId) { showToast('Please select an employee role.', 'warning'); return; }

        const employeeData = Object.fromEntries(new FormData(form).entries());
        employeeData.role_id = Number(employeeData.role_id);

        try {
            const res = await fetch(`${BASE_EMPLOYEES_API}/add-employee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });
            const data = await res.json();

            if (res.ok) {
                showToast('Employee added successfully!', 'success');
                form.reset();
                form.classList.remove('was-validated');
                resetRolePicker();
                setTimeout(() => { window.location.href = './employees_list.html'; }, 1500);
            } else {
                showToast(data.message || 'Failed to add employee.', 'danger');
            }
        } catch (err) {
            console.error('Add Employee Error:', err);
            showToast('An error occurred while adding the employee.', 'danger');
        }
    });
};

// ── Init ───────────────────────────────────────
const init = async () => {
    await fetchRoles();
    populateDepartments();
    populateRoles();
    setupDepartmentFilter();
    setupAddRole();
    setupAddEmployeeForm();
};

init();
