// Retrieve the current employee ID from the URL search params
const employeeIdUrlParam = new URLSearchParams(window.location.search).get('id');

if (!employeeIdUrlParam) {
    showToast('No employee ID provided. Redirecting…', 'danger');
    setTimeout(() => {
        location.href = './employees_list.html';
    }, 2000);
}

// check if an email already exists in our records (excluding current user)
function isEmailDuplicateForEdit(email, targetEmployeeId) {
    const enteredEmail = email.trim().toLowerCase();

    return allEmployees.some(employee => {
        const isSameEmail = employee.email.toLowerCase() === enteredEmail;
        const isDifferentUser = String(employee.id) !== String(targetEmployeeId);
        return isSameEmail && isDifferentUser;
    });
}

// Fetches the existing employee data and fills out the form inputs
async function loadEmployeeData() {
    const { ok: isSuccessful, data: employee } = await apiCall(`${API.employees}/${employeeIdUrlParam}`);
    if (!isSuccessful) return;

    // Fill in standard text inputs
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('name').value = employee.name || '';
    document.getElementById('email').value = employee.email || '';

    const rawDate = employee.joining_date;
    document.getElementById('joining_date').value = rawDate ? rawDate.split('T')[0] : '';

    const departmentId = employee.role?.department?.id;
    const roleId = employee.role?.id;
    const status = employee.status;

    populateDepartments(departmentId);
    populateRoles(departmentId, roleId);
    populateStatusDropdown(status);
}

// Validates individual inputs as the user types
function handleEditInputEvent(event) {
    const fieldId = event.target.id;
    validateField(fieldId);
    validateForm('editEmployeeForm', '#submitBtn');

    //check for email uniqueness
    if (fieldId === 'email') {
        const emailValue = event.target.value;
        const currentId = document.getElementById('employeeId').value || employeeIdUrlParam;

        if (isEmailDuplicateForEdit(emailValue, currentId)) {
            showFieldError('email', 'Email address you have entered is already in use by another user.');
        }
    }
}

// Handles the submission of the Edit Employee form
async function handleEditFormSubmit(event) {
    event.preventDefault();

    const editEmployeeForm = event.target;
    const formData = new FormData(editEmployeeForm);

    const targetEmployeeId = formData.get('employeeId') || employeeIdUrlParam;

    const payload = {
        name: formData.get('name'),
        email: formData.get('email').trim(),
        role_id: Number(formData.get('role_id')),
        joining_date: formData.get('joining_date'),
        status: formData.get('status')
    };

    // uniqueness check before saving
    if (isEmailDuplicateForEdit(payload.email, targetEmployeeId)) {
        showFieldError('email', 'Email address you have entered is already in use by another user.');
        validateForm('editEmployeeForm', '#submitBtn');
        return; // Stop formal submission
    }

    // Ask user to confirm
    const isUserAgreed = await confirmUI('Update Employee', 'Save changes?', 'primary');
    if (!isUserAgreed) return;

    // Send data to backend using PUT
    const { ok: isSuccessful } = await apiCall(`${API.employees}/${targetEmployeeId}`, 'PUT', payload);
    if (isSuccessful) {
        showToast('Employee updated!', 'success');
        setTimeout(() => {
            location.href = './employees_list.html';
        }, 1500);
    }
}

function setupEditEmployeeForm() {
    const editEmployeeForm = document.getElementById('editEmployeeForm');
    if (!editEmployeeForm) return;

    const fieldsToValidate = ['name', 'email', 'joining_date', 'status'];
    fieldsToValidate.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('input', handleEditInputEvent);
        }
    });

    // Attach submit listener to the form itself
    editEmployeeForm.addEventListener('submit', handleEditFormSubmit);
}

// Initializer function that runs when the page loads
async function init() {
    if (!employeeIdUrlParam) return;

    await Promise.all([fetchRolesData(), fetchEmployeesData()]);
    await loadEmployeeData();
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupEditEmployeeForm();
    validateForm('editEmployeeForm', '#submitBtn');
}

init();

