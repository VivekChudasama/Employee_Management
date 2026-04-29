// Handles the submission of the Add Employee form
async function handleFormSubmit(event) {
    event.preventDefault();

    const addEmployeeForm = event.target;
    const formData = new FormData(addEmployeeForm);

    const payload = {
        name: formData.get('name'),
        email: formData.get('email').trim(),
        role_id: Number(formData.get('role_id')),
        salary: formData.get('salary'),
        joining_date: formData.get('joining_date'),
        status: formData.get('status')
    };

    //check uniqueness of email before Adding employee
    if (isEmailDuplicate(payload.email)) {
        showFieldError('email', 'Email address you have entered is already in use by another user.');
        validateForm('addEmployeeForm', '#submitBtn');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    setBtnLoading(submitBtn, 'Submitting...');

    // Send data to backend
    const { ok: isSuccessful } = await apiCall(`${API.employees}/add-employee`, 'POST', payload);

    if (isSuccessful) {
        showToast('Employee added!', 'success');
        setTimeout(() => {
            location.href = './employees_list.html';
        }, 1500);
    } else {
        resetBtnLoading(submitBtn);
    }
}

function setupAddEmployeeForm() {
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (!addEmployeeForm) return;

    fieldsValidation('addEmployeeForm', '#submitBtn');

    addEmployeeForm.addEventListener('submit', handleFormSubmit);
}

async function init() {
    await Promise.all([fetchRolesData(), fetchEmployeesData()]);
    populateDepartments();
    populateRoles();
    populateStatusDropdown('active');
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupAddEmployeeForm();
}

init();
