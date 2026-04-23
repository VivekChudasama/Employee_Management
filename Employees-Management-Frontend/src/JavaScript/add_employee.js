// Validates individual inputs as the user types
function handleInputEvent(event) {
    const fieldId = event.target.id;
    validateField(fieldId);
    validateForm('addEmployeeForm', '#submitBtn');

    //check for email uniqueness
    if (fieldId === 'email') {
        const emailValue = event.target.value;
        if (isEmailDuplicate(emailValue)) {
            showFieldError('email', 'Email address you have entered is already in use by another user.');
        }
    }
}

// Handles the submission of the Add Employee form
async function handleFormSubmit(event) {
    event.preventDefault();

    const addEmployeeForm = event.target;
    const formData = new FormData(addEmployeeForm);

    const payload = {
        name: formData.get('name'),
        email: formData.get('email').trim(),
        role_id: Number(formData.get('role_id')),
        joining_date: formData.get('joining_date'),
        status: formData.get('status')
    };

    //check uniqueness of email before saving
    if (isEmailDuplicate(payload.email)) {
        showFieldError('email', 'Email address you have entered is already in use by another user.');
        validateForm('addEmployeeForm', '#submitBtn');
        return;
    }

    // Ask user to confirm
    const isUserAgreed = await confirmUI('Add Employee', 'Confirm new entry?', 'primary');
    if (!isUserAgreed) return;

    // Send data to backend
    const { ok: isSuccessful } = await apiCall(`${API.employees}/add-employee`, 'POST', payload);
    if (isSuccessful) {
        showToast('Employee added!', 'success');
        setTimeout(() => {
            location.href = './employees_list.html';
        }, 1500);
    }
}

function setupAddEmployeeForm() {
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (!addEmployeeForm) return;

    // Add validation to specific input fields
    const fieldsToValidate = ['name', 'email', 'joining_date', 'status'];
    fieldsToValidate.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('input', handleInputEvent);
        }
    });
    addEmployeeForm.addEventListener('submit', handleFormSubmit);
}

async function init() {
    await Promise.all([fetchRolesData(), fetchEmployeesData()]);
    populateDepartments();
    populateRoles();
    populateStatusDropdown();
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupAddEmployeeForm();
    validateForm('addEmployeeForm', '#submitBtn');
}

init();

