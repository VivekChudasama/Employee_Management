const setupAddEmployeeForm = () => {
    const form = document.getElementById('addEmployeeForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        // ── Bootstrap validates all visible required fields ──
        const bootstrapOk = form.checkValidity();
        form.classList.add('was-validated');

        const roleError = RULES.role_id(document.getElementById('role_id')?.value);
        if (roleError) showToast(roleError, 'warning');

        if (!bootstrapOk || roleError) return;

        const data = Object.fromEntries(new FormData(form));
        data.role_id = Number(data.role_id);

        try {
            const res = await fetch(`${BASE_EMPLOYEES_API}/add-employee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();

            if (res.ok) {
                showToast('Employee added successfully!', 'success');
                form.reset();
                form.classList.remove('was-validated');
                resetRolePicker();
                setTimeout(() => { window.location.href = './employees_list.html'; }, 1500);
            } else {
                handleBackendErrors(json);
            }
        } catch {
            showToast('Could not connect to the server. Please try again.', 'danger');
        }
    });
};

// ── Init ────────────────────────────────────────────────────
const init = async () => {
    await fetchRoles();
    populateDepartments();
    populateRoles();
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupAddEmployeeForm();
};

init();
