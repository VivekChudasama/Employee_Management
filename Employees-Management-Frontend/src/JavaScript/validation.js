/**
 * Validation Rules
 */
const RULES = {
    name: value => !value?.trim() ? 'Name is required' : value.trim().length < 3 ? 'At least 3 characters' : !/^[a-zA-Z\s.]+$/.test(value.trim()) ? 'Letters, spaces and dots only' : null,
    email: value => !value?.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? 'Invalid email format' : null,
    role_id: value => (!value || value === '') ? 'Required' : null,
    roleName: value => !value?.trim() ? 'Required' : value.trim().length < 3 ? 'At least 3 characters' : value.trim().length > 30 ? 'Max 30 characters' : null,
    salary: value => !value?.trim() ? 'Required' : (isNaN(+value) || +value < 1) ? 'Positive number only' : null,
    department_id: value => (!value || value === '') ? 'Required' : null,
    joining_date: value => !value ? 'Required' : new Date(value) <= new Date('2026-01-01') ? 'Must be after 2026-01-01' : null
};

/**
 * Field Error Handlers
 */
const showFieldError = (fieldId, message) => {
    const element = document.getElementById(fieldId);
    if (!element) return;
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
    let feedbackElement = element.nextElementSibling;
    if (!feedbackElement?.classList.contains('invalid-feedback')) {
        feedbackElement = Object.assign(document.createElement('div'), { className: 'invalid-feedback' });
        element.insertAdjacentElement('afterend', feedbackElement);
    }
    feedbackElement.textContent = message;
};

const clearFieldError = (fieldId) => {
    const element = document.getElementById(fieldId);
    if (element) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    }
};

/**
 * Validates a single field and updates its UI state.
 */
const validateField = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return true;

    const ruleFunction = RULES[element.name || element.id];
    const errorMessage = ruleFunction ? ruleFunction(element.value) : (element.required && !element.value ? 'Required' : null);

    if (errorMessage) {
        showFieldError(elementId, errorMessage);
        return false;
    } else {
        clearFieldError(elementId);
        return true;
    }
};

/**
 * Form Checkers
 */
const validateAddRole = () => {
    const validationFields = {
        newRoleName: RULES.roleName(document.getElementById('newRoleName')?.value),
        newRoleSalary: RULES.salary(document.getElementById('newRoleSalary')?.value),
        department_id: RULES.department_id(document.getElementById('department_id')?.value)
    };
    let isAllValid = true;
    Object.entries(validationFields).forEach(([id, error]) => {
        if (error) {
            showFieldError(id, error);
            isAllValid = false;
        } else {
            clearFieldError(id);
        }
    });
    return { valid: isAllValid };
};

const validateForm = (formId, submitBtnSelector) => {
    const formElement = document.getElementById(formId);
    if (!formElement) return false;

    const submitButton = formElement.querySelector(submitBtnSelector);
    const formInputs = [...formElement.querySelectorAll('input, select, textarea')];

    // For general form validity (enabling/disabling submit button)
    const isFormValid = formInputs.filter(input => (input.required || input.name === 'role_id')).every(input => {
        const ruleFunction = RULES[input.name || input.id];
        return ruleFunction ? !ruleFunction(input.value) : !!input.value;
    });

    if (submitButton) submitButton.disabled = !isFormValid;
    return isFormValid;
};

/**
 * Backend Error Bridge
 */
const handleBackendErrors = (responseData) => {
    if (Array.isArray(responseData.errors)) {
        responseData.errors.forEach(error => showFieldError(error.field, error.message));
        showToast(responseData.message || 'Check form errors', 'danger');
    } else {
        showToast(responseData.message || 'Operation failed', 'danger');
    }
};



