import { METHODS } from "node:http";

const BASE_API = 'http://localhost:3001/employees/';

const editEmployeeForm = document.getElementById('editEmployeeForm');

editEmployeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editEmployeeForm);
    const employeeData = Object.fromEntries(formData.entries());
    try {
        const res = await fetch({BASE_API}, {
            method: PUT,
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(employeeData)
        });
        if (res.ok) {
            alert('Employee added successfully');
            editEmployeeForm.reset();
        } else {
            const errorData = await res.json();
            alert('Error adding employee: ' + errorData.message);
        }
    } catch (err) {
        console.error('Add Employee Error:', err);
        alert('An error occurred while adding the employee.');
    }
});

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
if (id) {
    fetchEmployeeDetails(id);
}
else{
    alert('No employee ID provided');
    window.location.href = 'index.html';
}
