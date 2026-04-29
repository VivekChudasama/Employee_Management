// Validation Rules - returns error string if invalid, or null.
const RULES = {
    name: function (value) {
        if (!value || value.trim() === '') return 'Name is required';
        if (!/^[a-zA-Z\s.]+$/.test(value.trim())) return 'Letters, spaces and dots only';
        if (value.trim().length < 3) return 'Name shoulde content At least 3 characters';
        if (value.trim().length >= 70) return 'Please enter name below 70 character'

        return null;
    },
    email: function (value) {
        if (!value || value.trim() === '') return 'Email is required';
        if (!/^(?!.*\.{2})[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/.test(value.trim())) return 'Invalid email format';
        return null;
    },
    role_id: function (value) {
        if (!value || value === '') return 'Role is required';
        return null;
    },
    roleName: function (value) {
        if (!value || value.trim() === '') return 'RoleName is Required';
        if (value.trim().length < 3) return 'RoleName shoulde content At least 3 characters';
        if (value.trim().length >= 70) return 'Please enter name below 70 characters';
        return null;
    },
    salary: function (value) {
        if (!value || value.trim() === '') return 'Salary is Required';
        if (value.trim().length > 9) return 'Salary shoulde not contain more then 9 digit'
        if (isNaN(Number(value)) || Number(value) === 0) return 'Salary coule not be Zero'
        if (isNaN(Number(value)) || Number(value) < 1) return 'Please enter valid Positive number only';
        return null;
    },
    department_id: function (value) {
        if (!value || value === '') return 'Department is required';
        return null;
    },
    joining_date: function (value) {
        if (!value) return 'Joining Date is Required';
        if (new Date(value) <= new Date('2026-01-01')) return 'Must be after 2026-01-01';
        const today = new Date().toISOString().split('T')[0];
        if (new Date(value) > new Date(today)) return 'Please select a valid date. Future dates are not allowed.';
        return null;
    },
    status: function (value) {
        if (!value || value === '') return 'Status is required';
        return null;
    }
};

// Helper to get associated dropdown button for hidden inputs
function getDropdownButton(fieldId) {
    const btnId = (fieldId.endsWith('_id') ? fieldId.replace('_id', '') : fieldId) + 'DropdownBtn';
    return document.getElementById(btnId);
}

// Show an error message on a specific input field
function showFieldError(fieldId, message) {
    const element = document.getElementById(fieldId);
    if (!element) return;

    element.classList.add('is-invalid');
    element.classList.remove('is-valid');

    // Also highlight the visual dropdown button if the field is hidden
    if (element.type === 'hidden') {
        const dropdownBtn = getDropdownButton(fieldId);
        if (dropdownBtn) {
            dropdownBtn.classList.add('is-invalid');
            dropdownBtn.classList.remove('is-valid');
        }
    }

    let feedbackElement = element.nextElementSibling;
    if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'invalid-feedback';
        element.insertAdjacentElement('afterend', feedbackElement);
    }

    feedbackElement.textContent = message;
    feedbackElement.style.display = 'block';
}

function clearFieldError(fieldId) {
    const element = document.getElementById(fieldId);
    if (!element) return;

    element.classList.remove('is-invalid');
    element.classList.add('is-valid');

    // Clear highlight from visual dropdown button
    if (element.type === 'hidden') {
        const dropdownBtn = getDropdownButton(fieldId);
        if (dropdownBtn) {
            dropdownBtn.classList.remove('is-invalid');
            dropdownBtn.classList.add('is-valid');
        }
    }

    // Hide the dynamically added feedback block if it exists
    const feedbackElement = element.nextElementSibling;
    if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement.style.display = 'none';
    }
}

function validateField(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return true;

    const ruleName = element.name || element.id;
    const ruleFunction = RULES[ruleName];

    let errorMessage = ruleFunction ? ruleFunction(element.value) : (element.required && !element.value ? 'Required' : null);

    if (errorMessage) {
        showFieldError(elementId, errorMessage);
        return false;
    }

    clearFieldError(elementId);
    return true;
}

function validateAddRole() {
    const nameVal = document.getElementById('newRoleName')?.value || '';
    const deptVal = document.getElementById('department_id')?.value || '';

    const nameError = RULES.roleName(nameVal);
    const deptError = RULES.department_id(deptVal);

    if (nameError) showFieldError('newRoleName', nameError); else clearFieldError('newRoleName');
    if (deptError) showFieldError('department_id', deptError); else clearFieldError('department_id');

    return { valid: !nameError && !deptError };
}

function validateForm(formId, submitBtnSelector) {
    const formElement = document.getElementById(formId);
    if (!formElement) return false;

    // Find all required inputs or specific role_id
    const formInputs = Array.from(formElement.querySelectorAll('input, select, textarea'))
        .filter(input => input.required || input.name === 'role_id');

    const isFormValid = formInputs.every(input => {
        const ruleName = input.name || input.id;
        const ruleFunction = RULES[ruleName];
        return ruleFunction ? ruleFunction(input.value) === null : !!input.value;
    });

    const submitButton = formElement.querySelector(submitBtnSelector);
    if (submitButton) submitButton.disabled = !isFormValid;

    return isFormValid;
}

// Captures backend JSON errors and puts them into UI Toasts
function handleBackendErrors(responseData) {
    if (responseData.errors && Array.isArray(responseData.errors)) {
        responseData.errors.forEach(error => {
            showFieldError(error.field, error.message);
        });
        showToast(responseData.message || 'Check form errors', 'danger');
    } else {
        const errorMsg = responseData.error || responseData.message || 'Operation failed';
        showToast(errorMsg, 'danger');
    }
}

// Input validation for employee forms (Add/Edit)
function fieldsValidation(formId, submitBtnSelector, excludeIdProvider = null) {
    const fieldsToValidate = ['name', 'email', 'joining_date', 'status', 'salary', 'role_id', 'department_id'];

    const runValidation = (fieldId, event) => {
        let isValid = validateField(fieldId);

        // Specific email uniqueness check
        if (fieldId === 'email' && isValid && typeof isEmailDuplicate === 'function') {
            const emailValue = document.getElementById('email')?.value || '';
            const excludeId = excludeIdProvider ? excludeIdProvider() : null;
            if (isEmailDuplicate(emailValue, excludeId)) {
                showFieldError('email', 'Email address you have entered is already in use by another user.');
                isValid = false;
            }
        }

        const isFormValid = validateForm(formId, submitBtnSelector);
        
        // Disable submit button if either form-level or the specific duplicate check fails
        const submitButton = document.querySelector(submitBtnSelector);
        if (submitButton) {
            submitButton.disabled = !(isFormValid && isValid);
        }
    };

    fieldsToValidate.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (!element) return;

        if (element.type === 'hidden') {
            element.addEventListener('change', () => runValidation(fieldId));
            const dropdownBtn = getDropdownButton(fieldId);
            if (dropdownBtn) dropdownBtn.addEventListener('hidden.bs.dropdown', () => runValidation(fieldId));
        } else {
            element.addEventListener('input', (e) => runValidation(fieldId, e));
            element.addEventListener('change', (e) => runValidation(fieldId, e));
            element.addEventListener('blur', () => runValidation(fieldId));
        }
    });
}