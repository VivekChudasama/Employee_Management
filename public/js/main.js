

const searchInput = document.getElementById('searchInput');
const tbody = document.getElementById('employeeTableBody');
let debounceTimeout;

if (searchInput && tbody) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const query = e.target.value;
            fetch(`/employees?ajax=true&search=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    tbody.innerHTML = '';
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No Employees Found!</td></tr>';
                    } else {
                        data.forEach(emp => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                                <td>${emp.name || ''}</td>
                                                <td>${emp.email || ''}</td>
                                                <td>${emp.role ? emp.role.role : ''}</td>
                                                <td>${emp.role && emp.role.department ? emp.role.department.departmentName : ''}</td>
                                                <td>$${emp.role ? emp.role.salary : ''}</td>
                                                <td>
                                                    <span class="badge ${emp.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                                                        ${emp.status || ''}
                                                    </span>
                                                </td>
                                                <td>
                                                    <a href="/employees/edit-employee/${emp.id}" class="btn btn-sm btn-outline-primary">Edit</a>
                                                    <form action="/employees/delete-employee" method="POST" class="d-inline">
                                                        <input type="hidden" value="${emp.id}" name="employeeId">
                                                        <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                                                    </form>
                                                </td>
                                            `;
                            tbody.appendChild(tr);
                        });
                    }
                })
                .catch(err => console.error(err));
        }, 300);
    });
}