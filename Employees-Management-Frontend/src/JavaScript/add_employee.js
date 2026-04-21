const setupAddEmployeeForm = () => {
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (!addEmployeeForm) return;

    ['name', 'email', 'joining_date', 'status' , 'role'].forEach(fieldId => {
        document.getElementById(fieldId)?.addEventListener('input', () => {
            validateField(fieldId);
            validateForm('addEmployeeForm', '#submitBtn');
            
            // check email is unique or not 
            if (fieldId === 'email') {
                const emailValue = document.getElementById('email').value.trim();
                const isDuplicate = allEmployees.some(employee => employee.email.toLowerCase() === emailValue.toLowerCase());
                if (isDuplicate) {
                    showFieldError('email', 'Email already registered.');
                }
            }

            if (fieldId === 'role'){
                const roleValue = document.getElementById()
            }
        });
    });

    addEmployeeForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(addEmployeeForm));
        formData.role_id = Number(formData.role_id);

        const emailValue = formData.email.trim();
        if (allEmployees.some(employee => employee.email.toLowerCase() === emailValue.toLowerCase())) {
            showFieldError('email', 'Email already registered.');
            return validateForm('addEmployeeForm', '#submitBtn');
        }

        const isUserAgreed = await confirmUI('Add Employee', 'Confirm new entry?', 'primary');
        if (isUserAgreed) {
            const { ok: isSuccessful } = await apiCall(`${API.employees}/add-employee`, 'POST', formData);
            if (isSuccessful) {
                showToast('Employee added!', 'success');
                setTimeout(() => location.href = './employees_list.html', 1500);
            }
        }
    });
};

const init = async () => {
    await Promise.all([fetchRolesData(), fetchEmployeesData()]);
    populateDepartments();
    populateRoles();
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupAddEmployeeForm();
    validateForm('addEmployeeForm', '#submitBtn');
};

init();

