// Field rules 
const RULES = {
    role_id: v => (!v || v === '') ? 'Please select a role' : null,
    roleName: v => !v?.trim() ? 'Role name is required'
        : v.trim().length < 3 ? 'Role name must be at least 3 characters'
            : v.trim().length > 30 ? 'Role name must be at most 30 characters' : null,
    salary: v => !v?.trim() ? 'Salary is required'
        : isNaN(+v) || +v < 1 ? 'Salary must be a positive number' : null,
    department_id: v => (!v || v === '') ? 'Please select a department' : null
};

// Inline field error helpers 
const showFieldError = (id, msg) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-invalid');
    el.classList.remove('is-valid');
    let fb = el.nextElementSibling;
    if (!fb?.classList.contains('invalid-feedback')) {
        fb = document.createElement('div');
        fb.className = 'invalid-feedback';
        el.insertAdjacentElement('afterend', fb);
    }
    fb.textContent = msg;
};

const clearFieldError = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.replace('is-invalid', 'is-valid');
};

// Validate role quick-add fields 
const validateAddRole = () => {
    const checks = {
        newRoleName: RULES.roleName(document.getElementById('newRoleName')?.value),
        newRoleSalary: RULES.salary(document.getElementById('newRoleSalary')?.value),
        department_id: RULES.department_id(document.getElementById('department_id')?.value)
    };
    let valid = true;
    Object.entries(checks).forEach(([id, msg]) => {
        if (msg) { showFieldError(id, msg); valid = false; }
        else clearFieldError(id);
    });
    return { valid };
};

// Handle backend error response 
const handleBackendErrors = (data) => {
    if (Array.isArray(data.errors) && data.errors.length) {
        data.errors.forEach(({ field, message }) => showFieldError(field, message));
        showToast(data.message || 'Validation error', 'danger');
    } else {
        showToast(data.message || 'An error occurred.', 'danger');
    }
};
