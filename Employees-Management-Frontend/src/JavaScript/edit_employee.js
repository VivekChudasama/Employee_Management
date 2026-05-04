// Retrieve the current employee ID from the URL search params
const employeeIdUrlParam = new URLSearchParams(window.location.search).get('id');

if (!employeeIdUrlParam) {
    showToast('No employee ID provided. Redirecting…', 'danger');
    setTimeout(() => {
        location.href = './employees_list.html';
    }, 1000);
}

let originalEmployeeData = null;

// Fetch the existing employee data and fills out the form inputs
async function loadEmployeeData() {
    const { ok: isSuccessful, data: employee } = await apiCall(`${API.employees}/${employeeIdUrlParam}`);
    if (!isSuccessful) return;

    originalEmployeeData = employee;

    // Fill in standard text inputs
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('name').value = employee.name || '';
    document.getElementById('email').value = employee.email || '';
    document.getElementById('salary').value = employee.salary || '';

    const rawDate = employee.joining_date;
    document.getElementById('joining_date').value = rawDate ? rawDate.split('T')[0] : '';

    const departmentId = employee.role?.department?.id;
    const roleId = employee.role?.id;
    const status = employee.status;

    populateDepartments(departmentId);
    populateRoles(departmentId, roleId);
    populateStatusDropdown(status);
}

// Handles the submission of the Edit Employee form
async function handleEditFormSubmit(event) {
    event.preventDefault();

    const editEmployeeForm = event.target;
    const formData = new FormData(editEmployeeForm);

    const targetEmployeeId = formData.get('employeeId') || employeeIdUrlParam;

    const payload = EmployeePayload(formData);

    if (originalEmployeeData) {
        const rawDate = originalEmployeeData.joining_date;
        const originalDate = rawDate ? rawDate.split('T')[0] : '';
        const originalRoleId = Number(originalEmployeeData.role?.id);

        const hasChanges =
            payload.name.trim() !== (originalEmployeeData.name || '').trim() ||
            payload.email.trim() !== (originalEmployeeData.email || '').trim() ||
            payload.role_id !== originalRoleId ||
            payload.salary !== String(originalEmployeeData.salary || '') ||
            payload.joining_date !== originalDate ||
            payload.status !== (originalEmployeeData.status || '');

        if (!hasChanges) {
            showToast('No changes were made.', 'warning');
            return
        }
    }

    // check uniqueness of email before updating employee
    if (isEmailDuplicate(payload.email, targetEmployeeId)) {
        showFieldError('email', EMAIL_DUPLICATE_MSG);
        validateForm('editEmployeeForm', null);
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    setBtnLoading(submitBtn, 'Updating');

    // Send data to backend using PUT method
    const { ok: isSuccessful } = await apiCall(`${API.employees}/${targetEmployeeId}`, 'PUT', payload);

    if (isSuccessful) {
        handleSubmitSuccess(submitBtn, 'Updated', 'Employee updated!', './employees_list.html');
    } else {
        resetBtnLoading(submitBtn);
        showToast('Failed to update employee. Please try again.', 'danger');
    }
}

function setupEditEmployeeForm() {
    const editEmployeeForm = document.getElementById('editEmployeeForm');
    if (!editEmployeeForm) return;

    fieldsValidation('editEmployeeForm', '#submitBtn', () => {
        return document.getElementById('employeeId').value || employeeIdUrlParam;
    });

    validateForm('editEmployeeForm', '#submitBtn');

    editEmployeeForm.addEventListener('submit', handleEditFormSubmit);
}

async function init() {
    if (!employeeIdUrlParam) return;

    await Promise.all([fetchRolesData(), fetchEmployeesData()]);
    await loadEmployeeData();
    setupDepartmentFilter();
    setupRoleDropdown();
    setupAddRole();
    setupEditEmployeeForm();
}

init();
