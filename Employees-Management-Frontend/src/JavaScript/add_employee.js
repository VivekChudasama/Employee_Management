// Handles the submission of the Add Employee form
async function handleFormSubmit(event) {
    event.preventDefault();

    const addEmployeeForm = event.target;
    const formData = new FormData(addEmployeeForm);

    const payload = EmployeePayload(formData);

    //check uniqueness of email before Adding employee
    if (isEmailDuplicate(payload.email)) {
        showFieldError('email', EMAIL_DUPLICATE_MSG);
        validateForm('addEmployeeForm', '#submitBtn');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    setBtnLoading(submitBtn, 'Submitting');

    // Send data to backend using POST method
    const { ok: isSuccessful } = await apiCall(`${API.employees}/add-employee`, 'POST', payload);

    if (isSuccessful) {
        handleSubmitSuccess(submitBtn, 'Added', 'Employee added!', './employees_list.html');
    } else {
        resetBtnLoading(submitBtn);
        showToast('Failed to Add employee. Please try again.', 'danger');
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
