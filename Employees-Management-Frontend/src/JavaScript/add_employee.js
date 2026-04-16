import { METHODS } from "node:http";

const BASE_API = 'http://localhost:3001/employees/add-employee/';

const addEmployeeForm = document.getElementById('addEmployeeForm');

addEmployeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const employeeData = Object.fromEntries(formData.entries());
    try {
        const res = await fetch(BASE_API, {
            method: METHODS.PUT,
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(employeeData)
        });
        if (res.ok) {
            alert('Employee added successfully');
            addEmployeeForm.reset();
        } else {
            const errorData = await res.json();
            alert('Error adding employee: ' + errorData.message);
        }
    } catch (err) {
        console.error('Add Employee Error:', err);
        alert('An error occurred while adding the employee.');
    }
});