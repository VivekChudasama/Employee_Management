// Validation Rules - returns error string if invalid, or null.
const RULES = {
    name: function (value) {
        if (!value || value.trim() === '') return 'Name is required';
        if (!/^[a-zA-Z\s.]+$/.test(value.trim())) return 'Letters, spaces and dots only';
        if (value.trim().length < 3) return 'At least 3 characters needed';
        return null;
    },
    email: function (value) {
        if (!value || value.trim() === '') return 'Email is required';
        if (!/^(?!.*\.{2})[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/.test(value.trim())) return 'Invalid email format';
        return null;
    },
    role_id: function (value) {
        if (!value || value === '') return 'Role_Id is Required';
        return null;
    },
    roleName: function (value) {
        if (!value || value.trim() === '') return 'Required';
        if (value.trim().length < 3) return 'At least 3 characters';
        if (value.trim().length > 30) return 'Max 30 characters';
        return null;
    },
    salary: function (value) {
        if (!value || value.trim() === '') return 'Required';
        if (isNaN(Number(value)) || Number(value) < 1) return 'Positive number only';
        return null;
    },
    department_id: function (value) {
        if (!value || value === '') return 'Department_Id Required';
        return null;
    },
    joining_date: function (value) {
        if (!value) return 'Required';
        if (new Date(value) <= new Date('2026-01-01')) return 'Must be after 2026-01-01';
        return null;
    }
};

// Show an error message on a specific input field
function showFieldError(fieldId, message) {
    const element = document.getElementById(fieldId);
    if (!element) return;

    element.classList.add('is-invalid');
    element.classList.remove('is-valid');

    let feedbackElement = element.nextElementSibling;
    if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'invalid-feedback';
        element.insertAdjacentElement('afterend', feedbackElement);
    }

    feedbackElement.textContent = message;
}

function clearFieldError(fieldId) {
    const element = document.getElementById(fieldId);
    if (!element) return;

    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
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
    const roleNameValue = document.getElementById('newRoleName')?.value || '';
    const departmentValue = document.getElementById('department_id')?.value || '';

    const validationErrors = {
        newRoleName: RULES.roleName(roleNameValue),
        department_id: RULES.department_id(departmentValue)
    };

    let isAllValid = true;

    for (const [fieldId, errorMessage] of Object.entries(validationErrors)) {
        if (errorMessage !== null) {
            showFieldError(fieldId, errorMessage);
            isAllValid = false;
        } else {
            clearFieldError(fieldId);
        }
    }

    return { valid: isAllValid };
}

function validateForm(formId, submitBtnSelector) {
    const formElement = document.getElementById(formId);
    if (!formElement) return false;

    const submitButton = formElement.querySelector(submitBtnSelector);
    let isFormValid = true;

    // Find all inputs, selects, and textareas inside this form
    const formInputs = formElement.querySelectorAll('input, select, textarea');

    // Check every required input or specific roles
    for (const input of formInputs) {
        if (input.required || input.name === 'role_id') {
            const ruleName = input.name || input.id;
            const ruleFunction = RULES[ruleName];

            if (ruleFunction) {
                // If there's an error message, form is invalid
                if (ruleFunction(input.value) !== null) {
                    isFormValid = false;
                    break;
                }
            } else if (!input.value) {
                isFormValid = false;
                break;
            }
        }
    }

    if (submitButton) {
        submitButton.disabled = !isFormValid;
    }

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
    const formElement = document.getElementById(formId);
    if (!formElement) return;

    const fieldsToValidate = ['name', 'email', 'joining_date', 'status', 'salary', 'role_id'];

    fieldsToValidate.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            // Validate on input event
            element.addEventListener('input', (event) => {
                validateField(fieldId);
                validateForm(formId, submitBtnSelector);

                // Specific email uniqueness check using global function
                if (fieldId === 'email' && typeof isEmailDuplicate === 'function') {
                    const excludeId = excludeIdProvider ? excludeIdProvider() : null;
                    if (isEmailDuplicate(event.target.value, excludeId)) {
                        showFieldError('email', 'Email address you have entered is already in use by another user.');
                        const submitButton = document.querySelector(submitBtnSelector);
                        if (submitButton) submitButton.disabled = true;
                    }
                }
            });

            // Validate on blur event (when leaving the field)
            element.addEventListener('blur', () => {
                validateField(fieldId);
                validateForm(formId, submitBtnSelector);
            });
        }
    });
}