const employeeId = new URLSearchParams(window.location.search).get('id');

if (!employeeId) {
    showToast('No employee ID provided. Redirecting…', 'danger');
    setTimeout(() => location.href = './employees_list.html', 2000);
}

const loadEmployeeData = async () => {
    const { ok: isSuccessful, data: employee } = await apiCall(`${API.employees}/${employeeId}`);
    if (isSuccessful) {
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('name').value = employee.name || '';
        document.getElementById('email').value = employee.email || '';
        document.getElementById('status').value = employee.status || 'active';
        document.getElementById('joining_date').value = employee.joining_date?.split('T')[0] || '';

        populateDepartments(employee.role?.department?.id);
        populateRoles(employee.role?.department?.id, employee.role?.id);
    }
};

const setupEditEmployeeForm = () => {
    const editEmployeeForm = document.getElementById('editEmployeeForm');
    if (!editEmployeeForm) return;

    ['name', 'email', 'joining_date', 'status'].forEach(fieldId => {
        document.getElementById(fieldId)?.addEventListener('input', () => {
            validateField(fieldId);
            validateForm('editEmployeeForm', '#submitBtn');

            // check email is unique or not 
            if (fieldId === 'email') {
                const emailValue = document.getElementById('email').value.trim();
                const targetEmployeeId = document.getElementById('employeeId').value || employeeId;
                const isDuplicate = allEmployees.some(employee => 
                    employee.email.toLowerCase() === emailValue.toLowerCase() && 
                    String(employee.id) !== String(targetEmployeeId)
                );
                if (isDuplicate) {
                    showFieldError('email', 'Email address you have entered is already in use by another user.');
                }
            }
        });
    });

    editEmployeeForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(editEmployeeForm));
        const targetEmployeeId = formData.employeeId || employeeId;
        delete formData.employeeId;
        formData.role_id = Number(formData.role_id);

        const emailValue = formData.email.trim();
        if (allEmployees.some(employee => employee.email.toLowerCase() === emailValue.toLowerCase() && String(employee.id) !== String(targetEmployeeId))) {
            showFieldError('email', 'Email address you have entered is already in use by another user.');
            return validateForm('#submitBtn');
        }

        const isUserAgreed = await confirmUI('Update Employee', 'Save changes?', 'primary');
        if (isUserAgreed) {
            const { ok: isSuccessful } = await apiCall(`${API.employees}/${targetEmployeeId}`, 'PUT', formData);
            if (isSuccessful) {
                showToast('Employee updated!', 'success');
                setTimeout(() => location.href = './employees_list.html', 1500);
            }
        }
    });
};

const init = async () => {
    if (!employeeId) return;
    await Promise.all([fetchRolesData(), fetchEmployeesData()]);
    await loadEmployeeData();
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupEditEmployeeForm();
    validateForm( '#submitBtn');
};

init();

